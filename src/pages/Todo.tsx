import { TopBar } from "@/components/TopBar";
import { TodoView } from "@/components/todo/TodoView";

export default function Todo() {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <main className="container mx-auto px-4 py-8">
        <TodoView />
      </main>
    </div>
  );
}