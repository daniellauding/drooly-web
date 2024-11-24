import { collection, query, where, orderBy, getDocs, doc, updateDoc, deleteDoc, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Conversation, Message } from "@/types/chat";

export const fetchConversations = async (userId: string): Promise<Conversation[]> => {
  console.log("Fetching conversations for user:", userId);
  try {
    const conversationsRef = collection(db, "conversations");
    const q = query(
      conversationsRef,
      where("participants", "array-contains", userId),
      orderBy("lastMessageTimestamp", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Conversation));
  } catch (error) {
    console.error("Error fetching conversations:", error);
    throw error;
  }
};

export const fetchMessages = async (conversationId: string): Promise<Message[]> => {
  console.log("Fetching messages for conversation:", conversationId);
  try {
    const messagesRef = collection(db, `conversations/${conversationId}/messages`);
    const q = query(messagesRef, orderBy("timestamp", "asc"));
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Message));
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};

export const markMessageAsSeen = async (conversationId: string, messageId: string) => {
  try {
    const messageRef = doc(db, `conversations/${conversationId}/messages/${messageId}`);
    await updateDoc(messageRef, {
      seen: true
    });
  } catch (error) {
    console.error("Error marking message as seen:", error);
    throw error;
  }
};

export const deleteMessage = async (conversationId: string, messageId: string) => {
  try {
    const messageRef = doc(db, `conversations/${conversationId}/messages/${messageId}`);
    await deleteDoc(messageRef);
  } catch (error) {
    console.error("Error deleting message:", error);
    throw error;
  }
};

export const editMessage = async (conversationId: string, messageId: string, newText: string) => {
  try {
    const messageRef = doc(db, `conversations/${conversationId}/messages/${messageId}`);
    await updateDoc(messageRef, {
      text: newText,
      edited: true
    });
  } catch (error) {
    console.error("Error editing message:", error);
    throw error;
  }
};

export const sendMessage = async (conversationId: string, message: Omit<Message, 'id'>) => {
  try {
    const messagesRef = collection(db, `conversations/${conversationId}/messages`);
    await addDoc(messagesRef, message);
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};