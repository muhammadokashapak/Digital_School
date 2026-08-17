export const INITIAL_SCHOOL_DATA = {
  schoolName: "Apex International Digital Academy",
  tagline: "Empowering Next-Gen Intelligent Digital Campus",
  academicYear: "2026-2027",

  // Default User Role & Active Super Admin
  currentUserRole: "SUPER_ADMIN",
  activeUser: {
    id: "USR-ADMIN-1",
    name: "Muhammad Okasha",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    grade: "Director & Super Administrator",
    rollNo: "ADM-001",
    guardian: "Head of Institution",
    email: "muhammad.okasha2146@gmail.com",
    phone: "+92 300 0000000"
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

  // Faculty Directory (Initialized with Super Admin faculty record)
  teachersProfile: [
    {
      id: "U-ADM-FAC",
      employeeId: "EMP-ADMIN",
      name: "Muhammad Okasha",
      department: "Director Office",
      primarySubject: "System Administration & Computing",
      secondarySubjects: ["Computer Science", "Mathematics"],
      assignedGrades: ["9", "10"],
      assignedClasses: ["Class 9-A", "Class 10-A"],
      assignedSections: ["A"],
      assignedCourses: ["CRS-CS9"],
      assignedStudents: [],
      classTeacherFor: "Class 9-A",
      permissions: ["Teaching", "Attendance", "Assignments", "Quizzes", "Exams", "Resources", "Student Progress", "Grading", "Feedback"],
      qualification: "Master of Science in Information Technology",
      joiningDate: "01 Jan 2026",
      bio: "Super Administrator and Director of Apex International Digital Academy."
    }
  ],

  // Clean Initial Student 360° Profiles List (Empty slate)
  students360: [],

  // Timetable
  timetable: [
    { time: "08:30 AM - 09:15 AM", subject: "Computer Science", teacher: "Muhammad Okasha", room: "Digital Lab 1" },
    { time: "09:20 AM - 10:05 AM", subject: "Mathematics", teacher: "Faculty Staff", room: "Room 102" },
    { time: "10:30 AM - 11:15 AM", subject: "Physics", teacher: "Science Faculty", room: "Room 201" },
    { time: "11:20 AM - 12:05 PM", subject: "English Literature", teacher: "Languages Faculty", room: "Room 104" }
  ],

  // LMS Courses & Chapters
  lms: [
    {
      id: "CRS-CS9",
      subject: "Computer Science & Programming",
      class: "Class 9-A",
      teacher: "Muhammad Okasha",
      code: "CS-901",
      chapters: [
        {
          id: "CH1",
          title: "Introduction to Algorithms & Flowcharts",
          items: [
            { id: "L1", title: "Video Lecture: Computational Thinking", type: "video", duration: "18 mins", completed: false },
            { id: "L2", title: "Flowchart Design Guidelines (PDF)", type: "pdf", fileSize: "1.2 MB", completed: false }
          ],
          quiz: {
            id: "QZ-CS1",
            title: "Computer Science Concept Assessment",
            questionsCount: 2,
            timeLimit: "10 mins",
            questions: [
              { id: 1, text: "Which symbol represents a Decision in flowcharts?", options: ["Rectangle", "Oval", "Diamond", "Parallelogram"], correct: 2 },
              { id: 2, text: "Which language is primarily used for Web Frontend development?", options: ["JavaScript", "C++", "Assembly", "Fortran"], correct: 0 }
            ]
          }
        }
      ]
    }
  ],

  // Clean Initial Attendance Records (Empty slate)
  attendance: [],

  // Clean Initial Fee Invoices (Empty slate)
  feeInvoices: [],

  // Examination Results Template
  examResults: {
    studentName: "Student",
    term: "Term Examination 2026",
    grade: "Class 9-A",
    overallPercentage: 0,
    gpa: "N/A",
    gradeLetter: "N/A",
    rankInClass: "N/A",
    subjects: [
      { name: "Mathematics", marks: 0, total: 100, grade: "-", remarks: "Pending Assessment" },
      { name: "Computer Science", marks: 0, total: 100, grade: "-", remarks: "Pending Assessment" }
    ]
  },

  // Library Resources
  libraryResources: [
    { id: "LIB-1", title: "Computer Science & Python Textbook", subject: "Computer Science", format: "PDF", pages: 240, category: "Textbook", size: "12.4 MB" },
    { id: "LIB-2", title: "Mathematics for Senior Secondary", subject: "Mathematics", format: "PDF", pages: 310, category: "Textbook", size: "15.1 MB" }
  ],

  // Announcements
  announcements: [
    {
      id: "ANN-1",
      title: "📢 Welcome to Apex Digital School Portal",
      date: "August 18, 2026",
      category: "System",
      author: "Super Admin",
      content: "System initialized. Super Administrator Muhammad Okasha is active. You may now enroll students, faculty and staff."
    }
  ],

  schoolIntelligence: {
    totalStudents: 0,
    overallAttendance: 100,
    atRiskStudentsCount: 0,
    academicAverage: 0
  },

  teacherWorkload: [
    { name: "Muhammad Okasha", subject: "Computer Science", classesCount: 2, totalWeeklyHours: 18, assignedGrade: "Grade 9 & 10", status: "Optimal" }
  ],

  messages: [],

  aiPresets: {
    tutorTopics: [
      "Explain the binary search algorithm step-by-step",
      "What is the difference between synchronous and asynchronous programming?",
      "How does object-oriented inheritance work?"
    ],
    weaknessRecommendations: []
  }
};
