let courses = JSON.parse(localStorage.getItem("courses")) || [];
let myCourses = JSON.parse(localStorage.getItem("myCourses")) || [];

// ADMIN FUNCTIONS
function addCourse() {
    const name = document.getElementById("courseName").value;
    const code = document.getElementById("courseCode").value;
    const time = document.getElementById("courseTime").value;
    const instructor = document.getElementById("instructor").value;
    const capacity = document.getElementById("capacity").value;

    if (name && code && time && instructor && capacity) {
        courses.push({ name, code, time, instructor, capacity: parseInt(capacity), enrolled: 0 });
        localStorage.setItem("courses", JSON.stringify(courses));
        displayCourses();
        document.getElementById("courseName").value = "";
        document.getElementById("courseCode").value = "";
        document.getElementById("courseTime").value = "";
        document.getElementById("instructor").value = "";
        document.getElementById("capacity").value = "";
        alert("✅ Course Added Successfully!");
    } else {
        alert("⚠️ Please fill all fields!");
    }
}

function displayCourses() {
    const list = document.getElementById("courseList");
    if (!list) return;

    list.innerHTML = "";
    const totalElement = document.getElementById("totalCourses");
    if (totalElement) totalElement.textContent = courses.length;

    courses.forEach((course, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <div class="course-info">
                <div class="course-name">${course.code}: ${course.name}</div>
                <div class="course-details">
                    🕒 ${course.time} | 👨‍🏫 ${course.instructor} | 👥 ${course.enrolled}/${course.capacity}
                </div>
            </div>
            <button onclick="deleteCourse(${index})" class="btn-danger">Delete</button>
        `;
        list.appendChild(li);
    });
}

function deleteCourse(index) {
    if (confirm("Are you sure you want to delete this course?")) {
        courses.splice(index, 1);
        localStorage.setItem("courses", JSON.stringify(courses));
        displayCourses();
        displayRegistrationOverview();
    }
}

function displayRegistrationOverview() {
    const list = document.getElementById("registrationList");
    if (!list) return;

    list.innerHTML = "";
    if (courses.length === 0) {
        list.innerHTML = "<li>No courses available</li>";
        return;
    }

    courses.forEach(course => {
        const li = document.createElement("li");
        const percentage = (course.enrolled / course.capacity * 100).toFixed(0);
        li.innerHTML = `
            <div class="course-info">
                <div class="course-name">${course.code}: ${course.name}</div>
                <div class="course-details">
                    Enrollment: ${course.enrolled}/${course.capacity} (${percentage}%)
                </div>
            </div>
        `;
        list.appendChild(li);
    });
}

// STUDENT FUNCTIONS
function displayAvailableCourses() {
    const list = document.getElementById("availableCourses");
    if (!list) return;

    list.innerHTML = "";
    if (courses.length === 0) {
        list.innerHTML = "<li>No courses available</li>";
        return;
    }

    courses.forEach((course, index) => {
        const isEnrolled = myCourses.some(c => c.code === course.code);
        const isFull = course.enrolled >= course.capacity;
        
        const li = document.createElement("li");
        if (isFull) li.classList.add("full-capacity");
        
        li.innerHTML = `
            <div class="course-info">
                <div class="course-name">${course.code}: ${course.name}</div>
                <div class="course-details">
                    🕒 ${course.time} | 👨‍🏫 ${course.instructor} | 👥 ${course.enrolled}/${course.capacity}
                </div>
            </div>
            <button onclick="registerCourse(${index})" class="btn-success" 
                ${isEnrolled || isFull ? 'disabled' : ''}>
                ${isEnrolled ? 'Enrolled' : isFull ? 'Full' : 'Register'}
            </button>
        `;
        list.appendChild(li);
    });
}

function registerCourse(index) {
    const selectedCourse = courses[index];

    if (selectedCourse.enrolled >= selectedCourse.capacity) {
        alert("⚠️ Course is full!");
        return;
    }

    const conflict = myCourses.some(course => course.time === selectedCourse.time);
    if (conflict) {
        alert("⚠️ Schedule Conflict! You already have a course at this time.");
        return;
    }

    courses[index].enrolled++;
    myCourses.push(selectedCourse);
    localStorage.setItem("courses", JSON.stringify(courses));
    localStorage.setItem("myCourses", JSON.stringify(myCourses));
    displayAvailableCourses();
    displayMySchedule();
    alert("✅ Successfully registered for " + selectedCourse.name);
}

function displayMySchedule() {
    const list = document.getElementById("mySchedule");
    if (!list) return;

    list.innerHTML = "";
    const countElement = document.getElementById("enrolledCount");
    if (countElement) countElement.textContent = myCourses.length;

    if (myCourses.length === 0) {
        list.innerHTML = "<li>No courses enrolled yet</li>";
        return;
    }

    myCourses.forEach((course, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <div class="course-info">
                <div class="course-name">${course.code}: ${course.name}</div>
                <div class="course-details">
                    🕒 ${course.time} | 👨‍🏫 ${course.instructor}
                </div>
            </div>
            <button onclick="dropCourse(${index})" class="btn-danger">Drop</button>
        `;
        list.appendChild(li);
    });
}

function dropCourse(index) {
    if (confirm("Are you sure you want to drop this course?")) {
        const droppedCourse = myCourses[index];
        const courseIndex = courses.findIndex(c => c.code === droppedCourse.code);
        if (courseIndex !== -1) {
            courses[courseIndex].enrolled--;
            localStorage.setItem("courses", JSON.stringify(courses));
        }
        
        myCourses.splice(index, 1);
        localStorage.setItem("myCourses", JSON.stringify(myCourses));
        displayAvailableCourses();
        displayMySchedule();
    }
}

function filterCourses() {
    const searchTerm = document.getElementById("searchCourse").value.toLowerCase();
    const list = document.getElementById("availableCourses");
    const items = list.getElementsByTagName("li");

    for (let item of items) {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(searchTerm) ? "" : "none";
    }
}

// Initialize
displayCourses();
displayAvailableCourses();
displayMySchedule();
displayRegistrationOverview();