import { Users } from "lucide-react";

interface Participant {
  name: string;
  status: 'accepted' | 'pending' | 'declined';
  avatar: string;
}

interface EventParticipantsProps {
  participants: Participant[];
}

export function EventParticipants({ participants }: EventParticipantsProps) {
  return (
    <div>
      <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
        <Users className="h-4 w-4" />
        Participants
      </h4>
      <div className="flex flex-wrap gap-2">
        {participants.map((participant) => (
          <div
            key={participant.name}
            className="flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
          >
            <img
              src={participant.avatar}
              alt={participant.name}
              className="w-6 h-6 rounded-full"
            />
            <span>{participant.name}</span>
            <span className="text-xs">({participant.status})</span>
          </div>
        ))}
      </div>
    </div>
  );
}