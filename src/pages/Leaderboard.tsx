import { useState } from 'react';
import { useNavigate } from 'react-router';
import { trpc } from '@/providers/trpc';
import { LeagueBadge } from '@/components/LeagueBadge';
import { Trophy, Medal, Crown, Flame, TrendingUp, Target, ChevronLeft, ChevronRight } from 'lucide-react';

type League = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'master';

const LEAGUES: { id: League; name: string; color: string; minPoints: number }[] = [
  { id: 'bronze', name: 'Bronz', color: '#cd7f32', minPoints: 0 },
  { id: 'silver', name: 'Gümüş', color: '#c0c0c0', minPoints: 1000 },
  { id: 'gold', name: 'Altın', color: '#ffd700', minPoints: 2500 },
  { id: 'platinum', name: 'Platin', color: '#e5e4e2', minPoints: 5000 },
  { id: 'diamond', name: 'Elmas', color: '#b9f2ff', minPoints: 10000 },
  { id: 'master', name: 'Usta', color: '#ff6b6b', minPoints: 20000 },
];

const RANK_ICONS: Record<number, React.ReactNode> = {
  1: <Crown className="w-5 h-5 text-yellow-400" />,
  2: <Medal className="w-5 h-5 text-gray-300" />,
  3: <Medal className="w-5 h-5 text-orange-400" />,
};

export default function Leaderboard() {
  const navigate = useNavigate();
  const [selectedLeague, setSelectedLeague] = useState<League | 'all'>('all');
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('week');

  // Get leaderboard data
  const { data: leaderboard, isLoading } = trpc.activity.getLeagueLeaderboard.useQuery(
    undefined,
    { enabled: true }
  );

  // Get current user stats
  const { data: userStats } = trpc.activity.getUserStats.useQuery();

  // Filter by league
  const filteredData = leaderboard?.filter((user) => {
    if (selectedLeague === 'all') return true;
    // Note: The API returns users from the same league as current user
    // For global leaderboard, we'd need a different endpoint
    return true;
  }) || [];

  return (
    <div className="min-h-screen bg-[#05050f]">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/[0.04]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/discover')}
            className="text-[10px] text-[#666] hover:text-[#aaa] transition-colors"
          >
            ← Keşfet
          </button>
        </div>
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-[#d4a574]" />
          <h1 className="text-sm text-[#e0e0e0]">Sıralama</h1>
        </div>
        <div className="w-16" /> {/* Spacer for centering */}
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Current User Stats Card */}
        {userStats && (
          <div className="mb-8 p-6 rounded-xl bg-gradient-to-r from-[#1a1a1a] to-[#0d0d0d] border border-[#333]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#d4a574]/20 to-[#c8956c]/10 border-2 border-[#d4a574]/30 flex items-center justify-center">
                    <span className="text-2xl">☾</span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-[#d4a574] text-[10px] font-bold text-[#05050f]">
                    #{leaderboard?.find(u => u.isCurrentUser)?.rank || '?'}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-[#666] mb-1">Senin Sıralaman</div>
                  <LeagueBadge
                    league={userStats.league}
                    points={userStats.leaguePoints}
                    size="md"
                  />
                </div>
              </div>

              <div className="flex gap-6 text-center">
                <div>
                  <div className="text-2xl font-light text-[#e0e0e0]">{userStats.weeklyPoints}</div>
                  <div className="text-[10px] text-[#666]">Haftalık Puan</div>
                </div>
                <div>
                  <div className="text-2xl font-light text-[#e0e0e0]">{userStats.currentStreak}</div>
                  <div className="text-[10px] text-[#666]">Gün Serisi</div>
                </div>
                <div>
                  <div className="text-2xl font-light text-[#e0e0e0]">{userStats.totalChallengesCompleted}</div>
                  <div className="text-[10px] text-[#666]">Görev</div>
                </div>
              </div>
            </div>

            {/* Progress to next league */}
            <div className="mt-4 pt-4 border-t border-[#333]">
              <div className="flex items-center justify-between text-xs text-[#666] mb-2">
                <span>Bir sonraki lige yükselmek için</span>
                <span className="text-[#d4a574]">
                  {userStats.leaguePoints} / {LEAGUES.find(l => l.id === userStats.league)?.minPoints || 0} puan
                </span>
              </div>
              <div className="h-2 bg-[#0a0a0a] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#d4a574] to-[#e8c547] rounded-full"
                  style={{ width: `${Math.min(100, (userStats.leaguePoints / (LEAGUES.find(l => l.id === userStats.league)?.minPoints || 1)) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          {/* League Filter */}
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedLeague('all')}
              className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                selectedLeague === 'all'
                  ? 'bg-[#d4a574]/20 text-[#d4a574]'
                  : 'bg-white/[0.04] text-[#666] hover:bg-white/[0.08]'
              }`}
            >
              Tümü
            </button>
            {LEAGUES.map((league) => (
              <button
                key={league.id}
                onClick={() => setSelectedLeague(league.id)}
                className={`px-3 py-1.5 text-xs rounded-lg transition-colors flex items-center gap-1.5 ${
                  selectedLeague === league.id
                    ? 'bg-white/[0.08] text-[#e0e0e0]'
                    : 'bg-white/[0.04] text-[#666] hover:bg-white/[0.08]'
                }`}
              >
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: league.color }}
                />
                {league.name}
              </button>
            ))}
          </div>

          {/* Time Range */}
          <div className="flex gap-1 p-1 rounded-lg bg-white/[0.04]">
            {[
              { id: 'week', label: 'Hafta' },
              { id: 'month', label: 'Ay' },
              { id: 'all', label: 'Tüm Zamanlar' },
            ].map((range) => (
              <button
                key={range.id}
                onClick={() => setTimeRange(range.id as any)}
                className={`px-3 py-1 text-xs rounded-md transition-colors ${
                  timeRange === range.id
                    ? 'bg-[#d4a574]/20 text-[#d4a574]'
                    : 'text-[#666] hover:text-[#888]'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="rounded-xl bg-white/[0.02] border border-white/[0.04] overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-white/[0.04] text-[10px] text-[#666] uppercase tracking-wider">
            <div className="col-span-1">#</div>
            <div className="col-span-5">Kullanıcı</div>
            <div className="col-span-2 text-center">Lig</div>
            <div className="col-span-2 text-center">Puan</div>
            <div className="col-span-2 text-center">Görev</div>
          </div>

          {/* Table Body */}
          {isLoading ? (
            <div className="py-12 text-center text-[#666]">Yükleniyor...</div>
          ) : filteredData.length > 0 ? (
            <div className="divide-y divide-white/[0.04]">
              {filteredData.map((user, index) => (
                <div
                  key={user.id}
                  className={`grid grid-cols-12 gap-4 px-6 py-4 items-center transition-colors ${
                    user.isCurrentUser
                      ? 'bg-[#d4a574]/10 border-l-2 border-l-[#d4a574]'
                      : 'hover:bg-white/[0.02]'
                  } ${index < 3 ? 'bg-gradient-to-r from-white/[0.02] to-transparent' : ''}`}
                >
                  {/* Rank */}
                  <div className="col-span-1 flex items-center justify-center">
                    {RANK_ICONS[user.rank] || (
                      <span className="text-xs text-[#666]">#{user.rank}</span>
                    )}
                  </div>

                  {/* User */}
                  <div className="col-span-5 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1a1a3e] to-[#0a0a1e] flex items-center justify-center text-[#c8956c]">
                      {user.avatar ? (
                        <img src={user.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <span className="text-sm">☾</span>
                      )}
                    </div>
                    <div>
                      <div className={`text-sm ${user.isCurrentUser ? 'text-[#d4a574]' : 'text-[#aaa]'}`}>
                        {user.name || 'Anonim'}
                      </div>
                      {user.isCurrentUser && (
                        <div className="text-[10px] text-[#d4a574]/70">Sen</div>
                      )}
                    </div>
                  </div>

                  {/* League */}
                  <div className="col-span-2 text-center">
                    <LeagueBadge
                      league={userStats?.league || 'bronze'}
                      points={user.leaguePoints}
                      showDetails={false}
                      size="sm"
                    />
                  </div>

                  {/* Weekly Points */}
                  <div className="col-span-2 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <TrendingUp className="w-3 h-3 text-[#d4a574]" />
                      <span className="text-sm text-[#e0e0e0] font-medium">
                        {user.weeklyPoints.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Challenges */}
                  <div className="col-span-2 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Target className="w-3 h-3 text-[#666]" />
                      <span className="text-sm text-[#888]">
                        {user.totalChallengesCompleted}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-[#666]">
              <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Henüz sıralama verisi bulunmuyor.</p>
            </div>
          )}
        </div>

        {/* Pagination or Load More */}
        {filteredData.length > 0 && (
          <div className="flex items-center justify-between mt-6 text-xs text-[#666]">
            <span>Toplam {filteredData.length} kullanıcı</span>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] transition-colors flex items-center gap-1">
                <ChevronLeft className="w-3 h-3" />
                Önceki
              </button>
              <button className="px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] transition-colors flex items-center gap-1">
                Sonraki
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-8 p-4 rounded-lg bg-white/[0.02] border border-white/[0.04] text-xs text-[#666]">
          <h4 className="text-[#aaa] mb-2 flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-500" />
            Lig Sistemi Nasıl Çalışır?
          </h4>
          <ul className="space-y-1 ml-5 list-disc">
            <li>Her hafta en çok puan toplayan kullanıcılar üst lige yükselir</li>
            <li>Haftalık görevleri tamamlayarak ekstra puan kazanabilirsin</li>
            <li>7+ gün aktif kalırsan "gün serisi" bonus puanı alırsın</li>
            <li>Altın lig ve üzeri kullanıcılar özel rozeter kazanır</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
