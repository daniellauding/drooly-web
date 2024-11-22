import { Search } from "lucide-react";
import { Input } from "./ui/input";

export function TopBar() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-xl border-b border-white/10">
      <div className="flex items-center gap-4 px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-500 p-[2px] animate-pulse">
            <div className="h-full w-full bg-black rounded-xl flex items-center justify-center">
              <img src="/lovable-uploads/e7734f7b-7b98-4c29-9f0f-1cd60bacbfac.png" alt="Recipe App" className="h-6 w-6" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            Cyber Kitchen
          </h1>
        </div>
        <div className="relative flex-1 max-w-md ml-auto">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-purple-300" />
          <Input 
            className="pl-9 bg-white/5 border-purple-500/30 rounded-2xl text-white placeholder:text-purple-300"
            placeholder="Search the matrix..." 
          />
        </div>
      </div>
    </div>
  );
}