# 📚 Online Course Selection and Scheduling Platform
**FSAD-PS48 Project**

A web-based application that enables students to select courses, build schedules, and manage registrations while allowing administrators to manage course listings and resolve scheduling conflicts.

---

## 🎯 Project Overview

This platform provides a comprehensive solution for academic course management with two distinct user roles:

### Admin Features
- ✅ Add new courses with detailed information
- ✅ Manage course listings (view/delete)
- ✅ Monitor registration statistics
- ✅ Track course capacity and enrollment
- ✅ View registration overview

### Student Features
- ✅ Browse available courses
- ✅ Search and filter courses
- ✅ Register for courses
- ✅ Automatic schedule conflict detection
- ✅ View personal schedule
- ✅ Drop courses
- ✅ Real-time capacity checking

---

## 🛠️ Technologies Used

- **HTML5** - Structure and content
- **CSS3** - Styling with modern gradients and animations
- **JavaScript (ES6)** - Client-side logic and interactivity
- **LocalStorage API** - Data persistence

---

## 📁 Project Structure

```
course scheduler/
│
├── index.html          # Landing page with role selection
├── admin.html          # Admin dashboard
├── student.html        # Student dashboard
├── style.css           # Global styles
├── script.js           # Application logic
└── README.md           # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Edge, Safari)
- No server or installation required

### Installation

1. **Clone or download** the project files
2. **Open** `index.html` in your web browser
3. **Choose** your role (Admin or Student)

---

## 💡 How to Use

### For Administrators

1. Click **Admin Login** on the home page
2. **Add a Course:**
   - Enter course name (e.g., "Data Structures")
   - Enter course code (e.g., "CS101")
   - Enter time slot (e.g., "Mon 10:00-12:00")
   - Enter instructor name
   - Set maximum capacity
   - Click "Add Course"
3. **Manage Courses:**
   - View all courses in the listing
   - Delete courses using the "Delete" button
   - Monitor enrollment statistics

### For Students

1. Click **Student Login** on the home page
2. **Browse Courses:**
   - View all available courses
   - Use search bar to filter courses
3. **Register for Courses:**
   - Click "Register" on desired courses
   - System automatically checks for:
     - Schedule conflicts
     - Course capacity
4. **Manage Schedule:**
   - View enrolled courses in "My Schedule"
   - Drop courses using the "Drop" button

---

## ✨ Key Features

### 🔒 Schedule Conflict Detection
The system automatically prevents students from registering for courses that overlap in time.

### 📊 Capacity Management
- Tracks enrollment vs. capacity for each course
- Prevents registration when course is full
- Real-time updates across admin and student views

### 🔍 Search Functionality
Students can quickly find courses by searching for:
- Course name
- Course code
- Instructor name
- Time slot

### 💾 Data Persistence
All data is stored in browser's LocalStorage, maintaining state across sessions.

---

## 🎨 Design Features

- **Modern UI/UX** with gradient backgrounds
- **Responsive design** for mobile and desktop
- **Interactive elements** with hover effects
- **Color-coded indicators** for course status
- **Emoji icons** for better visual communication

---

## 📋 Course Data Structure

```javascript
{
  name: "Data Structures",
  code: "CS101",
  time: "Mon 10:00-12:00",
  instructor: "Dr. Smith",
  capacity: 30,
  enrolled: 0
}
```

---

## 🔄 System Workflow

### Admin Workflow
```
Add Course → Course Listed → Students Register → Monitor Enrollment
```

### Student Workflow
```
Browse Courses → Select Course → Check Conflicts → Register → View Schedule
```

---

## 🐛 Known Limitations

- Data stored in LocalStorage (browser-specific)
- No backend server or database
- No user authentication system
- No email notifications
- Single browser/device limitation

---

## 🚀 Future Enhancements

- [ ] Backend integration with database
- [ ] User authentication and authorization
- [ ] Email notifications for registration
- [ ] Advanced scheduling algorithms
- [ ] Course prerequisites management
- [ ] Waitlist functionality
- [ ] Export schedule to PDF/Calendar
- [ ] Multi-semester support
- [ ] Grade management integration

---

## 📱 Browser Compatibility

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Edge
- ✅ Safari
- ✅ Opera

---

## 🤝 Contributing

This is an academic project (FSAD-PS48). For improvements:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Submit a pull request

---

## 📄 License

This project is created for educational purposes as part of FSAD-PS48 coursework.

---

## 👨‍💻 Developer Notes

### LocalStorage Keys Used
- `courses` - Array of all courses
- `myCourses` - Array of student's enrolled courses

### Important Functions
- `addCourse()` - Admin adds new course
- `registerCourse(index)` - Student registers for course
- `dropCourse(index)` - Student drops course
- `filterCourses()` - Search functionality

---

## 📞 Support

For issues or questions related to this project, please refer to the course instructor or teaching assistant.

---

**Project ID:** FSAD-PS48  
**Project Type:** Full Stack Application Development  
**Version:** 1.0.0  
**Last Updated:** 2024

---

## 🎓 Academic Integrity

This project is submitted as part of academic coursework. Please maintain academic integrity and use this as a reference for learning purposes only.
