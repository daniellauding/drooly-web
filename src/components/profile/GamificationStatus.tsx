import { Trophy, Star, Users, ChefHat } from "lucide-react";
import { useGamification } from "@/hooks/useGamification";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function GamificationStatus() {
  const { achievements, stats, isLoading } = useGamification();

  if (isLoading) {
    return <Skeleton className="w-full h-32" />;
  }

  if (!stats) return null;

  const levelProgress = ((stats.totalRecipes + stats.followersCount) % 5) / 5 * 100;

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold">Level {stats.level}</h3>
            <p className="text-muted-foreground">Chef Status</p>
          </div>
          <ChefHat className="h-8 w-8 text-primary" />
        </div>
        <Progress value={levelProgress} className="h-2" />
        <p className="text-sm text-muted-foreground mt-2">
          {5 - ((stats.totalRecipes + stats.followersCount) % 5)} more to next level
        </p>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <div>
              <p className="font-medium">{stats.completedAchievements}/{stats.totalAchievements}</p>
              <p className="text-sm text-muted-foreground">Achievements</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-blue-500" />
            <div>
              <p className="font-medium">{stats.totalRecipes}</p>
              <p className="text-sm text-muted-foreground">Recipes Created</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-green-500" />
            <div>
              <p className="font-medium">{stats.followersCount}</p>
              <p className="text-sm text-muted-foreground">Followers</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((achievement) => (
          <Card key={achievement.id} className="p-4">
            <div className="flex items-start gap-3">
              <div className="text-2xl">{achievement.icon}</div>
              <div>
                <h4 className="font-medium">{achievement.title}</h4>
                <p className="text-sm text-muted-foreground">{achievement.description}</p>
                <Progress 
                  value={(achievement.progress / achievement.maxProgress) * 100} 
                  className="h-1 mt-2"
                />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}