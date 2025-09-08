'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import Link from 'next/link';
import Button from '../../../components/ui/Button';
import NewNavigation from '../../../components/layout/NewNavigation';

interface Student {
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
  placement_eligible: boolean;
  active_backlogs: number;
  placement_status: string;
}

type FilterType = 'overall' | '7th-sem' | '5th-sem';

export default function TopPerformersPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('overall');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        // Try to load from localStorage first
        const storedData = localStorage.getItem('studentData');
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          console.log('Loaded from localStorage:', parsedData);
          // Handle both old and new data structures
          if (Array.isArray(parsedData)) {
            setStudents(parsedData);
          } else if (parsedData.students5th && parsedData.students7th) {
            const combined = [...parsedData.students5th, ...parsedData.students7th];
            console.log('Combined students:', combined);
            setStudents(combined);
          }
          setLoading(false);
          return;
        }

        // Fallback to API
        console.log('Fetching from API...');
        const response = await fetch('/api/students/all');
        if (response.ok) {
          const data = await response.json();
          console.log('API response:', data);
          // Combine students from both batches
          const combinedStudents = [...(data.students5th || []), ...(data.students7th || [])];
          console.log('Combined students from API:', combinedStudents);
          setStudents(combinedStudents);
          localStorage.setItem('studentData', JSON.stringify(data));
        }
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const getFilteredTopPerformers = (filterType: FilterType) => {
    if (!students.length) return [];

    let filteredStudents = [...students];

    switch (filterType) {
      case '7th-sem':
        // 7th semester students (have sem5 and sem6)
        filteredStudents = students.filter(student => 
          student.batch === '7th-sem' && student.sem5_percentage !== undefined && student.sem6_percentage !== undefined
        );
        break;
      case '5th-sem':
        // 5th semester students (only have sem1-sem4)
        filteredStudents = students.filter(student => 
          student.batch === '5th-sem' && student.sem5_percentage === undefined && student.sem6_percentage === undefined
        );
        break;
      case 'overall':
      default:
        // All students
        break;
    }

    // Sort by aggregate percentage and return top 10
    return filteredStudents
      .sort((a, b) => b.aggregate_percentage - a.aggregate_percentage)
      .slice(0, 10);
  };

  const getCurrentTopPerformers = () => getFilteredTopPerformers(selectedFilter);

  // Debug logging
  console.log('Current students state:', students);
  console.log('Selected filter:', selectedFilter);
  console.log('Current top performers:', getCurrentTopPerformers());

  const getRankIcon = (index: number) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return String(index + 1);
  };

  const getFilterTitle = (filterType: FilterType) => {
    switch (filterType) {
      case 'overall':
        return 'Overall Top Performers (All Semesters)';
      case '7th-sem':
        return '7th Semester Top Performers (1st to 6th Semester)';
      case '5th-sem':
        return '5th Semester Top Performers (1st to 4th Semester)';
      default:
        return 'Top Performers';
    }
  };

  const getFilterDescription = (filterType: FilterType) => {
    switch (filterType) {
      case 'overall':
        return 'Top 10 students across all semesters based on aggregate performance';
      case '7th-sem':
        return 'Top 10 students from 7th semester based on 1st to 6th semester performance';
      case '5th-sem':
        return 'Top 10 students from 5th semester based on 1st to 4th semester performance';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading top performers...</p>
        </div>
      </div>
    );
  }

  const currentTopPerformers = getCurrentTopPerformers();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20">
      <NewNavigation />
      
      {/* Header Section */}
      <header className="pt-16 sm:pt-20 pb-8 sm:pb-12 bg-white dark:bg-gray-800 text-gray-900 dark:text-white relative overflow-hidden border-b border-gray-200 dark:border-gray-700">
        <div className="absolute inset-0 bg-pattern opacity-10 dark:opacity-20" />
        
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
              🏆 Top Performers
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-2 sm:px-0">
              Celebrating academic excellence and outstanding performance across all semesters
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-8 sm:py-12">
        {/* Back Button */}
        <div className="mb-6 sm:mb-8">
          <Link href="/analytics">
            <Button variant="outline" className="flex items-center space-x-2 text-sm sm:text-base px-3 sm:px-4 py-2 sm:py-3">
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Analytics</span>
            </Button>
          </Link>
        </div>

        {/* Filter Controls */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              onClick={() => setSelectedFilter('overall')}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base ${
                selectedFilter === 'overall'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              Overall Aggregate
            </button>
            <button
              onClick={() => setSelectedFilter('7th-sem')}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base ${
                selectedFilter === '7th-sem'
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <span className="hidden sm:inline">7th Sem (1st to 6th semester)</span>
              <span className="sm:hidden">7th Sem</span>
            </button>
            <button
              onClick={() => setSelectedFilter('5th-sem')}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base ${
                selectedFilter === '5th-sem'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <span className="hidden sm:inline">5th Sem (1st to 4th semester)</span>
              <span className="sm:hidden">5th Sem</span>
            </button>
          </div>
        </div>

        {/* Filter Info */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2 px-2 sm:px-0">
            {getFilterTitle(selectedFilter)}
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 px-2 sm:px-0">
            {getFilterDescription(selectedFilter)}
          </p>
        </div>

        {/* Performance Overview Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3 sm:p-4 lg:p-6 mb-6 sm:mb-8 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Performance Overview</h3>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4">Bar chart showing top 5 performers and pie chart showing performance distribution</p>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Top 3 Performance Chart */}
            <div className="lg:col-span-2">
              <div className="h-64 sm:h-80 lg:h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={currentTopPerformers.slice(0, 5)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45} 
                      textAnchor="end" 
                      height={100}
                      tick={{ fontSize: 10 }}
                    />
                    <YAxis 
                      tick={{ fontSize: 10 }}
                    />
                    <Tooltip 
                      formatter={(value) => [`${value}%`, 'Aggregate']}
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        color: '#1F2937',
                        fontSize: '14px',
                        fontWeight: '600',
                        padding: '10px 14px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                        backdropFilter: 'blur(8px)'
                      }}
                      labelStyle={{
                        color: '#1F2937',
                        fontSize: '14px',
                        fontWeight: '600'
                      }}
                    />
                    <Bar dataKey="aggregate_percentage" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Performance Distribution */}
            <div>
              <div className="h-64 sm:h-80 lg:h-96 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Top 3', value: currentTopPerformers.slice(0, 3).length, color: '#F59E0B' },
                        { name: 'Top 4-7', value: currentTopPerformers.slice(3, 7).length, color: '#3B82F6' },
                        { name: 'Top 8-10', value: currentTopPerformers.slice(7, 10).length, color: '#10B981' }
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {[
                        { name: 'Top 3', value: currentTopPerformers.slice(0, 3).length, color: '#F59E0B' },
                        { name: 'Top 4-7', value: currentTopPerformers.slice(3, 7).length, color: '#3B82F6' },
                        { name: 'Top 8-10', value: currentTopPerformers.slice(7, 10).length, color: '#10B981' }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        color: '#1F2937',
                        fontSize: '14px',
                        fontWeight: '600',
                        padding: '10px 14px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                        backdropFilter: 'blur(8px)'
                      }}
                      labelStyle={{
                        color: '#1F2937',
                        fontSize: '14px',
                        fontWeight: '600'
                      }}
                      formatter={(value, name) => [`${value}`, name]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Top Performers List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3 sm:p-4 lg:p-6">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6">Top 10 Performers</h3>
          
          {currentTopPerformers.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-500 dark:text-gray-400 text-lg mb-4">No students found</div>
              <div className="text-sm text-gray-400 dark:text-gray-500">
                Total students loaded: {students.length}<br/>
                Selected filter: {selectedFilter}<br/>
                Debug: Check console for more details
              </div>
            </div>
          ) : (
            <div className="grid gap-3 sm:gap-4">
              {currentTopPerformers.map((student, index) => (
                <motion.div
                  key={student.usn}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 rounded-xl border-2 transition-all hover:shadow-md relative ${
                    index === 0 ? 'border-yellow-400 bg-yellow-100 dark:bg-yellow-900/20 shadow-lg' :
                    index === 1 ? 'border-yellow-400 bg-yellow-100 dark:bg-yellow-900/20 shadow-lg' :
                    index === 2 ? 'border-yellow-400 bg-yellow-100 dark:bg-yellow-900/20 shadow-lg' :
                    'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-600'
                  }`}
                >
                  {/* Top 3 Badge */}
                  {index < 3 && (
                    <div className={`absolute -top-1 -left-1 sm:-top-2 sm:-left-2 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-lg ${
                      index === 0 ? 'bg-yellow-500' :
                      index === 1 ? 'bg-yellow-500' :
                      'bg-yellow-500'
                    }`}>
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto">
                    <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full text-white font-bold text-sm sm:text-base ${
                      index === 0 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                      index === 1 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                      index === 2 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                      'bg-gradient-to-r from-blue-500 to-purple-600'
                    }`}>
                      {getRankIcon(index)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base truncate">{student.name}</h4>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                        {student.usn} • 
                        <span className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${
                          student.batch === '5th-sem' 
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' 
                            : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                        }`}>
                          {student.batch.replace('-sem', ' Sem')}
                        </span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between sm:justify-end space-x-3 sm:space-x-4 w-full sm:w-auto mt-3 sm:mt-0">
                    <div className="text-left sm:text-right">
                      <div className={`text-lg sm:text-xl lg:text-2xl font-bold ${
                        index === 0 ? 'text-yellow-700 dark:text-yellow-400' :
                        index === 1 ? 'text-yellow-700 dark:text-yellow-400' :
                        index === 2 ? 'text-yellow-700 dark:text-yellow-400' :
                        'text-gray-900 dark:text-gray-100'
                      }`}>
                        {student.aggregate_percentage.toFixed(1)}%
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Aggregate</div>
                    </div>
                    <div className="flex flex-col sm:flex-col items-end space-y-1 sm:space-y-2">
                      <div className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                        student.placement_eligible ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                      }`}>
                        {student.placement_eligible ? 'Eligible' : 'Not Eligible'}
                      </div>
                      {student.active_backlogs > 0 && (
                        <div className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 rounded-full text-xs font-medium">
                          {student.active_backlogs} Backlog{student.active_backlogs > 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Semester-wise Breakdown */}
        {selectedFilter === 'overall' && (
          <div className="mt-6 sm:mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {/* 7th Semester Leaders */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3 sm:p-4 lg:p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4 flex items-center gap-2">
                🎓 <span className="hidden sm:inline">7th Semester Leaders (1st-6th Sem)</span>
                <span className="sm:hidden">7th Sem Leaders</span>
              </h3>
              <div className="space-y-2 sm:space-y-3">
                {getFilteredTopPerformers('7th-sem').slice(0, 5).map((student, index) => (
                  <div key={student.usn} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900 dark:text-gray-100 text-sm sm:text-base truncate">{student.name}</p>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">{student.usn}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      <p className="font-bold text-green-600 dark:text-green-400 text-sm sm:text-base">{student.aggregate_percentage.toFixed(1)}%</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Aggregate</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 5th Semester Leaders */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3 sm:p-4 lg:p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4 flex items-center gap-2">
                📚 <span className="hidden sm:inline">5th Semester Leaders (1st-4th Sem)</span>
                <span className="sm:hidden">5th Sem Leaders</span>
              </h3>
              <div className="space-y-2 sm:space-y-3">
                {getFilteredTopPerformers('5th-sem').slice(0, 5).map((student, index) => (
                  <div key={student.usn} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900 dark:text-gray-100 text-sm sm:text-base truncate">{student.name}</p>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">{student.usn}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      <p className="font-bold text-blue-600 dark:text-blue-400 text-sm sm:text-base">{student.aggregate_percentage.toFixed(1)}%</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Aggregate</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
