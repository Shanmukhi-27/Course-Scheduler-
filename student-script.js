let allCourses = [];
let myCourses = [];
let currentUser = '';

async function checkAuth() {
    try {
        const res = await fetch('/api/check-auth');
        const data = await res.json();
        if (!data.authenticated || data.user.role !== 'student') {
            window.location.href = 'login.html';
        } else {
            currentUser = data.user.username;
            document.getElementById('welcomeUser').textContent = `Welcome, ${currentUser}!`;
        }
    } catch (err) {
        window.location.href = 'login.html';
    }
}

checkAuth();

async function logout() {
    await fetch('/api/logout', { method: 'POST' });
    window.location.href = 'index.html';
}

async function loadData() {
    try {
        const [coursesRes, myCoursesRes] = await Promise.all([
            fetch('/api/courses'),
            fetch('/api/my-courses')
        ]);
        
        allCourses = await coursesRes.json();
        myCourses = await myCoursesRes.json();
        
        updateStats();
        displayAvailableCourses();
        displayMySchedule();
        generateTimetable();
        showRecommendations();
    } catch (err) {
        console.error(err);
    }
}

function updateStats() {
    document.getElementById('enrolledCount').textContent = myCourses.length;
    document.getElementById('totalCredits').textContent = myCourses.length * 3;
    document.getElementById('availableCount').textContent = allCourses.filter(c => 
        c.enrolled < c.capacity && !myCourses.some(mc => mc.id === c.id)
    ).length;
}

function generateTimetable() {
    const times = ['08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00', 
                   '12:00-13:00', '13:00-14:00', '14:00-15:00', '15:00-16:00', '16:00-17:00'];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    
    const tbody = document.getElementById('timetableBody');
    tbody.innerHTML = '';
    
    times.forEach(time => {
        const row = document.createElement('tr');
        row.innerHTML = `<td class="time-cell">${time}</td>`;
        
        days.forEach(day => {
            const cell = document.createElement('td');
            const course = myCourses.find(c => {
                const courseDay = c.time.split(' ')[0];
                const courseTime = c.time.split(' ')[1];
                return courseDay === day && courseTime && courseTime.includes(time.split('-')[0]);
            });
            
            if (course) {
                cell.className = 'course-cell';
                cell.innerHTML = `
                    <div class="timetable-course">
                        <strong>${course.code}</strong><br>
                        <small>${course.name}</small><br>
                        <small>👨🏫 ${course.instructor}</small>
                    </div>
                `;
            } else {
                cell.className = 'empty-cell';
            }
            row.appendChild(cell);
        });
        
        tbody.appendChild(row);
    });
}

function displayAvailableCourses() {
    const list = document.getElementById("availableCourses");
    list.innerHTML = "";
    
    if (allCourses.length === 0) {
        list.innerHTML = "<li>No courses available</li>";
        return;
    }

    allCourses.forEach(course => {
        const isEnrolled = myCourses.some(c => c.id === course.id);
        const isFull = course.enrolled >= course.capacity;
        const availableSeats = course.capacity - course.enrolled;
        
        const li = document.createElement("li");
        if (isFull) li.classList.add("full-capacity");
        
        li.innerHTML = `
            <div class="course-info">
                <div class="course-name">${course.code}: ${course.name}</div>
                <div class="course-details">
                    🕒 ${course.time} | 👨🏫 ${course.instructor} | 
                    👥 ${course.enrolled}/${course.capacity} 
                    <span class="seats-badge ${availableSeats < 5 ? 'low-seats' : ''}">${availableSeats} seats left</span>
                </div>
            </div>
            <button onclick="registerCourse(${course.id})" class="btn-success" 
                ${isEnrolled || isFull ? 'disabled' : ''}>
                ${isEnrolled ? '✓ Enrolled' : isFull ? '✗ Full' : '+ Register'}
            </button>
        `;
        list.appendChild(li);
    });
}

async function registerCourse(courseId) {
    try {
        const res = await fetch('/api/register-course', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ courseId })
        });

        const data = await res.json();
        if (res.ok) {
            alert("✅ Successfully registered!");
            loadData();
        } else {
            alert("⚠️ " + data.error);
        }
    } catch (err) {
        alert("❌ Error: " + err.message);
    }
}

function displayMySchedule() {
    const list = document.getElementById("mySchedule");
    list.innerHTML = "";

    if (myCourses.length === 0) {
        list.innerHTML = "<li>No courses enrolled yet. Start building your schedule!</li>";
        return;
    }

    myCourses.forEach(course => {
        const li = document.createElement("li");
        li.innerHTML = `
            <div class="course-info">
                <div class="course-name">${course.code}: ${course.name}</div>
                <div class="course-details">
                    🕒 ${course.time} | 👨🏫 ${course.instructor} | 📚 3 Credits
                </div>
            </div>
            <button onclick="dropCourse(${course.id})" class="btn-danger">Drop Course</button>
        `;
        list.appendChild(li);
    });
}

async function dropCourse(courseId) {
    if (confirm("Are you sure you want to drop this course?")) {
        try {
            const res = await fetch('/api/drop-course', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ courseId })
            });

            if (res.ok) {
                alert("✅ Course dropped successfully!");
                loadData();
            }
        } catch (err) {
            alert("❌ Error: " + err.message);
        }
    }
}

function showRecommendations() {
    const list = document.getElementById("recommendations");
    list.innerHTML = "";
    
    const enrolledTimes = myCourses.map(c => c.time);
    const recommended = allCourses.filter(course => {
        const notEnrolled = !myCourses.some(c => c.id === course.id);
        const notFull = course.enrolled < course.capacity;
        const noConflict = !enrolledTimes.includes(course.time);
        return notEnrolled && notFull && noConflict;
    }).slice(0, 5);
    
    if (recommended.length === 0) {
        list.innerHTML = "<li>No recommendations available</li>";
        return;
    }
    
    recommended.forEach(course => {
        const li = document.createElement("li");
        li.innerHTML = `
            <div class="course-info">
                <div class="course-name">⭐ ${course.code}: ${course.name}</div>
                <div class="course-details">
                    🕒 ${course.time} | 👨🏫 ${course.instructor}
                </div>
            </div>
            <button onclick="registerCourse(${course.id})" class="btn-success">+ Register</button>
        `;
        list.appendChild(li);
    });
}

function filterCourses() {
    const searchTerm = document.getElementById("searchCourse").value.toLowerCase();
    const dayFilter = document.getElementById("filterDay").value;
    const list = document.getElementById("availableCourses");
    const items = list.getElementsByTagName("li");

    for (let item of items) {
        const text = item.textContent.toLowerCase();
        const matchesSearch = text.includes(searchTerm);
        const matchesDay = !dayFilter || text.includes(dayFilter.toLowerCase());
        item.style.display = matchesSearch && matchesDay ? "" : "none";
    }
}

function sortCourses() {
    const sortBy = document.getElementById("sortBy").value;
    
    allCourses.sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'code') return a.code.localeCompare(b.code);
        if (sortBy === 'time') return a.time.localeCompare(b.time);
        if (sortBy === 'capacity') return (b.capacity - b.enrolled) - (a.capacity - a.enrolled);
        return 0;
    });
    
    displayAvailableCourses();
}

function exportSchedule() {
    let scheduleText = `📚 MY COURSE SCHEDULE - ${currentUser}\n`;
    scheduleText += `${'='.repeat(50)}\n\n`;
    
    myCourses.forEach((course, index) => {
        scheduleText += `${index + 1}. ${course.code}: ${course.name}\n`;
        scheduleText += `   Time: ${course.time}\n`;
        scheduleText += `   Instructor: ${course.instructor}\n`;
        scheduleText += `   Credits: 3\n\n`;
    });
    
    scheduleText += `\nTotal Courses: ${myCourses.length}\n`;
    scheduleText += `Total Credits: ${myCourses.length * 3}\n`;
    
    const blob = new Blob([scheduleText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `schedule_${currentUser}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    alert("✅ Schedule exported successfully!");
}

loadData();
