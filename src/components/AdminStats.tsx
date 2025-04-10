
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Feedback } from '@/services/feedbackService';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface AdminStatsProps {
  feedbacks: Feedback[];
}

const AdminStats: React.FC<AdminStatsProps> = ({ feedbacks }) => {
  // Count feedbacks by status
  const pendingCount = feedbacks.filter(f => f.status === 'pending').length;
  const inProgressCount = feedbacks.filter(f => f.status === 'in_progress').length;
  const resolvedCount = feedbacks.filter(f => f.status === 'resolved').length;
  const totalCount = feedbacks.length;

  // Categories data for bar chart
  const categoryCounts = feedbacks.reduce((acc: Record<string, number>, feedback) => {
    acc[feedback.category] = (acc[feedback.category] || 0) + 1;
    return acc;
  }, {});

  const categoryData = Object.keys(categoryCounts).map(category => ({
    name: category,
    count: categoryCounts[category],
  })).sort((a, b) => b.count - a.count);

  // Status data for pie chart
  const statusData = [
    { name: 'Pending', value: pendingCount, color: '#f59e0b' },
    { name: 'In Progress', value: inProgressCount, color: '#3b82f6' },
    { name: 'Resolved', value: resolvedCount, color: '#10b981' },
  ];

  const resolvedPercent = totalCount ? Math.round((resolvedCount / totalCount) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Feedbacks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalCount}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-amber-500">{pendingCount}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-500">{inProgressCount}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Resolved</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-emerald-500">{resolvedCount}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {resolvedPercent}% resolution rate
          </p>
        </CardContent>
      </Card>

      {/* Charts row */}
      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>Feedback by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categoryData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis allowDecimals={false} />
                <RechartsTooltip />
                <Bar dataKey="count" fill="#8884d8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>Feedback Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminStats;
