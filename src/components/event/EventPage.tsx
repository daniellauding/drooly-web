import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "lucide-react";
import { MapPin } from "lucide-react";
import { GuestList } from "./GuestList";
import { EventMenu } from "./EventMenu";
import { EventDiscussion } from "./EventDiscussion";
import { EventTimeline } from "./EventTimeline";

interface EventPageProps {
  id?: string;
}

export function EventPage({ id }: EventPageProps) {
  const [title, setTitle] = useState("Potluck Dinner Party");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("June 20, 2024");
  const [time, setTime] = useState("7:00 PM");
  const [location, setLocation] = useState({
    name: "1 Nevern Square",
    address: "1 Nevern Square, London SW5 9NW, UK"
  });

  const guests = [
    { 
      name: "Flavien",
      status: "coming",
      plusOne: false,
      dietaryRestrictions: "",
      cooking: "Rhubarb & Cherry Crumble"
    },
    {
      name: "Xenia",
      status: "coming",
      plusOne: true,
      dietaryRestrictions: "",
      cooking: "Apple & Fennel Salad"
    },
    {
      name: "William K",
      status: "pending",
      plusOne: false,
      dietaryRestrictions: "",
      cooking: "Chocolate Tart"
    },
    {
      name: "Shivani",
      status: "coming",
      plusOne: false,
      dietaryRestrictions: "",
      cooking: "Japanese Curry"
    },
    {
      name: "Andreas & Jodie",
      status: "coming",
      plusOne: true,
      dietaryRestrictions: "Gluten",
      cooking: ""
    }
  ];

  const dishes = [
    {
      name: "Rhubarb & Cherry Crumble",
      assignedTo: "Flavien",
      ingredients: ["Rhubarb", "Cherries", "Flour", "Butter", "Sugar"]
    },
    {
      name: "Japanese Curry",
      assignedTo: "Shivani",
      ingredients: ["Chicken", "Curry Roux", "Potatoes", "Carrots"],
      notes: "Don't make it too spicy!"
    },
    {
      name: "Chocolate Tart",
      assignedTo: "William K",
      ingredients: ["Chocolate", "Cream", "Butter", "Flour"],
      notes: "Make berry compote to top off"
    },
    {
      name: "Apple & Fennel Salad",
      assignedTo: "Xenia",
      ingredients: ["Apple", "Fennel", "Radish", "Herbs", "Olive Oil"]
    }
  ];

  const messages = [
    {
      id: "1",
      sender: "Flavien",
      text: "I'll bring some wine too!",
      timestamp: new Date()
    },
    {
      id: "2",
      sender: "Xenia",
      text: "Great! I can help with setup if needed",
      timestamp: new Date()
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div className="space-y-6">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-4xl font-bold border-none px-0 focus-visible:ring-0"
          placeholder="Event Title"
        />

        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="text-lg text-muted-foreground resize-none border-none px-0 focus-visible:ring-0"
          placeholder="Add a description..."
        />
      </div>

      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-2 text-lg">
          <Calendar className="h-5 w-5" />
          <span className="font-medium">When?</span>
        </div>
        <div className="pl-7">
          <p className="text-lg">{date} {time}</p>
          <p className="text-muted-foreground mt-2">
            Feel free to arrive early and help in the kitchen, wine in hand 😉
          </p>
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-2 text-lg">
          <MapPin className="h-5 w-5" />
          <span className="font-medium">Where?</span>
        </div>
        <div className="pl-7">
          <p className="text-lg">{location.name}</p>
          <p className="text-muted-foreground">{location.address}</p>
          <div className="mt-4 aspect-video w-full rounded-lg overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2484.1463405825873!2d-0.1946371!3d51.4923031!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48760f8c2f71b8e9%3A0x61e05540751c6c80!2s1%20Nevern%20Square%2C%20London%20SW5%209NW!5e0!3m2!1sen!2suk!4v1648132442642!5m2!1sen!2suk"
              className="w-full h-full border-0"
              loading="lazy"
            />
          </div>
        </div>
      </Card>

      <GuestList guests={guests} />
      
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">What's cooking?</h2>
        <EventMenu dishes={dishes} />
      </div>

      <EventDiscussion messages={messages} />

      <EventTimeline 
        events={[
          {
            id: "1",
            time: "10:30 AM",
            description: "Flavien suggested Rhubarb & Cherry Crumble",
            user: "Flavien",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80"
          }
        ]} 
      />
    </div>
  );
}