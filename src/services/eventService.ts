import { collection, addDoc, updateDoc, doc, getDoc, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { Event } from '@/types/event';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export const createEvent = async (eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) => {
  console.log('Creating new event:', eventData);
  
  // Check if user is logged in
  if (!auth.currentUser) {
    throw new Error('You must be logged in to create an event');
  }

  if (!auth.currentUser.emailVerified) {
    throw new Error('Please verify your email before creating events. Check your inbox for a verification link.');
  }

  try {
    const eventsRef = collection(db, 'events');
    const newEvent = {
      ...eventData,
      guests: eventData.guests || [],
      dishes: eventData.dishes || [],
      isPrivate: eventData.isPrivate || false,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    
    const docRef = await addDoc(eventsRef, newEvent);
    console.log('Event created successfully with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error creating event:', error);
    throw new Error('Failed to create event. Please ensure you are logged in and verified.');
  }
};
