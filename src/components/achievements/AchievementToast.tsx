import { Achievement } from "@/services/achievementService";
import { Toast } from "@/components/ui/toast";
import { Medal } from "lucide-react";

interface AchievementToastProps {
  achievement: Achievement;
}

export function AchievementToast({ achievement }: AchievementToastProps) {
  return (
    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-yellow-500/10 to-yellow-500/5 rounded-lg border border-yellow-500/20">
      <div className="text-3xl">{achievement.icon}</div>
      <div className="flex-1">
        <h3 className="font-semibold flex items-center gap-2">
          <Medal className="h-4 w-4 text-yellow-500" />
          {achievement.title}
        </h3>
        <p className="text-sm text-muted-foreground">{achievement.description}</p>
      </div>
    </div>
  );
}