
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useAuth } from '@/context/AuthContext';
import { useFeedback, Comment } from '@/services/feedbackService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import StatusBadge from '@/components/StatusBadge';
import { 
  ArrowLeft, 
  Calendar, 
  UserCircle, 
  UserX,
  MessageSquare,
  Clock,
  Send 
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

const FeedbackDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const { feedbacks, getFeedbackById, updateFeedbackStatus, addComment } = useFeedback();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [feedback, setFeedback] = useState(getFeedbackById(id || ''));
  const [newComment, setNewComment] = useState('');
  const [newStatus, setNewStatus] = useState(feedback?.status || 'pending');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!feedback) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, feedback, navigate]);

  useEffect(() => {
    // Update local feedback state when feedbacks change
    setFeedback(getFeedbackById(id || ''));
  }, [feedbacks, id, getFeedbackById]);

  if (!feedback || !isAuthenticated) {
    return null;
  }

  const handleStatusChange = (status: 'pending' | 'in_progress' | 'resolved') => {
    updateFeedbackStatus(feedback.id, status);
    setNewStatus(status);
    toast({
      title: 'Status Updated',
      description: `Feedback status updated to ${status.replace('_', ' ')}.`,
    });
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim()) {
      toast({
        variant: 'destructive',
        title: 'Empty Comment',
        description: 'Please enter a comment before submitting.',
      });
      return;
    }
    
    if (!user) return;
    
    addComment(feedback.id, {
      text: newComment,
      userId: user.id,
      userName: user.name,
      role: user.role,
    });
    
    setNewComment('');
    
    toast({
      title: 'Comment Added',
      description: 'Your comment has been added to the feedback.',
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Layout>
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate('/dashboard')} className="pl-0 mb-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl font-bold">{feedback.title}</h1>
          
          {user?.role === 'admin' && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Status:</span>
              <Select value={newStatus} onValueChange={(val: any) => handleStatusChange(val)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Update Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <div className="flex flex-wrap gap-3 mb-2">
            <StatusBadge status={feedback.status} size="lg" />
            <Badge variant="outline" className="bg-campus-light text-gray-700">
              {feedback.category}
            </Badge>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-2">
              {feedback.isAnonymous ? (
                <div className="flex items-center gap-1">
                  <UserX className="h-4 w-4" />
                  <span>Anonymous</span>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <UserCircle className="h-4 w-4" />
                  <span>{feedback.userName}</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(feedback.createdAt)}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="mb-4 whitespace-pre-wrap text-gray-700">{feedback.description}</p>
          
          {feedback.updatedAt !== feedback.createdAt && (
            <div className="text-xs text-gray-500 mt-4 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>Last updated: {formatDate(feedback.updatedAt)}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Comments Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Comments {feedback.comments && feedback.comments.length > 0 && `(${feedback.comments.length})`}
        </h2>
        
        {feedback.comments && feedback.comments.length > 0 ? (
          <div className="space-y-4">
            {feedback.comments.map((comment: Comment) => (
              <Card key={comment.id} className="overflow-hidden">
                <CardHeader className="py-3 bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <UserCircle className="h-5 w-5 text-gray-700" />
                      <span className="font-medium">
                        {comment.userName}
                        <span className="ml-2 text-xs px-2 py-0.5 bg-gray-200 rounded text-gray-700">
                          {comment.role === 'admin' ? 'Admin' : 'Student'}
                        </span>
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
                  </div>
                </CardHeader>
                <CardContent className="py-3">
                  <p className="whitespace-pre-wrap">{comment.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-gray-50 border-dashed">
            <CardContent className="text-center py-8">
              <p className="text-gray-500">No comments yet</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add Comment Form */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-lg">Add a Comment</CardTitle>
        </CardHeader>
        <form onSubmit={handleCommentSubmit}>
          <CardContent>
            <Textarea
              placeholder="Write your comment here..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[100px]"
            />
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" className="bg-campus-primary hover:bg-campus-primary/90">
              <Send className="h-4 w-4 mr-2" />
              Post Comment
            </Button>
          </CardFooter>
        </form>
      </Card>
    </Layout>
  );
};

export default FeedbackDetail;
