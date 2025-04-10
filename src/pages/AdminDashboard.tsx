
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useAuth } from '@/context/AuthContext';
import { useFeedback, Feedback } from '@/services/feedbackService';
import AdminFeedbackTable from '@/components/AdminFeedbackTable';
import AdminStats from '@/components/AdminStats';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

const AdminDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const { feedbacks, loading } = useFeedback();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (user?.role !== 'admin') {
      navigate('/dashboard');
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin dashboard.",
        variant: "destructive"
      });
    }
  }, [isAuthenticated, user, navigate]);

  // Get unique categories from feedbacks
  const categories = ['all', ...new Set(feedbacks.map(f => f.category))];

  // Apply search and filters
  const filteredFeedbacks = feedbacks.filter(feedback => {
    const matchesSearch = searchTerm === '' || 
      feedback.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || 
      feedback.category === categoryFilter;
    
    const matchesStatus = statusFilter === 'all' || 
      feedback.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleRefresh = () => {
    // In a real app, this would refresh data from the server
    toast({
      title: "Refreshed",
      description: "Dashboard data has been refreshed",
    });
  };

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Button variant="outline" onClick={handleRefresh}>
          <RefreshCcw className="h-4 w-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      <AdminStats feedbacks={feedbacks} />

      {/* Search and filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex items-center relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          <Input
            placeholder="Search feedbacks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabs for different views */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="all">All Feedbacks</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="in_progress">In Progress</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <AdminFeedbackTable 
            feedbacks={filteredFeedbacks}
            loading={loading} 
          />
        </TabsContent>
        
        <TabsContent value="pending">
          <AdminFeedbackTable 
            feedbacks={filteredFeedbacks.filter(f => f.status === 'pending')}
            loading={loading}
          />
        </TabsContent>
        
        <TabsContent value="in_progress">
          <AdminFeedbackTable 
            feedbacks={filteredFeedbacks.filter(f => f.status === 'in_progress')}
            loading={loading}
          />
        </TabsContent>
        
        <TabsContent value="resolved">
          <AdminFeedbackTable 
            feedbacks={filteredFeedbacks.filter(f => f.status === 'resolved')}
            loading={loading}
          />
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default AdminDashboard;
