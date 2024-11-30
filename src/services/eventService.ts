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
    console.log('Event created with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
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
    throw error;
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
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Event[];
  } catch (error) {
    console.error('Error fetching user events:', error);
    throw error;
  }
};