import { Target, BookOpen, PenTool, CheckCircle, Flame, Trophy } from "lucide-react";

interface Challenge {
  id: number;
  title: string;
  description: string | null;
  type: string;
  targetValue: number;
  pointsReward: number;
  progress: {
    currentValue: number;
    targetValue: number;
    isCompleted: boolean;
    percentComplete: number;
  };
}

interface WeeklyChallengesProps {
  challenges: Challenge[];
  userStats?: {
    weeklyPoints: number;
    streakDays: number;
  };
}

const challengeIcons: Record<string, React.ReactNode> = {
  read_articles: <BookOpen className="w-5 h-5" />,
  complete_quizzes: <CheckCircle className="w-5 h-5" />,
  write_notes: <PenTool className="w-5 h-5" />,
  streak_days: <Flame className="w-5 h-5" />,
  default: <Target className="w-5 h-5" />,
};

const challengeLabels: Record<string, string> = {
  read_articles: "Makale Oku",
  complete_quizzes: "Quiz Tamamla",
  write_notes: "Not Yaz",
  streak_days: "Gün Serisi",
  default: "Görev",
};

export function WeeklyChallenges({ challenges, userStats }: WeeklyChallengesProps) {
  const completedCount = challenges.filter((c) => c.progress.isCompleted).length;
  const totalRewards = challenges
    .filter((c) => c.progress.isCompleted)
    .reduce((sum, c) => sum + c.pointsReward, 0);

  return (
    <div className="space-y-4">
      {/* Header Stats */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#1a1a1a] to-[#0d0d0d] rounded-lg border border-[#333]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#d4a574]" />
            <span className="text-sm text-[#999]">
              <span className="text-[#d4a574] font-semibold">{completedCount}</span>
              /{challenges.length} tamamlandı
            </span>
          </div>
          {userStats && (
            <div className="flex items-center gap-4 text-sm text-[#666]">
              <span>
                Haftalık: <span className="text-[#d4a574]">{userStats.weeklyPoints}</span> puan
              </span>
              {userStats.streakDays > 0 && (
                <span className="flex items-center gap-1">
                  <Flame className="w-4 h-4 text-orange-500" />
                  {userStats.streakDays} gün seri
                </span>
              )}
            </div>
          )}
        </div>
        <div className="text-sm">
          <span className="text-[#666]">Kazanılan: </span>
          <span className="text-[#d4a574] font-semibold">+{totalRewards}</span>
        </div>
      </div>

      {/* Challenges List */}
      <div className="grid gap-3">
        {challenges.map((challenge) => (
          <div
            key={challenge.id}
            className={`
              p-4 rounded-lg border transition-all duration-300
              ${
                challenge.progress.isCompleted
                  ? "bg-[#0e4429]/20 border-[#0e4429]/50"
                  : "bg-[#1a1a1a] border-[#333] hover:border-[#444]"
              }
            `}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div
                  className={`
                    p-2 rounded-lg
                    ${
                      challenge.progress.isCompleted
                        ? "bg-[#0e4429]/30 text-[#39d353]"
                        : "bg-[#262626] text-[#666]"
                    }
                  `}
                >
                  {challengeIcons[challenge.type] || challengeIcons.default}
                </div>
                <div>
                  <h4
                    className={`font-medium ${
                      challenge.progress.isCompleted
                        ? "text-[#39d353] line-through"
                        : "text-[#d4a574]"
                    }`}
                  >
                    {challenge.title}
                  </h4>
                  {challenge.description && (
                    <p className="text-xs text-[#666] mt-1">
                      {challenge.description}
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-2 text-xs">
                    <span className="text-[#666]">
                      {challengeLabels[challenge.type] || challengeLabels.default}
                    </span>
                    <span className="text-[#d4a574]">
                      +{challenge.pointsReward} puan
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm font-medium text-[#999]">
                  {challenge.progress.currentValue}/{challenge.targetValue}
                </div>
                {challenge.progress.isCompleted ? (
                  <div className="text-xs text-[#39d353]">Tamamlandı!</div>
                ) : (
                  <div className="text-xs text-[#666]">
                    %{challenge.progress.percentComplete}
                  </div>
                )}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-3">
              <div className="h-1.5 bg-[#0d0d0d] rounded-full overflow-hidden">
                <div
                  className={`
                    h-full transition-all duration-500 rounded-full
                    ${
                      challenge.progress.isCompleted
                        ? "bg-[#39d353]"
                        : "bg-gradient-to-r from-[#d4a574] to-[#e8c547]"
                    }
                  `}
                  style={{ width: `${challenge.progress.percentComplete}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {challenges.length === 0 && (
        <div className="text-center py-8 text-[#666]">
          <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Bu hafta için aktif görev bulunmuyor.</p>
        </div>
      )}
    </div>
  );
}
