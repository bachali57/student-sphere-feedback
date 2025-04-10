
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useFeedback } from '@/services/feedbackService';
import FeedbackCard from '@/components/FeedbackCard';
import { MessageSquare, BarChart2, Shield, Clock, CheckCircle2 } from 'lucide-react';

const Index = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { feedbacks } = useFeedback();
  
  // Get latest 3 resolved feedbacks for showcase
  const resolvedFeedbacks = feedbacks
    .filter(feedback => feedback.status === 'resolved')
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-12 px-4 bg-gradient-to-br from-campus-primary to-campus-secondary rounded-lg text-white mb-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Your Voice Matters</h1>
          <p className="text-lg mb-8">
            CampusVoice empowers students to share feedback, report issues, and make your campus better.
            Get heard, track progress, and see results.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {isAuthenticated ? (
              <Button 
                size="lg"
                onClick={() => navigate('/submit-feedback')}
                className="bg-white text-campus-primary hover:bg-gray-100"
              >
                Submit Feedback
              </Button>
            ) : (
              <>
                <Button 
                  size="lg" 
                  onClick={() => navigate('/login')}
                  className="bg-white text-campus-primary hover:bg-gray-100"
                >
                  Login to Get Started
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => navigate('/register')}
                  className="border-white text-white hover:bg-white/20"
                >
                  Register Account
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-center mb-8">How CampusVoice Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md text-center flex flex-col items-center">
            <div className="h-12 w-12 bg-campus-primary/10 rounded-full flex items-center justify-center mb-4">
              <MessageSquare className="h-6 w-6 text-campus-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Submit Feedback</h3>
            <p className="text-gray-600">
              Share your concerns, suggestions, or issues with the campus administration, optionally anonymously.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center flex flex-col items-center">
            <div className="h-12 w-12 bg-campus-primary/10 rounded-full flex items-center justify-center mb-4">
              <Clock className="h-6 w-6 text-campus-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Track Progress</h3>
            <p className="text-gray-600">
              Follow the status of your submissions in real-time with updates from administrators.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center flex flex-col items-center">
            <div className="h-12 w-12 bg-campus-primary/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="h-6 w-6 text-campus-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Get Resolution</h3>
            <p className="text-gray-600">
              See your feedback addressed with transparent communication from campus administration.
            </p>
          </div>
        </div>
      </section>

      {/* Recent Resolutions */}
      {resolvedFeedbacks.length > 0 && (
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Recent Resolutions</h2>
            <Button variant="ghost" className="text-campus-primary" onClick={() => navigate('/dashboard')}>
              View All
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {resolvedFeedbacks.map(feedback => (
              <FeedbackCard key={feedback.id} feedback={feedback} compact />
            ))}
          </div>
        </section>
      )}

      {/* Stats Section */}
      <section className="bg-white p-8 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold text-center mb-8">Making a Difference</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-campus-primary mb-2">
              {feedbacks.length}+
            </div>
            <p className="text-gray-600">Feedback Submissions</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-campus-primary mb-2">
              {feedbacks.filter(f => f.status === 'resolved').length}+
            </div>
            <p className="text-gray-600">Issues Resolved</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-campus-primary mb-2">
              {Math.round((feedbacks.filter(f => f.status === 'resolved').length / feedbacks.length) * 100) || 0}%
            </div>
            <p className="text-gray-600">Resolution Rate</p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
