import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useBlogposts } from '@/hooks/useBlogposts';
import type { Blogpost } from '@/types';

interface DotStar {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  size: number;
  opacity: number;
  blogpostId: number;
  title: string;
  orbitAngle: number;
  orbitRadius: number;
  orbitSpeed: number;
}

export default function Discover() {
  const navigate = useNavigate();
  const { blogposts, isLoading } = useBlogposts();
  const leftCanvasRef = useRef<HTMLCanvasElement>(null);
  const dotStarsRef = useRef<DotStar[]>([]);
  const animationRef = useRef<number>(0);
  const [selectedPost, setSelectedPost] = useState<Blogpost | null>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [previewVideo, setPreviewVideo] = useState<number | null>(null);

  // Initialize dot stars based on blogposts
  useEffect(() => {
    if (blogposts.length === 0) return;
    const canvas = leftCanvasRef.current;
    if (!canvas) return;

    const centerX = canvas.width / 2 || window.innerWidth / 4;
    const centerY = canvas.height / 2 || window.innerHeight / 2;

    dotStarsRef.current = blogposts.map((post, i) => {
      const angle = (i / blogposts.length) * Math.PI * 2;
      const radius = 80 + Math.random() * 120;
      return {
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        targetX: centerX + Math.cos(angle) * radius,
        targetY: centerY + Math.sin(angle) * radius,
        size: 3 + Math.random() * 4,
        opacity: 0.6 + Math.random() * 0.4,
        blogpostId: Number(post.id),
        title: post.title,
        orbitAngle: angle,
        orbitRadius: radius,
        orbitSpeed: 0.0003 + Math.random() * 0.0005,
      };
    });
  }, [blogposts]);

  // Animate dot stars galaxy
  useEffect(() => {
    const canvas = leftCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };
    resize();
    window.addEventListener('resize', resize);

    const animate = () => {
      ctx.fillStyle = 'rgba(5, 5, 15, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Draw background nebula
      const nebula = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, canvas.width * 0.4);
      nebula.addColorStop(0, 'rgba(30, 25, 70, 0.06)');
      nebula.addColorStop(0.5, 'rgba(20, 15, 50, 0.03)');
      nebula.addColorStop(1, 'rgba(5, 5, 15, 0)');
      ctx.fillStyle = nebula;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw faint orbit rings
      ctx.strokeStyle = 'rgba(200, 149, 108, 0.03)';
      ctx.lineWidth = 1;
      for (let r = 60; r < 250; r += 40) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Update and draw dot stars
      dotStarsRef.current.forEach((star, i) => {
        star.orbitAngle += star.orbitSpeed;
        star.targetX = centerX + Math.cos(star.orbitAngle) * star.orbitRadius;
        star.targetY = centerY + Math.sin(star.orbitAngle) * star.orbitRadius;

        // Smooth lerp
        star.x += (star.targetX - star.x) * 0.05;
        star.y += (star.targetY - star.y) * 0.05;

        // Pulsing glow
        const pulse = Math.sin(Date.now() * 0.002 + i * 1.5) * 0.3 + 0.7;
        const isSelected = selectedPost?.id === String(star.blogpostId);
        const isHovered = hoveredCard === star.blogpostId;
        const glowSize = (isSelected ? 20 : isHovered ? 15 : 8) * pulse;
        const alpha = isSelected ? 0.8 : isHovered ? 0.6 : star.opacity * 0.5;

        // Outer glow
        const glow = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, glowSize);
        const color = isSelected ? '200, 149, 108' : isHovered ? '180, 200, 255' : '255, 255, 255';
        glow.addColorStop(0, `rgba(${color}, ${alpha})`);
        glow.addColorStop(0.5, `rgba(${color}, ${alpha * 0.3})`);
        glow.addColorStop(1, `rgba(${color}, 0)`);
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(star.x, star.y, glowSize, 0, Math.PI * 2);
        ctx.fill();

        // Core dot
        ctx.fillStyle = `rgba(${color}, ${isSelected ? 1 : 0.9})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * (isSelected ? 1.5 : 1), 0, Math.PI * 2);
        ctx.fill();

        // Draw connecting lines to nearby stars
        dotStarsRef.current.forEach((other, j) => {
          if (i >= j) return;
          const dx = other.x - star.x;
          const dy = other.y - star.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.strokeStyle = `rgba(200, 149, 108, ${0.05 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(star.x, star.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        });
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [selectedPost, hoveredCard]);

  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = leftCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Find closest dot star
    let closest: DotStar | null = null;
    let closestDist = Infinity;

    dotStarsRef.current.forEach((star) => {
      const dx = star.x - clickX;
      const dy = star.y - clickY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 30 && dist < closestDist) {
        closest = star;
        closestDist = dist;
      }
    });

    if (closest) {
      const post = blogposts.find((p) => Number(p.id) === closest!.blogpostId);
      if (post) setSelectedPost(post);
    }
  }, [blogposts]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = leftCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Find hovered dot star
    let hovered: number | null = null;
    dotStarsRef.current.forEach((star) => {
      const dx = star.x - mouseX;
      const dy = star.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 25) {
        hovered = star.blogpostId;
      }
    });

    // Only update if changed to avoid re-renders
    if (hovered !== hoveredCard) {
      setHoveredCard(hovered);
    }
  }, [hoveredCard]);

  const handleCardHover = useCallback((postId: number) => {
    setHoveredCard(postId);
    setPreviewVideo(postId);
  }, []);

  const handleCardLeave = useCallback(() => {
    setHoveredCard(null);
    setPreviewVideo(null);
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#05050f]">
        <div className="text-[#555] text-sm">Galaksi verileri yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex overflow-hidden bg-[#05050f]">
      {/* Left - Galaxy Canvas */}
      <div className="w-1/2 relative border-r border-white/[0.04]">
        <canvas
          ref={leftCanvasRef}
          onClick={handleCanvasClick}
          onMouseMove={handleMouseMove}
          className="absolute inset-0 cursor-crosshair"
          style={{ background: 'radial-gradient(ellipse at center, #0a0a24 0%, #05050f 100%)' }}
        />

        {/* Overlay info */}
        <div className="absolute top-6 left-6 z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[#c8956c] text-lg">☾</span>
            <span className="text-xs text-[#888] tracking-wider">Bilgi Galaksisi</span>
          </div>
          <p className="text-[10px] text-[#555] max-w-[200px]">
            İçerik keşfetmek için yıldızlara tıkla veya önizleme için üzerine gel
          </p>
        </div>

        {/* Selected post info */}
        {selectedPost && (
          <div className="absolute bottom-6 left-6 right-6 z-10">
            <div className="liquid-glass rounded-xl p-4 border border-[#c8956c]/20">
              <h3 className="text-sm text-[#c8956c] mb-1">{selectedPost.title}</h3>
              <p className="text-[10px] text-[#888] line-clamp-2">{selectedPost.excerpt || selectedPost.content.slice(0, 100)}</p>
              <button
                onClick={() => navigate(`/blog/${selectedPost.id}`)}
                className="mt-2 px-3 py-1.5 text-[10px] rounded-md bg-[#c8956c]/20 text-[#c8956c] hover:bg-[#c8956c]/30 transition-colors"
              >
                Okumaya Başla →
              </button>
            </div>
          </div>
        )}

        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          className="absolute top-6 right-6 z-10 px-3 py-1.5 text-[10px] rounded-lg bg-white/[0.04] text-[#666] hover:bg-white/[0.08] hover:text-[#aaa] transition-colors border border-white/[0.06]"
        >
          ← Geri
        </button>
      </div>

      {/* Right - Content Cards */}
      <div className="w-1/2 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#333 #05050f' }}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg text-[#e0e0e0] font-light">İçerik Haritası</h2>
            <span className="text-[10px] text-[#555]">{blogposts.length} içerik</span>
          </div>

          {/* Cards grid - 14:18 aspect ratio is approximately 2:2.57, so we'll use a fixed height approach */}
          <div className="grid grid-cols-2 gap-4">
            {blogposts.map((post) => (
              <div
                key={post.id}
                className={`group relative rounded-xl overflow-hidden border transition-all duration-500 cursor-pointer ${
                  hoveredCard === Number(post.id)
                    ? 'border-[#c8956c]/40 shadow-[0_0_30px_rgba(200,149,108,0.15)] scale-[1.02]'
                    : 'border-white/[0.06] hover:border-white/[0.1]'
                }`}
                onMouseEnter={() => handleCardHover(Number(post.id))}
                onMouseLeave={handleCardLeave}
                onClick={() => navigate(`/blog/${post.id}`)}
              >
                {/* Banner area - 14:18 ratio ≈ 280x360 or similar proportional */}
                <div className="relative aspect-[14/18] bg-gradient-to-b from-[#1a1a3e]/60 to-[#0a0a1e]/80 overflow-hidden">
                  {/* Star field pattern for banner */}
                  <div className="absolute inset-0">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-px h-px rounded-full bg-white/40"
                        style={{
                          top: `${Math.random() * 100}%`,
                          left: `${Math.random() * 100}%`,
                          opacity: Math.random() * 0.6 + 0.2,
                        }}
                      />
                    ))}
                  </div>

                  {/* Category tag */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="px-2 py-1 text-[9px] rounded-md bg-black/40 text-[#c8956c] border border-[#c8956c]/20 backdrop-blur-sm">
                      {post.category || 'Keşif'}
                    </span>
                  </div>

                  {/* Read time */}
                  <div className="absolute top-3 right-3 z-10">
                    <span className="text-[9px] text-[#666]">{post.readTime || 5} dk</span>
                  </div>

                  {/* Netflix-style video preview on hover */}
                  {previewVideo === Number(post.id) && post.videoUrl && (
                    <div className="absolute inset-0 z-20 animate-fade-in">
                      <video
                        src={post.videoUrl}
                        autoPlay
                        muted
                        loop
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                  )}

                  {/* Animated preview simulation when no video but hovered */}
                  {hoveredCard === Number(post.id) && !post.videoUrl && (
                    <div className="absolute inset-0 z-10">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#c8956c]/10 via-transparent to-[#6b8cae]/10 animate-pulse" />
                      {/* Floating particles */}
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-1 h-1 rounded-full bg-[#c8956c]/50 animate-float"
                          style={{
                            top: `${20 + Math.random() * 60}%`,
                            left: `${20 + Math.random() * 60}%`,
                            animationDelay: `${i * 0.3}s`,
                            animationDuration: `${2 + Math.random() * 2}s`,
                          }}
                        />
                      ))}
                    </div>
                  )}

                  {/* Title overlay at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
                    <div className="bg-gradient-to-t from-black/80 to-transparent -mx-3 -mb-3 p-3 pt-6">
                      <h3 className="text-xs text-[#e0e0e0] font-medium line-clamp-2">{post.title}</h3>
                    </div>
                  </div>
                </div>

                {/* Card footer */}
                <div className="p-3 bg-white/[0.02]">
                  <p className="text-[10px] text-[#666] line-clamp-2 mb-2">{post.excerpt || post.content.slice(0, 80) + '...'}</p>
                  <div className="flex items-center gap-2">
                    {post.tags?.slice(0, 2).map((tag, i) => (
                      <span key={i} className="text-[9px] text-[#555] px-1.5 py-0.5 rounded bg-white/[0.04]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
