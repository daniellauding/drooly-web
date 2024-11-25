import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useToast } from "@/components/ui/use-toast";

interface AuthUser extends User {
  role?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const userData = userDoc.data();
        setUser({ ...user, role: userData?.role });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userData = userDoc.data();
      setUser({ ...user, role: userData?.I'll help create a basic backoffice interface. I'll implement the recipes and users management first, as those are the most critical features.

<lov-code>
First, let's create the backoffice pages and components:

<lov-write file_path="src/pages/Backoffice.tsx">
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { TopBar } from "@/components/TopBar";
import { BottomBar } from "@/components/BottomBar";
import { BackofficeUsers } from "@/components/backoffice/BackofficeUsers";
import { BackofficeRecipes } from "@/components/backoffice/BackofficeRecipes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

export default function Backoffice() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Check if user is admin
    const checkAdminStatus = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (!userDoc.exists() || userDoc.data().role !== 'admin') {
          toast({
            variant: "destructive",
            title: "Access Denied",
            description: "You don't have permission to access this page."
          });
          navigate('/');
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        navigate('/');
      }
    };

    checkAdminStatus();
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen pb-20">
      <TopBar />
      <main className="container py-6 px-4 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Backoffice</h1>
        
        <Tabs defaultValue="recipes" className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="recipes">Recipes</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>
          <TabsContent value="recipes" className="mt-6">
            <BackofficeRecipes />
          </TabsContent>
          <TabsContent value="users" className="mt-6">
            <BackofficeUsers />
          </TabsContent>
        </Tabs>
      </main>
      <BottomBar />
    </div>
  );
}