import { collection, addDoc, updateDoc, doc, getDoc, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Event } from '@/types/event';

export const createEvent = async (eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) => {
  console.log('Creating new event:', eventData);
  try {
    const eventsRef = collection(db, 'events');
    const newEvent = {
      ...eventData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    
    const docRef = await addDoc(eventsRef, newEvent);
    console.log('Event created successfully with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error creating event:', error);
    throw new Error('Failed to create event. Please ensure you are logged in and try again.');
  }
};

export const updateEvent = async (eventId: string, updates: Partial<Event>) => {
  console.log('Updating event:', eventId, updates);
  try {
    const eventRef = doc(db, 'events', eventId);
    await updateDoc(eventRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
    console.log('Event updated successfully');
  } catch (error) {
    console.error('Error updating event:', error);
    throw new Error('Failed to update event. Please ensure you have permission and try again.');
  }
};

export const getEvent = async (eventId: string): Promise<Event | null> => {
  console.log('Fetching event:', eventId);
  try {
    const eventRef = doc(db, 'events', eventId);
    const eventDoc = await getDoc(eventRef);
    
    if (!eventDoc.exists()) {
      console.log('Event not found');
      return null;
    }

    const eventData = eventDoc.data();
    return {
      id: eventDoc.id,
      ...eventData
    } as Event;
  } catch (error) {
    console.error('Error fetching event:', error);
    throw new Error('Failed to fetch event. Please try again later.');
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
    console.log(`Found ${querySnapshot.size} events for user`);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Event[];
  } catch (error) {
    console.error('Error fetching user events:', error);
    throw new Error('Failed to fetch events. Please ensure you are logged in and try again.');
  }
};