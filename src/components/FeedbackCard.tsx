
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import StatusBadge from '@/components/StatusBadge';
import { Feedback } from '@/services/feedbackService';
import { Calendar, MessageSquare, User, UserX } from 'lucide-react';

interface FeedbackCardProps {
  feedback: Feedback;
  compact?: boolean;
}

const FeedbackCard: React.FC<FeedbackCardProps> = ({ feedback, compact = false }) => {
  const formattedDate = new Date(feedback.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  
  const commentCount = feedback.comments?.length || 0;

  return (
    <Card className="h-full hover:shadow-md transition-shadow duration-300">
      <Link to={`/feedback/${feedback.id}`} className="block h-full">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className={compact ? "text-base" : "text-lg"}>{feedback.title}</CardTitle>
            <StatusBadge status={feedback.status} size={compact ? "sm" : "md"} />
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          {!compact && (
            <p className="text-sm text-gray-700 mb-3 line-clamp-2">
              {feedback.description}
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-campus-light text-gray-700 flex items-center gap-1">
              {feedback.isAnonymous ? (
                <>
                  <UserX className="h-3 w-3" />
                  <span className="text-xs">Anonymous</span>
                </>
              ) : (
                <>
                  <User className="h-3 w-3" />
                  <span className="text-xs">{feedback.userName || 'User'}</span>
                </>
              )}
            </Badge>
            <Badge variant="outline" className="bg-campus-light text-gray-700 text-xs">
              {feedback.category}
            </Badge>
          </div>
        </CardContent>
        <CardFooter className="pt-0 flex justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="h-3 w-3" />
            <span>{commentCount} {commentCount === 1 ? 'comment' : 'comments'}</span>
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
};

export default FeedbackCard;
