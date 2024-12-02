import { Home, Plus, ListTodo, PartyPopper, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CreateRecipeDrawer } from "@/components/recipe/CreateRecipeDrawer";

export function MobileNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t md:hidden">
      <div className="flex items-center justify-around p-2">
        <Link
          to="/"
          className={cn(
            "flex flex-col items-center p-2 text-muted-foreground",
            location.pathname === "/" && "text-primary"
          )}
        >
          <Home className="h-5 w-5" />
          <span className="text-xs">Home</span>
        </Link>

        <Sheet>
          <SheetTrigger asChild>
            <button className="flex flex-col items-center p-2 text-muted-foreground">
              <Plus className="h-5 w-5" />
              <span className="text-xs">Create</span>
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-fit max-h-[80vh]">
            <CreateRecipeDrawer />
          </SheetContent>
        </Sheet>

        <Link
          to="/events"
          className={cn(
            "flex flex-col items-center p-2 text-muted-foreground",
            location.pathname === "/events" && "text-primary"
          )}
        >
          <PartyPopper className="h-5 w-5" />
          <span className="text-xs">Events</span>
        </Link>

        <Link
          to="/todo"
          className={cn(
            "flex flex-col items-center p-2 text-muted-foreground",
            location.pathname === "/todo" && "text-primary"
          )}
        >
          <ListTodo className="h-5 w-5" />
          <span className="text-xs">Plan</span>
        </Link>

        <Link
          to="/profile"
          className={cn(
            "flex flex-col items-center p-2 text-muted-foreground",
            location.pathname === "/profile" && "text-primary"
          )}
        >
          <User className="h-5 w-5" />
          <span className="text-xs">Profile</span>
        </Link>
      </div>
    </nav>
  );
}