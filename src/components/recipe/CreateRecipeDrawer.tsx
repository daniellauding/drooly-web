import { CreateOptions } from "@/components/create/CreateOptions";

export function CreateRecipeDrawer() {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Create Something Amazing</h2>
      <CreateOptions />
    </div>
  );
}