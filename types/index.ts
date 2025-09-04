export interface FacultyMember {
  id: string;
  name: string;
  position: string;
  qualification: string;
  specialization: string[];
  experience: string;
  contact: string;
  phone: string;
  image: string;
  social?: {
    linkedin?: string;
    researchGate?: string;
    googleScholar?: string;
  };
  achievements: string[];
  publications: string[];
  patents?: string[];
  professionalMemberships?: string[];
  lab?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  type: 'student' | 'faculty' | 'department';
  date: string;
  image?: string;
  category: string;
  participants?: string[];
  externalLink?: string;
  pdfFile?: string;
  additionalPdfFile?: string;
}

export interface Facility {
  id: string;
  name: string;
  description: string;
  incharge: string;
  area: string;
  capacity: number;
  equipment: Equipment[];
  images: string[];
  features: string[];
  availability: string;
  bookingRequired: boolean;
}

export interface Equipment {
  name: string;
  specifications: string[];
  quantity: number;
  condition: 'excellent' | 'good' | 'fair' | 'needs-maintenance';
  lastMaintenance?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: 'workshop' | 'seminar' | 'conference' | 'competition' | 'celebration';
  image: string;
  registrationRequired: boolean;
  registrationDeadline?: string;
  maxParticipants?: number;
  currentParticipants: number;
  speakers?: string[];
  externalLink?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  publishDate: string;
  image: string;
  category: 'academic' | 'research' | 'student-life' | 'achievements' | 'events';
  tags: string[];
  readTime: number;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  credits: number;
  semester: number;
  description: string;
  objectives: string[];
  outcomes: string[];
  syllabus: string[];
  prerequisites: string[];
  faculty: string[];
  labHours: number;
  theoryHours: number;
}

export interface StudentProject {
  id: string;
  title: string;
  description: string;
  students: string[];
  faculty: string;
  year: number;
  semester: number;
  category: 'academic' | 'research' | 'industry' | 'competition';
  technologies: string[];
  image: string;
  githubLink?: string;
  liveDemo?: string;
  achievements?: string[];
}

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
  department?: string;
  phone?: string;
}

export interface NavigationItem {
  name: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  children?: NavigationItem[];
  external?: boolean;
}

export interface StatsData {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface Testimonial {
  id: string;
  name: string;
  position: string;
  company: string;
  content: string;
  image: string;
  rating: number;
  year: number;
}

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  image: string;
  category: 'events' | 'faculty' | 'students' | 'facilities' | 'achievements';
  date: string;
  tags: string[];
}

export interface Student {
  name: string;
  usn: string;
  batch: string;
  tenth_percentage: number;
  puc_percentage: number;
  sem1_percentage: number;
  sem2_percentage: number;
  sem3_percentage: number;
  sem4_percentage: number;
  sem5_percentage?: number;
  sem6_percentage?: number;
  aggregate_percentage: number;
  active_backlogs: number;
  placement_eligible: boolean;
  placement_status: 'Placed' | 'Not Placed' | 'Under Process';
}

export interface StudentAnalytics {
  totalStudents: number;
  averageAggregate: number;
  placementEligibleCount: number;
  placedStudentsCount: number;
  backlogStudentsCount: number;
  batchDistribution: { [key: string]: number };
  gradeDistribution: { [key: string]: number };
  semesterPerformance: { [key: string]: number };
  topPerformers: Student[];
  improvementTrends: { [key: string]: number };
}