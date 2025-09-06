'use client';

import React from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { Student } from '../../types';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface StudentDrawerProps {
  open: boolean;
  onClose: () => void;
  student: Student | null;
}

const gradeFromPercent = (p: number) => {
  if (p >= 90) return 'A+';
  if (p >= 80) return 'A';
  if (p >= 70) return 'B+';
  if (p >= 60) return 'B';
  if (p >= 50) return 'C';
  return 'F';
};

const cgpaFromPercent = (p: number) => {
  // Standard conversion: CGPA = (Percentage / 10) with max 10.0
  const cgpa = Math.min(p / 10, 10.0);
  return cgpa.toFixed(2);
};

const StudentDrawer: React.FC<StudentDrawerProps> = ({ open, onClose, student }) => {
  if (!open || !student) return null;

  const semData = [
    { name: 'Sem1', value: student.sem1_percentage },
    { name: 'Sem2', value: student.sem2_percentage },
    { name: 'Sem3', value: student.sem3_percentage },
    { name: 'Sem4', value: student.sem4_percentage },
  ];
  if (typeof student.sem5_percentage === 'number') semData.push({ name: 'Sem5', value: student.sem5_percentage });
  if (typeof student.sem6_percentage === 'number') semData.push({ name: 'Sem6', value: student.sem6_percentage });

  return (
    <div className="fixed inset-0 z-[10000]">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute top-0 right-0 h-full w-full max-w-xl bg-white dark:bg-gray-800 shadow-2xl p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{student.name}</h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm">USN: {student.usn} • {student.batch.replace('-sem', ' Semester')}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/analytics/student/${encodeURIComponent(student.usn)}`} className="px-3 py-1.5 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700">
              Open full view
            </Link>
            <button onClick={onClose} className="w-8 h-8 inline-flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700" aria-label="Close student details" title="Close">
              <X className="w-5 h-5 text-gray-900 dark:text-white" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">10th %</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{student.tenth_percentage}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">PUC %</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{student.puc_percentage}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Aggregate %</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{student.aggregate_percentage}%</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">CGPA</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{cgpaFromPercent(student.aggregate_percentage)}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Backlogs</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{student.active_backlogs}</p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Semester Trends</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={semData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" tick={{ fill: '#6B7280' }} />
                <YAxis tick={{ fill: '#6B7280' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                />
                <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Semester Performance</h3>
          <div className="space-y-2">
            {[{ label: 'Sem 1', val: student.sem1_percentage }, { label: 'Sem 2', val: student.sem2_percentage }, { label: 'Sem 3', val: student.sem3_percentage }, { label: 'Sem 4', val: student.sem4_percentage }]
              .concat(typeof student.sem5_percentage === 'number' ? [{ label: 'Sem 5', val: student.sem5_percentage }] : [])
              .concat(typeof student.sem6_percentage === 'number' ? [{ label: 'Sem 6', val: student.sem6_percentage }] : [])
              .map((row) => (
                <div key={row.label} className="bg-gray-50 dark:bg-gray-700 rounded-md p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">{row.label}</span>
                    <span className="text-gray-900 dark:text-white font-semibold">{gradeFromPercent(Number(row.val))}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Percentage: {row.val}%</span>
                    <span className="text-gray-600 dark:text-gray-400">CGPA: {cgpaFromPercent(Number(row.val))}</span>
                  </div>
                </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDrawer;


