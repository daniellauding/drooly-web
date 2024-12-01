import { collection, addDoc, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Event } from '@/types/event';

export const createEvent = async (eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) => {
  console.log('Creating new event with data:', eventData);
  
  try {
    const eventsRef = collection(db, 'events');
    
    // Validate required fields
    if (!eventData.title || !eventData.createdBy) {
      console.error('Missing required fields:', { title: eventData.title, createdBy: eventData.createdBy });
      throw new Error('Missing required fields for event creation');
    }

    const newEvent = {
      ...eventData,
      guests: eventData.guests || [],
      dishes: eventData.dishes || [],
      isPrivate: eventData.isPrivate || false,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    
    console.log('Attempting to save event to Firestore:', newEvent);
    const docRef = await addDoc(eventsRef, newEvent);
    console.log('Event created successfully with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

export const getUserEvents = async (userId: string) => {
  console.log('Fetching events for user:', userId);
  
  try {
    const eventsRef = collection(db, 'events');
    const q = query(
      eventsRef,
      where('createdBy', '==', userId)
    );
    
    const querySnapshot = await getDocs(q);
    const events = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Event[];
    
    console.log('Retrieved events:', events);
    return events;
  } catch (error) {
    console.error('Error fetching user events:', error);
    throw error;
  }
};