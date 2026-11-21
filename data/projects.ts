export const DOMAINS = [
  "Web",
  "Android",
  "Machine Learning",
  "IoT",
  "Python",
  "Java",
] as const;

export type Domain = (typeof DOMAINS)[number];

export type Project = {
  slug: string;
  title: string;
  domain: Domain;
  techStack: string[];
  price: number;
  featured: boolean;
  abstract: string;
  features: string[];
  screenshots: string[];
};

// Placeholder screenshots so nothing breaks. Swap for real screenshots later.
const DOMAIN_COLORS: Record<Domain, string> = {
  Web: "4f46e5",
  Android: "16a34a",
  "Machine Learning": "9333ea",
  IoT: "ea580c",
  Python: "0284c7",
  Java: "dc2626",
};

function placeholder(text: string, domain: Domain, size = "800x500") {
  const color = DOMAIN_COLORS[domain];
  return `https://placehold.co/${size}/${color}/ffffff/png?text=${encodeURIComponent(text)}&font=poppins`;
}

function screenshots(domain: Domain, names: string[]) {
  return names.map((name) => placeholder(name, domain));
}

export const WHAT_YOU_GET = [
  "Complete source code",
  "Database / dataset files",
  "Project report (Word + PDF)",
  "Presentation (PPT)",
  "Setup help over call / screen share",
];

export const projects: Project[] = [
  {
    slug: "hospital-management-system",
    title: "Hospital Management System",
    domain: "Web",
    techStack: ["React", "Node.js", "Express", "MongoDB"],
    price: 4999,
    featured: true,
    abstract:
      "A web application that digitises day-to-day hospital operations. Patients can book appointments online, doctors manage their schedules and prescriptions, and the admin tracks beds, billing and staff from a single dashboard.",
    features: [
      "Role-based login for admin, doctor and patient",
      "Online appointment booking with time slots",
      "Digital prescriptions and patient history",
      "Bed availability and ward management",
      "Billing with downloadable PDF invoices",
    ],
    screenshots: screenshots("Web", ["Dashboard", "Appointments", "Billing"]),
  },
  {
    slug: "e-commerce-website",
    title: "E-Commerce Website with Payment Gateway",
    domain: "Web",
    techStack: ["Next.js", "Tailwind CSS", "PostgreSQL", "Razorpay"],
    price: 5499,
    featured: true,
    abstract:
      "A full-featured online store where users can browse products, add them to a cart and pay securely using Razorpay. Includes an admin panel for managing products, orders and inventory.",
    features: [
      "Product catalogue with categories and search",
      "Cart, wishlist and checkout flow",
      "Razorpay payment integration (test mode)",
      "Order tracking for customers",
      "Admin panel for products and orders",
    ],
    screenshots: screenshots("Web", ["Home Page", "Product Page", "Admin Panel"]),
  },
  {
    slug: "online-examination-system",
    title: "Online Examination System",
    domain: "Web",
    techStack: ["PHP", "MySQL", "Bootstrap", "JavaScript"],
    price: 3499,
    featured: false,
    abstract:
      "A secure platform for conducting MCQ-based exams online. Teachers create question banks and schedule tests; students take timed exams and get instant results with detailed analysis.",
    features: [
      "Question bank with subjects and difficulty levels",
      "Timed exams with auto-submit",
      "Randomised question order per student",
      "Instant results and performance reports",
    ],
    screenshots: screenshots("Web", ["Exam Screen", "Results", "Teacher Panel"]),
  },
  {
    slug: "college-bus-tracking-app",
    title: "College Bus Tracking App",
    domain: "Android",
    techStack: ["Kotlin", "Firebase", "Google Maps API"],
    price: 4499,
    featured: true,
    abstract:
      "An Android app that shows the live location of college buses on a map. Drivers share their GPS location and students get notified when the bus is close to their stop.",
    features: [
      "Live bus location on Google Maps",
      "Separate driver and student modes",
      "Arrival notifications for selected stop",
      "Route and stop list for every bus",
    ],
    screenshots: screenshots("Android", ["Live Map", "Routes", "Notifications"]),
  },
  {
    slug: "expense-tracker-app",
    title: "Smart Expense Tracker App",
    domain: "Android",
    techStack: ["Java", "SQLite", "MPAndroidChart"],
    price: 2999,
    featured: false,
    abstract:
      "A personal finance Android app to record daily income and expenses. Visual charts show where money goes each month, and budget alerts help users save more.",
    features: [
      "Add income and expenses with categories",
      "Monthly pie and bar charts",
      "Budget limits with alerts",
      "Export data to CSV",
    ],
    screenshots: screenshots("Android", ["Home", "Charts", "Add Expense"]),
  },
  {
    slug: "fake-news-detection",
    title: "Fake News Detection using NLP",
    domain: "Machine Learning",
    techStack: ["Python", "Scikit-learn", "NLTK", "Flask"],
    price: 3999,
    featured: true,
    abstract:
      "A machine learning model that classifies news articles as real or fake using natural language processing. A simple Flask web interface lets users paste any article and get an instant prediction.",
    features: [
      "Text cleaning, TF-IDF feature extraction",
      "Compared Logistic Regression, Naive Bayes and SVM",
      "Around 93% accuracy on test data",
      "Flask web app for live predictions",
    ],
    screenshots: screenshots("Machine Learning", ["Web Interface", "Accuracy Graph", "Prediction"]),
  },
  {
    slug: "plant-disease-detection",
    title: "Plant Disease Detection using CNN",
    domain: "Machine Learning",
    techStack: ["Python", "TensorFlow", "Keras", "Streamlit"],
    price: 4999,
    featured: false,
    abstract:
      "A deep learning project that identifies plant leaf diseases from a photo. A Convolutional Neural Network trained on the PlantVillage dataset predicts the disease and suggests remedies.",
    features: [
      "CNN model trained on 38 disease classes",
      "Upload a leaf photo for instant prediction",
      "Remedy suggestions for each disease",
      "Training graphs and confusion matrix included",
    ],
    screenshots: screenshots("Machine Learning", ["Upload Screen", "Prediction", "Training Graph"]),
  },
  {
    slug: "smart-home-automation",
    title: "Smart Home Automation System",
    domain: "IoT",
    techStack: ["ESP32", "Arduino IDE", "Blynk", "Relay Module"],
    price: 5999,
    featured: true,
    abstract:
      "Control home appliances like lights and fans from a mobile phone over Wi-Fi. The ESP32 board connects to the Blynk app, and appliances can also be scheduled or voice-controlled.",
    features: [
      "Control 4 appliances from your phone",
      "Works from anywhere over the internet",
      "Scheduling and timers",
      "Manual switch fallback",
    ],
    screenshots: screenshots("IoT", ["Circuit", "Mobile App", "Hardware Setup"]),
  },
  {
    slug: "air-quality-monitoring",
    title: "IoT Air Quality Monitoring System",
    domain: "IoT",
    techStack: ["NodeMCU", "MQ-135 Sensor", "ThingSpeak"],
    price: 4499,
    featured: false,
    abstract:
      "A low-cost device that measures air quality, temperature and humidity and uploads readings to the cloud. Live graphs on ThingSpeak show pollution levels, with alerts when air quality is poor.",
    features: [
      "Measures AQI, temperature and humidity",
      "Live graphs on ThingSpeak dashboard",
      "Email alert when pollution crosses a limit",
      "Compact, battery-powered design",
    ],
    screenshots: screenshots("IoT", ["Device", "Live Graphs", "Circuit Diagram"]),
  },
  {
    slug: "face-recognition-attendance",
    title: "Face Recognition Attendance System",
    domain: "Python",
    techStack: ["Python", "OpenCV", "face_recognition", "Tkinter"],
    price: 3999,
    featured: true,
    abstract:
      "An automatic attendance system that recognises students' faces through a webcam and marks attendance in an Excel sheet. No more proxy attendance or manual registers.",
    features: [
      "Register students with a few photos",
      "Real-time face detection via webcam",
      "Attendance saved to Excel with date and time",
      "Simple desktop GUI built with Tkinter",
    ],
    screenshots: screenshots("Python", ["Main Window", "Live Detection", "Attendance Sheet"]),
  },
  {
    slug: "library-management-system",
    title: "Library Management System",
    domain: "Java",
    techStack: ["Java", "Swing", "MySQL", "JDBC"],
    price: 2499,
    featured: false,
    abstract:
      "A desktop application for managing a college library. Librarians can add books, issue and return them, and the system automatically calculates late fines.",
    features: [
      "Add, update and search books",
      "Issue and return with due dates",
      "Automatic late fine calculation",
      "Student and book reports",
    ],
    screenshots: screenshots("Java", ["Login", "Book List", "Issue Book"]),
  },
  {
    slug: "online-banking-system",
    title: "Online Banking System",
    domain: "Java",
    techStack: ["Spring Boot", "Thymeleaf", "MySQL"],
    price: 4999,
    featured: false,
    abstract:
      "A web-based banking application built with Spring Boot. Customers can open accounts, transfer funds and view statements, while the admin approves accounts and monitors transactions.",
    features: [
      "Account creation with admin approval",
      "Deposit, withdraw and fund transfer",
      "Transaction history and mini statement",
      "Secure login with password encryption",
    ],
    screenshots: screenshots("Java", ["Dashboard", "Fund Transfer", "Statement"]),
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
