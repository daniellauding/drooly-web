import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2 } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, setDoc, deleteDoc, addDoc, Timestamp } from "firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

export function CustomTodoContent() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    if (user) {
      loadTodos();
    }
  }, [user]);

  const loadTodos = async () => {
    if (!user) return;
    try {
      const todosRef = collection(db, "users", user.uid, "todos");
      const querySnapshot = await getDocs(todosRef);
      const loadedTodos = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Todo[];

      setTodos(loadedTodos.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));
    } catch (error) {
      console.error("Error loading todos:", error);
      toast({
        title: "Error",
        description: "Failed to load your todos",
        variant: "destructive"
      });
    }
  };

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newTodo.trim()) return;

    try {
      const todosRef = collection(db, "users", user.uid, "todos");
      const newTodoDoc = await addDoc(todosRef, {
        text: newTodo.trim(),
        completed: false,
        createdAt: Timestamp.now()
      });

      setTodos(prev => [{
        id: newTodoDoc.id,
        text: newTodo.trim(),
        completed: false,
        createdAt: new Date()
      }, ...prev]);
      
      setNewTodo("");
    } catch (error) {
      console.error("Error adding todo:", error);
      toast({
        title: "Error",
        description: "Failed to add todo",
        variant: "destructive"
      });
    }
  };

  const toggleTodo = async (todoId: string) => {
    if (!user) return;
    
    try {
      const todoRef = doc(db, "users", user.uid, "todos", todoId);
      const updatedTodos = todos.map(todo => {
        if (todo.id === todoId) {
          return { ...todo, completed: !todo.completed };
        }
        return todo;
      });

      await setDoc(todoRef, {
        ...updatedTodos.find(t => t.id === todoId),
        completed: !todos.find(t => t.id === todoId)?.completed
      }, { merge: true });

      setTodos(updatedTodos);
    } catch (error) {
      console.error("Error toggling todo:", error);
      toast({
        title: "Error",
        description: "Failed to update todo",
        variant: "destructive"
      });
    }
  };

  const deleteTodo = async (todoId: string) => {
    if (!user) return;

    try {
      await deleteDoc(doc(db, "users", user.uid, "todos", todoId));
      setTodos(prev => prev.filter(todo => todo.id !== todoId));
    } catch (error) {
      console.error("Error deleting todo:", error);
      toast({
        title: "Error",
        description: "Failed to delete todo",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={addTodo} className="flex gap-2 mb-4">
        <Input
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new todo..."
          className="flex-1"
        />
        <Button type="submit">
          <Plus className="w-4 h-4" />
        </Button>
      </form>

      <div className="space-y-4">
        {todos.map((todo) => (
          <div key={todo.id}>
            <div className="flex items-center gap-4 py-2">
              <Checkbox
                checked={todo.completed}
                onCheckedChange={() => toggleTodo(todo.id)}
              />
              <span className={todo.completed ? "line-through text-muted-foreground" : ""}>
                {todo.text}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="ml-auto"
                onClick={() => deleteTodo(todo.id)}
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
            <Separator />
          </div>
        ))}
      </div>
    </Card>
  );
}