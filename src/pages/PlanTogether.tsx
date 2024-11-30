import { TopBar } from "@/components/TopBar";
import EventPage from "@/components/event/EventPage";

export default function PlanTogether() {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <main className="container max-w-6xl mx-auto px-4 py-6">
        <EventPage />
      </main>
    </div>
  );
}