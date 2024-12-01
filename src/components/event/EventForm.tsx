import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { CalendarDays, Clock, MapPin, Lock, Eye, ImageIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { GuestList } from "./GuestList";
import { ImageUpload } from "../ImageUpload";
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
    isHidden: boolean;
    password?: string;
    coverImage?: string;
  }) => void;
  onCancel: () => void;
  initialData?: any;
}

export function EventForm({ onSubmit, onCancel, initialData }: EventFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [guests, setGuests] = useState<EventGuest[]>([]);
  const [isPrivate, setIsPrivate] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [password, setPassword] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [featuredImageIndex] = useState(0);

  // Load initial data if provided (edit mode)
  useEffect(() => {
    if (initialData) {
      console.log("Loading initial event data:", initialData);
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
      setDate(initialData.date || "");
      setTime(initialData.time || "");
      setLocation(initialData.location?.name || "");
      setGuests(initialData.guests || []);
      setIsPrivate(initialData.isPrivate || false);
      setIsHidden(initialData.isHidden || false);
      setPassword(initialData.password || "");
      setImages(initialData.coverImage ? [initialData.coverImage] : []);
    }
  }, [initialData]);

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
      isHidden,
      ...(isPrivate && password ? { password } : {}),
      ...(images.length > 0 ? { coverImage: images[0] } : {})
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="coverImage" className="block text-sm font-medium mb-1">
              <ImageIcon className="w-4 h-4 inline-block mr-1" />
              Cover Image
            </label>
            <ImageUpload
              images={images}
              featuredImageIndex={featuredImageIndex}
              onChange={(newImages) => setImages(newImages)}
            />
          </div>

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
                  Require a password to access this event
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
                  placeholder="Set a password for uninvited guests"
                  required={isPrivate}
                />
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Hidden Event</Label>
                <p className="text-sm text-muted-foreground">
                  Hide this event from public listings
                </p>
              </div>
              <Switch
                checked={isHidden}
                onCheckedChange={setIsHidden}
              />
            </div>
          </div>
        </div>
      </Card>

      <GuestList guests={guests} onAddGuest={(guest) => setGuests([...guests, guest])} />

      <div className="flex gap-4">
        <Button type="submit">
          {initialData ? "Update Event" : "Create Event"}
        </Button>
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