import { TopBar } from "@/components/TopBar";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <main className="container mx-auto px-4 py-20 max-w-4xl">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-gray-900">About Droo.ly</h1>
            <p className="text-xl text-gray-600">
              Your personal recipe companion
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 mt-12">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800">Our Mission</h2>
              <p className="text-gray-600">
                We're on a mission to make cooking more accessible, enjoyable, and social. 
                Droo.ly helps you discover, create, and share recipes with friends and family.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800">What We Offer</h2>
              <ul className="space-y-2 text-gray-600">
                <li>• Create and share your favorite recipes</li>
                <li>• Plan meals with friends and family</li>
                <li>• Discover new recipes from our community</li>
                <li>• Organize your recipe collection</li>
              </ul>
            </div>
          </div>

          <div className="bg-gray-50 p-8 rounded-2xl mt-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Join Our Community</h2>
            <p className="text-gray-600">
              Whether you're a home cook or a professional chef, Droo.ly is the perfect place 
              to store your recipes, find inspiration, and connect with other food lovers.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}