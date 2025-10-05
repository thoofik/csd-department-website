'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import NewNavigation from '../../../../components/layout/NewNavigation';
import { ArrowLeft, Award, CheckCircle, Target, XCircle } from 'lucide-react';
import Link from 'next/link';
import { Student } from '../../../../types';
import StudentResumeManager from '../../../../components/analytics/StudentResumeManager';

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

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

const StudentDetailPage: React.FC = () => {
  const params = useParams<{ usn: string }>();
  const [apiStudent, setApiStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const usn = params?.usn ? decodeURIComponent(params.usn) : '';

  useEffect(() => {
    if (!usn) return; // Early return if no USN
    
    let cancelled = false;
    const load = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/students/all');
        if (!res.ok) return;
        const json = await res.json();
        const all: Student[] = [...(json.students5th || []), ...(json.students7th || [])];
        if (!cancelled) {
          setApiStudent(all.find(s => (s.usn || '').toLowerCase() === usn.toLowerCase()) || null);
          setIsLoading(false);
        }
      } catch (error) {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };
    load();
    return () => { cancelled = true; };
  }, [usn]);

  const student: Student | undefined = useMemo(() => {
    return apiStudent || undefined;
  }, [apiStudent]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20">
        <NewNavigation />
        <div className="max-w-4xl mx-auto px-4 py-24">
          <Link href="/analytics" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Analytics
          </Link>
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl p-8 shadow">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-700 dark:text-gray-300">Loading student data...</span>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!student) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <NewNavigation />
        <div className="max-w-4xl mx-auto px-4 py-24">
          <Link href="/analytics" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Analytics
          </Link>
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl p-8 shadow">
            <p className="text-gray-700 dark:text-gray-300">Student not found.</p>
          </div>
        </div>
      </main>
    );
  }

  const semData = [
    { name: 'Sem1', value: student.sem1_percentage },
    { name: 'Sem2', value: student.sem2_percentage },
    { name: 'Sem3', value: student.sem3_percentage },
    { name: 'Sem4', value: student.sem4_percentage },
  ];
  if (typeof student.sem5_percentage === 'number') semData.push({ name: 'Sem5', value: student.sem5_percentage });
  if (typeof student.sem6_percentage === 'number') semData.push({ name: 'Sem6', value: student.sem6_percentage });

  const gradeRows = [
    { label: '10th %', value: student.tenth_percentage },
    { label: 'PUC %', value: student.puc_percentage },
    { label: 'Sem 1', value: student.sem1_percentage },
    { label: 'Sem 2', value: student.sem2_percentage },
    { label: 'Sem 3', value: student.sem3_percentage },
    { label: 'Sem 4', value: student.sem4_percentage },
    ...(typeof student.sem5_percentage === 'number' ? [{ label: 'Sem 5', value: student.sem5_percentage }] : []),
    ...(typeof student.sem6_percentage === 'number' ? [{ label: 'Sem 6', value: student.sem6_percentage }] : []),
    { label: 'Aggregate', value: student.aggregate_percentage },
  ];

  return (
          <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20">
        <NewNavigation />
        <div className="max-w-6xl mx-auto px-4 py-24">
        <div className="flex items-center justify-between mb-6">
          <Link href="/analytics" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Analytics
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{student.name}</h1>
              <p className="text-gray-600 dark:text-gray-300">USN: {student.usn} • {student.batch.replace('-sem', ' Semester')}</p>
            </div>
            <div>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                student.placement_status === 'Placed' ? 'bg-green-100 text-green-800' :
                student.placement_eligible ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
              }`}>
                {student.placement_status === 'Placed' ? <CheckCircle className="w-4 h-4 mr-1" /> : student.placement_eligible ? <Target className="w-4 h-4 mr-1" /> : <XCircle className="w-4 h-4 mr-1" />} 
                {student.placement_status}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow lg:col-span-2">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Semester Performance</h2>
            <ResponsiveContainer width="100%" height={320}>
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

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Overview</h2>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[{ name: 'Aggregate', value: student.aggregate_percentage }, { name: 'Remaining', value: Math.max(0, 100 - student.aggregate_percentage) }]}
                    innerRadius={50}
                    outerRadius={70}
                    dataKey="value"
                  >
                    <Cell fill="#3B82F6" />
                    <Cell fill="#E5E7EB" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">10th %</span>
                <span className="font-semibold text-gray-900 dark:text-white">{student.tenth_percentage}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">PUC %</span>
                <span className="font-semibold text-gray-900 dark:text-white">{student.puc_percentage}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Aggregate %</span>
                <span className="font-semibold text-gray-900 dark:text-white">{student.aggregate_percentage}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">CGPA</span>
                <span className="font-semibold text-gray-900 dark:text-white">{cgpaFromPercent(student.aggregate_percentage)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Active Backlogs</span>
                <span className="font-semibold text-gray-900 dark:text-white">{student.active_backlogs}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow mt-8">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Marks and Grades</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-600">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Item</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Percentage</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">CGPA</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Grade</th>
                </tr>
              </thead>
              <tbody>
                {gradeRows.map((row) => (
                  <tr key={row.label} className="border-b border-gray-100 dark:border-gray-700">
                    <td className="py-3 px-4 text-gray-900 dark:text-white">{row.label}</td>
                    <td className="py-3 px-4 text-gray-900 dark:text-white">{row.value}%</td>
                    <td className="py-3 px-4 text-gray-900 dark:text-white">
                      {(row.label === '10th %' || row.label === 'PUC %') ? '-' : cgpaFromPercent(Number(row.value))}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium">
                        {gradeFromPercent(Number(row.value))}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Resume Management Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow mt-8">
          <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Resume Management</h2>
          <StudentResumeManager 
            studentUSN={student.usn}
            studentName={student.name}
            studentEmail={`${student.usn.toLowerCase()}@pestrust.edu.in`}
          />
        </div>

      </div>
    </main>
  );
};

export default StudentDetailPage;


