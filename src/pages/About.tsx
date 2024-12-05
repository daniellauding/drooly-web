import { TopBar } from "@/components/TopBar";
import { useTranslation } from "react-i18next";

export default function About() {
  const { t } = useTranslation();
  console.log('Rendering About page with translations');

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <main className="container mx-auto px-4 py-20 max-w-4xl">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-gray-900">{t('about.title', 'About Droo.ly')}</h1>
            <p className="text-xl text-gray-600">
              {t('about.subtitle', 'Your personal recipe companion')}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 mt-12">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800">{t('about.mission.title', 'Our Mission')}</h2>
              <p className="text-gray-600">
                {t('about.mission.description', "We're on a mission to make cooking more accessible, enjoyable, and social. Droo.ly helps you discover, create, and share recipes with friends and family.")}
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800">{t('about.features.title', 'What We Offer')}</h2>
              <ul className="space-y-2 text-gray-600">
                <li>• {t('about.features.create', 'Create and share your favorite recipes')}</li>
                <li>• {t('about.features.plan', 'Plan meals with friends and family')}</li>
                <li>• {t('about.features.discover', 'Discover new recipes from our community')}</li>
                <li>• {t('about.features.organize', 'Organize your recipe collection')}</li>
              </ul>
            </div>
          </div>

          <div className="bg-gray-50 p-8 rounded-2xl mt-12">
            <h2 className="text-2xl font-semibold text-gray-800">{t('about.community.title', 'Join Our Community')}</h2>
            <p className="text-gray-600">
              {t('about.community.description', "Whether you're a home cook or a professional chef, Droo.ly is the perfect place to store your recipes, find inspiration, and connect with other food lovers.")}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}