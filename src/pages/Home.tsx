import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@/hooks/useAuth';

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  twinkleSpeed: number;
  twinklePhase: number;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  opacity: number;
  life: number;
}

export default function Home() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const shootingStarsRef = useRef<ShootingStar[]>([]);
  const animationRef = useRef<number>(0);
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Initialize stars
    const starCount = 300;
    starsRef.current = Array.from({ length: starCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 1.4 + 0.35,
      opacity: Math.random() * 0.8 + 0.2,
      speed: Math.random() * 0.02 + 0.005,
      twinkleSpeed: Math.random() * 0.03 + 0.01,
      twinklePhase: Math.random() * Math.PI * 2,
    }));

    // Create shooting star occasionally
    const createShootingStar = () => {
      if (shootingStarsRef.current.length < 3 && Math.random() < 0.01) {
        shootingStarsRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height * 0.5,
          length: Math.random() * 80 + 40,
          speed: Math.random() * 8 + 4,
          angle: Math.random() * Math.PI * 0.3 + Math.PI * 0.1,
          opacity: 1,
          life: 1,
        });
      }
    };

    const animate = () => {
      ctx.fillStyle = 'rgba(5, 5, 15, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw nebula-like background glow
      const gradient = ctx.createRadialGradient(
        canvas.width * 0.3, canvas.height * 0.4, 0,
        canvas.width * 0.3, canvas.height * 0.4, canvas.width * 0.6
      );
      gradient.addColorStop(0, 'rgba(25, 20, 60, 0.08)');
      gradient.addColorStop(0.5, 'rgba(15, 10, 40, 0.04)');
      gradient.addColorStop(1, 'rgba(5, 5, 15, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw stars
      starsRef.current.forEach((star) => {
        star.twinklePhase += star.twinkleSpeed;
        const twinkle = Math.sin(star.twinklePhase) * 0.5 + 0.5;
        const currentOpacity = star.opacity * (0.5 + twinkle * 0.5);

        // Star glow
        const glowGradient = ctx.createRadialGradient(
          star.x, star.y, 0,
          star.x, star.y, star.size * 4
        );
        glowGradient.addColorStop(0, `rgba(200, 210, 255, ${currentOpacity * 0.3})`);
        glowGradient.addColorStop(1, 'rgba(200, 210, 255, 0)');
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * 4, 0, Math.PI * 2);
        ctx.fill();

        // Star core
        ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw shooting stars
      createShootingStar();
      shootingStarsRef.current = shootingStarsRef.current.filter((ss) => {
        ss.x += Math.cos(ss.angle) * ss.speed;
        ss.y += Math.sin(ss.angle) * ss.speed;
        ss.life -= 0.015;
        ss.opacity = ss.life;

        if (ss.life <= 0) return false;

        // Draw shooting star trail
        const tailX = ss.x - Math.cos(ss.angle) * ss.length;
        const tailY = ss.y - Math.sin(ss.angle) * ss.length;
        const trailGradient = ctx.createLinearGradient(ss.x, ss.y, tailX, tailY);
        trailGradient.addColorStop(0, `rgba(255, 255, 255, ${ss.opacity})`);
        trailGradient.addColorStop(0.3, `rgba(200, 210, 255, ${ss.opacity * 0.6})`);
        trailGradient.addColorStop(1, 'rgba(200, 210, 255, 0)');

        ctx.strokeStyle = trailGradient;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();

        // Head glow
        ctx.fillStyle = `rgba(255, 255, 255, ${ss.opacity})`;
        ctx.beginPath();
        ctx.arc(ss.x, ss.y, 2, 0, Math.PI * 2);
        ctx.fill();

        return true;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const features = [
    {
      title: "Galaksi Keşfi",
      desc: "Bilgi galaksisinde harika içerikler keşfedin",
      icon: "✦",
      action: () => navigate('/discover'),
    },
    {
      title: "LLM Notları",
      desc: "Obsidian tarzı notlarla bilgi haritası oluşturun",
      icon: "◈",
      action: () => navigate('/notes'),
    },
    {
      title: "Sanal Deneyler",
      desc: "Elinizle uygulayın, temel kavramları derinlemesine anlayın",
      icon: "◇",
      action: () => navigate('/discover'),
    },
    {
      title: "Başarı Rozetleri",
      desc: "Rozetleri toplayın, öğrenme yolculuğunuzu kaydedin",
      icon: "✶",
      action: () => isAuthenticated ? navigate('/profile') : navigate('/login'),
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#05050f]">
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full"
        style={{ background: 'radial-gradient(ellipse at 30% 40%, #0f0f2e 0%, #05050f 50%, #020205 100%)' }}
      />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-300/30 to-amber-600/20 border border-amber-400/30 flex items-center justify-center">
              <span className="text-amber-300 text-sm">☾</span>
            </div>
            <span className="text-[#c8956c] text-sm font-medium tracking-wider">brk0zt</span>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated && user ? (
              <>
                <button
                  onClick={() => navigate('/profile')}
                  className="flex items-center gap-2 text-xs text-[#888] hover:text-[#c8956c] transition-colors"
                >
                  <span>{user.name || 'Kaşif'}</span>
                  {user.avatar && (
                    <img src={user.avatar} alt="" className="w-6 h-6 rounded-full" />
                  )}
                </button>
                <button
                  onClick={() => navigate('/discover')}
                  className="px-4 py-2 text-xs rounded-lg bg-[#c8956c]/20 text-[#c8956c] hover:bg-[#c8956c]/30 transition-colors border border-[#c8956c]/30"
                >
                  Keşfe Başla
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 text-xs rounded-lg bg-[#c8956c]/20 text-[#c8956c] hover:bg-[#c8956c]/30 transition-colors border border-[#c8956c]/30"
              >
                Giriş Yap
              </button>
            )}
          </div>
        </header>

        {/* Hero */}
        <main className="flex-1 flex flex-col items-center justify-center px-8 py-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            {/* Moon icon */}
            <div className="mb-8 inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-b from-[#1a1a3e] to-[#0a0a1e] border border-[#c8956c]/20 shadow-[0_0_60px_rgba(200,149,108,0.15)]">
              <span className="text-4xl text-[#c8956c]">☾</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-light text-[#e0e0e0] mb-4 tracking-wide">
              Bilgi <span className="text-[#c8956c]">Galaksisi</span>
            </h1>
            <p className="text-sm md:text-base text-[#888] mb-2 leading-relaxed">
              Uçsuz bucaksız içerik evreninde, her blog parıldayan bir yıldızdır
            </p>
            <p className="text-xs text-[#666] mb-8">
              Keşfet · Oku · Dene · Geliş
            </p>

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => navigate('/discover')}
                className="px-8 py-3 text-sm rounded-xl bg-[#c8956c]/20 text-[#c8956c] hover:bg-[#c8956c]/30 transition-all border border-[#c8956c]/30 hover:shadow-[0_0_20px_rgba(200,149,108,0.2)]"
              >
                Galaksiyi Keşfet
              </button>
              {!isAuthenticated && (
                <button
                  onClick={() => navigate('/login')}
                  className="px-8 py-3 text-sm rounded-xl bg-white/[0.04] text-[#888] hover:bg-white/[0.08] hover:text-[#aaa] transition-all border border-white/[0.06]"
                >
                  Yolculuğa Katıl
                </button>
              )}
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl w-full">
            {features.map((feature, i) => (
              <button
                key={i}
                onClick={feature.action}
                onMouseEnter={() => setHoveredFeature(i)}
                onMouseLeave={() => setHoveredFeature(null)}
                className={`group relative p-6 rounded-xl border transition-all duration-500 text-left ${
                  hoveredFeature === i
                    ? 'bg-white/[0.06] border-[#c8956c]/30 shadow-[0_0_30px_rgba(200,149,108,0.1)] scale-105'
                    : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]'
                }`}
              >
                <div className={`text-2xl mb-3 transition-colors duration-300 ${
                  hoveredFeature === i ? 'text-[#c8956c]' : 'text-[#555]'
                }`}>
                  {feature.icon}
                </div>
                <h3 className="text-xs font-medium text-[#aaa] mb-1">{feature.title}</h3>
                <p className="text-[10px] text-[#666] leading-relaxed">{feature.desc}</p>
                {/* Dot stars around card */}
                {hoveredFeature === i && (
                  <div className="absolute -inset-1 pointer-events-none">
                    {Array.from({ length: 6 }).map((_, j) => (
                      <div
                        key={j}
                        className="absolute w-1 h-1 rounded-full bg-[#c8956c]/60 animate-pulse"
                        style={{
                          top: `${Math.random() * 100}%`,
                          left: `${Math.random() * 100}%`,
                          animationDelay: `${j * 0.2}s`,
                        }}
                      />
                    ))}
                  </div>
                )}
              </button>
            ))}
          </div>
        </main>

        {/* Footer */}
        <footer className="px-8 py-6 text-center">
          <p className="text-[10px] text-[#444]">Ay Notu — Bilgi galaksisinde yol al</p>
        </footer>
      </div>
    </div>
  );
}
