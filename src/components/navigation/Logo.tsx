import { Link } from "react-router-dom";

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-3">
      <img 
        src="/lovable-uploads/e7734f7b-7b98-4c29-9f0f-1cd60bacbfac.png" 
        alt="Recipe App" 
        className="h-8 w-8" 
      />
      <h1 className="text-2xl font-bold text-[#2C3E50] hidden sm:block">
        Drooly
      </h1>
    </Link>
  );
}