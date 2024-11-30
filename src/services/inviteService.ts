import { collection, addDoc, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface EventInvite {
  eventId: string;
  email: string;
  status: 'pending' | 'accepted' | 'declined';
  invitedBy: string;
  createdAt: Date;
  inviteCode: string;
}

export const createEventInvite = async (eventId: string, email: string, invitedBy: string) => {
  console.log('Creating event invite:', { eventId, email, invitedBy });
  
  const inviteCode = Math.random().toString(36).substring(2, 15);
  
  const inviteData: EventInvite = {
    eventId,
    email,
    status: 'pending',
    invitedBy,
    createdAt: new Date(),
    inviteCode
  };

  const inviteRef = await addDoc(collection(db, "eventInvites"), inviteData);
  console.log('Created invite with ID:', inviteRef.id);
  
  return inviteCode;
};

export const getInviteByCode = async (inviteCode: string) => {
  console.log('Fetching invite by code:', inviteCode);
  
  const invitesRef = collection(db, "eventInvites");
  const q = query(invitesRef, where("inviteCode", "==", inviteCode));
  const snapshot = await getDocs(q);
  
  if (snapshot.empty) {
    console.log('No invite found for code:', inviteCode);
    return null;
  }
  
  return {
    id: snapshot.docs[0].id,
    ...snapshot.docs[0].data()
  } as EventInvite & { id: string };
};

export const acceptInvite = async (inviteId: string) => {
  console.log('Accepting invite:', inviteId);
  
  const inviteRef = doc(db, "eventInvites", inviteId);
  await updateDoc(inviteRef, {
    status: 'accepted'
  });
};