import { Trophy, Medal, Award, Crown, Star, Target } from "lucide-react";

type League = "bronze" | "silver" | "gold" | "platinum" | "diamond" | "master";

interface LeagueBadgeProps {
  league: League;
  points?: number;
  rank?: number;
  showDetails?: boolean;
  size?: "sm" | "md" | "lg";
}

const leagueConfig: Record<
  League,
  {
    name: string;
    color: string;
    bgColor: string;
    borderColor: string;
    icon: React.ReactNode;
    description: string;
  }
> = {
  bronze: {
    name: "Bronz",
    color: "text-[#cd7f32]",
    bgColor: "bg-[#cd7f32]/10",
    borderColor: "border-[#cd7f32]/30",
    icon: <Target className="w-4 h-4" />,
    description: "Başlangıç seviyesi - Öğrenmeye devam et!",
  },
  silver: {
    name: "Gümüş",
    color: "text-[#c0c0c0]",
    bgColor: "bg-[#c0c0c0]/10",
    borderColor: "border-[#c0c0c0]/30",
    icon: <Medal className="w-4 h-4" />,
    description: "İlerleme kaydediyorsun - Böyle devam et!",
  },
  gold: {
    name: "Altın",
    color: "text-[#ffd700]",
    bgColor: "bg-[#ffd700]/10",
    borderColor: "border-[#ffd700]/30",
    icon: <Award className="w-4 h-4" />,
    description: "Mükemmel iş çıkarıyorsun!",
  },
  platinum: {
    name: "Platin",
    color: "text-[#e5e4e2]",
    bgColor: "bg-[#e5e4e2]/10",
    borderColor: "border-[#e5e4e2]/30",
    icon: <Star className="w-4 h-4" />,
    description: "Elit öğrenci seviyesi!",
  },
  diamond: {
    name: "Elmas",
    color: "text-[#b9f2ff]",
    bgColor: "bg-[#b9f2ff]/10",
    borderColor: "border-[#b9f2ff]/30",
    icon: <Trophy className="w-4 h-4" />,
    description: "Usta seviyesi - Harikasın!",
  },
  master: {
    name: "Usta",
    color: "text-[#ff6b6b]",
    bgColor: "bg-[#ff6b6b]/10",
    borderColor: "border-[#ff6b6b]/30",
    icon: <Crown className="w-4 h-4" />,
    description: "Efsanevi seviye - Sen bir star'sın!",
  },
};

export function LeagueBadge({
  league,
  points = 0,
  rank,
  showDetails = true,
  size = "md",
}: LeagueBadgeProps) {
  const config = leagueConfig[league];

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-2 text-sm",
    lg: "px-4 py-3 text-base",
  };

  return (
    <div
      className={`
        inline-flex flex-col rounded-lg border ${config.borderColor} ${config.bgColor}
        ${sizeClasses[size]}
      `}
    >
      <div className="flex items-center gap-2">
        <span className={config.color}>{config.icon}</span>
        <span className={`font-semibold ${config.color}`}>{config.name}</span>
        {rank && rank <= 5 && (
          <span className="text-xs bg-[#d4a574]/20 text-[#d4a574] px-1.5 py-0.5 rounded">
            #{rank}
          </span>
        )}
      </div>
      {showDetails && (
        <div className="mt-1 text-xs text-[#666]">
          <span>{points.toLocaleString()} puan</span>
        </div>
      )}
    </div>
  );
}

export function LeagueProgress({
  currentPoints,
  nextLeaguePoints,
  currentLeague,
}: {
  currentPoints: number;
  nextLeaguePoints: number;
  currentLeague: League;
}) {
  const progress = Math.min(
    100,
    (currentPoints / nextLeaguePoints) * 100
  );

  const nextLeague: Record<League, League | null> = {
    bronze: "silver",
    silver: "gold",
    gold: "platinum",
    platinum: "diamond",
    diamond: "master",
    master: null,
  };

  const next = nextLeague[currentLeague];

  if (!next) {
    return (
      <div className="text-sm text-[#d4a574]">
        🎉 Maksimum seviyeye ulaştın! Tebrikler!
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs text-[#666]">
        <span>{currentPoints.toLocaleString()} puan</span>
        <span>
          Sonraki: {leagueConfig[next].name} ({nextLeaguePoints.toLocaleString()}{" "}
          puan)
        </span>
      </div>
      <div className="h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#d4a574] to-[#e8c547] transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-xs text-[#666]">
        Bir sonraki lig için{" "}
        <span className="text-[#d4a574]">
          {(nextLeaguePoints - currentPoints).toLocaleString()}
        </span>{" "}
        puan daha kazanmalısın
      </p>
    </div>
  );
}
