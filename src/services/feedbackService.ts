import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface FeedbackData {
  email: string;
  subject: string;
  message: string;
  createdBy?: string; // Made optional since non-auth users won't have this
}

export const submitFeedback = async (feedbackData: FeedbackData) => {
  console.log('Submitting feedback:', feedbackData);

  try {
    // Validate email format
    const emailRegex = /^[^@]+@[^@]+\.[^@]+$/;
    if (!feedbackData.email || !emailRegex.test(feedbackData.email)) {
      console.error('Invalid email format:', feedbackData.email);
      throw new Error('Valid email is required for feedback submission');
    }

    // Validate message
    if (!feedbackData.message) {
      console.error('Missing message in feedback');
      throw new Error('Message is required for feedback submission');
    }

    const feedbackRef = collection(db, 'feedback');
    const newFeedback = {
      ...feedbackData,
      createdAt: Timestamp.now(),
      status: 'new',
      // Only include createdBy if it exists
      ...(feedbackData.createdBy && { createdBy: feedbackData.createdBy })
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