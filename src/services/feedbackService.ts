import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface FeedbackData {
  type: string;
  message: string;
  userId?: string | null;
  userEmail: string;
  metadata?: {
    url: string;
    timestamp: Date;
    browser: string;
  };
}

export const submitFeedback = async (data: FeedbackData) => {
  try {
    const feedbackRef = collection(db, 'feedback');
    
    // Extremely simplified data structure
    const feedbackDoc = {
      type: data.type || 'general',
      message: data.message,
      email: data.userEmail || 'anonymous',
      createdAt: new Date().toISOString(), // Use ISO string instead of Timestamp
      status: 'new'
    };

    console.log('Attempting to submit feedback:', feedbackDoc);
    const docRef = await addDoc(feedbackRef, feedbackDoc);
    console.log('Feedback submitted successfully, ID:', docRef.id);
    
    return docRef.id;
  } catch (error) {
    console.error('Detailed feedback submission error:', {
      error,
      errorMessage: error.message,
      errorCode: error.code,
      errorDetails: error.details
    });
    throw error;
  }
};