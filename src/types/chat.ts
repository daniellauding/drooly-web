export interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: number;
  seen: boolean;
  edited: boolean;
  replyTo?: string;
}

export interface Conversation {
  id: string;
  name: string;
  participants: string[];
  lastMessage: string;
  lastMessageTimestamp: number;
  unreadCount: number;
  isGroup: boolean;
  participantAvatar?: string;
  participantEmails: string[];
}