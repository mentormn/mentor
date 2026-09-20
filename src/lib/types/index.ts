export type FormalTier = 
  | 'JUNIOR_MENTOR' 
  | 'SENIOR_MENTOR' 
  | 'MASTER_MENTOR' 
  | 'NATIONAL_LAUREATE';

export interface TierConfig {
  tier: FormalTier;
  titleEn: string;
  titleMn: string;
  minXp: number;
  minClasses: number;
  minStudents: number;
  colorHex: string;
  badgeClass: string;
  description: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  gender: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  age: number;
  grade: string; // e.g., "11th Grade", "12th Grade", "University 1st Year"
  school: string; // e.g., "School No. 1", "Orchlon", "Sant", "Khovd High School"
  location: string; // e.g., "Ulaanbaatar - Sukhbaatar District", "Khovd Aimag", "Darkhan-Uul"
  specializations: string[]; // Subjects they can mentor (e.g. ["Cambridge Math", "Python", "Physics Olympiad"])
  learningGoals: string[]; // Subjects they want to learn (e.g. ["Competitive Programming", "Advanced Calculus"])
  
  // Mentor progression metrics
  mentorTier: FormalTier;
  mentorXp: number;
  totalStudentsMentored: number;
  completedClasses: number;
  
  // Learner metrics
  enrolledClassIds: string[];
}

export interface EnrolledStudent {
  id: string;
  name: string;
  school: string;
  location: string;
  grade: string;
  enrolledAt: string;
}

export interface SprintClass {
  id: string;
  title: string;
  description: string;
  mentorId: string;
  mentorName: string;
  mentorTier: FormalTier;
  mentorSchool: string;
  subject: string;
  curriculum: string; // "Mongolian 12-Year", "Cambridge AS/A-Level", "IB Diploma", "National Olympiad"
  maxSeats: number; // 1 to 10 seats
  enrolledStudents: EnrolledStudent[];
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  durationWeeks: number; // 1, 2, or 3 weeks
  scheduleSummary: string; // e.g., "Tuesdays & Thursdays, 18:00 - 19:30"
  meetingLink: string; // Google Meet / Zoom link
  status: 'open' | 'full' | 'in_progress' | 'completed';
  createdAt: string;
}

export interface Deliverable {
  id: string;
  classId: string;
  studentId: string;
  studentName: string;
  title: string;
  urlOrNotes: string; // GitHub URL, PDF link, or project notes
  mentorFeedback?: string;
  status: 'pending' | 'approved' | 'revision';
  submittedAt: string;
  approvedAt?: string;
}

export interface Certificate {
  id: string; // Format: MN-EDU-2026-XXXX
  mentorId: string;
  mentorName: string;
  mentorSchool: string;
  tier: FormalTier;
  totalHours: number;
  studentsImpacted: number;
  classTitle: string;
  subject: string;
  sha256Hash: string;
  issuedDate: string;
  verificationUrl: string;
}
