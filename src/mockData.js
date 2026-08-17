export const INITIAL_SCHOOL_DATA = {
  schoolName: "Apex International Digital Academy",
  tagline: "Empowering Next-Gen Intelligent Digital Campus",
  academicYear: "2026-2027",

  // 11 Core User Roles
  currentUserRole: "STUDENT",
  activeUser: {
    id: "S101",
    name: "Ali Ahmed",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    grade: "Class 9-A",
    rollNo: "09042",
    guardian: "Tariq Ahmed",
    email: "ali.ahmed@apexdigital.edu",
    phone: "+92 300 1234567"
  },

  roles: [
    { id: "SUPER_ADMIN", name: "Super Admin", icon: "ShieldAlert", badge: "System Level" },
    { id: "SCHOOL_ADMIN", name: "School Admin", icon: "Settings", badge: "Operations" },
    { id: "PRINCIPAL", name: "Principal Dashboard", icon: "TrendingUp", badge: "Executive" },
    { id: "TEACHER", name: "Teacher Portal", icon: "GraduationCap", badge: "Staff" },
    { id: "STUDENT", name: "Student Portal", icon: "User", badge: "Learner" },
    { id: "PARENT", name: "Parent Portal", icon: "Users", badge: "Guardian" },
    { id: "ACCOUNTANT", name: "Accountant / Fees", icon: "CreditCard", badge: "Finance" },
    { id: "EXAMINATION", name: "Exam Department", icon: "FileSpreadsheet", badge: "Assessment" },
    { id: "LIBRARY", name: "Library Portal", icon: "Library", badge: "Resources" },
    { id: "TRANSPORT", name: "Transport Dept", icon: "Bus", badge: "Logistics" },
    { id: "HR", name: "HR & Staff Portal", icon: "UserCheck", badge: "Human Capital" }
  ],

  // Teacher Profiles
  teachersProfile: [
    {
      id: "U102",
      employeeId: "EMP-2001",
      name: "Prof. Sarah Khan",
      department: "Mathematics",
      primarySubject: "Mathematics",
      secondarySubjects: ["Algebra Advanced"],
      assignedGrades: ["9", "10"],
      assignedClasses: ["Class 9-A", "Class 10-B"],
      assignedSections: ["A", "B"],
      assignedCourses: ["CRS-MATH9", "CRS-MATH10"],
      assignedStudents: ["S101", "S102"], // normally derived, but static here
      classTeacherFor: "Class 9-A",
      permissions: ["Teaching", "Attendance", "Assignments", "Quizzes", "Exams", "Resources", "Student Progress", "Grading", "Feedback"],
      qualification: "Ph.D. in Mathematics",
      joiningDate: "15 Aug 2021",
      bio: "Passionate about making mathematics accessible to everyone."
    },
    {
      id: "U-PHY1",
      employeeId: "EMP-2002",
      name: "Dr. Kamran Malik",
      department: "Science",
      primarySubject: "Physics",
      secondarySubjects: ["General Science"],
      assignedGrades: ["9"],
      assignedClasses: ["Class 9-A"],
      assignedSections: ["A"],
      assignedCourses: ["CRS-PHY9"],
      assignedStudents: ["S101", "S102"],
      classTeacherFor: null,
      permissions: ["Teaching", "Attendance", "Assignments", "Quizzes", "Exams", "Resources", "Student Progress", "Grading", "Feedback"],
      qualification: "Ph.D. in Physics",
      joiningDate: "10 Jan 2020",
      bio: "Believes in practical, hands-on science education."
    }
  ],

  // Student 360° Profiles
  students360: [
    {
      id: "S101",
      name: "Ali Ahmed",
      rollNo: "09042",
      grade: "Class 9-A",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      guardian: "Tariq Ahmed",
      guardianPhone: "+92 300 1234567",
      attendancePct: 94.5,
      gpa: 3.85,
      overallGrade: "A+",
      riskLevel: "LOW", // 'LOW', 'MEDIUM', 'HIGH'
      riskReasons: [],
      learningStreak: 7, // days
      xpPoints: 1420,
      badges: ["Math Wizard 🧮", "100% Attendance 🌟", "Code Ninja 💻", "Fast Quizzer ⚡"],
      strongSubjects: ["Computer Science", "English Literature", "Mathematics"],
      weakTopics: ["Physics - Kinematics Vector Numericals"],
      teacherRemarks: "Exceptional logic skills. Very active during live video classes.",
      portfolioProjects: ["Weather App in Python", "Solar System 3D Model"],
      skills: ["Python", "Problem Solving", "Public Speaking"],
      behaviorRating: "Excellent"
    },
    {
      id: "S102",
      name: "Usman Tariq",
      rollNo: "09044",
      grade: "Class 9-A",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
      guardian: "Tariq Mahmood",
      guardianPhone: "+92 300 7654321",
      attendancePct: 68.0,
      gpa: 2.10,
      overallGrade: "C",
      riskLevel: "HIGH", // Early Warning System Target
      riskReasons: ["Attendance below 70% threshold", "4 Overdue Assignments", "Scored 52% in Mathematics"],
      learningStreak: 1,
      xpPoints: 340,
      badges: ["Participation Badge 🥉"],
      strongSubjects: ["Islamic Studies"],
      weakTopics: ["Mathematics - Matrices & Determinants", "Physics - Motion Laws"],
      teacherRemarks: "Requires urgent academic assistance and attendance improvement.",
      portfolioProjects: ["Basic HTML Page"],
      skills: ["Drawing"],
      behaviorRating: "Needs Monitoring"
    }
  ],

  // School Intelligence Dashboard Stats
  schoolIntelligence: {
    totalStudents: 1240,
    overallAttendance: 94.2,
    academicAverage: 82.5,
    assignmentCompletionRate: 89.4,
    atRiskStudentsCount: 42,
    topClass: "Class 8-A (89.1% avg)",
    weakestSubject: "Physics Chapter 3 (Kinematics)",
    teacherWorkloadStatus: "OPTIMAL (85% avg capacity)"
  },

  // Teacher Workload Analytics
  teacherWorkload: [
    { name: "Prof. Sarah Khan", subject: "Mathematics", assignedClasses: 4, totalStudents: 160, pendingAssignments: 38, weeklyHours: 22, status: "Normal" },
    { name: "Dr. Kamran Malik", subject: "Physics", assignedClasses: 5, totalStudents: 195, pendingAssignments: 64, weeklyHours: 28, status: "High Workload" },
    { name: "Engr. Usman Ali", subject: "Computer Science", assignedClasses: 3, totalStudents: 120, pendingAssignments: 15, weeklyHours: 18, status: "Optimal" }
  ],

  // Transport Department & Bus Routes
  transport: {
    totalBuses: 12,
    activeRoutes: 8,
    assignedStudentsCount: 410,
    routes: [
      { id: "RT-1", busNo: "Bus 04 (Toyota Coaster)", driver: "Muhammad Aslam", routeName: "Gulberg → Model Town → School", status: "On Route", currentGps: "Lat: 31.5204, Long: 74.3587", capacity: "40 / 45" },
      { id: "RT-2", busNo: "Bus 08 (Hino Bus)", driver: "Tariq Bashir", routeName: "DHA Phase 5 → Cantt → School", status: "Departed", currentGps: "Lat: 31.4700, Long: 74.4100", capacity: "52 / 60" }
    ]
  },

  // HR & Staff Portal Data
  hrData: {
    totalStaff: 85,
    presentStaffToday: 82,
    pendingLeaveRequests: 3,
    leaves: [
      { id: "LV-1", staffName: "Ms. Ayesha Raza", role: "English Teacher", type: "Casual Leave", date: "10 Aug 2026", reason: "Family emergency", status: "PENDING" }
    ]
  },

  // Standard Timetable
  timetable: [
    { time: "08:30 - 09:15 AM", subject: "Mathematics", teacher: "Prof. Sarah Khan", room: "Virtual Studio 1", class: "Class 9-A" },
    { time: "09:20 - 10:05 AM", subject: "Physics", teacher: "Dr. Kamran Malik", room: "Studio B", class: "Class 9-A" },
    { time: "10:10 - 10:55 AM", subject: "Computer Science", teacher: "Engr. Usman Ali", room: "Lab 3", class: "Class 9-A" },
    { time: "11:15 - 12:00 PM", subject: "English Literature", teacher: "Ms. Ayesha Raza", room: "Room 105", class: "Class 9-A" }
  ],

  // LMS Courses
  lms: [
    {
      id: "CRS-MATH9",
      class: "Class 9",
      subject: "Mathematics",
      code: "MATH-901",
      teacher: "Prof. Sarah Khan",
      banner: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80",
      progress: 82,
      chapters: [
        {
          id: "CH-1",
          title: "Chapter 1: Matrices & Determinants",
          lessons: [
            { id: "L1", title: "Types of Matrices & Matrix Addition", duration: "24 mins", type: "video", videoUrl: "https://www.youtube.com/embed/xyAuNHP3-gU", completed: true },
            { id: "L2", title: "Cramer's Rule & Inverses Step-by-Step", duration: "18 mins", type: "video", videoUrl: "https://www.youtube.com/embed/01C_rP_m8_M", completed: true },
            { id: "L3", title: "Chapter 1 Reference Formula Sheet (PDF)", type: "pdf", fileSize: "1.4 MB", completed: true }
          ],
          quiz: {
            id: "QZ-MATH1",
            title: "Matrices Mastery Quiz",
            questionsCount: 3,
            timeLimit: "10 mins",
            questions: [
              { id: 1, text: "What is the determinant of a 2x2 identity matrix?", options: ["0", "1", "2", "-1"], correct: 1 },
              { id: 2, text: "If matrix A is 2x3 and matrix B is 3x2, what is the order of AB?", options: ["2x2", "3x3", "2x3", "3x2"], correct: 0 },
              { id: 3, text: "Which matrix has non-zero determinant?", options: ["Singular Matrix", "Non-Singular Matrix", "Null Matrix", "Diagonal Zero Matrix"], correct: 1 }
            ]
          }
        }
      ]
    },
    {
      id: "CRS-PHY9",
      class: "Class 9",
      subject: "Physics",
      code: "PHY-902",
      teacher: "Dr. Kamran Malik",
      banner: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=600&auto=format&fit=crop&q=80",
      progress: 65,
      chapters: [
        {
          id: "CH-2",
          title: "Chapter 2: Kinematics & Motion Laws",
          lessons: [
            { id: "L4", title: "Distance vs Displacement & Velocity Graphs", duration: "20 mins", type: "video", videoUrl: "https://www.youtube.com/embed/rAof9Ld5sOg", completed: true },
            { id: "L5", title: "Equations of Uniformly Accelerated Motion", duration: "25 mins", type: "video", videoUrl: "https://www.youtube.com/embed/ZM8ECpBuQYE", completed: false },
            { id: "L6", title: "Kinematics Numerical Problem Bank (PDF)", type: "pdf", fileSize: "2.1 MB", completed: false }
          ],
          quiz: {
            id: "QZ-PHY1",
            title: "Kinematics & Acceleration Quiz",
            questionsCount: 3,
            timeLimit: "10 mins",
            questions: [
              { id: 1, text: "Which of the following is a vector quantity?", options: ["Speed", "Distance", "Velocity", "Mass"], correct: 2 },
              { id: 2, text: "What is the SI unit of acceleration?", options: ["m/s", "m/s²", "N/m", "kg.m/s"], correct: 1 },
              { id: 3, text: "The slope of a Distance-Time graph represents:", options: ["Acceleration", "Speed", "Force", "Displacement"], correct: 1 }
            ]
          }
        }
      ]
    },
    {
      id: "CRS-CS9",
      class: "Class 9",
      subject: "Computer Science",
      code: "CS-903",
      teacher: "Engr. Usman Ali",
      banner: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80",
      progress: 90,
      chapters: [
        {
          id: "CH-3",
          title: "Chapter 3: Introduction to Programming & Algorithms",
          lessons: [
            { id: "L7", title: "Algorithms, Flowcharts & Logic Design", duration: "22 mins", type: "video", videoUrl: "https://www.youtube.com/embed/eSYeHLW5G0A", completed: true },
            { id: "L8", title: "Python Basics: Variables & Data Types", duration: "30 mins", type: "video", videoUrl: "https://www.youtube.com/embed/kqtD5dpn9C8", completed: true },
            { id: "L9", title: "Python Cheat Sheet & Syntax Guide (PDF)", type: "pdf", fileSize: "1.8 MB", completed: true }
          ],
          quiz: {
            id: "QZ-CS1",
            title: "Python Syntax & Flowchart Quiz",
            questionsCount: 3,
            timeLimit: "10 mins",
            questions: [
              { id: 1, text: "Which symbol is used for Decision in Flowcharts?", options: ["Rectangle", "Oval", "Diamond", "Parallelogram"], correct: 2 },
              { id: 2, text: "Which function converts input to integer in Python?", options: ["int()", "str()", "float()", "num()"], correct: 0 },
              { id: 3, text: "How do you start a single-line comment in Python?", options: ["//", "/*", "#", "--"], correct: 2 }
            ]
          }
        }
      ]
    }
  ],

  // Attendance Records
  attendance: [
    { id: "ST1", name: "Ali Ahmed", rollNo: "09042", class: "Class 9-A", status: "PRESENT", totalDays: 200, presentDays: 189, percentage: 94.5 },
    { id: "ST2", name: "Ahmed Raza", rollNo: "09043", class: "Class 9-A", status: "PRESENT", totalDays: 250, presentDays: 228, percentage: 91.2 },
    { id: "ST3", name: "Usman Tariq", rollNo: "09044", class: "Class 9-A", status: "ABSENT", totalDays: 100, presentDays: 68, percentage: 68.0, alertSent: true },
    { id: "ST4", name: "Hamza Shafiq", rollNo: "09045", class: "Class 10-B", status: "LATE", totalDays: 250, presentDays: 221, percentage: 88.4 }
  ],

  // Fee Invoices
  feeInvoices: [
    {
      id: "INV-2026-081",
      studentName: "Ali Ahmed",
      studentId: "S101",
      month: "August 2026",
      dueDate: "15 Aug 2026",
      amount: "$180",
      breakdown: [
        { item: "Monthly Tuition Fee", cost: "$120" },
        { item: "Computer & AI Lab Fee", cost: "$35" },
        { item: "Digital Library Access", cost: "$15" },
        { item: "Transport (Route 4)", cost: "$10" }
      ],
      status: "UNPAID",
      transactionRef: null
    },
    {
      id: "INV-2026-071",
      studentName: "Ali Ahmed",
      studentId: "S101",
      month: "July 2026",
      dueDate: "15 Jul 2026",
      amount: "$180",
      breakdown: [
        { item: "Monthly Tuition Fee", cost: "$120" },
        { item: "Computer & AI Lab Fee", cost: "$35" },
        { item: "Digital Library Access", cost: "$15" },
        { item: "Transport (Route 4)", cost: "$10" }
      ],
      status: "PAID",
      paidOn: "12 Jul 2026",
      transactionRef: "TXN-8849201"
    }
  ],

  // Examination Results
  examResults: {
    studentName: "Ali Ahmed",
    term: "Mid-Term Assessment 2026",
    grade: "Class 9-A",
    overallPercentage: 89.2,
    gpa: "3.85 / 4.0",
    gradeLetter: "A+",
    rankInClass: "3rd / 42",
    subjects: [
      { name: "Mathematics", marks: 88, total: 100, grade: "A", remarks: "Excellent logical skills" },
      { name: "Physics", marks: 81, total: 100, grade: "A-", remarks: "Good conceptual clarity" },
      { name: "Computer Science", marks: 95, total: 100, grade: "A+", remarks: "Outstanding programming potential" },
      { name: "English Literature", marks: 92, total: 100, grade: "A+", remarks: "Strong comprehension" }
    ]
  },

  // Library Resources
  libraryResources: [
    { id: "LIB-1", title: "Class 9 Mathematics Comprehensive Textbook", subject: "Math", format: "PDF", pages: 320, category: "Textbook", size: "14.2 MB" },
    { id: "LIB-2", title: "Physics Practical Manual & Lab Guide", subject: "Physics", format: "PDF", pages: 95, category: "Lab Guide", size: "8.5 MB" },
    { id: "LIB-3", title: "Python Programming for Beginners", subject: "Computer Science", format: "E-Book", pages: 180, category: "E-Book", size: "6.1 MB" }
  ],

  // Announcements & Messages
  announcements: [
    {
      id: "ANN-1",
      title: "📢 Mid-Term Examination Schedule Announced",
      date: "August 06, 2026",
      category: "Academic",
      author: "Principal Office",
      content: "The Mid-Term Examinations for Classes 8 to 10 will begin on September 01, 2026."
    }
  ],

  messages: [
    {
      id: "MSG-1",
      sender: "Prof. Sarah Khan (Math Teacher)",
      receiver: "Tariq Ahmed (Parent)",
      time: "Yesterday 4:30 PM",
      text: "Hello Mr. Tariq, Ali performed exceptionally well in the recent Matrices quiz."
    }
  ],

  aiPresets: {
    tutorTopics: [
      "Explain Cramer's Rule in simple steps",
      "How to derive 2nd Equation of Motion v = u + at?",
      "What is the difference between a Compiler and an Interpreter?"
    ],
    weaknessRecommendations: [
      { subject: "Physics", topic: "Kinematics - Velocity vs Time Graphs", score: "64%", recommendation: "Watch 12-min Revision Video + Practice Quiz #3" }
    ]
  }
};
