'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { X, Save } from 'lucide-react';
import { Student } from '../../types';

interface Props {
  open: boolean;
  onClose: () => void;
  student: Student | null;
  onSave?: (updated: Student) => void;
}

const number = (v: any) => (v === '' || v === null || v === undefined ? 0 : Number(v));

const computeAggregate = (s: Student) => {
  const values = [s.sem1_percentage, s.sem2_percentage, s.sem3_percentage, s.sem4_percentage]
    .map(number);
  if (typeof s.sem5_percentage === 'number') values.push(number(s.sem5_percentage));
  if (typeof s.sem6_percentage === 'number') values.push(number(s.sem6_percentage));
  const used = values.filter((x) => !isNaN(x));
  if (used.length === 0) return 0;
  return Number((used.reduce((a, b) => a + b, 0) / used.length).toFixed(2));
};

const StudentEditDrawer: React.FC<Props> = ({ open, onClose, student, onSave }) => {
  const [form, setForm] = useState<Student | null>(student);

  useEffect(() => {
    setForm(student);
  }, [student]);

  if (!open || !form) return null;

  const handleChange = (key: keyof Student, value: any) => {
    const next = { ...form, [key]: value } as Student;
    // recompute aggregate & eligibility
    next.aggregate_percentage = computeAggregate(next);
    next.placement_eligible = next.aggregate_percentage >= 50 && next.active_backlogs === 0;
    setForm(next);
  };

  const handleSubmit = async () => {
    if (!form) return;
    
    try {
      // Save to localStorage for persistence
      const existingData = localStorage.getItem('csd_student_data');
      let allStudents = existingData ? JSON.parse(existingData) : [];
      
      // Update the specific student
      const studentIndex = allStudents.findIndex((s: any) => s.usn === form.usn);
      if (studentIndex !== -1) {
        allStudents[studentIndex] = form;
      } else {
        allStudents.push(form);
      }
      
      // Save back to localStorage
      localStorage.setItem('csd_student_data', JSON.stringify(allStudents));
      
      // Also try to save to API if available
      try {
        const response = await fetch('/api/students/update', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(form),
        });
        
        if (response.ok) {
          console.log('Student data saved to API successfully');
        }
      } catch (apiError) {
        console.log('API save failed, but data saved locally:', apiError);
      }
      
      // Update local state
      onSave?.(form);
      onClose();
      
    } catch (error) {
      console.error('Error saving student:', error);
      alert('Failed to save student data. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-[10000]">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute top-0 right-0 h-full w-full max-w-xl bg-white dark:bg-gray-800 shadow-2xl p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit Student</h2>
          <button onClick={onClose} className="w-8 h-8 inline-flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700" aria-label="Close edit" title="Close">
            <X className="w-5 h-5 text-gray-900 dark:text-white" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="text-sm text-gray-600 dark:text-gray-300">Name</label>
            <input id="name" placeholder="Enter name" title="Name" value={form.name} onChange={(e) => handleChange('name', e.target.value)} className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400" />
          </div>
          <div>
            <label htmlFor="usn" className="text-sm text-gray-600 dark:text-gray-300">USN (read-only)</label>
            <input id="usn" placeholder="USN" title="USN" value={form.usn} readOnly className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-400" />
          </div>
          <div>
            <label htmlFor="tenth" className="text-sm text-gray-600 dark:text-gray-300">10th %</label>
            <input id="tenth" placeholder="e.g. 85" title="10th percentage" type="number" value={form.tenth_percentage} onChange={(e) => handleChange('tenth_percentage', number(e.target.value))} className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400" />
          </div>
          <div>
            <label htmlFor="puc" className="text-sm text-gray-600 dark:text-gray-300">PUC %</label>
            <input id="puc" placeholder="e.g. 88" title="PUC percentage" type="number" value={form.puc_percentage} onChange={(e) => handleChange('puc_percentage', number(e.target.value))} className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400" />
          </div>
          {(['sem1_percentage','sem2_percentage','sem3_percentage','sem4_percentage'] as (keyof Student)[]).map((key) => (
            <div key={key}>
              <label htmlFor={key as string} className="text-sm text-gray-600 dark:text-gray-300">{key.replace('_percentage','').replace('sem','Sem ')} %</label>
              <input id={key as string} placeholder="e.g. 75" title={`${key.replace('_percentage','')} percentage`} type="number" value={form[key] as number} onChange={(e) => handleChange(key, number(e.target.value))} className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400" />
            </div>
          ))}
          <div>
            <label htmlFor="sem5" className="text-sm text-gray-600 dark:text-gray-300">Sem 5 %</label>
            <input id="sem5" placeholder="e.g. 80" title="Sem 5 percentage" type="number" value={form.sem5_percentage ?? ''} onChange={(e) => handleChange('sem5_percentage', number(e.target.value))} className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400" />
          </div>
          <div>
            <label htmlFor="sem6" className="text-sm text-gray-600 dark:text-gray-300">Sem 6 %</label>
            <input id="sem6" placeholder="e.g. 82" title="Sem 6 percentage" type="number" value={form.sem6_percentage ?? ''} onChange={(e) => handleChange('sem6_percentage', number(e.target.value))} className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400" />
          </div>
          <div>
            <label htmlFor="backlogs" className="text-sm text-gray-600 dark:text-gray-300">Active Backlogs</label>
            <input id="backlogs" placeholder="e.g. 0" title="Active backlogs" type="number" value={form.active_backlogs} onChange={(e) => handleChange('active_backlogs', number(e.target.value))} className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400" />
          </div>
          <div>
            <label htmlFor="placement_status" className="text-sm text-gray-600 dark:text-gray-300">Placement Status</label>
            <select id="placement_status" title="Placement status" value={form.placement_status} onChange={(e) => handleChange('placement_status', e.target.value)} className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option>Not Placed</option>
              <option>Placed</option>
              <option>Under Process</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-300">Aggregate: <span className="font-semibold text-gray-900 dark:text-white">{form.aggregate_percentage}%</span> • Eligible: <span className="font-semibold text-gray-900 dark:text-white">{form.placement_eligible ? 'Yes' : 'No'}</span></div>
          <button onClick={handleSubmit} className="inline-flex items-center px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700">
            <Save className="w-4 h-4 mr-2" /> Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentEditDrawer;


