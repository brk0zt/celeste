import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import { useBadges } from '@/hooks/useBadges';
import { useBlogposts } from '@/hooks/useBlogposts';
import { trpc } from '@/providers/trpc';

const BADGE_ICONS: Record<string, string> = {
  rocket: '🚀',
  book: '📚',
  flask: '🧪',
  star: '⭐',
  pen: '✍️',
  moon: '🌙',
};

export default function Profile() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth({ redirectOnUnauthenticated: true });
  const { userBadges, badges, isLoading: badgesLoading } = useBadges();
  const { blogposts } = useBlogposts();
  const [activeTab, setActiveTab] = useState<'overview' | 'badges' | 'content'>('overview');
  const [bio, setBio] = useState('');
  const [editingBio, setEditingBio] = useState(false);

  const utils = trpc.useUtils();
  const updateBioMutation = trpc.auth.updateBio.useMutation({
    onSuccess: () => {
      utils.auth.me.invalidate();
    },
  });

  useEffect(() => {
    if (user?.bio) {
      setBio(user.bio);
    }
  }, [user?.bio]);

  const handleSaveBio = () => {
    updateBioMutation.mutate({ bio });
    setEditingBio(false);
  };

  const userPosts = blogposts.filter((p) => p.authorId === user?.id);
  const { data: stats } = trpc.progress.stats.useQuery(undefined, { enabled: isAuthenticated });

  if (authLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#05050f]">
        <div className="text-[#555] text-sm">Yükleniyor...</div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#05050f]">
        <div className="text-center">
          <p className="text-[#555] text-sm mb-4">Lütfen önce giriş yapın</p>
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 text-xs rounded-lg bg-[#c8956c]/20 text-[#c8956c]"
          >
            Giriş Yap
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview' as const, label: 'Genel Bakış', icon: '◈' },
    { id: 'badges' as const, label: 'Rozetler', icon: '✦' },
    { id: 'content' as const, label: 'İçerik', icon: '◉' },
  ];

  return (
    <div className="min-h-screen bg-[#05050f]">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/[0.04]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/discover')}
            className="text-[10px] text-[#666] hover:text-[#aaa] transition-colors"
          >
            ← Galaksiyi Keşfet
          </button>
        </div>
        <button
          onClick={logout}
          className="text-[10px] text-[#555] hover:text-[#999] transition-colors"
        >
          Çıkış Yap
        </button>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Profile Header */}
        <div className="flex items-start gap-6 mb-8">
          <div className="relative">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name || ''}
                className="w-20 h-20 rounded-full border-2 border-[#c8956c]/20"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#1a1a3e] to-[#0a0a1e] border-2 border-[#c8956c]/20 flex items-center justify-center">
                <span className="text-2xl text-[#c8956c]">☾</span>
              </div>
            )}
            {/* Status indicator */}
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#05050f] flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
          </div>

          <div className="flex-1">
            <h1 className="text-xl text-[#e0e0e0] font-light mb-1">{user.name || 'Galaksi Kaşifi'}</h1>
            <p className="text-xs text-[#666] mb-2">{user.email || ''}</p>

            {editingBio ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs rounded-lg bg-white/[0.04] border border-white/[0.08] text-[#aaa] focus:outline-none focus:border-[#c8956c]/30"
                  placeholder="Kendin hakkında bir şeyler yaz..."
                  maxLength={200}
                />
                <button
                  onClick={handleSaveBio}
                  className="px-3 py-2 text-xs rounded-lg bg-[#c8956c]/20 text-[#c8956c] hover:bg-[#c8956c]/30 transition-colors"
                >
                  Kaydet
                </button>
                <button
                  onClick={() => setEditingBio(false)}
                  className="px-3 py-2 text-xs rounded-lg bg-white/[0.04] text-[#666] hover:bg-white/[0.08] transition-colors"
                >
                  İptal
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <p className="text-xs text-[#888] max-w-md">{bio || 'Henüz biyografi yok...'}</p>
                <button
                  onClick={() => setEditingBio(true)}
                  className="text-[10px] text-[#555] hover:text-[#c8956c] transition-colors"
                >
                  Düzenle
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Okunan Makale', value: stats?.completed ?? 0, icon: '✦' },
            { label: 'Devam Eden', value: stats?.inProgress ?? 0, icon: '◈' },
            { label: 'Yayınlanan', value: userPosts.length, icon: '◉' },
            { label: 'Kazanılan Rozet', value: userBadges.length, icon: '✶' },
          ].map((stat, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition-colors text-center"
            >
              <div className="text-lg text-[#c8956c] mb-1">{stat.icon}</div>
              <div className="text-xl text-[#e0e0e0] font-light">{stat.value}</div>
              <div className="text-[10px] text-[#666]">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 p-1 rounded-xl bg-white/[0.02] border border-white/[0.04]">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs rounded-lg transition-all ${
                activeTab === tab.id
                  ? 'bg-[#c8956c]/15 text-[#c8956c]'
                  : 'text-[#666] hover:text-[#888] hover:bg-white/[0.02]'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="min-h-[300px]">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Recent Progress */}
              <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <h3 className="text-xs text-[#aaa] mb-3">Okuma İlerlemesi</h3>
                <div className="space-y-3">
                  {blogposts.slice(0, 5).map((post) => {
                    const progress = Math.random() * 100; // Simulated - would come from actual progress data
                    return (
                      <div key={post.id} className="flex items-center gap-3">
                        <span className="text-[10px] text-[#666] w-24 truncate">{post.title}</span>
                        <div className="flex-1 h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                          <div
                            className="h-full rounded-full bg-[#c8956c]/50 transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="text-[9px] text-[#555] w-8 text-right">{Math.round(progress)}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recent Badges */}
              <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <h3 className="text-xs text-[#aaa] mb-3">Son Kazanılan</h3>
                <div className="flex gap-3 flex-wrap">
                  {userBadges.slice(0, 4).map((badge) => (
                    <div
                      key={badge.id}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06]"
                    >
                      <span className="text-sm">{BADGE_ICONS[badge.icon || 'star'] || '✦'}</span>
                      <div>
                        <div className="text-[10px] text-[#aaa]">{badge.name}</div>
                        <div className="text-[9px] text-[#555]">
                          {new Date(badge.awardedAt).toLocaleDateString('tr-TR')}
                        </div>
                      </div>
                    </div>
                  ))}
                  {userBadges.length === 0 && (
                    <p className="text-[10px] text-[#555]">Henüz rozet kazanılmadı, keşfetmeye başla!</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'badges' && (
            <div>
              {badgesLoading ? (
                <div className="text-center py-8 text-[#555] text-xs">Rozetler yükleniyor...</div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {badges.map((badge) => {
                    const hasBadge = userBadges.some((ub) => ub.id === badge.id);
                    return (
                      <div
                        key={badge.id}
                        className={`relative p-5 rounded-xl border transition-all ${
                          hasBadge
                            ? 'bg-white/[0.04] border-[#c8956c]/20'
                            : 'bg-white/[0.02] border-white/[0.04] opacity-50'
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                            style={{
                              background: hasBadge
                                ? `linear-gradient(135deg, ${badge.color || '#c8956c'}20, ${badge.color || '#c8956c'}10)`
                                : 'rgba(255,255,255,0.02)',
                              border: `1px solid ${hasBadge ? (badge.color || '#c8956c') + '40' : 'rgba(255,255,255,0.04)'}`,
                            }}
                          >
                            {BADGE_ICONS[badge.icon || 'star'] || '✦'}
                          </div>
                          <div>
                            <h4 className="text-xs text-[#aaa]">{badge.name}</h4>
                            <p className="text-[9px] text-[#555]">{badge.description}</p>
                          </div>
                        </div>
                        {hasBadge && (
                          <div className="absolute top-2 right-2">
                            <span className="text-[10px] text-[#c8956c]">✓ Kazanıldı</span>
                          </div>
                        )}
                        <div className="mt-2 text-[9px] text-[#444]">
                          Koşul: {badge.requirement || 'Keşifte'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'content' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs text-[#aaa]">Yayınlarım</h3>
                <button
                  onClick={() => navigate('/discover')}
                  className="px-3 py-1.5 text-[10px] rounded-lg bg-[#c8956c]/20 text-[#c8956c] hover:bg-[#c8956c]/30 transition-colors"
                >
                  + Yeni İçerik
                </button>
              </div>

              {userPosts.length > 0 ? (
                userPosts.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => navigate(`/blog/${post.id}`)}
                    className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] hover:border-white/[0.08] transition-all cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#1a1a3e] to-[#0a0a1e] flex items-center justify-center text-[#c8956c]/50 text-lg">
                      ◈
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xs text-[#aaa] mb-1">{post.title}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] text-[#555]">{post.category || 'Kategorisiz'}</span>
                        <span className="text-[9px] text-[#444]">·</span>
                        <span className="text-[9px] text-[#555]">{post.readTime || 5} dk</span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {post.tags?.slice(0, 2).map((tag, i) => (
                        <span key={i} className="text-[9px] text-[#555] px-1.5 py-0.5 rounded bg-white/[0.03]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-xs text-[#555] mb-4">Henüz yayınlanan içerik yok</p>
                  <button
                    onClick={() => navigate('/discover')}
                    className="px-4 py-2 text-xs rounded-lg bg-[#c8956c]/20 text-[#c8956c] hover:bg-[#c8956c]/30 transition-colors"
                  >
                    Oluştur
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
