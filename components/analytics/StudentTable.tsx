'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Target, Search, SortAsc, SortDesc, Eye, Pencil } from 'lucide-react';
import Link from 'next/link';
import { Student } from '../../types';

interface StudentTableProps {
  students: Student[];
  title: string;
  delay?: number;
  onView?: (student: Student) => void;
  onEdit?: (student: Student) => void;
  showDetails?: boolean;
  filters?: {
    batch?: string;
    usn?: string;
    backlogs?: string;
    status?: string;
    eligibility?: string;
  };
}

const StudentTable: React.FC<StudentTableProps> = ({ students, title, delay = 0, onView, onEdit, showDetails = false, filters }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Student>('usn');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const filteredAndSortedStudents = React.useMemo(() => {
    let filtered = students.filter(student => {
      // Apply search filter (name or USN)
      const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           student.usn.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesSearch;
    });

    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
    });

    return filtered;
  }, [students, searchTerm, sortField, sortDirection]);

  const handleSort = (field: keyof Student) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getStatusIcon = (student: Student) => {
    if (student.placement_status === 'Placed') {
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    } else if (student.placement_eligible) {
      return <Target className="w-4 h-4 text-blue-600" />;
    } else {
      return <XCircle className="w-4 h-4 text-red-600" />;
    }
  };

  const getStatusColor = (student: Student) => {
    if (student.placement_status === 'Placed') {
      return 'bg-green-100 text-green-800';
    } else if (student.placement_eligible) {
      return 'bg-blue-100 text-blue-800';
    } else {
      return 'bg-red-100 text-red-800';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 dark:border-gray-700"
    >
             <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-4">
         <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">{title}</h3>
         <div className="relative w-full sm:w-auto">
           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
           <input
             type="text"
             placeholder="Search students..."
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 w-full sm:w-64"
           />
         </div>
       </div>
       
       {/* Simple Student Count Display */}
       <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg">
         <div className="text-center text-sm text-gray-700 dark:text-gray-300">
           Showing {filteredAndSortedStudents.length} students
         </div>
       </div>

        {/* Table */}
        <div className="w-full overflow-x-auto sm:overflow-x-visible">
          <table className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm min-w-[800px] sm:min-w-0">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-16 sm:w-20">
                  SI No
                </th>
                <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-48 sm:w-64">
                  Name
                </th>
                <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 w-32 sm:w-40" onClick={() => handleSort('usn')}>
                  <div className="flex items-center space-x-1">
                    <span>USN</span>
                    {sortField === 'usn' && (
                      sortDirection === 'asc' ? 
                        <SortAsc className="w-3 h-3 sm:w-4 sm:h-4" /> : 
                        <SortDesc className="w-3 h-3 sm:w-4 sm:h-4" />
                    )}
                  </div>
                </th>
                <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-24 sm:w-32">
                  Batch
                </th>
                <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 w-24 sm:w-32" onClick={() => handleSort('aggregate_percentage')}>
                  <div className="flex items-center space-x-1">
                    <span>Aggregate</span>
                    {sortField === 'aggregate_percentage' && (
                      sortDirection === 'asc' ? 
                        <SortAsc className="w-3 h-3 sm:w-4 sm:h-4" /> : 
                        <SortDesc className="w-3 h-3 sm:w-4 sm:h-4" />
                    )}
                  </div>
                </th>
                <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-20 sm:w-28">
                  Backlogs
                </th>
                <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-32 sm:w-40">
                  Placement Status
                </th>
                <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-32 sm:w-40">
                  Placement Eligible
                </th>
                <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-40 sm:w-48">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredAndSortedStudents.map((student, index) => (
                <motion.tr
                  key={student.usn}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="px-2 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100">
                    {index + 1}
                  </td>
                  <td className="px-2 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 dark:text-gray-100 font-medium">
                    {student.name}
                  </td>
                  <td className="px-2 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-mono">
                    {student.usn}
                  </td>
                  <td className="px-2 sm:px-4 py-3 sm:py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                      student.batch === '5th-sem' 
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' 
                        : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                    }`}>
                      {student.batch.replace('-sem', ' Sem')}
                    </span>
                  </td>
                  <td className="px-2 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 dark:text-gray-100 font-semibold">
                    {student.aggregate_percentage.toFixed(1)}%
                  </td>
                  <td className="px-2 sm:px-4 py-3 sm:py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                      student.active_backlogs === 0 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
                        : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                    }`}>
                      {student.active_backlogs}
                    </span>
                  </td>
                  <td className="px-2 sm:px-4 py-3 sm:py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      {getStatusIcon(student)}
                      <span className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                        student.placement_status === 'Placed' 
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
                          : student.placement_status === 'Under Process'
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                      }`}>
                        {student.placement_status}
                      </span>
                    </div>
                  </td>
                  <td className="px-2 sm:px-4 py-3 sm:py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                      student.placement_eligible 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
                        : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                    }`}>
                      {student.placement_eligible ? 'Eligible' : 'Not Eligible'}
                    </span>
                  </td>
                  <td className="px-2 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium">
                    <div className="flex items-center space-x-1 sm:space-x-3">
                      {onView && (
                        <button
                          onClick={() => onView(student)}
                          className="inline-flex items-center px-2 sm:px-4 py-1 sm:py-2 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors dark:bg-blue-500 dark:hover:bg-blue-600"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          <span className="hidden sm:inline">View</span>
                        </button>
                      )}
                      {onEdit && (
                        <button
                          onClick={() => onEdit(student)}
                          className="inline-flex items-center px-2 sm:px-4 py-1 sm:py-2 border border-gray-300 dark:border-gray-600 text-xs font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                        >
                          <Pencil className="w-3 h-3 mr-1" />
                          <span className="hidden sm:inline">Edit</span>
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

      {filteredAndSortedStudents.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No students found matching your search criteria.
        </div>
      )}
    </motion.div>
  );
};

export default StudentTable;
