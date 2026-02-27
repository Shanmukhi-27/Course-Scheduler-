let allCourses = [];

async function checkAuth() {
    try {
        const res = await fetch('/api/check-auth');
        const data = await res.json();
        if (!data.authenticated || data.user.role !== 'admin') {
            window.location.href = 'login.html';
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

async function addCourse() {
    const name = document.getElementById("courseName").value;
    const code = document.getElementById("courseCode").value;
    const day = document.getElementById("courseDay").value;
    const startTime = document.getElementById("courseStartTime").value;
    const endTime = document.getElementById("courseEndTime").value;
    const instructor = document.getElementById("instructor").value;
    const capacity = document.getElementById("capacity").value;

    if (name && code && day && startTime && endTime && instructor && capacity) {
        const time = `${day} ${startTime}-${endTime}`;
        
        try {
            const res = await fetch('/api/courses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, code, time, instructor, capacity: parseInt(capacity) })
            });

            if (res.ok) {
                document.getElementById("courseName").value = "";
                document.getElementById("courseCode").value = "";
                document.getElementById("courseDay").value = "";
                document.getElementById("courseStartTime").value = "";
                document.getElementById("courseEndTime").value = "";
                document.getElementById("instructor").value = "";
                document.getElementById("capacity").value = "";
                alert("✅ Course Added Successfully!");
                loadCourses();
            }
        } catch (err) {
            alert("❌ Error: " + err.message);
        }
    } else {
        alert("⚠️ Please fill all fields!");
    }
}

async function loadCourses() {
    try {
        const res = await fetch('/api/courses');
        allCourses = await res.json();
        
        updateAnalytics();
        displayCourses();
        displayRegistrationOverview();
        detectConflicts();
    } catch (err) {
        console.error(err);
    }
}

function updateAnalytics() {
    const totalCourses = allCourses.length;
    const totalEnrollments = allCourses.reduce((sum, c) => sum + c.enrolled, 0);
    const totalCapacity = allCourses.reduce((sum, c) => sum + c.capacity, 0);
    const avgEnrollment = totalCapacity > 0 ? ((totalEnrollments / totalCapacity) * 100).toFixed(1) : 0;
    
    document.getElementById('totalCoursesCount').textContent = totalCourses;
    document.getElementById('totalEnrollments').textContent = totalEnrollments;
    document.getElementById('avgEnrollment').textContent = avgEnrollment + '%';
}

function displayCourses() {
    const list = document.getElementById("courseList");
    list.innerHTML = "";

    if (allCourses.length === 0) {
        list.innerHTML = "<li>No courses available</li>";
        return;
    }

    allCourses.forEach(course => {
        const enrollmentRate = ((course.enrolled / course.capacity) * 100).toFixed(0);
        const isFull = course.enrolled >= course.capacity;
        const isLow = enrollmentRate < 30;
        
        const li = document.createElement("li");
        if (isFull) li.classList.add("full-capacity");
        
        li.innerHTML = `
            <div class="course-info">
                <div class="course-name">
                    ${course.code}: ${course.name}
                    ${isFull ? '<span class="badge-full">FULL</span>' : ''}
                    ${isLow ? '<span class="badge-low">LOW</span>' : ''}
                </div>
                <div class="course-details">
                    🕒 ${course.time} | 👨🏫 ${course.instructor} | 
                    👥 ${course.enrolled}/${course.capacity} (${enrollmentRate}%)
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${enrollmentRate}%"></div>
                </div>
            </div>
            <button onclick="deleteCourse(${course.id})" class="btn-danger">Delete</button>
        `;
        list.appendChild(li);
    });
}

async function deleteCourse(id) {
    if (confirm("Are you sure you want to delete this course?")) {
        try {
            await fetch(`/api/courses/${id}`, { method: 'DELETE' });
            alert("✅ Course deleted successfully!");
            loadCourses();
        } catch (err) {
            alert("❌ Error: " + err.message);
        }
    }
}

function displayRegistrationOverview() {
    const list = document.getElementById("registrationList");
    list.innerHTML = "";
    
    if (allCourses.length === 0) {
        list.innerHTML = "<li>No courses available</li>";
        return;
    }

    const sortedCourses = [...allCourses].sort((a, b) => b.enrolled - a.enrolled);

    sortedCourses.forEach(course => {
        const li = document.createElement("li");
        const percentage = ((course.enrolled / course.capacity) * 100).toFixed(0);
        const status = percentage >= 80 ? '🔴' : percentage >= 50 ? '🟡' : '🟢';
        
        li.innerHTML = `
            <div class="course-info">
                <div class="course-name">${status} ${course.code}: ${course.name}</div>
                <div class="course-details">
                    Enrollment: ${course.enrolled}/${course.capacity} (${percentage}%)
                </div>
            </div>
        `;
        list.appendChild(li);
    });
}

function detectConflicts() {
    const list = document.getElementById("conflictList");
    list.innerHTML = "";
    
    const timeMap = {};
    const conflicts = [];
    
    allCourses.forEach(course => {
        if (timeMap[course.time]) {
            conflicts.push({
                time: course.time,
                courses: [timeMap[course.time], course]
            });
        } else {
            timeMap[course.time] = course;
        }
    });
    
    if (conflicts.length === 0) {
        list.innerHTML = "<li style='color: green;'>✅ No schedule conflicts detected</li>";
        return;
    }
    
    conflicts.forEach(conflict => {
        const li = document.createElement("li");
        li.innerHTML = `
            <div class="course-info">
                <div class="course-name">⚠️ Time Conflict: ${conflict.time}</div>
                <div class="course-details">
                    Conflicting courses: ${conflict.courses.map(c => c.code).join(', ')}
                </div>
            </div>
        `;
        list.appendChild(li);
    });
}

function filterAdminCourses() {
    const searchTerm = document.getElementById("searchAdmin").value.toLowerCase();
    const statusFilter = document.getElementById("filterStatus").value;
    const list = document.getElementById("courseList");
    const items = list.getElementsByTagName("li");

    for (let item of items) {
        const text = item.textContent.toLowerCase();
        const matchesSearch = text.includes(searchTerm);
        
        let matchesStatus = true;
        if (statusFilter === 'full') {
            matchesStatus = text.includes('full');
        } else if (statusFilter === 'available') {
            matchesStatus = !text.includes('full');
        } else if (statusFilter === 'low') {
            matchesStatus = text.includes('low');
        }
        
        item.style.display = matchesSearch && matchesStatus ? "" : "none";
    }
}

loadCourses();
