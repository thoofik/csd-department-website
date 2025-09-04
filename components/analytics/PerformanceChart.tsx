'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

interface PerformanceChartProps {
  data: any[];
  type: 'bar' | 'pie' | 'line';
  title: string;
  dataKey: string;
  nameKey: string;
  colors?: string[];
  height?: number;
  delay?: number;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'];

const PerformanceChart: React.FC<PerformanceChartProps> = ({
  data,
  type,
  title,
  dataKey,
  nameKey,
  colors = COLORS,
  height = 300,
  delay = 0
}) => {
  const renderChart = () => {
    switch (type) {
      case 'bar':
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey={nameKey} 
              tick={{ fontSize: 10 }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              tick={{ fontSize: 10 }}
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
            />
            <Bar dataKey={dataKey} fill={colors[0]} />
          </BarChart>
        );
      
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ [nameKey]: name, [dataKey]: value }) => `${name}: ${value}`}
              outerRadius={60}
              fill="#8884d8"
              dataKey={dataKey}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1F2937', 
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#F9FAFB',
                fontSize: '12px'
              }}
            />
          </PieChart>
        );
      
      case 'line':
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey={nameKey} 
              tick={{ fontSize: 10 }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              tick={{ fontSize: 10 }}
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
            />
            <Line type="monotone" dataKey={dataKey} stroke={colors[0]} strokeWidth={2} />
          </LineChart>
        );
      
      default:
        return <div>Unsupported chart type</div>;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-3 sm:p-4 lg:p-6 shadow-lg border border-gray-100 dark:border-gray-700"
    >
      <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">{title}</h3>
      <div className="h-48 sm:h-64 md:h-72 lg:h-80">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default PerformanceChart;
