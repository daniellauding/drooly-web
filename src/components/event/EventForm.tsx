import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { CalendarDays, Clock, MapPin, Lock } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { GuestList } from "./GuestList";
import { EventGuest } from "@/types/event";

interface EventFormProps {
  onSubmit: (formData: {
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    guests: EventGuest[];
    isPrivate: boolean;
    password?: string;
  }) => void;
  onCancel: () => void;
}

export function EventForm({ onSubmit, onCancel }: EventFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [guests, setGuests] = useState<EventGuest[]>([]);
  const [isPrivate, setIsPrivate] = useState(false);
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      date,
      time,
      location,
      guests,
      isPrivate,
      ...(isPrivate && password ? { password } : {})
    });
  };

  const handleAddGuest = (guest: EventGuest) => {
    setGuests([...guests, guest]);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Event Title
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter event title"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              Description
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's the occasion?"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium mb-1">
                <CalendarDays className="w-4 h-4 inline-block mr-1" />
                Date
              </label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="time" className="block text-sm font-medium mb-1">
                <Clock className="w-4 h-4 inline-block mr-1" />
                Time
              </label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium mb-1">
              <MapPin className="w-4 h-4 inline-block mr-1" />
              Location
            </label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Where is it happening?"
              required
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Private Event</Label>
                <p className="text-sm text-muted-foreground">
                  Only invited guests can see this event
                </p>
              </div>
              <Switch
                checked={isPrivate}
                onCheckedChange={setIsPrivate}
              />
            </div>

            {isPrivate && (
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1">
                  <Lock className="w-4 h-4 inline-block mr-1" />
                  Event Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Optional: Set a password for uninvited guests"
                />
              </div>
            )}
          </div>
        </div>
      </Card>

      <GuestList guests={guests} onAddGuest={handleAddGuest} />

      <div className="flex gap-4">
        <Button type="submit" className="bg-primary">Create Event</Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}