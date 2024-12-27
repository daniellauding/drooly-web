import { RegisterForm } from "@/components/RegisterForm";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F7F9FC]">
      <div className="w-full max-w-md space-y-4">
        <RegisterForm 
          onSignInClick={() => navigate('/login')}
        />
      </div>
    </div>
  );
}