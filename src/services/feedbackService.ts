
import { useState, useEffect } from 'react';

export interface Feedback {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'pending' | 'in_progress' | 'resolved';
  isAnonymous: boolean;
  userId: string;
  userName: string | null;
  createdAt: string;
  updatedAt: string;
  attachments?: string[];
  comments?: Comment[];
}

export interface Comment {
  id: string;
  text: string;
  userId: string;
  userName: string;
  role: 'student' | 'admin';
  createdAt: string;
}

// Mock initial feedback data
const initialFeedbacks: Feedback[] = [
  {
    id: '1',
    title: 'Poor WiFi in Dorm Building A',
    description: 'The WiFi signal in Dorm Building A has been extremely weak for the past week, making it difficult to complete online assignments.',
    category: 'Infrastructure',
    status: 'in_progress',
    isAnonymous: false,
    userId: '2',
    userName: 'Student User',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    comments: [
      {
        id: '101',
        text: 'We have dispatched a technician to check the router in Building A.',
        userId: '1',
        userName: 'Admin User',
        role: 'admin',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
  {
    id: '2',
    title: 'Need More Vegetarian Options in Cafeteria',
    description: 'There are very limited vegetarian food options available in the main cafeteria. Could we please have more variety?',
    category: 'Services',
    status: 'resolved',
    isAnonymous: false,
    userId: '3',
    userName: 'Jane Smith',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    comments: [
      {
        id: '102',
        text: 'Thank you for your feedback. We have added 5 new vegetarian options to the weekly menu rotation.',
        userId: '1',
        userName: 'Admin User',
        role: 'admin',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '103',
        text: 'Thank you! The new options are great.',
        userId: '3',
        userName: 'Jane Smith',
        role: 'student',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
  {
    id: '3',
    title: 'Library Closing Too Early',
    description: 'The library has been closing at 8 PM, but many students need to study later, especially during exam period.',
    category: 'Academics',
    status: 'pending',
    isAnonymous: true,
    userId: '4',
    userName: null,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Get feedbacks from localStorage or use initial data
export const useFeedback = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to get feedbacks from localStorage
    const storedFeedbacks = localStorage.getItem('campusVoiceFeedbacks');
    
    if (storedFeedbacks) {
      setFeedbacks(JSON.parse(storedFeedbacks));
    } else {
      // Use initial data if nothing in localStorage
      setFeedbacks(initialFeedbacks);
      localStorage.setItem('campusVoiceFeedbacks', JSON.stringify(initialFeedbacks));
    }
    
    setLoading(false);
  }, []);

  const saveFeedbacks = (updatedFeedbacks: Feedback[]) => {
    localStorage.setItem('campusVoiceFeedbacks', JSON.stringify(updatedFeedbacks));
    setFeedbacks(updatedFeedbacks);
  };

  const getFeedbackById = (id: string) => {
    return feedbacks.find(feedback => feedback.id === id);
  };

  const addFeedback = (feedback: Omit<Feedback, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newFeedback: Feedback = {
      ...feedback,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: [],
    };
    
    const updatedFeedbacks = [...feedbacks, newFeedback];
    saveFeedbacks(updatedFeedbacks);
    return newFeedback;
  };

  const updateFeedbackStatus = (id: string, status: 'pending' | 'in_progress' | 'resolved') => {
    const updatedFeedbacks = feedbacks.map(feedback => 
      feedback.id === id 
        ? { ...feedback, status, updatedAt: new Date().toISOString() } 
        : feedback
    );
    saveFeedbacks(updatedFeedbacks);
  };

  const addComment = (feedbackId: string, comment: Omit<Comment, 'id' | 'createdAt'>) => {
    const updatedFeedbacks = feedbacks.map(feedback => {
      if (feedback.id === feedbackId) {
        const newComment = {
          ...comment,
          id: Math.random().toString(36).substring(2, 9),
          createdAt: new Date().toISOString(),
        };
        
        return {
          ...feedback,
          updatedAt: new Date().toISOString(),
          comments: [...(feedback.comments || []), newComment],
        };
      }
      return feedback;
    });
    
    saveFeedbacks(updatedFeedbacks);
  };

  return { 
    feedbacks, 
    loading, 
    getFeedbackById, 
    addFeedback, 
    updateFeedbackStatus, 
    addComment 
  };
};

export const feedbackCategories = [
  'Academics',
  'Infrastructure',
  'Services',
  'Sports',
  'Events',
  'Hostel',
  'Transportation',
  'Safety',
  'Other',
];
