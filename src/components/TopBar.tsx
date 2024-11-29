import { Link } from "react-router-dom";

export function TopBar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <Link to="/" className="text-lg font-bold">
          Drooly
        </Link>
        <nav className="flex items-center space-x-4">
          <Link to="/about" className="text-sm text-muted-foreground">About</Link>
          <Link to="/settings" className="text-sm text-muted-foreground">Settings</Link>
          <Link to="/login" className="text-sm text-muted-foreground">Login</Link>
          <Link to="/signup" className="text-sm text-muted-foreground">Sign Up</Link>
        </nav>
      </div>
    </header>
  );
}