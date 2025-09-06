'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navigation from '../components/layout/Navigation';
import HeroSection from '../components/sections/HeroSection';
import { 
  GraduationCap, 
  Users, 
  Trophy, 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  ExternalLink,
  Star,
  Award,
  BookOpen,
  Globe,
  Code,
  Palette,
  Database,
  Cloud,
  Shield,
  Zap,
  Target,
  Sparkles
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { FacultyMember, Achievement, Facility, Event, NewsItem, Course, StudentProject } from '../types';

// Real data from PESITM official website - Updated faculty order
const facultyMembers: FacultyMember[] = [
     {
     id: "1",
     name: "Dr. Pramod",
     position: "Professor and HOD",
     qualification: "Ph.D. in Computer Science",
     specialization: ["Computer Science", "Department Leadership", "Research", "Intrusion Detection Systems", "Machine Learning", "IoT"],
     experience: "23 Years",
     contact: "hodcsd@pestrust.edu.in",
     phone: "9886890174",
     image: "/dr-pramod.jpg",
     achievements: ["Department Head", "Research Excellence", "Academic Leadership", "Scopus Author ID: 57373921000", "Orcid ID: 0000-0002-3998-8544"],
     publications: [
       "An Efficient Feature Selection Approach for Intrusion Detection System using Decision Tree - IJACSA 13(2), 2022",
       "Deep Reinforcement Learning based Ensemble Model for Intrusion Detection System - IJACSA 13(5), 2022",
       "A Deep Learning Approach to Enhance Network Intrusion Detection Capabilities for Cyber Security - IJACSA 13(5), 2022",
       "Design and Development of an Efficient Network Intrusion Detection System Using Ensemble Machine Learning Techniques for Wifi Environments - IJACSA 13(5), 2023",
       "Internet of Things-Powered Drone Monitoring System for Prompt Identification of Unauthorized Deforestation in Specific Areas - ISSN No:1001-2400 VOLUME 18, ISSUE 1, 2024"
     ],
     patents: [
       "An Approach of Topic Modelling and Ensemble Learning to Analyze the Aspect Sentiments of Restaurant Contexts - Application No. 202441052753, published in Patent Office Journal on 19/07/2024"
     ],
     professionalMemberships: [
       "Life Member Computer Society of India, Bangalore, India",
       "Life Member of Indian Society for Technical Education, Bangalore, India",
       "Life Member of IFERP",
       "Web of Science Researcher ID: GON-4299-2022"
     ]
   },
     {
     id: "2",
     name: "Mrs. Ayisha Khanum",
     position: "Assistant Professor",
     qualification: "B.E M.Tech",
     specialization: ["Programming", "Software Engineering", "Web Development", "Deep Learning", "Neural Networks", "IoT", "DDoS Detection"],
     experience: "9 years",
     contact: "ayishak@pesturst.edu.in",
     phone: "8296317636",
     image: "/mrs-ayisha-khanum.jpg",
     lab: "Programming C LAB",
     achievements: ["Excellence in Teaching", "Lab Management", "Industry Projects", "Research Publications"],
     publications: [
       "Deep Recurrent Neural Network Designed to Identify Distributed Denial of Service Flooding Attacks - HTL Journal, Volume 30, Issue 5, May 2024",
       "An Internet of Things Powered Drone Monitoring System for Prompt Identification of Unauthorized Deforestation in Specific Areas - XADZKJDX, Volume 18, Issue 1, 2024, ISSN: 1001-2400"
     ]
   },
     {
     id: "3",
     name: "Mrs. Kavya S",
     position: "Assistant Professor",
     qualification: "B.E, M.Tech",
     specialization: ["Computer Science", "Machine Learning", "AI", "IoT", "Precision Farming", "Agriculture Technology", "Computer Vision"],
     experience: "10 Years",
     contact: "kavyas1828@pestrust.edu.in",
     phone: "8296317636",
     image: "/mrs-kavya-s.jpg",
     achievements: ["AI Research", "Machine Learning", "Innovation", "Research Publications", "IoT and ML Solutions", "Computer Vision Applications"],
     publications: [
       "Integrated IoT and Machine Learning Solutions for Precision Farming: Crop Recommendation and Leaf Disease Diagnosis - 2024 8th International Conference on I-SMAC (IoT in Social, Mobile, Analytics and Cloud) (I-SMAC)",
       "Crop Disease Identification using Computer Vision and Machine Learning Technique - Published in the International Journal of Advanced Scientific Innovation, Volume-6, Issue-8, May 2024",
       "Revolutionizing in agriculture through technology - National-Level Conference Pravarthana-2024 at SEACET, December 2024"
     ]
   },
     {
     id: "4",
     name: "Mr. Manjunatha G",
     position: "Assistant Professor",
     qualification: "DEC, B.E, M.Tech",
     specialization: ["Computer Science", "Data Structures", "Algorithms", "Image Encryption", "VLSI Architectures", "AI and ML Applications", "6G Communication", "Cybersecurity"],
     experience: "10 Years",
     contact: "manjunathag1830@pestrust.edu.in",
     phone: "8296317636",
     image: "/mr-manjunatha-g.png",
     achievements: ["Teaching Excellence", "Student Mentoring", "Technical Skills", "Research Publications", "IEEE Conference Papers", "Springer Publications"],
     publications: [
       "Image Encryption in Compressed Domain Using Auto-Encoder for 6G Communication - Published as a book chapter by Springer Books in August 2024",
       "Design and Implementation of Advanced VLSI Architectures for AI and ML Applications - Published in IJIRCCE, ISO-9001-2007 Certified Journal",
       "Next-Gen AI-Embedded Vision Systems: Real-Time Optimization for Surveillance, Autonomous Vehicles, and Industry 4.0 - IEEE ICDSCNC-2024 Conference, September 2024",
       "Multiple Chaotic Map-Based Selective Image Encryption Scheme for Medical Images - 2nd IEEE ICIICS-2024 Conference",
       "Revolutionizing in agriculture through technology - National-Level Conference Pravarthana-2024 at SEACET, December 2024",
       "Q1 journal paper on Springer publication - March 2025",
       "Published more than 13 IEEE papers in various IEEE conferences during 2024-25"
     ],
     professionalMemberships: [
       "Vidwan ID: 575089",
       "Orcid ID: 0009-0004-7556-4238",
       "Web of Science Researcher ID: LLL-3079-2024",
       "Life Member of IFERP - PROF-4166821",
       "Google Scholar ID: 7ucrqRsAAAAJ",
       "Research Gate ID: Manjunatha-Gopalakrishna",
       "Life Member of IAENG - International Association of Engineers",
       "Life member of Google Developer Groups (GDG) ID: mndkc6",
       "Active IEEE Member / Bangalore section",
       "Semantic scholar id: 2343845247",
       "Scopus author id: 59563402000",
       "EDAS ID: 2325008",
       "Open reviewer id: Manjunatha_G1"
     ]
   },
     {
     id: "5",
     name: "Mr. Harish M",
     position: "Assistant Professor",
     qualification: "B.E, M.Tech",
     specialization: ["Computer Science", "Database Systems", "Web Technologies", "IoT", "Machine Learning", "Precision Farming", "Agriculture Technology"],
     experience: "Not specified",
     contact: "harishm1843@pestrust.edu.in",
     phone: "8296317636",
     image: "/mr-harish-m.jpg",
     achievements: ["Database Expertise", "Web Development", "Student Projects", "Research Publications", "IoT and ML Solutions"],
     publications: [
       "Integrated IoT and Machine Learning Solutions for Precision Farming: Crop Recommendation and Leaf Disease Diagnosis - 2024 8th International Conference on I-SMAC (IoT in Social, Mobile, Analytics and Cloud) (I-SMAC)",
       "Revolutionizing in agriculture through technology - National-Level Conference Pravarthana-2024 at SEACET, December 2024"
     ]
   },
     {
     id: "6",
     name: "Mrs. Nithya H L",
     position: "Assistant Professor",
     qualification: "B.E, M.Tech",
     specialization: ["Machine Learning", "Innovation", "Research Publications", "Machine Learning Detection"],
     experience: "Not specified",
     contact: "nithyahl1954@pestrust.edu.in",
     phone: "9740418759",
     image: "/nithya.jpg",
     lab: "",
     achievements: ["Machine Learning", "Innovation", "Research Publications", "Machine Learning Detection"],
     publications: [
       "Detection of fake online reviews using Machine Learning Technique - Published in the International Journal for research in Applied science and engineering technology, Volume-8, Issue-8, August 2020"
     ]
   },
     {
     id: "7",
     name: "Mr. Shivakumar S V",
     position: "Lab Instructor",
     qualification: "",
     specialization: [],
     experience: "",
     contact: "",
     phone: "",
     image: "/mr-shivakumar-sv.jpg",
     achievements: [],
     publications: []
   }
];

const achievements: Achievement[] = [
  {
    id: "1",
    title: "Student Consultancy Projects",
    description: "4th Semester students working on consultancy projects with Sixaxis Ltd, Bangalore. Students visited the company on 13th July 2024 and met with Mr. Senthil S, Director of Sixaxis Ltd.",
    type: "student",
    date: "July 2024",
    category: "Industry Collaboration",
    participants: ["4th Semester Students", "Sixaxis Ltd", "Mr. Senthil S"]
  },
  {
    id: "2",
    title: "NPTEL Certifications",
    description: "Total 50+ students have achieved NPTEL certificates from both 5th and 7th semesters till July 2025.",
    type: "student",
    date: "July 2025",
    category: "Academic Excellence",
    participants: ["5th Semester Students", "7th Semester Students"]
  },
  {
    id: "3",
    title: "Industry Collaboration MOU",
    description: "Current MOU with ExcelR Solutions for enhanced learning opportunities and industry exposure.",
    type: "department",
    date: "2023-24",
    category: "Partnerships"
  },
  {
    id: "4",
    title: "Department Newsletters",
    description: "Access our latest department newsletters from 2023 and 2024. Stay updated with our achievements, events, and department highlights.",
    type: "department",
    date: "2023-2024",
    category: "Publications",
    pdfFile: "CSD Newsletter 2024_20250804_130023_0000.pdf",
    additionalPdfFile: "CSD Newsletter 2023.pdf"
  }
];

const facilities: Facility[] = [
  {
    id: "1",
    name: "Programming C LAB",
    description: "State-of-the-art programming laboratory with modern computing facilities and high-speed internet connectivity.",
    incharge: "Mrs. Ayisha Khanum",
    area: "180.27 SQ Meters",
    capacity: 40,
    equipment: [
      {
        name: "ACER Desktop M200 Core 15-12th Generation",
        specifications: ["Intel Core i5", "8 GB RAM", "256 GB SSD", "1TB HDD"],
        quantity: 40,
        condition: "excellent"
      },
      {
        name: "20\" TFT Monitor /DOS",
        specifications: ["Full HD", "IPS Panel", "VGA/HDMI", "High Resolution"],
        quantity: 40,
        condition: "excellent"
      },
      {
        name: "D-Link 24 Port Manageable Switch",
        specifications: ["Gigabit Ethernet", "Managed", "PoE Support", "High Performance"],
        quantity: 2,
        condition: "excellent"
      },
      {
        name: "D-Link 8 Port UnManageable Switch",
        specifications: ["Gigabit Ethernet", "Plug & Play", "Auto-negotiation"],
        quantity: 1,
        condition: "excellent"
      },
      {
        name: "19\" Networking Rack",
        specifications: ["Professional Grade", "Cable Management", "Ventilation"],
        quantity: 1,
        condition: "excellent"
      }
    ],
    images: ["/lab1.jpg", "/lab2.jpg"],
    features: ["Air Conditioned", "High-Speed Internet", "Projector", "Whiteboard", "Professional Setup"],
    availability: "Monday to Friday, 9:00 AM - 6:00 PM",
    bookingRequired: false
  }
];

const events: Event[] = [
  {
    id: "1",
    title: "Two-Day Technical Training on GitHub",
    description: "Comprehensive training session on Git and GitHub for version control and collaboration.",
    date: "2024-08-22",
    time: "9:00 AM - 5:00 PM",
    location: "Programming C LAB",
    type: "workshop",
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=600&fit=crop",
    registrationRequired: true,
    registrationDeadline: "2024-08-20",
    maxParticipants: 40,
    currentParticipants: 35,
    speakers: ["Industry Experts", "GitHub Professionals"]
  },
  {
    id: "2",
    title: "CODE-MANTHANA 2.0",
    description: "Annual coding competition and hackathon showcasing student programming skills and innovation.",
    date: "2024-06-17",
    time: "10:00 AM - 6:00 PM",
    location: "Main Campus",
    type: "competition",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop",
    registrationRequired: true,
    registrationDeadline: "2024-06-15",
    maxParticipants: 100,
    currentParticipants: 85,
    speakers: ["Dr. Pramod", "Industry Mentors"]
  }
];

const news: NewsItem[] = [
  {
    id: "1",
    title: "CSD Department Receives Excellence Award",
    content: "The Computer Science and Design department has been recognized for outstanding contributions to education and research...",
    excerpt: "Department recognized for excellence in education and research",
    author: "Department Office",
    publishDate: "2024-01-15",
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop",
    category: "achievements",
    tags: ["award", "excellence", "recognition"],
    readTime: 3
  }
];

const courses: Course[] = [
  {
    id: "1",
    code: "CS101",
    name: "Introduction to Computer Science",
    credits: 4,
    semester: 1,
    description: "Fundamental concepts of computer science and programming",
    objectives: ["Understand basic CS concepts", "Learn programming fundamentals"],
    outcomes: ["Able to write simple programs", "Understand algorithms"],
    syllabus: ["Programming Basics", "Data Structures", "Algorithms"],
    prerequisites: ["Basic Mathematics"],
    faculty: ["Dr. Pramod"],
    labHours: 2,
    theoryHours: 3
  }
];

const studentProjects: StudentProject[] = [
  {
    id: "1",
    title: "Smart Campus Management System",
    description: "IoT-based system for managing campus facilities and resources",
    students: ["Student 1", "Student 2", "Student 3"],
    faculty: "Dr. Pramod",
    year: 2024,
    semester: 4,
    category: "industry",
    technologies: ["IoT", "Python", "React", "Node.js"],
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop",
    githubLink: "https://github.com/example/project",
    liveDemo: "https://demo.example.com",
    achievements: ["Best Project Award", "Industry Recognition"]
  }
];

// About Section Component with enhanced design
const AboutSection: React.FC = () => {
  const features = [
    {
      icon: GraduationCap,
      title: "Core Courses",
      description: "Combines core courses in Computer Science and Design with electives from Computer Science, Design, and Digital Media.",
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100"
    },

    {
      icon: Building2,
      title: "State-of-the-Art",
      description: "State-of-the-art infrastructure and computing facilities with strong student-faculty interaction.",
      color: "from-blue-600 to-blue-700",
      bgColor: "from-blue-100 to-blue-200"
    },
    {
      icon: Trophy,
      title: "Excellence",
      description: "Consistently achieving academic excellence with industry recognition and partnerships.",
      color: "from-blue-600 to-blue-700",
      bgColor: "from-blue-100 to-blue-200"
    }
  ];

  return (
    <section id="about" className="py-16 sm:py-20 lg:py-24 bg-white dark:bg-gray-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-pattern opacity-10 dark:opacity-20" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16 lg:mb-20"
        >
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-full px-4 sm:px-6 py-2 sm:py-3 text-sm font-medium text-blue-700 mb-6 sm:mb-8 dark:from-blue-900/30 dark:to-blue-800/30 dark:border-blue-700/50 dark:text-blue-300">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
            <span className="text-gray-700 dark:text-gray-300">About Our Department</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4 sm:mb-6 dark:text-gray-100">
            About Our <span className="text-blue-600 dark:text-blue-400">Department</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed dark:text-gray-300 px-2 sm:px-0">
            The B.E Computer Science and Design (CSD) program focuses on developing students experienced with computing approaches, design tools, design approaches, and new digital media technologies.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="card-gradient h-full p-6 sm:p-8 text-center group">
                <div className={`w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br ${feature.color} rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <feature.icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-800 dark:text-white">{feature.title}</h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Enhanced Faculty Section with Detailed Modal
const FacultySection: React.FC = () => {
  const [selectedFaculty, setSelectedFaculty] = useState<FacultyMember | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    console.log('Modal state changed:', { isModalOpen, selectedFaculty: selectedFaculty?.name });
  }, [isModalOpen, selectedFaculty]);

  const openModal = (faculty: FacultyMember) => {
    console.log('Opening modal for:', faculty.name);
    setSelectedFaculty(faculty);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFaculty(null);
    // Re-enable body scrolling
    document.body.style.overflow = 'unset';
    document.body.style.position = 'unset';
    document.body.style.width = 'unset';
    
    // Ensure we stay in faculty section after closing modal
    setTimeout(() => {
      const facultySection = document.getElementById('faculty');
      if (facultySection) {
        facultySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isModalOpen) {
      // Store current scroll position
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      // Restore scroll position
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }

    // Cleanup function
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isModalOpen]);

  return (
         <section id="faculty" className="py-16 sm:py-20 lg:py-16 mt-4 bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20 relative overflow-hidden">
      <div className="absolute inset-0 bg-pattern opacity-15 dark:opacity-25" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-blue-200 dark:border-blue-700 rounded-full px-3 sm:px-4 py-2 mb-4">
            <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
            <span className="text-xs sm:text-sm font-medium text-blue-700 dark:text-blue-300">Meet Our Team</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 text-gray-800 dark:text-gray-100">
            Our <span className="text-blue-600 dark:text-blue-400">Faculty</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-2 sm:px-0">
            Meet our dedicated faculty members who are committed to excellence in education and research.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {facultyMembers.map((faculty, index) => (
            <motion.div
              key={faculty.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
                             <Card 
                 className={`p-3 sm:p-4 h-auto relative z-10 transition-transform duration-300 group-hover:scale-105 ${faculty.name === "Mr. Shivakumar S V" ? "cursor-default" : "cursor-pointer"}`}
                 onClick={faculty.name === "Mr. Shivakumar S V" ? undefined : () => openModal(faculty)}
               >
                 {/* Blurred background effect */}
                 <div className="absolute inset-0 bg-white/80 dark:bg-transparent backdrop-blur-sm rounded-xl opacity-0 group-hover:opacity-100 dark:group-hover:opacity-0 transition-all duration-300 -z-10" />
                 <div className="text-center">
                   <div className="relative mb-3 sm:mb-4">
                     <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 mx-auto rounded-xl overflow-hidden">
                      <img
                        src={faculty.image}
                        alt={faculty.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                  </div>
                  
                                                         <h3 className="text-base sm:text-lg font-bold mb-1 text-gray-800 dark:text-gray-100">{faculty.name}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-1 font-medium text-xs sm:text-sm">{faculty.position}</p>
                    {faculty.qualification && (
                      <p className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 mb-1 font-medium">{faculty.qualification}</p>
                    )}
                    
                    {faculty.qualification && (
                      <div className="mt-2">
                        <span className="text-xs sm:text-sm text-blue-500 dark:text-blue-400 font-medium">Click to view details</span>
                      </div>
                    )}
                    
                    {/* Add spacing for cards without qualification to maintain consistent height */}
                    {!faculty.qualification && (
                      <div className="mt-6 sm:mt-8">
                        <div className="h-4 sm:h-6"></div>
                      </div>
                    )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Faculty Detail Modal */}
        {isModalOpen && selectedFaculty && (
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[99999] flex items-center justify-center p-4 sm:p-6"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-800 rounded-2xl max-w-5xl w-full max-h-[90vh] relative shadow-2xl z-[100000]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with Close Button */}
              <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-gray-100 pr-4">{selectedFaculty.name}</h2>
                  <button
                    onClick={closeModal}
                    className="w-10 h-10 sm:w-8 sm:h-8 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-800/50 rounded-full flex items-center justify-center transition-colors flex-shrink-0 border-2 border-red-200 dark:border-red-700"
                  >
                    <span className="text-red-600 dark:text-red-400 text-lg sm:text-base font-bold">×</span>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-6 lg:p-8 overflow-y-auto max-h-[calc(90vh-120px)]">

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                  {/* Faculty Image and Basic Info */}
                  <div className="lg:col-span-1">
                    <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 mx-auto rounded-2xl overflow-hidden mb-4 sm:mb-6">
                      <img
                        src={selectedFaculty.image}
                        alt={selectedFaculty.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="space-y-3 sm:space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-1 sm:mb-2 text-sm sm:text-base">Position</h4>
                        <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">{selectedFaculty.position}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-1 sm:mb-2 text-sm sm:text-base">Qualification</h4>
                        <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">{selectedFaculty.qualification}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-1 sm:mb-2 text-sm sm:text-base">Experience</h4>
                        <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">{selectedFaculty.experience}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-1 sm:mb-2 text-sm sm:text-base">Contact</h4>
                        <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">{selectedFaculty.contact}</p>
                      </div>
                    </div>
                  </div>

                                     {/* Detailed Information */}
                   <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                     {/* Achievements */}
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2 sm:mb-3 text-sm sm:text-base">Achievements</h4>
                      <ul className="space-y-1 sm:space-y-2">
                        {selectedFaculty.achievements.map((achievement: string, idx: number) => (
                          <li key={idx} className="text-gray-600 dark:text-gray-300 flex items-start text-sm sm:text-base">
                            <span className="text-blue-500 dark:text-blue-400 mr-2 flex-shrink-0">•</span>
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Publications */}
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2 sm:mb-3 text-sm sm:text-base">Publications</h4>
                      <div className="space-y-2 sm:space-y-3">
                        {selectedFaculty.publications.map((pub: string, idx: number) => (
                          <div key={idx} className="bg-gray-50 dark:bg-gray-700 p-2 sm:p-3 rounded-lg">
                            <p className="text-gray-700 dark:text-gray-200 text-xs sm:text-sm">{pub}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Patents */}
                    {selectedFaculty.patents && selectedFaculty.patents.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2 sm:mb-3 text-sm sm:text-base">Patents</h4>
                        <div className="space-y-2 sm:space-y-3">
                          {selectedFaculty.patents.map((patent: string, idx: number) => (
                            <div key={idx} className="bg-blue-50 dark:bg-blue-900/20 p-2 sm:p-3 rounded-lg border-l-4 border-blue-500 dark:border-blue-400">
                              <p className="text-gray-700 dark:text-gray-200 text-xs sm:text-sm">{patent}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Professional Memberships */}
                    {selectedFaculty.professionalMemberships && selectedFaculty.professionalMemberships.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2 sm:mb-3 text-sm sm:text-base">Professional Memberships</h4>
                        <ul className="space-y-1 sm:space-y-2">
                          {selectedFaculty.professionalMemberships.map((membership: string, idx: number) => (
                            <li key={idx} className="text-gray-600 dark:text-gray-300 flex items-start text-sm sm:text-base">
                              <span className="text-blue-500 dark:text-blue-400 mr-2 flex-shrink-0">•</span>
                              {membership}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
};

// Enhanced Achievements Section
const AchievementsSection: React.FC = () => {
  const openPdfInNewTab = (pdfFile: string) => {
    window.open(`/${pdfFile}`, '_blank');
  };

  return (
    <section id="achievements" className="py-16 sm:py-20 bg-white dark:bg-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-pattern opacity-10 dark:opacity-20" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-4 sm:mb-6">
            <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
            <span className="text-xs sm:text-sm font-medium text-blue-700 dark:text-blue-300">Department Achievements</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-gray-800 dark:text-white">
            Department <span className="text-blue-600 dark:text-blue-400">Achievements</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-2 sm:px-0">
            Celebrating the success and accomplishments of our students and faculty.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="gradient-border cursor-pointer relative z-10 transition-transform duration-300 group-hover:scale-105">
                <div className="gradient-border-content p-4 sm:p-6 lg:p-8">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    {achievement.pdfFile ? (
                      <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400" />
                    ) : (
                      <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400" />
                    )}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-800 dark:text-white">{achievement.title}</h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-3 sm:mb-4 leading-relaxed">{achievement.description}</p>
                  <div className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 font-medium mb-2 sm:mb-3">
                    {achievement.date} • {achievement.category}
                  </div>
                  {achievement.participants && (
                    <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-3 sm:mb-4">
                      <span className="font-medium">Participants:</span> {achievement.participants.join(', ')}
                    </div>
                  )}
                  {achievement.pdfFile && (
                    <div className="mt-3 sm:mt-4">
                      {achievement.additionalPdfFile ? (
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                          <button
                            onClick={() => openPdfInNewTab(achievement.additionalPdfFile!)}
                            className="inline-flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 font-medium text-sm"
                          >
                            <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>2023 Newsletter</span>
                          </button>
                          <button
                            onClick={() => openPdfInNewTab(achievement.pdfFile!)}
                            className="inline-flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-medium text-sm"
                          >
                            <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>2024 Newsletter</span>
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => openPdfInNewTab(achievement.pdfFile!)}
                          className="inline-flex items-center space-x-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-medium text-sm"
                        >
                          <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>View Newsletter</span>
                        </button>
                      )}
                    </div>
                  )}
                  {achievement.externalLink && (
                    <div className="mt-3 sm:mt-4">
                      <a
                        href={achievement.externalLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-medium text-sm"
                      >
                        <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>Visit Website</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

// Enhanced Facilities Section
const FacilitiesSection: React.FC = () => {
  return (
    <section id="facilities" className="py-20 bg-gradient-to-br from-blue-50 via-white to-blue-100 relative overflow-hidden">
      <div className="absolute inset-0 bg-pattern opacity-15" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-full px-6 py-3 mb-6">
            <Building2 className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">Our Infrastructure</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
            Our <span className="text-blue-600">Facilities</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            State-of-the-art infrastructure and computing facilities to support your learning journey.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {facilities.map((facility, index) => (
            <motion.div
              key={facility.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="p-8 h-full" hover="lift">
                <h3 className="text-2xl font-bold mb-4 text-gray-800">{facility.name}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{facility.description}</p>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl">
                      <p className="text-sm text-blue-600 font-medium mb-1">Lab In-charge</p>
                      <p className="text-gray-700 font-medium">{facility.incharge}</p>
                    </div>
                    <div className="bg-gradient-to-r from-blue-100 to-blue-200 p-4 rounded-xl">
                      <p className="text-sm text-blue-600 font-medium mb-1">Lab Area</p>
                      <p className="text-gray-700 font-medium">{facility.area}</p>
                    </div>
                    <div className="bg-gradient-to-r from-blue-200 to-blue-100 p-4 rounded-xl">
                      <p className="text-sm text-blue-600 font-medium mb-1">Capacity</p>
                      <p className="text-gray-700 font-medium">{facility.capacity} students</p>
                    </div>
                    <div className="bg-gradient-to-r from-blue-100 to-blue-50 p-4 rounded-xl">
                      <p className="text-sm text-blue-600 font-medium mb-1">Availability</p>
                      <p className="text-gray-700 font-medium text-sm">{facility.availability}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-blue-600 font-medium mb-3">Equipment Details</p>
                    <div className="space-y-3">
                      {facility.equipment.map((item, idx) => (
                        <div key={idx} className="bg-white border border-gray-200 p-4 rounded-xl">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-medium text-gray-700">{item.name}</span>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              item.condition === 'excellent' ? 'bg-green-100 text-green-700' :
                              item.condition === 'good' ? 'bg-blue-100 text-blue-700' :
                              item.condition === 'fair' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {item.condition}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Quantity:</span> {item.quantity}
                          </div>
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Specs:</span> {item.specifications.join(', ')}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-blue-600 font-medium mb-3">Features</p>
                    <div className="flex flex-wrap gap-2">
                      {facility.features.map((feature, idx) => (
                        <span key={idx} className="px-3 py-1 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 text-sm rounded-full font-medium">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Enhanced Contact Section
const ContactSection: React.FC = () => {
  return (
    <section id="contact" className="py-20 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-pattern opacity-15" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full px-6 py-3 mb-6">
            <Mail className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">Get In Touch</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
            Get in <span className="text-blue-600">Touch</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold mb-6 text-gray-800">Contact Information</h3>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Address</h4>
                  <p className="text-gray-600">NH 206, Sagar Road, Shivamogga – 577 204</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-200 to-blue-300 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Phone</h4>
                  <p className="text-gray-600">9886890174</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Email</h4>
                  <p className="text-gray-600">hodcsd@pestrust.edu.in</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="gradient-border">
              <div className="gradient-border-content">
                <h3 className="text-2xl font-bold mb-6 text-gray-800">Send us a Message</h3>
                <form className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="Your name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="Your message..."
                    ></textarea>
                  </div>
                  
                  <Button type="submit" variant="primary" fullWidth>
                    Send Message
                  </Button>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Compact Footer
const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20 text-white py-6 sm:py-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-pattern opacity-10 dark:opacity-20" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
          {/* Logo and Institution Info */}
          <div className="flex items-center space-x-3 sm:space-x-4">
                         <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-white p-1">
               <img 
                 src="/pesitm-logo.jpeg" 
                 alt="PESITM Logo" 
                 className="w-full h-full object-contain"
               />
             </div>
            <div>
              <h3 className="text-sm sm:text-lg font-bold">PES Institute of Technology and Management</h3>
              <p className="text-blue-100 dark:text-blue-200 text-xs sm:text-sm">CSD Department</p>
            </div>
          </div>
          
          
          
          
        </div>
        
        <div className="border-t border-white/20 mt-4 sm:mt-6 pt-3 sm:pt-4 text-center">
          <p className="text-blue-200 dark:text-blue-300 text-xs sm:text-sm">
            © 2025 CSD Department, PESITM. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

// Main App Component
export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
      <AboutSection />
      <FacultySection />
      <AchievementsSection />
      <Footer />
    </main>
  );
}
