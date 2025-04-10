
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useAuth } from '@/context/AuthContext';
import { useFeedback, Feedback } from '@/services/feedbackService';
import FeedbackCard from '@/components/FeedbackCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PlusCircle, Search, Filter } from 'lucide-react';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const { feedbacks, loading } = useFeedback();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Filter feedbacks based on user role
  const userFeedbacks = user?.role === 'student'
    ? feedbacks.filter(feedback => feedback.userId === user.id)
    : feedbacks;

  // Apply search and filters
  const filteredFeedbacks = userFeedbacks.filter(feedback => {
    const matchesSearch = searchTerm === '' || 
      feedback.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || 
      feedback.category === categoryFilter;
    
    const matchesStatus = statusFilter === 'all' || 
      feedback.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Count feedbacks by status
  const pendingCount = userFeedbacks.filter(f => f.status === 'pending').length;
  const inProgressCount = userFeedbacks.filter(f => f.status === 'in_progress').length;
  const resolvedCount = userFeedbacks.filter(f => f.status === 'resolved').length;

  // Get unique categories from feedbacks
  const categories = ['all', ...new Set(feedbacks.map(f => f.category))];

  return (
    <Layout>
      {isAuthenticated && (
        <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">
              {user?.role === 'admin' ? 'Admin Dashboard' : 'My Feedback'}
            </h1>
            <Button onClick={() => navigate('/submit-feedback')}>
              <PlusCircle className="h-4 w-4 mr-2" />
              New Feedback
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-campus-pending">{pendingCount}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-campus-inprogress">{inProgressCount}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Resolved</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-campus-resolved">{resolvedCount}</div>
              </CardContent>
            </Card>
          </div>

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

          {/* Feedback tabs */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="recent">Recent</TabsTrigger>
              <TabsTrigger value="mine">
                {user?.role === 'admin' ? 'Active' : 'My Submissions'}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              {loading ? (
                <p>Loading feedbacks...</p>
              ) : filteredFeedbacks.length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium">No feedbacks found</h3>
                  <p className="text-gray-500 mt-2">
                    {searchTerm || categoryFilter !== 'all' || statusFilter !== 'all'
                      ? 'Try changing your filters or search term'
                      : 'Be the first to submit feedback!'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {filteredFeedbacks.map((feedback) => (
                    <FeedbackCard key={feedback.id} feedback={feedback} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="recent">
              {loading ? (
                <p>Loading recent feedbacks...</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {filteredFeedbacks
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .slice(0, 6)
                    .map((feedback) => (
                      <FeedbackCard key={feedback.id} feedback={feedback} />
                    ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="mine">
              {loading ? (
                <p>Loading your feedbacks...</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {user?.role === 'admin' 
                    ? filteredFeedbacks
                        .filter(f => f.status !== 'resolved')
                        .map((feedback) => (
                          <FeedbackCard key={feedback.id} feedback={feedback} />
                        ))
                    : filteredFeedbacks
                        .filter(f => f.userId === user?.id)
                        .map((feedback) => (
                          <FeedbackCard key={feedback.id} feedback={feedback} />
                        ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </>
      )}
    </Layout>
  );
};

export default Dashboard;
