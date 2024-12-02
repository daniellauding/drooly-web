import { CreateOptions } from "@/components/create/CreateOptions";

export function CreateRecipeDrawer() {
  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold">Create Something Amazing</h2>
      <CreateOptions />
    </div>
  );
}