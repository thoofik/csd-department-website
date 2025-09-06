'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navigation from '../../components/layout/Navigation';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Award, 
  BookOpen, 
  Target,
  PieChart,
  LineChart,
  GraduationCap,
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter,
  Download,
  AlertTriangle,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, LineChart as RechartsLineChart, Line as RechartsLine, Area, AreaChart, Legend } from 'recharts';
import { Student, StudentAnalytics } from '../../types';
import StudentStatsCard from '../../components/analytics/StudentStatsCard';
import PerformanceChart from '../../components/analytics/PerformanceChart';
import StudentTable from '../../components/analytics/StudentTable';
import StudentDrawer from '../../components/analytics/StudentDrawer';
import StudentEditDrawer from '../../components/analytics/StudentEditDrawer';
import Link from 'next/link';
import Button from '../../components/ui/Button';
import { calculateAnalytics, prepareChartData } from '../../lib/analytics';

// Main Analytics Component
const AnalyticsPage: React.FC = () => {
  const [selectedBatch, setSelectedBatch] = useState<string>('all');
  const [selectedUSN, setSelectedUSN] = useState<string>('');
  const [selectedBacklogs, setSelectedBacklogs] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedEligibility, setSelectedEligibility] = useState<string>('all');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('/api/students/all');
        if (response.ok) {
          const data = await response.json();
          let allStudents = [...data.students5th, ...data.students7th];
          
          // Check for edited data in localStorage and merge it
          const editedData = localStorage.getItem('csd_student_data');
          if (editedData) {
            try {
              const editedStudents = JSON.parse(editedData);
              // Merge edited data with API data
              allStudents = allStudents.map(apiStudent => {
                const editedStudent = editedStudents.find((s: any) => s.usn === apiStudent.usn);
                return editedStudent || apiStudent;
              });
            } catch (e) {
              console.error('Error parsing edited data:', e);
            }
          }
          
          setStudents(allStudents.sort((a, b) => {
            // First sort by batch: 7th-sem first, then 5th-sem
            const batchOrder = { '7th-sem': 0, '5th-sem': 1 };
            const aBatchOrder = batchOrder[a.batch as keyof typeof batchOrder] ?? 2;
            const bBatchOrder = batchOrder[b.batch as keyof typeof batchOrder] ?? 2;
            
            if (aBatchOrder !== bBatchOrder) {
              return aBatchOrder - bBatchOrder;
            }
            
            // Within the same batch, sort by USN numerically
            const extractNumber = (usn: string) => {
              const match = usn.match(/(\d+)$/);
              return match ? parseInt(match[1], 10) : 0;
            };
            
            const aNum = extractNumber(a.usn);
            const bNum = extractNumber(b.usn);
            
            return aNum - bNum;
          }));
          
          // Save to localStorage for offline access
          localStorage.setItem('studentData', JSON.stringify(data));
        } else {
          console.error('Failed to fetch students');
        }
      } catch (error) {
        console.error('Error fetching students:', error);
        
        // Try to load from localStorage as fallback
        const savedData = localStorage.getItem('studentData');
        if (savedData) {
          try {
            const data = JSON.parse(savedData);
            let allStudents = [...data.students5th, ...data.students7th];
            
            // Also check for edited data
            const editedData = localStorage.getItem('csd_student_data');
            if (editedData) {
              try {
                const editedStudents = JSON.parse(editedData);
                allStudents = allStudents.map(apiStudent => {
                  const editedStudent = editedStudents.find((s: any) => s.usn === apiStudent.usn);
                  return editedStudent || apiStudent;
                });
              } catch (e) {
                console.error('Error parsing edited data:', e);
              }
            }
            
            setStudents(allStudents.sort((a, b) => {
              // First sort by batch: 7th-sem first, then 5th-sem
              const batchOrder = { '7th-sem': 0, '5th-sem': 1 };
              const aBatchOrder = batchOrder[a.batch as keyof typeof batchOrder] ?? 2;
              const bBatchOrder = batchOrder[b.batch as keyof typeof batchOrder] ?? 2;
              
              if (aBatchOrder !== bBatchOrder) {
                return aBatchOrder - bBatchOrder;
              }
              
              // Within the same batch, sort by USN numerically
              const extractNumber = (usn: string) => {
                const match = usn.match(/(\d+)$/);
                return match ? parseInt(match[1], 10) : 0;
              };
              
              const aNum = extractNumber(a.usn);
              const bNum = extractNumber(b.usn);
              
              return aNum - bNum;
            }));
          } catch (e) {
            console.error('Error parsing saved data:', e);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Refresh data when page becomes visible (useful for when user comes back to tab)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        refreshDataFromStorage();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);
  
  // Filter students based on all selected criteria
  const filteredStudents = useMemo(() => {
    const source = students;
    return source.filter(student => {
      // Batch filter
      if (selectedBatch !== 'all' && student.batch !== selectedBatch) return false;
      
      // USN filter (partial match)
      if (selectedUSN && !student.usn.toLowerCase().includes(selectedUSN.toLowerCase())) return false;
      
      // Backlogs filter
      if (selectedBacklogs !== 'all') {
        if (selectedBacklogs === '0' && student.active_backlogs !== 0) return false;
        if (selectedBacklogs === '1-2' && (student.active_backlogs < 1 || student.active_backlogs > 2)) return false;
        if (selectedBacklogs === '3+' && student.active_backlogs < 3) return false;
      }
      
      // Status filter
      if (selectedStatus !== 'all' && student.placement_status !== selectedStatus) return false;
      
      // Eligibility filter
      if (selectedEligibility !== 'all') {
        if (selectedEligibility === 'Eligible' && !student.placement_eligible) return false;
        if (selectedEligibility === 'Not Eligible' && student.placement_eligible) return false;
      }
      
      return true;
    }).sort((a, b) => {
      // First sort by batch: 7th-sem first, then 5th-sem
      const batchOrder = { '7th-sem': 0, '5th-sem': 1 };
      const aBatchOrder = batchOrder[a.batch as keyof typeof batchOrder] ?? 2;
      const bBatchOrder = batchOrder[b.batch as keyof typeof batchOrder] ?? 2;
      
      if (aBatchOrder !== bBatchOrder) {
        return aBatchOrder - bBatchOrder;
      }
      
      // Within the same batch, sort by USN numerically
      const extractNumber = (usn: string) => {
        const match = usn.match(/(\d+)$/);
        return match ? parseInt(match[1], 10) : 0;
      };
      
      const aNum = extractNumber(a.usn);
      const bNum = extractNumber(b.usn);
      
      return aNum - bNum;
    });
  }, [selectedBatch, selectedUSN, selectedBacklogs, selectedStatus, selectedEligibility, students]);
  
  // Calculate analytics based on filtered students
  const analytics = useMemo(() => calculateAnalytics(filteredStudents), [filteredStudents]);
  const chartData = useMemo(() => prepareChartData(analytics), [analytics]);

  // Get batch-specific data for charts
  const getBatchSpecificData = (batch: string) => {
    if (batch === 'all') return students;
    return students.filter(s => s.batch === batch);
  };

  // Get current batch data for charts
  const currentBatchData = useMemo(() => getBatchSpecificData(selectedBatch), [selectedBatch, students]);
  const currentBatchAnalytics = useMemo(() => calculateAnalytics(currentBatchData), [currentBatchData]);
  const currentBatchChartData = useMemo(() => prepareChartData(currentBatchAnalytics), [currentBatchAnalytics]);

  // Use current batch data for charts when a specific batch is selected
  const displayAnalytics = selectedBatch === 'all' ? analytics : currentBatchAnalytics;
  const displayChartData = selectedBatch === 'all' ? chartData : currentBatchChartData;

  const handleViewStudent = (student: Student) => {
    setSelectedStudent(student);
    setIsDrawerOpen(true);
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setIsEditDrawerOpen(true);
  };

  const handleSaveStudent = (updatedStudent: Student) => {
    if (students) {
      const updatedStudents = students.map(s => s.usn === updatedStudent.usn ? updatedStudent : s);
      setStudents(updatedStudents);
      
      // Update localStorage
      const savedData = localStorage.getItem('studentData');
      if (savedData) {
        try {
          const data = JSON.parse(savedData);
          const updatedData = {
            ...data,
            students5th: data.students5th.map((s: Student) => s.usn === updatedStudent.usn ? updatedStudent : s),
            students7th: data.students7th.map((s: Student) => s.usn === updatedStudent.usn ? updatedStudent : s)
          };
          localStorage.setItem('studentData', JSON.stringify(updatedData));
        } catch (e) {
          console.error('Error updating localStorage:', e);
        }
      }
      
      // Also update the csd_student_data for persistence
      const existingEditedData = localStorage.getItem('csd_student_data');
      let editedStudents = existingEditedData ? JSON.parse(existingEditedData) : [];
      
      const studentIndex = editedStudents.findIndex((s: any) => s.usn === updatedStudent.usn);
      if (studentIndex !== -1) {
        editedStudents[studentIndex] = updatedStudent;
      } else {
        editedStudents.push(updatedStudent);
      }
      
      localStorage.setItem('csd_student_data', JSON.stringify(editedStudents));
    }
    setIsEditDrawerOpen(false);
    setEditingStudent(null);
  };

  // Function to refresh data from localStorage (useful for page reloads)
  const refreshDataFromStorage = () => {
    const savedData = localStorage.getItem('studentData');
    const editedData = localStorage.getItem('csd_student_data');
    
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        let allStudents = [...data.students5th, ...data.students7th];
        
        // Merge with edited data
        if (editedData) {
          try {
            const editedStudents = JSON.parse(editedData);
            allStudents = allStudents.map(apiStudent => {
              const editedStudent = editedStudents.find((s: any) => s.usn === apiStudent.usn);
              return editedStudent || apiStudent;
            });
          } catch (e) {
            console.error('Error parsing edited data:', e);
          }
        }
        
        setStudents(allStudents.sort((a, b) => {
          // First sort by batch: 7th-sem first, then 5th-sem
          const batchOrder = { '7th-sem': 0, '5th-sem': 1 };
          const aBatchOrder = batchOrder[a.batch as keyof typeof batchOrder] ?? 2;
          const bBatchOrder = batchOrder[b.batch as keyof typeof batchOrder] ?? 2;
          
          if (aBatchOrder !== bBatchOrder) {
            return aBatchOrder - bBatchOrder;
          }
          
          // Within the same batch, sort by USN numerically
          const extractNumber = (usn: string) => {
            const match = usn.match(/(\d+)$/);
            return match ? parseInt(match[1], 10) : 0;
          };
          
          const aNum = extractNumber(a.usn);
          const bNum = extractNumber(b.usn);
          
          return aNum - bNum;
        }));
      } catch (e) {
        console.error('Error parsing saved data:', e);
      }
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-lg text-gray-600">Loading student data...</p>
          </div>
        </div>
      </main>
    );
  }

     return (
     <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20">
      <Navigation />

      <section className="pt-16 sm:pt-20 pb-6 sm:pb-8 lg:pb-12 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-10 dark:opacity-20" />
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-3 sm:mb-4 lg:mb-6">
              <Filter className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
              <span className="text-xs sm:text-sm font-medium">Analytics Dashboard</span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-6xl font-bold mb-2 sm:mb-3 lg:mb-4 leading-tight">Student Analytics</h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-blue-100 max-w-3xl mx-auto px-1 sm:px-2 lg:px-0 leading-relaxed">Comprehensive insights into student performance and placement readiness</p>
          </div>
        </div>
      </section>

             <section className="py-8 sm:py-12">
         <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Controls Section */}
                     <div className="py-4 sm:py-6 lg:py-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl mb-6 sm:mb-8 shadow-lg">
             <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 sm:gap-6">
                <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-3 sm:gap-4 w-full lg:w-auto">
                  <div className="flex items-center space-x-2 mb-2 sm:mb-0">
                    <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400" />
                    <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Filters:</span>
                  </div>
                  
                  {/* Batch Filter */}
                  <select
                    value={selectedBatch}
                    onChange={(e) => setSelectedBatch(e.target.value)}
                    className="px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 w-full sm:w-auto"
                    aria-label="Filter by batch"
                    title="Filter by batch"
                  >
                    <option value="all">All Batches</option>
                    <option value="5th-sem">5th Semester</option>
                    <option value="7th-sem">7th Semester</option>
                  </select>
                  
                  {/* USN Filter */}
                  <input
                    type="text"
                    placeholder="Search by USN..."
                    value={selectedUSN}
                    onChange={(e) => setSelectedUSN(e.target.value)}
                    className="px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm w-full sm:w-40 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                    aria-label="Search students by USN"
                    title="Search students by USN"
                  />
                  
                  {/* Backlogs Filter */}
                  <select
                    value={selectedBacklogs}
                    onChange={(e) => setSelectedBacklogs(e.target.value)}
                    className="px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 w-full sm:w-auto"
                    aria-label="Filter by number of backlogs"
                    title="Filter by number of backlogs"
                  >
                    <option value="all">All Backlogs</option>
                    <option value="0">No Backlogs</option>
                    <option value="1-2">1-2 Backlogs</option>
                    <option value="3+">3+ Backlogs</option>
                  </select>
                  
                                     {/* Status Filter */}
                   <select
                     value={selectedStatus}
                     onChange={(e) => setSelectedStatus(e.target.value)}
                     className="px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 w-full sm:w-auto"
                     aria-label="Filter by placement status"
                     title="Filter by placement status"
                   >
                     <option value="all">All Status</option>
                     <option value="Placed">Placed</option>
                     <option value="Not Placed">Not Placed</option>
                     <option value="Under Process">Under Process</option>
                   </select>
                   
                                       {/* Eligibility Filter */}
                    <select
                      value={selectedEligibility}
                      onChange={(e) => setSelectedEligibility(e.target.value)}
                      className="px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 w-full sm:w-auto"
                      aria-label="Filter by eligibility"
                      title="Filter by eligibility"
                    >
                      <option value="all">All Students</option>
                      <option value="Eligible">Eligible</option>
                      <option value="Not Eligible">Not Eligible</option>
                    </select>
                   
                   {/* Clear Filters Button */}
                   {(selectedBatch !== 'all' || selectedUSN || selectedBacklogs !== 'all' || selectedStatus !== 'all' || selectedEligibility !== 'all') && (
                     <button
                       onClick={() => {
                         setSelectedBatch('all');
                         setSelectedUSN('');
                         setSelectedBacklogs('all');
                         setSelectedStatus('all');
                         setSelectedEligibility('all');
                       }}
                       className="px-3 sm:px-4 py-2 text-xs sm:text-sm text-red-600 dark:text-red-400 border border-red-300 dark:border-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full sm:w-auto"
                       aria-label="Clear all filters"
                       title="Clear all filters"
                     >
                       Clear Filters
                     </button>
                   )}
                </div>
                
                                                   <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto">
                    <Link href="/analytics/top-performers">
                      <button className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-xs sm:text-sm w-full sm:w-auto justify-center">
                        <Award className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>🏆 Top Performers</span>
                      </button>
                    </Link>
                  </div>
              </div>
              
                             {/* Filter Summary */}
               {(selectedBatch !== 'all' || selectedUSN || selectedBacklogs !== 'all' || selectedStatus !== 'all' || selectedEligibility !== 'all') && (
                 <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
                   <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                     <div className="flex items-center space-x-2 text-blue-700 dark:text-blue-300">
                       <Filter className="w-3 h-3 sm:w-4 sm:h-4" />
                       <span className="text-xs sm:text-sm font-medium">
                         Showing {filteredStudents.length} of {students.length} students
                       </span>
                     </div>
                     <div className="text-xs text-blue-600 dark:text-blue-400 flex flex-wrap gap-1 sm:gap-2">
                       {selectedBatch !== 'all' && <span className="mr-1 sm:mr-2">Batch: {selectedBatch.replace('-sem', ' Semester')}</span>}
                       {selectedUSN && <span className="mr-1 sm:mr-2">USN: {selectedUSN}</span>}
                       {selectedBacklogs !== 'all' && <span className="mr-1 sm:mr-2">Backlogs: {selectedBacklogs}</span>}
                       {selectedStatus !== 'all' && <span className="mr-1 sm:mr-2">Status: {selectedStatus}</span>}
                       {selectedEligibility !== 'all' && <span className="mr-1 sm:mr-2">Eligibility: {selectedEligibility}</span>}
                     </div>
                   </div>
                 </div>
               )}
            </div>
          </div>

          {/* Key Metrics */}
          <section className="py-6 sm:py-8">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">
                  Key Performance Metrics
                </h2>
                <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 px-2 sm:px-0">
                  Overview of student performance indicators
                </p>
              </div>
              
                                                           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-[1400px] mx-auto">
                  <StudentStatsCard
                    title="Total Students"
                    value={displayAnalytics.totalStudents}
                    icon={Users}
                    color="text-blue-600 dark:text-blue-400"
                    bgColor="bg-blue-100 dark:bg-blue-900/30"
                    description={selectedBatch === 'all' ? "Across all batches" : `${selectedBatch.replace('-sem', ' Semester')} Students`}
                    delay={0.1}
                  />
                  <StudentStatsCard
                    title="Placement Eligible"
                    value={displayAnalytics.placementEligibleCount}
                    icon={CheckCircle}
                    color="text-purple-600 dark:text-purple-400"
                    bgColor="bg-purple-100 dark:bg-purple-900/30"
                    description={`${((displayAnalytics.placementEligibleCount / displayAnalytics.totalStudents) * 100).toFixed(1)}% of total`}
                    delay={0.3}
                  />
                  <StudentStatsCard
                    title="Active Backlogs"
                    value={displayAnalytics.backlogStudentsCount}
                    icon={AlertTriangle}
                    color="text-orange-600 dark:text-orange-400"
                    bgColor="bg-orange-100 dark:bg-orange-900/30"
                    description="Students with backlogs"
                    delay={0.4}
                  />
                  <StudentStatsCard
                    title="Placed Students"
                    value={displayAnalytics.placedStudentsCount}
                    icon={Award}
                    color="text-emerald-600 dark:text-emerald-400"
                    bgColor="bg-emerald-100 dark:bg-emerald-900/30"
                    description={`${((displayAnalytics.placedStudentsCount / displayAnalytics.totalStudents) * 100).toFixed(1)}% of total`}
                    delay={0.5}
                  />
                </div>
            </div>
          </section>

          {/* Batch Comparison Chart */}
          {selectedBatch === 'all' && (
            <section className="py-6 sm:py-8">
              <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-6 sm:mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">
                    5th vs 7th Semester Performance Comparison
                  </h2>
                  <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 px-2 sm:px-0">
                    Track academic progress across semesters for both batches
                  </p>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3 sm:p-4 lg:p-6 border border-gray-200 dark:border-gray-700">
                  <div className="h-48 sm:h-64 md:h-72 lg:h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsLineChart data={[
                        { semester: '1st Sem', '5th-sem': 75.2, '7th-sem': 72.8 },
                        { semester: '2nd Sem', '5th-sem': 78.5, '7th-sem': 76.3 },
                        { semester: '3rd Sem', '5th-sem': 81.1, '7th-sem': 79.7 },
                        { semester: '4th Sem', '5th-sem': 79.8, '7th-sem': 78.9 },
                        { semester: '5th Sem', '5th-sem': null, '7th-sem': 80.1 },
                        { semester: '6th Sem', '5th-sem': null, '7th-sem': 81.5 }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis 
                          dataKey="semester" 
                          tick={{ fontSize: 10, fill: '#6B7280' }}
                          interval={0}
                          angle={-45}
                          textAnchor="end"
                          height={60}
                        />
                        <YAxis 
                          tick={{ fontSize: 10, fill: '#6B7280' }}
                          label={{ value: 'Avg %', angle: -90, position: 'insideLeft', fill: '#6B7280', style: { textAnchor: 'middle', fontSize: 10 } }}
                          width={60}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1F2937', 
                            border: '1px solid #374151',
                            borderRadius: '8px',
                            color: '#F9FAFB',
                            fontSize: '12px'
                          }}
                          labelStyle={{ fontSize: '12px' }}
                        />
                        <Legend 
                          wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                        />
                        <RechartsLine 
                          type="monotone" 
                          dataKey="5th-sem" 
                          stroke="#3B82F6" 
                          strokeWidth={2}
                          name="5th Semester"
                          dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                        <RechartsLine 
                          type="monotone" 
                          dataKey="7th-sem" 
                          stroke="#10B981" 
                          strokeWidth={2}
                          name="7th Semester"
                          dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </RechartsLineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-2 sm:mt-3 lg:mt-4 text-center text-xs sm:text-sm text-gray-600 dark:text-gray-400 px-1 sm:px-2 lg:px-0">
                    <p>Note: 5th semester students only have 4 semesters of data (1st-4th), while 7th semester students have 6 semesters (1st-6th)</p>
                  </div>
                </div>
              </div>
            </section>
          )}



          {/* Semester Performance Charts */}
          {(selectedBatch === '5th-sem' || selectedBatch === '7th-sem') && (
            <section className="py-6 sm:py-8">
              <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-6 sm:mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">
                    {selectedBatch.replace('-sem', ' Semester')} Performance Trends
                  </h2>
                  <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 px-2 sm:px-0">
                    Track academic progress for {selectedBatch.replace('-sem', ' semester')} students
                  </p>
                </div>
                
                <div className="grid grid-cols-1 gap-6 sm:gap-8">
                  {/* Show 7th Semester Chart only when 7th Sem is selected */}
                  {selectedBatch === '7th-sem' && (
                    <PerformanceChart
                      title="7th Semester Performance"
                      data={displayChartData.semesterData}
                      type="line"
                      dataKey="average"
                      nameKey="semester"
                      delay={0.7}
                    />
                  )}
                  
                  {/* Show 5th Semester Chart only when 5th Sem is selected */}
                  {selectedBatch === '5th-sem' && (
                    <PerformanceChart
                      title="5th Semester Performance"
                      data={displayChartData.semesterData}
                      type="line"
                      dataKey="average"
                      nameKey="semester"
                      delay={0.6}
                    />
                  )}
                </div>
              </div>
            </section>
          )}

          {/* Student Performance Overview */}
          <section className="py-6 sm:py-8">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-6 sm:mb-8">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Student Performance Overview</h2>
                  <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">Detailed view of all students with filtering options</p>
                </div>
              </div>

              {/* Placement Eligibility Summary */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8 border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6">
                  {selectedBatch === 'all' ? "Placement Eligibility Summary" : `${selectedBatch.replace('-sem', ' Semester')} Placement Eligibility Summary`}
                </h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-4 sm:mb-6">
                  {/* Total Students */}
                  <div className="text-center p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                    <div className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1 sm:mb-2">{filteredStudents.length}</div>
                    <div className="text-sm sm:text-lg text-blue-700 dark:text-blue-300 font-medium">Total Students</div>
                    <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {selectedBatch === 'all' ? "In Current Filter" : `${selectedBatch.replace('-sem', ' Semester')} Students`}
                    </div>
                  </div>
                  
                  {/* Eligible Students */}
                  <div className="text-center p-3 sm:p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                    <div className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400 mb-1 sm:mb-2">
                      {filteredStudents.filter(s => s.placement_eligible).length}
                    </div>
                    <div className="text-sm sm:text-lg text-green-700 dark:text-green-300 font-medium">Placement Eligible</div>
                    <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">Ready for Jobs</div>
                  </div>
                  
                  {/* Not Eligible */}
                  <div className="text-center p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-700">
                    <div className="text-2xl sm:text-3xl font-bold text-red-600 dark:text-red-400 mb-1 sm:mb-2">
                      {filteredStudents.filter(s => !s.placement_eligible).length}
                    </div>
                    <div className="text-sm sm:text-lg text-red-700 dark:text-red-300 font-medium">Not Eligible</div>
                    <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">Need Improvement</div>
                  </div>

                  {/* Eligibility Rate */}
                  <div className="text-center p-3 sm:p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
                    <div className="text-2xl sm:text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1 sm:mb-2">
                      {filteredStudents.length > 0 
                        ? Math.round((filteredStudents.filter(s => s.placement_eligible).length / filteredStudents.length) * 100)
                        : 0}%
                    </div>
                    <div className="text-sm sm:text-lg text-purple-700 dark:text-purple-300 font-medium">Eligibility Rate</div>
                    <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">Success Percentage</div>
                  </div>
                </div>
                
                {/* Eligibility Criteria */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 sm:p-4 border border-gray-200 dark:border-gray-600">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 sm:mb-3 text-sm sm:text-base">Eligibility Criteria:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                    <div>
                      <span className="font-medium text-green-700 dark:text-green-400">✅ Placement Eligible:</span> Aggregate ≥ 50% and No Active Backlogs
                    </div>
                    <div>
                      <span className="font-medium text-red-700 dark:text-red-400">❌ Not Eligible:</span> Aggregate &lt; 50% or Has Active Backlogs
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          


          
          {/* Single Student Data Table */}
          <div className="w-full">
            <StudentTable
              students={filteredStudents}
              title="Student Performance Overview"
              delay={0.8}
              showDetails={false}
              onView={(student) => { setSelectedStudent(student); setIsDrawerOpen(true); }}
              onEdit={(student) => { setEditingStudent(student); setIsEditDrawerOpen(true); }}
            />
          </div>
        </div>
      </section>

      {/* Student Detail Drawer */}
      <StudentDrawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        student={selectedStudent}
      />

      {/* Student Edit Drawer */}
      <StudentEditDrawer
        open={isEditDrawerOpen}
        onClose={() => setIsEditDrawerOpen(false)}
        student={editingStudent}
        onSave={handleSaveStudent}
      />
    </main>
  );
};

export default AnalyticsPage;
