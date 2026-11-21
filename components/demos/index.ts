import type { ComponentType } from "react";
import type { Device } from "./DeviceFrame";
import HospitalDemo from "./HospitalDemo";
import ShopDemo from "./ShopDemo";
import ExamDemo from "./ExamDemo";
import BusDemo from "./BusDemo";
import ExpenseDemo from "./ExpenseDemo";
import FakeNewsDemo from "./FakeNewsDemo";
import PlantDemo from "./PlantDemo";
import SmartHomeDemo from "./SmartHomeDemo";
import AirQualityDemo from "./AirQualityDemo";
import AttendanceDemo from "./AttendanceDemo";
import LibraryDemo from "./LibraryDemo";
import BankingDemo from "./BankingDemo";

type Demo = {
  component: ComponentType;
  device: Device;
  label: string; // URL bar text (browser) or window title (desktop)
};

// One entry per project slug in data/projects.ts.
export const DEMOS: Record<string, Demo> = {
  "hospital-management-system": { component: HospitalDemo, device: "browser", label: "localhost:3000/admin/dashboard" },
  "e-commerce-website": { component: ShopDemo, device: "browser", label: "localhost:3000" },
  "online-examination-system": { component: ExamDemo, device: "browser", label: "localhost/exam-portal/student/test.php" },
  "college-bus-tracking-app": { component: BusDemo, device: "phone", label: "CampusRide" },
  "expense-tracker-app": { component: ExpenseDemo, device: "phone", label: "Spendly" },
  "fake-news-detection": { component: FakeNewsDemo, device: "browser", label: "127.0.0.1:5000" },
  "plant-disease-detection": { component: PlantDemo, device: "browser", label: "localhost:8501" },
  "smart-home-automation": { component: SmartHomeDemo, device: "browser", label: "blynk.cloud/dashboard" },
  "air-quality-monitoring": { component: AirQualityDemo, device: "browser", label: "thingspeak.com/channels/2451873" },
  "face-recognition-attendance": { component: AttendanceDemo, device: "desktop", label: "Face Recognition Attendance System" },
  "library-management-system": { component: LibraryDemo, device: "desktop", label: "Library Management System – Java Swing" },
  "online-banking-system": { component: BankingDemo, device: "browser", label: "localhost:8080/login" },
};
