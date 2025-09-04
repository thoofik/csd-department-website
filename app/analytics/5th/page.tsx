'use client';

import React, { useMemo, useEffect, useState } from 'react';
import Navigation from '../../../components/layout/Navigation';
import { Filter, TrendingUp, Users, Target, Download, CheckCircle } from 'lucide-react';
import StudentStatsCard from '../../../components/analytics/StudentStatsCard';
import PerformanceChart from '../../../components/analytics/PerformanceChart';
import StudentTable from '../../../components/analytics/StudentTable';
import StudentDrawer from '../../../components/analytics/StudentDrawer';
import StudentEditDrawer from '../../../components/analytics/StudentEditDrawer';
import { Student } from '../../../types';
import { calculateAnalytics, prepareChartData } from '../../../lib/analytics';
import Link from 'next/link';
import Button from '../../../components/ui/Button';

const FifthSemAnalyticsPage: React.FC = () => {
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
          const fifthSemStudents = localStudents.filter((s: Student) => s.batch === '5th-sem');
          if (fifthSemStudents.length > 0) {
            setApiStudents(fifthSemStudents);
            return; // Use local data if available
          }
        }
        
        // Fallback to API
        const res = await fetch('/api/students/all');
        if (!res.ok) return;
        const json = await res.json();
        if (cancelled) return;
        setApiStudents(json.students5th || null);
        // Save to localStorage for future use
        localStorage.setItem('csd_student_data', JSON.stringify([...(json.students5th || []), ...(json.students7th || [])]));
      } catch {}
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const students = useMemo<Student[]>(() => {
    const source = apiStudents?.filter(s => s.batch === '5th-sem') || [];
    
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
    });
  }, [apiStudents, selectedUSN, selectedBacklogs, selectedStatus]);
  const analytics = useMemo(() => calculateAnalytics(students), [students]);
  const chartData = useMemo(() => prepareChartData(analytics), [analytics]);

  const { totalStudents, averageAggregate, placementEligibleCount, placedStudentsCount } = analytics;
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
              <span className="text-sm font-medium">5th Semester</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Student Analytics</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">Insights for 5th semester students</p>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <StudentStatsCard title="Total Students" value={totalStudents} icon={Filter as any} color="text-blue-600" bgColor="bg-blue-100" />
            <StudentStatsCard title="Average Aggregate" value={`${averageAggregate.toFixed(1)}%`} icon={Filter as any} color="text-green-600" bgColor="bg-green-100" />
            <StudentStatsCard
              title="Placement Eligible"
              value={placementEligibleCount}
              icon={CheckCircle}
              color="text-purple-600 dark:text-purple-400"
              bgColor="bg-purple-100 dark:bg-purple-900/30"
              description="Ready for Placement"
              delay={0.3}
            />
            <StudentStatsCard
              title="No Backlogs"
              value={students.filter(s => s.active_backlogs === 0).length}
              icon={Target}
              color="text-orange-600 dark:text-orange-400"
              bgColor="bg-orange-100 dark:bg-orange-900/30"
              description="Clean Academic Record"
              delay={0.4}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <PerformanceChart data={batchData} type="pie" title="Batch Distribution" dataKey="count" nameKey="batch" />
            <PerformanceChart data={gradeData} type="bar" title="Grade Distribution" dataKey="count" nameKey="grade" />
          </div>

          <PerformanceChart data={semesterData} type="line" title="Semester Performance Trends" dataKey="average" nameKey="semester" height={400} />

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
                        Showing {students.length} of {apiStudents?.filter(s => s.batch === '5th-sem').length || 0} students
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
              batch: '5th-sem',
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

export default FifthSemAnalyticsPage;


