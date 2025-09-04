'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StudentStatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  delay?: number;
}

const StudentStatsCard: React.FC<StudentStatsCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
  bgColor,
  description,
  trend,
  delay = 0
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{value}</p>
          {description && (
            <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
          )}
          {trend && (
            <div className="flex items-center mt-2">
              <span className={`text-xs font-medium ${
                trend.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">vs last semester</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 ${bgColor} rounded-xl flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </motion.div>
  );
};

export default StudentStatsCard;
