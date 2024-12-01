import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface FeedbackData {
  email: string;
  subject: string;
  message: string;
  createdBy: string;
}

export const submitFeedback = async (feedbackData: FeedbackData) => {
  console.log('Submitting feedback:', feedbackData);

  try {
    // Validate required fields
    if (!feedbackData.email || !feedbackData.message) {
      console.error('Missing required fields:', { 
        email: feedbackData.email, 
        message: feedbackData.message 
      });
      throw new Error('Missing required fields for feedback submission');
    }

    const feedbackRef = collection(db, 'feedback');
    const newFeedback = {
      ...feedbackData,
      createdAt: Timestamp.now(),
      status: 'new'
    };

    console.log('Attempting to save feedback to Firestore:', newFeedback);
    const docRef = await addDoc(feedbackRef, newFeedback);
    console.log('Feedback submitted successfully with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error submitting feedback:', error);
    throw error;
  }
};