import { Student, StudentAnalytics } from '../types';

// Analytics calculation function
export const calculateAnalytics = (students: Student[]): StudentAnalytics => {
  const totalStudents = students.length;
  const averageAggregate = students.reduce((sum, s) => sum + s.aggregate_percentage, 0) / totalStudents;
  const placementEligibleCount = students.filter(s => s.placement_eligible).length;
  const placedStudentsCount = students.filter(s => s.placement_status === 'Placed').length;
  const backlogStudentsCount = students.filter(s => s.active_backlogs > 0).length;
  
  // Batch distribution
  const batchDistribution = students.reduce((acc, s) => {
    acc[s.batch] = (acc[s.batch] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });
  
  // Grade distribution
  const gradeDistribution = students.reduce((acc, s) => {
    const grade = s.aggregate_percentage >= 90 ? 'A+' :
                  s.aggregate_percentage >= 80 ? 'A' :
                  s.aggregate_percentage >= 70 ? 'B+' :
                  s.aggregate_percentage >= 60 ? 'B' :
                  s.aggregate_percentage >= 50 ? 'C' : 'F';
    acc[grade] = (acc[grade] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });
  
  // Semester performance (average for each semester)
  const semesterPerformance = {
    'Sem 1': students.reduce((sum, s) => sum + s.sem1_percentage, 0) / totalStudents,
    'Sem 2': students.reduce((sum, s) => sum + s.sem2_percentage, 0) / totalStudents,
    'Sem 3': students.reduce((sum, s) => sum + s.sem3_percentage, 0) / totalStudents,
    'Sem 4': students.reduce((sum, s) => sum + s.sem4_percentage, 0) / totalStudents,
    'Sem 5': students.filter(s => s.sem5_percentage).reduce((sum, s) => sum + (s.sem5_percentage || 0), 0) / students.filter(s => s.sem5_percentage).length,
    'Sem 6': students.filter(s => s.sem6_percentage).reduce((sum, s) => sum + (s.sem6_percentage || 0), 0) / students.filter(s => s.sem6_percentage).length,
  };
  
  // Top performers (top 10 by aggregate)
  const topPerformers = [...students]
    .sort((a, b) => b.aggregate_percentage - a.aggregate_percentage)
    .slice(0, 10);
  
  // Improvement trends (comparing semesters)
  const improvementTrends = {
    'Sem 1-2': students.reduce((sum, s) => sum + (s.sem2_percentage - s.sem1_percentage), 0) / totalStudents,
    'Sem 2-3': students.reduce((sum, s) => sum + (s.sem3_percentage - s.sem2_percentage), 0) / totalStudents,
    'Sem 3-4': students.reduce((sum, s) => sum + (s.sem4_percentage - s.sem3_percentage), 0) / totalStudents,
  };
  
  return {
    totalStudents,
    averageAggregate,
    placementEligibleCount,
    placedStudentsCount,
    backlogStudentsCount,
    batchDistribution,
    gradeDistribution,
    semesterPerformance,
    topPerformers,
    improvementTrends,
  };
};

// Chart data preparation
export const prepareChartData = (analytics: StudentAnalytics) => {
  const batchData = Object.entries(analytics.batchDistribution).map(([batch, count]) => ({
    batch: batch.replace('-sem', ' Semester'),
    count,
    percentage: (count / analytics.totalStudents * 100).toFixed(1)
  }));
  
  const gradeData = Object.entries(analytics.gradeDistribution).map(([grade, count]) => ({
    grade,
    count,
    percentage: (count / analytics.totalStudents * 100).toFixed(1)
  }));
  
  const semesterData = Object.entries(analytics.semesterPerformance).map(([semester, average]) => ({
    semester,
    average: Number(average.toFixed(2))
  }));
  
  const placementData = [
    { status: 'Placed', count: analytics.placedStudentsCount, color: '#10B981' },
    { status: 'Eligible', count: analytics.placementEligibleCount - analytics.placedStudentsCount, color: '#3B82F6' },
    { status: 'Not Eligible', count: analytics.totalStudents - analytics.placementEligibleCount, color: '#EF4444' }
  ];
  
  return { batchData, gradeData, semesterData, placementData };
};
