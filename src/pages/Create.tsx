import { TopBar } from "@/components/TopBar";
import { CreateOptions } from "@/components/create/CreateOptions";

const Create = () => {
  return (
    <div className="min-h-screen pb-20">
      <TopBar />
      <div className="container max-w-4xl mx-auto p-4 space-y-6 mt-20">
        <h1 className="text-3xl font-bold text-center mb-8">Create Something Amazing</h1>
        <CreateOptions />
      </div>
    </div>
  );
};

export default Create;