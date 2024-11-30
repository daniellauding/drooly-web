import { TopBar } from "@/components/TopBar";
import EventPage from "@/components/event/EventPage";

export default function PlanTogether() {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <div className="container mx-auto pt-20">
        <EventPage />
      </div>
    </div>
  );
}