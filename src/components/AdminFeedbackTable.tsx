
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Feedback, useFeedback } from '@/services/feedbackService';
import StatusBadge from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, Eye, UserCircle, UserX } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface AdminFeedbackTableProps {
  feedbacks: Feedback[];
  loading: boolean;
}

const AdminFeedbackTable: React.FC<AdminFeedbackTableProps> = ({ feedbacks, loading }) => {
  const navigate = useNavigate();
  const { updateFeedbackStatus } = useFeedback();

  const handleStatusChange = (id: string, status: 'pending' | 'in_progress' | 'resolved') => {
    updateFeedbackStatus(id, status);
    toast({
      title: 'Status Updated',
      description: `Feedback status updated to ${status.replace('_', ' ')}.`,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return <p className="text-center py-8">Loading feedbacks...</p>;
  }

  if (feedbacks.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed">
        <h3 className="text-lg font-medium">No feedbacks found</h3>
        <p className="text-gray-500 mt-2">
          No feedbacks match your current filters.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Submitted By</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {feedbacks.map((feedback) => (
            <TableRow key={feedback.id}>
              <TableCell className="font-medium">{feedback.title}</TableCell>
              <TableCell>
                <Badge variant="outline" className="bg-campus-light text-gray-700">
                  {feedback.category}
                </Badge>
              </TableCell>
              <TableCell>
                {feedback.isAnonymous ? (
                  <div className="flex items-center gap-1">
                    <UserX className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-500">Anonymous</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <UserCircle className="h-4 w-4" />
                    <span>{feedback.userName}</span>
                  </div>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1 text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(feedback.createdAt)}</span>
                </div>
              </TableCell>
              <TableCell>
                <Select
                  value={feedback.status}
                  onValueChange={(value: 'pending' | 'in_progress' | 'resolved') => 
                    handleStatusChange(feedback.id, value)
                  }
                >
                  <SelectTrigger className="w-[130px] h-8">
                    <SelectValue>
                      <StatusBadge status={feedback.status} />
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate(`/feedback/${feedback.id}`)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminFeedbackTable;
