'use client';

import React, { useMemo, useEffect, useState } from 'react';
import Navigation from '../../../components/layout/Navigation';
import { Filter, TrendingUp, Users, Target, Download } from 'lucide-react';
import StudentStatsCard from '../../../components/analytics/StudentStatsCard';
import PerformanceChart from '../../../components/analytics/PerformanceChart';
import StudentTable from '../../../components/analytics/StudentTable';
import StudentDrawer from '../../../components/analytics/StudentDrawer';
import StudentEditDrawer from '../../../components/analytics/StudentEditDrawer';
import { Student } from '../../../types';
import { calculateAnalytics, prepareChartData } from '../../../lib/analytics';
import Link from 'next/link';
import Button from '../../../components/ui/Button';
import { LineChart as RechartsLineChart, Line as RechartsLine, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SeventhSemAnalyticsPage: React.FC = () => {
  const [apiStudents, setApiStudents] = useState<Student[] | null>(null);
  const [selectedUSN, setSelectedUSN] = useState<string>('');
  const [selectedBacklogs, setSelectedBacklogs] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        // First try to load from localStorage
        const localData = localStorage.getItem('csd_student_data');
        if (localData) {
          const localStudents = JSON.parse(localData);
          const seventhSemStudents = localStudents.filter((s: Student) => s.batch === '7th-sem');
          if (seventhSemStudents.length > 0) {
            setApiStudents(seventhSemStudents);
            return; // Use local data if available
          }
        }
        
        // Fallback to API
        const res = await fetch('/api/students/all');
        if (!res.ok) return;
        const json = await res.json();
        if (cancelled) return;
        setApiStudents(json.students7th || null);
        // Save to localStorage for future use
        localStorage.setItem('csd_student_data', JSON.stringify([...(json.students5th || []), ...(json.students7th || [])]));
      } catch {}
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const students = useMemo<Student[]>(() => {
    const source = apiStudents?.filter(s => s.batch === '7th-sem') || [];
    
    return source.filter(student => {
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
      
      return true;
    }).sort((a, b) => {
      // Simple USN sorting - CGO students first, then CG students
      const aIsCGO = a.usn.includes('CGO');
      const bIsCGO = b.usn.includes('CGO');
      
      if (aIsCGO && !bIsCGO) return -1;
      if (!aIsCGO && bIsCGO) return 1;
      
      // If both are same type, sort by USN normally
      return a.usn.localeCompare(b.usn);
    });
  }, [apiStudents, selectedUSN, selectedBacklogs, selectedStatus]);
  
  // Get all students for comparison chart
  const allStudents = useMemo<Student[]>(() => {
    return apiStudents || [];
  }, [apiStudents]);
  
  const analytics = useMemo(() => calculateAnalytics(students), [students]);
  const chartData = useMemo(() => prepareChartData(analytics), [analytics]);

  const { totalStudents, averageAggregate, placementEligibleCount } = analytics;
  const { batchData, gradeData, semesterData } = chartData;

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20">
      <Navigation />

      <section className="pt-20 pb-12 bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900/20 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-10 dark:opacity-20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Filter className="w-5 h-5" />
              <span className="text-sm font-medium">7th Semester</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Student Analytics</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">Insights for 7th semester students</p>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-12">
            <StudentStatsCard
              title="Total Students"
              value={students.length}
              icon={Users}
              color="text-blue-600 dark:text-blue-400"
              bgColor="bg-blue-100 dark:bg-blue-900/30"
              description="7th Semester Students"
              delay={0.1}
            />
            <StudentStatsCard
              title="Average Aggregate"
              value={`${averageAggregate.toFixed(1)}%`}
              icon={Filter as any}
              color="text-green-600"
              bgColor="bg-green-100"
            />
            <StudentStatsCard
              title="Average CGPA"
              value={`${Math.min(averageAggregate / 10, 10.0).toFixed(2)}`}
              icon={TrendingUp}
              color="text-indigo-600"
              bgColor="bg-indigo-100"
            />
            <StudentStatsCard
              title="Placement Eligible"
              value={placementEligibleCount}
              icon={Filter as any}
              color="text-purple-600"
              bgColor="bg-purple-100"
            />
            <StudentStatsCard
              title="Placed"
              value={analytics.placedStudentsCount}
              icon={Filter as any}
              color="text-yellow-600"
              bgColor="bg-yellow-100"
            />
            <StudentStatsCard
              title="No Backlogs"
              value={students.filter((s: Student) => s.active_backlogs === 0).length}
              icon={Target}
              color="text-orange-600 dark:text-orange-400"
              bgColor="bg-orange-100 dark:bg-orange-900/30"
              description="Clean Academic Record"
              delay={0.4}
            />
          </div>

          {/* 5th vs 7th Semester Performance Comparison Chart */}
          <div className="mb-12">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3 sm:p-4 lg:p-6 border border-gray-200 dark:border-gray-700">
              <div className="text-center mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">
                  5th vs 7th Semester Performance Comparison
                </h2>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 px-2 sm:px-0">
                  Track academic progress across semesters for both batches
                </p>
              </div>
              
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

          {/* Controls Section */}
          <div className="py-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl mb-8 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <Filter className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filters:</span>
                  </div>
                  
                  {/* USN Filter */}
                  <input
                    type="text"
                    placeholder="Search by USN..."
                    value={selectedUSN}
                    onChange={(e) => setSelectedUSN(e.target.value)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-40 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                    aria-label="Search students by USN"
                    title="Search students by USN"
                  />
                  
                  {/* Backlogs Filter */}
                  <select
                    value={selectedBacklogs}
                    onChange={(e) => setSelectedBacklogs(e.target.value)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
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
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    aria-label="Filter by placement status"
                    title="Filter by placement status"
                  >
                    <option value="all">All Status</option>
                    <option value="Placed">Placed</option>
                    <option value="Not Placed">Not Placed</option>
                    <option value="Under Process">Under Process</option>
                  </select>
                  
                  {/* Clear Filters Button */}
                  {(selectedUSN || selectedBacklogs !== 'all' || selectedStatus !== 'all') && (
                    <button
                      onClick={() => {
                        setSelectedUSN('');
                        setSelectedBacklogs('all');
                        setSelectedStatus('all');
                      }}
                      className="px-4 py-2 text-sm text-red-600 dark:text-red-400 border border-red-300 dark:border-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      aria-label="Clear all filters"
                      title="Clear all filters"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
                
                <div className="flex items-center space-x-4">
                  
                  <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                    <Download className="w-4 h-4" />
                    <span>Export Data</span>
                  </button>
                </div>
              </div>
              
              {/* Filter Summary */}
              {(selectedUSN || selectedBacklogs !== 'all' || selectedStatus !== 'all') && (
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-blue-700 dark:text-blue-300">
                      <Filter className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        Showing {students.length} of {apiStudents?.filter(s => s.batch === '7th-sem').length || 0} students
                      </span>
                    </div>
                    <div className="text-xs text-blue-600 dark:text-blue-400">
                      {selectedUSN && <span className="mr-2">USN: {selectedUSN}</span>}
                      {selectedBacklogs !== 'all' && <span className="mr-2">Backlogs: {selectedBacklogs}</span>}
                      {selectedStatus !== 'all' && <span className="mr-2">Status: {selectedStatus}</span>}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <StudentTable
            students={students}
            title="Student Performance Overview"
            showDetails={false}
            onView={(student) => { setSelectedStudent(student); setIsDrawerOpen(true); }}
            onEdit={(student) => { setEditingStudent(student); setIsEditDrawerOpen(true); }}
            filters={{
              batch: '7th-sem',
              usn: selectedUSN,
              backlogs: selectedBacklogs,
              status: selectedStatus
            }}
          />
        </div>
      </section>
      <StudentDrawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} student={selectedStudent} />
      <StudentEditDrawer open={isEditDrawerOpen} onClose={() => setIsEditDrawerOpen(false)} student={editingStudent} onSave={(updated) => {
        // Update local state optimistically
        if (apiStudents) {
          const updatedStudents = apiStudents.map(s => s.usn === updated.usn ? updated : s);
          setApiStudents(updatedStudents);
          
          // Update localStorage
          const allLocalData = localStorage.getItem('csd_student_data');
          if (allLocalData) {
            const allStudents = JSON.parse(allLocalData);
            const updatedAllStudents = allStudents.map((s: Student) => s.usn === updated.usn ? updated : s);
            localStorage.setItem('csd_student_data', JSON.stringify(updatedAllStudents));
          }
        }
      }} />
    </main>
  );
};

export default SeventhSemAnalyticsPage;


