const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));
app.use(session({
    secret: 'course-scheduler-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 }
}));

// In-memory storage (replace with database in production)
let courses = [];
let users = {
    admin: {
        username: 'admin',
        password: bcrypt.hashSync('admin123', 10),
        role: 'admin'
    }
};
let studentCourses = {};

// Middleware to check authentication
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

const isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ error: 'Forbidden' });
    }
};

// Auth routes
app.post('/api/login', async (req, res) => {
    const { username, password, role } = req.body;
    
    if (role === 'admin') {
        const user = users.admin;
        if (username === user.username && bcrypt.compareSync(password, user.password)) {
            req.session.user = { username, role: 'admin' };
            return res.json({ success: true, role: 'admin' });
        }
    } else {
        if (users[username] && bcrypt.compareSync(password, users[username].password)) {
            req.session.user = { username, role: 'student' };
            return res.json({ success: true, role: 'student' });
        }
    }
    
    res.status(401).json({ error: 'Invalid credentials' });
});

app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    
    if (users[username]) {
        return res.status(400).json({ error: 'Username already exists' });
    }
    
    users[username] = {
        username,
        password: bcrypt.hashSync(password, 10),
        role: 'student'
    };
    studentCourses[username] = [];
    
    res.json({ success: true });
});

app.post('/api/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

app.get('/api/check-auth', (req, res) => {
    if (req.session.user) {
        res.json({ authenticated: true, user: req.session.user });
    } else {
        res.json({ authenticated: false });
    }
});

// Course routes
app.get('/api/courses', isAuthenticated, (req, res) => {
    res.json(courses);
});

app.post('/api/courses', isAdmin, (req, res) => {
    const course = { ...req.body, id: Date.now(), enrolled: 0 };
    courses.push(course);
    res.json(course);
});

app.delete('/api/courses/:id', isAdmin, (req, res) => {
    courses = courses.filter(c => c.id != req.params.id);
    res.json({ success: true });
});

// Student course registration
app.get('/api/my-courses', isAuthenticated, (req, res) => {
    const username = req.session.user.username;
    res.json(studentCourses[username] || []);
});

app.post('/api/register-course', isAuthenticated, (req, res) => {
    const username = req.session.user.username;
    const { courseId } = req.body;
    
    const course = courses.find(c => c.id == courseId);
    if (!course) {
        return res.status(404).json({ error: 'Course not found' });
    }
    
    if (course.enrolled >= course.capacity) {
        return res.status(400).json({ error: 'Course is full' });
    }
    
    const myCourses = studentCourses[username] || [];
    const conflict = myCourses.some(c => c.time === course.time);
    if (conflict) {
        return res.status(400).json({ error: 'Schedule conflict' });
    }
    
    course.enrolled++;
    myCourses.push(course);
    studentCourses[username] = myCourses;
    
    res.json({ success: true });
});

app.post('/api/drop-course', isAuthenticated, (req, res) => {
    const username = req.session.user.username;
    const { courseId } = req.body;
    
    const course = courses.find(c => c.id == courseId);
    if (course) course.enrolled--;
    
    studentCourses[username] = (studentCourses[username] || []).filter(c => c.id != courseId);
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
