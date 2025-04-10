import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useAuth } from '@/context/AuthContext';
import { useFeedback, feedbackCategories } from '@/services/feedbackService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';

const feedbackSchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters' }).max(100),
  description: z.string().min(20, { message: 'Description must be at least 20 characters' }),
  category: z.string().min(1, { message: 'Please select a category' }),
  isAnonymous: z.boolean().default(false),
});

type FeedbackFormValues = z.infer<typeof feedbackSchema>;

const SubmitFeedback = () => {
  const { user, isAuthenticated } = useAuth();
  const { addFeedback } = useFeedback();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      isAnonymous: false,
    },
  });

  const onSubmit = (values: FeedbackFormValues) => {
    if (!user) return;
    
    try {
      addFeedback({
        title: values.title,
        description: values.description,
        category: values.category,
        isAnonymous: values.isAnonymous,
        userId: user.id,
        userName: values.isAnonymous ? null : user.name,
        status: 'pending',
      });
      
      toast({
        title: 'Feedback Submitted',
        description: 'Your feedback has been submitted successfully.',
      });
      
      navigate('/dashboard');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: 'An error occurred while submitting your feedback. Please try again.',
      });
    }
  };

  return (
    <Layout>
      {isAuthenticated && (
        <>
          <div className="mb-6">
            <Button variant="ghost" onClick={() => navigate('/dashboard')} className="pl-0 mb-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-2xl font-bold">Submit Feedback</h1>
          </div>

          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Share Your Thoughts</CardTitle>
              <CardDescription>
                Your feedback helps improve campus services and facilities.
              </CardDescription>
            </CardHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Brief title for your feedback" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          A concise title that describes your feedback
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Provide detailed information about your feedback or concern"
                            className="h-32"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Include important details to help administrators understand your feedback
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {feedbackCategories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Categorizing helps route your feedback to the appropriate department
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isAnonymous"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Submit Anonymously</FormLabel>
                          <FormDescription>
                            Your identity will not be revealed with your feedback
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>

                <CardFooter>
                  <Button
                    type="submit"
                    className="w-full bg-campus-primary hover:bg-campus-primary/90"
                  >
                    Submit Feedback
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </>
      )}
    </Layout>
  );
};

export default SubmitFeedback;
