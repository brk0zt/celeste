import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useBlogpost } from '@/hooks/useBlogposts';
import { useLabs, useQuizzes } from '@/hooks/useLabsQuizzes';
import { useProgress } from '@/hooks/useProgress';
import { useAuth } from '@/hooks/useAuth';
import type { VirtualLab, Quiz } from '@/types';

// Sound utility
function playSound(soundPath: string) {
  const audio = new Audio(soundPath);
  audio.volume = 0.4;
  audio.play().catch(() => {});
}

// Post-it Lab Component
function PostItLab({ lab, onOpen }: { lab: VirtualLab; onOpen: () => void }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onOpen}
    >
      <div
        className={`relative p-4 rounded-sm transition-all duration-500 ${
          isHovered ? 'scale-110 rotate-2 shadow-[0_8px_30px_rgba(200,149,108,0.3)]' : 'rotate-1'
        }`}
        style={{
          background: isHovered
            ? 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)'
            : 'linear-gradient(135deg, #fef9c3 0%, #fef3c7 100%)',
          boxShadow: isHovered
            ? '2px 3px 15px rgba(0,0,0,0.3), inset 0 0 20px rgba(255,255,255,0.2)'
            : '1px 2px 8px rgba(0,0,0,0.2), inset 0 0 10px rgba(255,255,255,0.1)',
          minHeight: '120px',
          width: '160px',
          transform: isHovered ? 'scale(1.1) rotate(2deg) translateY(-5px)' : 'rotate(-1deg)',
        }}
      >
        {/* Tape */}
        <div
          className="absolute -top-2 left-1/2 -translate-x-1/2 w-12 h-4 opacity-40"
          style={{
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.6), rgba(255,255,255,0.2))',
            transform: 'translateX(-50%) rotate(-2deg)',
          }}
        />
        <div className="text-[#5c4a2a] text-xs font-bold mb-1">🧪 {lab.title}</div>
        <div className="text-[#7c6a4a] text-[9px] leading-relaxed line-clamp-3">
          {lab.description || lab.instructions?.slice(0, 60) + '...'}
        </div>
        <div className="mt-2 text-[#9c8a6a] text-[8px]">Deneyi Açmak İçin Tıkla</div>
      </div>
    </div>
  );
}

// Origami Quiz Component
function OrigamiQuiz({ quiz, onOpen }: { quiz: Quiz; onOpen: () => void }) {
  const [isFolded, setIsFolded] = useState(true);

  const handleClick = () => {
    playSound('/sounds/origami-fold.mp3');
    setIsFolded(!isFolded);
    if (isFolded) {
      setTimeout(() => onOpen(), 600);
    }
  };

  return (
    <div
      className="relative cursor-pointer"
      style={{ perspective: '400px' }}
      onClick={handleClick}
    >
      <div
        className={`w-20 h-20 transition-all duration-700 ${
          isFolded ? 'origami-folded' : 'origami-unfolded'
        }`}
        style={{
          transformStyle: 'preserve-3d',
          transform: isFolded
            ? 'rotateX(15deg) rotateY(-15deg) rotateZ(5deg)'
            : 'rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1.2)',
        }}
      >
        {/* Origami shape - crane-like geometric */}
        <svg
          viewBox="0 0 80 80"
          className="w-full h-full"
          style={{
            filter: isFolded
              ? 'drop-shadow(2px 4px 6px rgba(200,149,108,0.3))'
              : 'drop-shadow(0 8px 20px rgba(200,149,108,0.4))',
          }}
        >
          <defs>
            <linearGradient id={`origamiGrad-${quiz.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#c8956c" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#d4a574" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#8fbc8f" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          <polygon
            points="40,5 75,35 55,75 25,75 5,35"
            fill={`url(#origamiGrad-${quiz.id})`}
            stroke="#c8956c"
            strokeWidth="0.5"
            opacity={isFolded ? 0.7 : 0.9}
          />
          <polygon
            points="40,5 40,40 75,35"
            fill="#c8956c"
            opacity={isFolded ? 0.5 : 0.3}
          />
          <polygon
            points="40,40 55,75 25,75"
            fill="#8fbc8f"
            opacity={isFolded ? 0.4 : 0.2}
          />
          {/* Question mark */}
          <text
            x="40"
            y="48"
            textAnchor="middle"
            fill="#fff"
            fontSize="28"
            fontWeight="bold"
            opacity={isFolded ? 0.9 : 0.6}
          >
            ?
          </text>
        </svg>
        {isFolded && (
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[8px] text-[#c8956c] whitespace-nowrap">
            Soru Cevap
          </div>
        )}
      </div>
    </div>
  );
}

// Lab Modal
function LabModal({ lab, onClose }: { lab: VirtualLab; onClose: () => void }) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    playSound('/sounds/zoom-in.mp3');
    if (modalRef.current) {
      modalRef.current.style.transform = 'scale(0.1) rotate(-10deg)';
      modalRef.current.style.opacity = '0';
      requestAnimationFrame(() => {
        if (modalRef.current) {
          modalRef.current.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
          modalRef.current.style.transform = 'scale(1) rotate(0deg)';
          modalRef.current.style.opacity = '1';
        }
      });
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-8" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        ref={modalRef}
        className="relative z-10 w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-xl p-8"
        style={{
          background: 'linear-gradient(135deg, #fef9c3 0%, #fef3c7 100%)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.4), inset 0 0 30px rgba(255,255,255,0.3)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tape decoration */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 bg-white/40 rotate-1" />

        <h2 className="text-lg font-bold text-[#5c4a2a] mb-2">🧪 {lab.title}</h2>
        <p className="text-sm text-[#7c6a4a] mb-4">{lab.description}</p>

        <div className="bg-[#fffbeb] rounded-lg p-4 mb-4 border border-[#d4c4a4]/30">
          <h4 className="text-xs font-bold text-[#5c4a2a] mb-2">Deney Talimatları</h4>
          <p className="text-xs text-[#6c5a4a] leading-relaxed">{lab.instructions}</p>
        </div>

        {lab.codeTemplate && (
          <div className="bg-[#1a1a2e] rounded-lg p-4 mb-4">
            <h4 className="text-xs font-bold text-[#c8956c] mb-2">Kod Şablonu</h4>
            <pre className="text-[10px] text-[#aaa] overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed">
              {lab.codeTemplate}
            </pre>
          </div>
        )}

        <div className="bg-[#f0e6d0] rounded-lg p-4 mb-6">
          <h4 className="text-xs font-bold text-[#5c4a2a] mb-1">Beklenen Çıktı</h4>
          <p className="text-xs text-[#7c6a4a]">{lab.expectedOutput}</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-xs rounded-lg bg-[#5c4a2a] text-[#fef3c7] hover:bg-[#4c3a1a] transition-colors"
          >
            Deneyi Tamamla
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs rounded-lg border border-[#5c4a2a]/30 text-[#5c4a2a] hover:bg-[#5c4a2a]/10 transition-colors"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
}

// Quiz Modal
function QuizModal({ quiz, onClose }: { quiz: Quiz; onClose: () => void }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    playSound('/sounds/zoom-in.mp3');
    if (modalRef.current) {
      modalRef.current.style.transform = 'scale(0.8) rotateX(-30deg)';
      modalRef.current.style.opacity = '0';
      requestAnimationFrame(() => {
        if (modalRef.current) {
          modalRef.current.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
          modalRef.current.style.transform = 'scale(1) rotateX(0deg)';
          modalRef.current.style.opacity = '1';
        }
      });
    }
  }, []);

  const handleAnswer = (idx: number) => {
    setSelected(idx);
    setShowResult(true);
  };

  const isCorrect = selected === quiz.correctAnswer;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-8" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        ref={modalRef}
        className="relative z-10 w-full max-w-lg"
        style={{ perspective: '800px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="rounded-xl p-8"
          style={{
            background: 'linear-gradient(135deg, #1a1a3e 0%, #0f0f2e 100%)',
            border: '1px solid rgba(200, 149, 108, 0.2)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(200,149,108,0.1)',
          }}
        >
          {/* Origami decoration */}
          <div className="flex justify-center mb-4">
            <svg viewBox="0 0 60 60" className="w-12 h-12">
              <defs>
                <linearGradient id="quizOrigami" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#c8956c" />
                  <stop offset="100%" stopColor="#8fbc8f" />
                </linearGradient>
              </defs>
              <polygon points="30,3 57,27 48,57 12,57 3,27" fill="url(#quizOrigami)" opacity="0.6" />
              <text x="30" y="38" textAnchor="middle" fill="#fff" fontSize="24" fontWeight="bold">?</text>
            </svg>
          </div>

          <h3 className="text-sm text-[#e0e0e0] mb-4 text-center">{quiz.question}</h3>

          <div className="space-y-2">
            {quiz.options.map((option, i) => (
              <button
                key={i}
                onClick={() => !showResult && handleAnswer(i)}
                disabled={showResult}
                className={`w-full text-left px-4 py-3 rounded-lg text-xs transition-all ${
                  showResult
                    ? i === quiz.correctAnswer
                      ? 'bg-green-900/30 border border-green-500/30 text-green-300'
                      : i === selected && !isCorrect
                        ? 'bg-red-900/30 border border-red-500/30 text-red-300'
                        : 'bg-white/[0.03] border border-white/[0.06] text-[#888]'
                    : selected === i
                      ? 'bg-[#c8956c]/20 border border-[#c8956c]/40 text-[#c8956c]'
                      : 'bg-white/[0.03] border border-white/[0.06] text-[#aaa] hover:bg-white/[0.06] hover:border-white/[0.1]'
                }`}
              >
                <span className="mr-2">{String.fromCharCode(65 + i)}.</span>
                {option}
              </button>
            ))}
          </div>

          {showResult && (
            <div className="mt-4 p-3 rounded-lg bg-white/[0.04]">
              <p className={`text-xs mb-1 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                {isCorrect ? '✓ Doğru Cevap!' : '✗ Yanlış Cevap'}
              </p>
              {quiz.explanation && (
                <p className="text-[10px] text-[#888] leading-relaxed">{quiz.explanation}</p>
              )}
            </div>
          )}

          <div className="mt-4 flex justify-center">
            <button
              onClick={onClose}
              className="px-6 py-2 text-xs rounded-lg bg-[#c8956c]/20 text-[#c8956c] hover:bg-[#c8956c]/30 transition-colors border border-[#c8956c]/30"
            >
              Kapat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BlogReader() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { blogpost, isLoading } = useBlogpost(id ? Number(id) : null);
  const { labs } = useLabs(id ? Number(id) : null);
  const { quizzes } = useQuizzes(id ? Number(id) : null);
  const { updateProgress } = useProgress();

  const [currentPage, setCurrentPage] = useState(0);
  const [pageTurning, setPageTurning] = useState<'left' | 'right' | null>(null);
  const [selectedLab, setSelectedLab] = useState<VirtualLab | null>(null);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [readPercent, setReadPercent] = useState(0);
  const [immersiveMode, setImmersiveMode] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Split content into pages
  const pages = useRef<string[]>([]);
  useEffect(() => {
    if (blogpost?.content) {
      const sections = blogpost.content.split(/\n#{1,2}\s/).filter(Boolean);
      if (sections.length <= 1) {
        // Split by paragraphs if no headings
        const paras = blogpost.content.split('\n\n').filter(Boolean);
        const mid = Math.ceil(paras.length / 2);
        pages.current = [
          paras.slice(0, mid).join('\n\n'),
          paras.slice(mid).join('\n\n'),
        ];
      } else {
        const mid = Math.ceil(sections.length / 2);
        pages.current = [
          sections.slice(0, mid).join('\n\n'),
          sections.slice(mid).join('\n\n'),
        ];
      }
    }
  }, [blogpost?.content]);

  const totalPages = Math.max(pages.current.length, 2);

  const turnPage = useCallback((direction: 'next' | 'prev') => {
    playSound('/sounds/page-turn.mp3');
    setPageTurning(direction === 'next' ? 'right' : 'left');

    setTimeout(() => {
      if (direction === 'next' && currentPage < totalPages - 1) {
        setCurrentPage((p) => p + 1);
      } else if (direction === 'prev' && currentPage > 0) {
        setCurrentPage((p) => p - 1);
      }
      setPageTurning(null);
    }, 400);
  }, [currentPage, totalPages]);

  // Update reading progress
  useEffect(() => {
    if (blogpost && isAuthenticated) {
      const percent = Math.min(100, Math.round(((currentPage + 1) / totalPages) * 100));
      setReadPercent(percent);
      updateProgress(Number(blogpost.id), percent, percent >= 100);
    }
  }, [currentPage, totalPages, blogpost, isAuthenticated, updateProgress]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0a0a1e]">
        <div className="text-[#555] text-sm">İçerik yükleniyor...</div>
      </div>
    );
  }

  if (!blogpost) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0a0a1e]">
        <div className="text-center">
          <p className="text-[#555] text-sm mb-4">İçerik bulunamadı</p>
          <button
            onClick={() => navigate('/discover')}
            className="px-4 py-2 text-xs rounded-lg bg-[#c8956c]/20 text-[#c8956c]"
          >
            Keşfe Dön
          </button>
        </div>
      </div>
    );
  }

  const leftContent = pages.current[currentPage * 2] || '';
  const rightContent = pages.current[currentPage * 2 + 1] || '';

  return (
    <div className="min-h-screen bg-[#0a0a1e] flex flex-col">
      {/* Header - hidden in immersive mode */}
      <header className={`flex items-center justify-between px-6 py-4 border-b border-white/[0.04] transition-all duration-300 ${immersiveMode ? 'opacity-0 h-0 overflow-hidden py-0' : 'opacity-100'}`}>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/discover')}
            className="text-[10px] text-[#666] hover:text-[#aaa] transition-colors"
          >
            ← Galaksiye Dön
          </button>
          <span className="text-[10px] text-[#444]">|</span>
          <span className="text-[10px] text-[#888]">{blogpost.category || 'Keşif'}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-[#555]">
            {currentPage + 1} / {totalPages}
          </span>
          <div className="w-20 h-1 rounded-full bg-white/[0.06] overflow-hidden">
            <div
              className="h-full bg-[#c8956c]/60 rounded-full transition-all duration-500"
              style={{ width: `${readPercent}%` }}
            />
          </div>
        </div>
      </header>

      {/* Book Content */}
      <main
        className={`flex-1 flex items-center justify-center transition-all duration-500 ${immersiveMode ? 'p-2' : 'p-6'}`}
        onClick={() => {
          // Toggle immersive mode when clicking outside book pages
          setImmersiveMode(!immersiveMode);
        }}
      >
        {/* Expand/Collapse hint button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setImmersiveMode(!immersiveMode);
          }}
          className={`absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/[0.05] text-[#666] hover:bg-white/[0.1] hover:text-[#999] transition-all flex items-center justify-center backdrop-blur-sm border border-white/[0.08] ${immersiveMode ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          title="Tam ekran modu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
          </svg>
        </button>

        <div
          className={`relative flex transition-all duration-500 ${
            pageTurning === 'right' ? 'translate-x-[-5%] opacity-80' : pageTurning === 'left' ? 'translate-x-[5%] opacity-80' : ''
          } ${immersiveMode ? 'w-full h-full max-w-none max-h-none' : 'w-full max-w-5xl'}`}
          style={{ perspective: '1200px' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Left Page */}
          <div
            className={`flex-1 relative transition-all duration-500 ${immersiveMode ? 'min-h-[85vh] p-12 md:p-16' : 'min-h-[60vh] p-8 md:p-12'}`}
            style={{
              background: 'linear-gradient(to right, #12121e 0%, #1a1a2e 95%, #1e1e35 100%)',
              borderRadius: '8px 0 0 8px',
              borderRight: '1px solid rgba(200, 149, 108, 0.1)',
              boxShadow: 'inset 20px 0 40px rgba(0,0,0,0.3)',
            }}
          >
            {/* Page texture */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
              style={{
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
              }}
            />
            {/* Spine shadow */}
            <div className="absolute right-0 top-4 bottom-4 w-8 bg-gradient-to-l from-black/20 to-transparent pointer-events-none" />

            {currentPage === 0 && !leftContent ? (
              <div className="h-full flex flex-col items-center justify-center">
                <h1 className="text-2xl md:text-3xl text-[#c8956c] font-light mb-4 text-center">{blogpost.title}</h1>
                <div className="flex items-center gap-3 mb-6">
                  {blogpost.tags.map((tag, i) => (
                    <span key={i} className="text-[9px] text-[#666] px-2 py-1 rounded bg-white/[0.03]">{tag}</span>
                  ))}
                </div>
                <p className="text-xs text-[#888] text-center max-w-md leading-relaxed">{blogpost.excerpt}</p>
                <div className="mt-8 text-[10px] text-[#555]">
                  {blogpost.readTime || 5} dk okuma
                </div>
              </div>
            ) : (
              <div ref={contentRef} className="prose prose-invert prose-sm max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {leftContent}
                </ReactMarkdown>
              </div>
            )}

            {/* Page number */}
            <div className="absolute bottom-4 left-8 text-[9px] text-[#444]">
              {currentPage * 2 + 1}
            </div>
          </div>

          {/* Right Page */}
          <div
            className={`flex-1 relative transition-all duration-500 ${immersiveMode ? 'min-h-[85vh] p-12 md:p-16' : 'min-h-[60vh] p-8 md:p-12'}`}
            style={{
              background: 'linear-gradient(to left, #12121e 0%, #1a1a2e 95%, #1e1e35 100%)',
              borderRadius: '0 8px 8px 0',
              borderLeft: '1px solid rgba(200, 149, 108, 0.05)',
              boxShadow: 'inset -20px 0 40px rgba(0,0,0,0.3)',
            }}
          >
            {/* Page texture */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
              style={{
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
              }}
            />
            {/* Spine shadow */}
            <div className="absolute left-0 top-4 bottom-4 w-8 bg-gradient-to-r from-black/20 to-transparent pointer-events-none" />

            {rightContent ? (
              <div className="prose prose-invert prose-sm max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {rightContent}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center">
                {/* Interactive elements */}
                {labs.length > 0 && (
                  <div className="mb-6">
                    <p className="text-[10px] text-[#555] mb-3">Sanal Deneyler</p>
                    <div className="flex flex-wrap gap-3 justify-center">
                      {labs.map((lab) => (
                        <PostItLab
                          key={lab.id}
                          lab={lab}
                          onOpen={() => setSelectedLab(lab)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {quizzes.length > 0 && (
                  <div className="mt-4">
                    <p className="text-[10px] text-[#555] mb-3">Bilgi Testi</p>
                    <div className="flex gap-4 justify-center">
                      {quizzes.map((quiz) => (
                        <OrigamiQuiz
                          key={quiz.id}
                          quiz={quiz}
                          onOpen={() => setSelectedQuiz(quiz)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {labs.length === 0 && quizzes.length === 0 && (
                  <div className="text-[#555] text-xs">
                    <p>Bölüm Sonu</p>
                    <p className="text-[10px] mt-2">Daha fazla içerik keşfet</p>
                  </div>
                )}
              </div>
            )}

            {/* Page number */}
            <div className="absolute bottom-4 right-8 text-[9px] text-[#444]">
              {currentPage * 2 + 2}
            </div>
          </div>
        </div>
      </main>

      {/* Navigation - hidden in immersive mode */}
      <footer className={`flex items-center justify-center gap-6 px-6 py-4 border-t border-white/[0.04] transition-all duration-300 ${immersiveMode ? 'opacity-0 h-0 overflow-hidden py-0' : 'opacity-100'}`}>
        <button
          onClick={() => turnPage('prev')}
          disabled={currentPage === 0}
          className="px-4 py-2 text-xs rounded-lg bg-white/[0.04] text-[#666] hover:bg-white/[0.08] hover:text-[#aaa] transition-colors disabled:opacity-30 disabled:cursor-not-allowed border border-white/[0.06]"
        >
          ← Önceki
        </button>
        <span className="text-[10px] text-[#444]">
          {currentPage + 1} / {totalPages}
        </span>
        <button
          onClick={() => turnPage('next')}
          disabled={currentPage >= totalPages - 1}
          className="px-4 py-2 text-xs rounded-lg bg-white/[0.04] text-[#666] hover:bg-white/[0.08] hover:text-[#aaa] transition-colors disabled:opacity-30 disabled:cursor-not-allowed border border-white/[0.06]"
        >
          Sonraki →
        </button>
      </footer>

      {/* Floating controls for immersive mode */}
      {immersiveMode && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 animate-fade-in">
          <button
            onClick={() => turnPage('prev')}
            disabled={currentPage === 0}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-white/[0.08] text-[#888] hover:bg-white/[0.12] hover:text-[#aaa] transition-all backdrop-blur-sm border border-white/[0.08] disabled:opacity-30"
          >
            ←
          </button>
          <button
            onClick={() => setImmersiveMode(false)}
            className="px-4 py-3 rounded-full bg-white/[0.08] text-[#888] hover:bg-white/[0.12] hover:text-[#aaa] transition-all backdrop-blur-sm border border-white/[0.08] text-xs"
          >
            Tam Ekrandan Çık
          </button>
          <button
            onClick={() => turnPage('next')}
            disabled={currentPage >= totalPages - 1}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-white/[0.08] text-[#888] hover:bg-white/[0.12] hover:text-[#aaa] transition-all backdrop-blur-sm border border-white/[0.08] disabled:opacity-30"
          >
            →
          </button>
        </div>
      )}

      {/* Modals */}
      {selectedLab && (
        <LabModal lab={selectedLab} onClose={() => setSelectedLab(null)} />
      )}
      {selectedQuiz && (
        <QuizModal quiz={selectedQuiz} onClose={() => setSelectedQuiz(null)} />
      )}
    </div>
  );
}
