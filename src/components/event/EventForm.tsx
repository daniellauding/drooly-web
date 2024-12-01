import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import { GuestList } from "./GuestList";
import { EventRecipeAssignment } from "./EventRecipeAssignment";
import { EventGuest, EventDish } from "@/types/event";
import { ImageUpload } from "@/components/ImageUpload";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface EventFormProps {
  onSubmit: (formData: any) => void;
  onCancel: () => void;
  initialData?: any;
}

export function EventForm({ onSubmit, onCancel, initialData }: EventFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [date, setDate] = useState(initialData?.date || "");
  const [time, setTime] = useState(initialData?.time || "");
  const [location, setLocation] = useState(initialData?.location?.name || "");
  const [guests, setGuests] = useState<EventGuest[]>(initialData?.guests || []);
  const [dishes, setDishes] = useState<EventDish[]>(initialData?.dishes || []);
  const [images, setImages] = useState<string[]>(initialData?.coverImage ? [initialData.coverImage] : []);
  const [featuredImageIndex, setFeaturedImageIndex] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      date,
      time,
      location,
      guests,
      dishes,
      coverImage: images[featuredImageIndex]
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Accordion type="single" collapsible defaultValue="basic-info" className="space-y-4">
        <AccordionItem value="cover-image" className="border rounded-lg">
          <AccordionTrigger className="px-4">Cover Image</AccordionTrigger>
          <AccordionContent className="p-4">
            <ImageUpload
              images={images}
              featuredImageIndex={featuredImageIndex}
              onChange={(newImages, newFeaturedIndex) => {
                setImages(newImages);
                setFeaturedImageIndex(newFeaturedIndex);
              }}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="basic-info" className="border rounded-lg">
          <AccordionTrigger className="px-4">Basic Information</AccordionTrigger>
          <AccordionContent className="p-4">
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
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <GuestList
        guests={guests}
        onAddGuest={(guest) => setGuests([...guests, guest])}
        onRemoveGuest={(guestId) => setGuests(guests.filter(g => g.id !== guestId))}
      />

      <EventRecipeAssignment
        dishes={dishes}
        onAddDish={(dish) => setDishes([...dishes, dish])}
      />

      <div className="flex gap-4">
        <Button type="submit">
          {initialData ? "Update Event" : "Create Event"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}