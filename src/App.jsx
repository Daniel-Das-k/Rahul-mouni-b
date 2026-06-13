import { useState, useEffect, useRef } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import gsap from 'gsap';
import confetti from 'canvas-confetti';

function App() {
  const location = useLocation();
  const path = location.pathname;

  // 1. Manage body scrolling constraints based on routing
  useEffect(() => {
    // Scroll container will manage the snap scrolling on '/details'
    if (path === '/details') {
      document.body.style.overflow = 'hidden'; // Container itself handles scroll
    } else {
      document.body.style.overflow = 'hidden';
    }
  }, [path]);

  // 2. Spawn falling blossoms, hearts, leaves, and sparkles dynamically
  useEffect(() => {
    // Hide decorative particles during cinematic video snapping section
    const container = document.getElementById('petals-container');
    if (!container) return;

    const createParticle = () => {
      const p = document.createElement('div');
      p.className = 'petal';
      
      const types = ['flower', 'heart', 'leaf', 'sparkle'];
      const type = types[Math.floor(Math.random() * types.length)];
      
      if (type === 'flower') {
        p.innerHTML = `<span style="font-size: 16px; user-select: none;">🌸</span>`;
      } else if (type === 'heart') {
        p.innerHTML = `<span style="font-size: 16px; opacity: 0.85; user-select: none;">🤍</span>`;
      } else if (type === 'leaf') {
        p.innerHTML = `<span style="font-size: 14px; user-select: none;">🍃</span>`;
      } else {
        p.innerHTML = `<span style="font-size: 16px; color: #d4af37; user-select: none;">✨</span>`;
      }
      
      p.style.left = Math.random() * 100 + 'vw';
      p.style.animationDuration = (Math.random() * 3 + 5) + 's';
      const scale = Math.random() * 0.6 + 0.4;
      p.style.transform = `scale(${scale}) rotate(${Math.random() * 360}deg)`;

      container.appendChild(p);
      
      setTimeout(() => {
        if (container.contains(p)) {
          p.remove();
        }
      }, 8000);
    };

    const intervalId = setInterval(createParticle, 400);
    return () => clearInterval(intervalId);
  }, [path]);

  return (
    <>
      {/* Dynamic particles layer */}
      <div id="petals-container" className="petals-overlay"></div>

      {/* Pages Routing */}
      <Routes>
        <Route path="/" element={<CoverPage />} />
        <Route path="/details" element={<DetailsPage />} />
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

/* =========================================================================
   1. COVER PAGE COMPONENT
   ========================================================================= */
function CoverPage() {
  const navigate = useNavigate();
  const envelopeStageRef = useRef(null);
  const envelopeRef = useRef(null);

  // 3D Parallax Tilt hover
  const handleEnvelopeMouseMove = (e) => {
    if (!envelopeRef.current) return;
    const rect = envelopeRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const degX = -(y / (rect.height / 2)) * 12;
    const degY = (x / (rect.width / 2)) * 12;
    envelopeRef.current.style.transform = `rotateX(${degX}deg) rotateY(${degY}deg)`;
  };

  const handleEnvelopeMouseLeave = () => {
    if (!envelopeRef.current) return;
    envelopeRef.current.style.transform = 'rotateX(0deg) rotateY(0deg)';
  };

  const handleOpenEnvelope = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.65 },
      colors: ['#dcae96', '#7a5642', '#faf9f6', '#d4af37']
    });

    // Start wedding music on envelope click (persists across navigation)
    if (!window._weddingAudio) {
      window._weddingAudio = new Audio('/assets/wedding_music.m4a');
      window._weddingAudio.loop = true;
      window._weddingAudio.volume = 0.2;
    }
    localStorage.setItem('wedding_music_playing', 'true');
    window._weddingAudio.play().catch(() => {});

    const tl = gsap.timeline();

    // A. Zoom envelope slightly
    tl.to(envelopeRef.current, {
      scale: 1.08,
      duration: 0.4,
      ease: 'power2.out'
    });

    // B. Fade out envelope stage and route to details page
    tl.to(envelopeStageRef.current, {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.out',
      onComplete: () => {
        navigate('/details');
      }
    }, '-=0.1');
  };

  return (
    <div ref={envelopeStageRef} className="envelope-stage">
      {/* Quote Section */}
      <div className="landing-quote-container">
        <p className="landing-quote">"Therefore, what God has joined Together, let no one Separate."</p>
        <p className="landing-citation">— Matthew 19:6 —</p>
      </div>

      {/* Interactive Envelope with Parallax */}
      <div
        ref={envelopeRef}
        className="landing-envelope-container"
        onMouseMove={handleEnvelopeMouseMove}
        onMouseLeave={handleEnvelopeMouseLeave}
        onClick={handleOpenEnvelope}
      >
        <img 
          src="/assets/images/envelope.jpg" 
          alt="Wedding Envelope" 
          className="landing-envelope-img" 
        />
      </div>

      {/* Invitation text & details */}
      <div className="landing-invite-container">
        <svg 
          width="28" 
          height="28" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="#cbb281" 
          strokeWidth="1.2" 
          className="church-gold-icon"
        >
          <path d="M12 2v6M9 4h6M12 8l-6 6h12l-6-6zM6 14v8h12v-8" />
          <path d="M10 22v-4a2 2 0 0 1 4 0v4" strokeLinecap="round" />
        </svg>

        <p className="landing-invite-text">You're invited to</p>
        <p className="landing-invite-title">Rahul & Mouni's Wedding</p>
        
        {/* Ring Divider */}
        <div className="ring-divider">
          <div className="divider-line"></div>
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="#cbb281" 
            strokeWidth="1.2" 
            className="divider-ring"
          >
            <circle cx="12" cy="14" r="6" />
            <polygon points="12,2 15,6 9,6" fill="#cbb281" />
          </svg>
          <div className="divider-line"></div>
        </div>

        <p className="landing-instruction-text">Tap the envelope to open your invitation</p>
      </div>
    </div>
  );
}

/* =========================================================================
   2. DETAILS PAGE COMPONENT (SCROLL SNAPPING MULTI-SECTION)
   ========================================================================= */
function DetailsPage() {
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [canvasRemoved, setCanvasRemoved] = useState(false);
  const [isCountdownUnveiled, setIsCountdownUnveiled] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: false });

  // RSVP Form States
  const [name, setName] = useState('');
  const [attendance, setAttendance] = useState('attending');
  const [guests, setGuests] = useState('1');
  const [wishes, setWishes] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Music states (audio lives on window._weddingAudio, started from CoverPage)
  const [isMusicPlaying, setIsMusicPlaying] = useState(() => {
    return localStorage.getItem('wedding_music_playing') !== 'false';
  });

  const canvasRef = useRef(null);
  const rsvpDialogRef = useRef(null);
  const scrollContainerRef = useRef(null);

  // Gallery states and refs
  const galleryDialogRef = useRef(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const [inlineActiveIndex, setInlineActiveIndex] = useState(0);

  const galleryImages = [
    '/assets/images/photo1.PNG',
    '/assets/images/photo2.jpg',
    '/assets/images/photo3.jpg',
    '/assets/images/photo4.jpg'
  ];

  // Gallery Dialog overlay controller
  useEffect(() => {
    const dialog = galleryDialogRef.current;
    if (!dialog) return;

    if (galleryOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [galleryOpen]);

  // Initialize audio and resume after refresh
  useEffect(() => {
    // Re-create audio object if wiped by refresh
    if (!window._weddingAudio) {
      window._weddingAudio = new Audio('/assets/wedding_music.m4a');
      window._weddingAudio.loop = true;
      window._weddingAudio.volume = 0.2;
    }
    const audio = window._weddingAudio;

    const handlePlay = () => setIsMusicPlaying(true);
    const handlePause = () => setIsMusicPlaying(false);

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    // Sync initial state (only if actually playing, otherwise keep user preference)
    if (!audio.paused) {
      setIsMusicPlaying(true);
    }

    // Check if user had music playing before refresh
    const musicWasPlaying = localStorage.getItem('wedding_music_playing') !== 'false';

    if (musicWasPlaying && audio.paused) {
      // Try immediately (works if browser allows it)
      audio.play().catch(() => {
        // Browser blocked autoplay — resume silently on very next interaction
        const resumeOnce = (e) => {
          // If they clicked the toggle button, let the toggle handle it
          if (e.target && e.target.closest('#music-toggle-btn')) {
            cleanup();
            return;
          }
          audio.play().catch(() => {});
          cleanup();
        };
        const cleanup = () => {
          document.removeEventListener('click', resumeOnce);
          document.removeEventListener('touchstart', resumeOnce);
        };
        document.addEventListener('click', resumeOnce);
        document.addEventListener('touchstart', resumeOnce);
      });
    }

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, []);

  const toggleMusic = () => {
    const audio = window._weddingAudio;
    if (!audio) return;
    if (audio.paused) {
      audio.play().catch(() => {});
      localStorage.setItem('wedding_music_playing', 'true');
    } else {
      audio.pause();
      localStorage.setItem('wedding_music_playing', 'false');
    }
  };

  const handleGalleryBackdropClick = (e) => {
    if (e.target === galleryDialogRef.current) {
      setGalleryOpen(false);
    }
  };

  const handleNextPhoto = () => {
    setActivePhotoIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const handlePrevPhoto = () => {
    setActivePhotoIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;
    
    // Swipe left -> Next
    if (diff > 50) {
      handleNextPhoto();
    }
    // Swipe right -> Prev
    if (diff < -50) {
      handlePrevPhoto();
    }
  };

  // Countdown timer hook
  useEffect(() => {
    const targetDate = new Date('2026-06-18T18:00:00+05:30').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        setTimeLeft(prev => ({ ...prev, isPast: true }));
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isPast: false });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Initialize and handle canvas scratching
  useEffect(() => {
    if (canvasRemoved) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const parent = canvas.parentNode;
    const rect = parent.getBoundingClientRect();
    canvas.width = rect.width || 400;
    canvas.height = rect.height || 400;

    // Fill background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#70585b'); // Dusty Rose
    gradient.addColorStop(0.5, '#dcae96'); // Gold / Peach
    gradient.addColorStop(1, '#70585b');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Apply texture sparkles
    ctx.globalAlpha = 0.12;
    for (let i = 0; i < 1500; i++) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 1.5, 1.5);
    }
    ctx.globalAlpha = 1.0;

    // Text instructions
    ctx.font = '22px "Playfair Display", Georgia, serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Scratch to Reveal', canvas.width / 2, canvas.height / 2);

    let isDrawing = false;
    let strokeCount = 0;

    const scratch = (x, y) => {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 40, 0, Math.PI * 2);
      ctx.fill();

      strokeCount++;
      if (strokeCount > 40) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let transparent = 0;
        let sampled = 0;
        // Sample pixels for performance check
        for (let i = 0; i < imageData.data.length; i += 1600) {
          sampled++;
          if (imageData.data[i + 3] === 0) {
            transparent++;
          }
        }
        const percentageCleared = sampled > 0 ? transparent / sampled : 0;
        if (percentageCleared > 0.40) {
          canvas.style.transition = 'opacity 0.8s ease-out';
          canvas.style.opacity = '0';
          
          setIsCountdownUnveiled(true);
          
          confetti({
            particleCount: 90,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#faf9f6', '#f8d8db', '#dcae96', '#70585b', '#d4af37'],
            scalar: 1.1
          });

          setTimeout(() => {
            setCanvasRemoved(true);
          }, 800);
        }
      }
    };

    const getPointerPos = (e) => {
      const canvasRect = canvas.getBoundingClientRect();
      const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
      const clientY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
      return {
        x: clientX - canvasRect.left,
        y: clientY - canvasRect.top
      };
    };

    const handlePointerDown = (e) => {
      isDrawing = true;
      const pos = getPointerPos(e);
      scratch(pos.x, pos.y);
    };

    const handlePointerMove = (e) => {
      if (!isDrawing) return;
      const pos = getPointerPos(e);
      scratch(pos.x, pos.y);
      if (e.cancelable) e.preventDefault();
    };

    const handlePointerUp = () => {
      isDrawing = false;
    };

    // Listeners
    canvas.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mouseup', handlePointerUp);
    canvas.addEventListener('mousemove', handlePointerMove);

    canvas.addEventListener('touchstart', handlePointerDown, { passive: false });
    canvas.addEventListener('touchend', handlePointerUp);
    canvas.addEventListener('touchmove', handlePointerMove, { passive: false });

    return () => {
      canvas.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mouseup', handlePointerUp);
      canvas.removeEventListener('mousemove', handlePointerMove);
      canvas.removeEventListener('touchstart', handlePointerDown);
      canvas.removeEventListener('touchend', handlePointerUp);
      canvas.removeEventListener('touchmove', handlePointerMove);
    };
  }, [canvasRemoved]);

  // Dialog overlay controller
  useEffect(() => {
    const dialog = rsvpDialogRef.current;
    if (!dialog) return;

    if (rsvpOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [rsvpOpen]);

  const handleDialogBackdropClick = (e) => {
    if (e.target === rsvpDialogRef.current) {
      setRsvpOpen(false);
    }
  };

  const handleRsvpSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const response = {
      name,
      attendance,
      guests: attendance === 'attending' ? guests : '0',
      wishes,
      timestamp: new Date().toISOString()
    };

    const existing = JSON.parse(localStorage.getItem('wedding_rsvps') || '[]');
    existing.push(response);
    localStorage.setItem('wedding_rsvps', JSON.stringify(existing));

    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.65 },
      colors: ['#7a5642', '#70585b', '#d4af37', '#dcae96']
    });

    setFormSubmitted(true);
  };

  const handleResetForm = () => {
    setName('');
    setAttendance('attending');
    setGuests('1');
    setWishes('');
    setFormSubmitted(false);
  };

  return (
    <div ref={scrollContainerRef} className="scroll-container">

      {/* Floating Music Toggle */}
      <button
        id="music-toggle-btn"
        onClick={toggleMusic}
        title={isMusicPlaying ? 'Pause music' : 'Play music'}
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          zIndex: 9999,
          width: '3rem',
          height: '3rem',
          borderRadius: '50%',
          border: 'none',
          background: 'rgba(122, 86, 66, 0.85)',
          backdropFilter: 'blur(8px)',
          color: '#fff',
          fontSize: '1.35rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 18px rgba(0,0,0,0.25)',
          transition: 'transform 0.2s, background 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.12)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        <span className="material-symbols-outlined" style={{ fontSize: '1.35rem' }}>
          {isMusicPlaying ? 'music_note' : 'music_off'}
        </span>
      </button>

      {/* ===== SECTION 1: Fullscreen Invitation Poster ===== */}
      <section className="scroll-section poster-scroll-section" style={{ background: 'radial-gradient(circle, #ffffff 0%, #f7f3ec 100%)' }}>
        <div className="video-stage">
          <div className="video-container">
            <img
              src="/assets/images/invite_details.png"
              alt="Rahul & Mouni Wedding Invitation Details"
              className="fullscreen-video"
              style={{ objectFit: 'contain', backgroundColor: 'transparent', borderRadius: '16px' }}
            />
          </div>
        </div>
      </section>

      {/* ===== SECTION 2: Save the Date + Bible Verse ===== */}
      <section className="scroll-section scroll-section-freeflow">
        <div className="details-wrapper" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
          {/* COUNTDOWN TIMER SECTION */}
          <section className="interactive-section" style={{ marginTop: '0' }}>
            <p className="label-caps mb-6">Something Special Awaits</p>
            
            <div className="scratch-card-relative">
              <div className={`countdown-unveiled ${isCountdownUnveiled ? 'scale-up-bounce' : ''}`}>
                {timeLeft.isPast ? (
                  <div className="text-center">
                    <p className="script-italic text-2xl text-[#7a5642] mb-1">The Celebration</p>
                    <p className="label-caps text-sm">Has Begun!</p>
                  </div>
                ) : (
                  <>
                    {/* Date reveal - appears first */}
                    <div className={`date-reveal ${isCountdownUnveiled ? 'date-reveal-animate' : ''}`}>
                      <p className="script-italic date-reveal-label">Save the Date</p>
                      <h2 className="date-reveal-main">18<sup>th</sup> June</h2>
                      <p className="date-reveal-year">2026</p>
                    </div>

                    <div className="timer-divider" style={{ margin: '1.2rem 0' }}></div>
                    
                    {/* Countdown - appears after date */}
                    <div className={`countdown-reveal ${isCountdownUnveiled ? 'countdown-reveal-animate' : ''}`}>
                      <p className="countdown-reveal-subtitle">Counting down to forever</p>
                      <div className="timer-grid">
                        <div className="timer-item">
                          <span className="timer-value">{String(timeLeft.days).padStart(2, '0')}</span>
                          <span className="timer-label">DAYS</span>
                        </div>
                        <div className="timer-item">
                          <span className="timer-value">{String(timeLeft.hours).padStart(2, '0')}</span>
                          <span className="timer-label">HOURS</span>
                        </div>
                        <div className="timer-item">
                          <span className="timer-value">{String(timeLeft.minutes).padStart(2, '0')}</span>
                          <span className="timer-label">MINS</span>
                        </div>
                        <div className="timer-item">
                          <span className="timer-value">{String(timeLeft.seconds).padStart(2, '0')}</span>
                          <span className="timer-label">SECS</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}

              </div>

              {!canvasRemoved && (
                <canvas ref={canvasRef} className="scratch-canvas" />
              )}
            </div>
            {!canvasRemoved && (
              <p className="scratch-hint-text">Scratch to reveal our countdown</p>
            )}
          </section>

          {/* BIBLE QUOTE */}
          <section className="scripture-section">
            <span className="material-symbols-outlined text-[#7a5642] text-4xl mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>
              format_quote
            </span>
            <blockquote className="scripture-quote">
              "I have found the one whom my soul loves."
            </blockquote>
            <cite className="scripture-citation">— Song of Solomon 3:4</cite>
          </section>
        </div>
      </section>

      {/* ===== SECTION 3: Photo Gallery ===== */}
      <section className="scroll-section scroll-section-freeflow">
        <div className="details-wrapper" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
          {/* PHOTO GALLERY (Option 3 combined with Option 2) */}
          {inlineActiveIndex < 4 ? (
            /* PHOTO GALLERY (Option 3: 3D Stacked Card Deck Inline) */
            <section className="deck-gallery-section scale-up-bounce">
              <p className="label-caps deck-grid-title">Our Moments</p>
              <p className="scratch-hint-text" style={{ marginBottom: '1rem', fontStyle: 'normal', color: 'var(--color-secondary)' }}>
                Tap the card stack to discover our photos ({inlineActiveIndex}/4)
              </p>
              <div 
                className="deck-container"
                onClick={() => setInlineActiveIndex((prev) => prev + 1)}
                title="Click card to swipe"
              >
                {galleryImages.map((imgUrl, index) => {
                  let cardClass = "deck-card";
                  
                  if (index < inlineActiveIndex) {
                    cardClass += index % 2 === 0 ? " swiped-left" : " swiped-right";
                  } else if (index === inlineActiveIndex) {
                    cardClass += " stack-depth-0";
                  } else {
                    const depth = index - inlineActiveIndex;
                    const depthIndex = depth > 3 ? 3 : depth;
                    cardClass += ` stack-depth-${depthIndex}`;
                  }

                  return (
                    <img
                      key={index}
                      src={imgUrl}
                      alt={`Wedding celebration ${index + 1}`}
                      className={cardClass}
                      style={{
                        pointerEvents: index === inlineActiveIndex ? 'auto' : 'none'
                      }}
                    />
                  );
                })}
              </div>

              {/* Navigation buttons below the deck */}
              <div className="deck-controls">
                <button 
                  className="deck-nav-btn" 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    setInlineActiveIndex((prev) => (prev === 0 ? 0 : prev - 1));
                  }}
                  disabled={inlineActiveIndex === 0}
                  style={{ opacity: inlineActiveIndex === 0 ? 0.3 : 1 }}
                  aria-label="Previous photo"
                >
                  <span className="material-symbols-outlined">arrow_back_ios_new</span>
                </button>
                <button 
                  className="deck-nav-btn" 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    setInlineActiveIndex((prev) => prev + 1);
                  }}
                  aria-label="Next photo"
                >
                  <span className="material-symbols-outlined">arrow_forward_ios</span>
                </button>
              </div>
            </section>
          ) : (
            /* PHOTO GALLERY (Option 2: Polaroid Scatter) */
            <section className="polaroid-gallery-section scale-up-bounce">
              <p className="label-caps polaroid-grid-title">Our Moments</p>
              <div className="polaroid-scatter-container">
                <div 
                  className="polaroid-card"
                  onClick={() => { setActivePhotoIndex(0); setGalleryOpen(true); }}
                >
                  <div className="polaroid-image-wrap">
                    <img src={galleryImages[0]} alt="Pre-wedding moment 1" />
                  </div>
                  <div className="polaroid-caption">Love</div>
                </div>
                
                <div 
                  className="polaroid-card"
                  onClick={() => { setActivePhotoIndex(1); setGalleryOpen(true); }}
                >
                  <div className="polaroid-image-wrap">
                    <img src={galleryImages[1]} alt="Pre-wedding moment 2" />
                  </div>
                  <div className="polaroid-caption">Together</div>
                </div>

                <div 
                  className="polaroid-card"
                  onClick={() => { setActivePhotoIndex(2); setGalleryOpen(true); }}
                >
                  <div className="polaroid-image-wrap">
                    <img src={galleryImages[2]} alt="Pre-wedding moment 3" />
                  </div>
                  <div className="polaroid-caption">Forever</div>
                </div>

                <div 
                  className="polaroid-card"
                  onClick={() => { setActivePhotoIndex(3); setGalleryOpen(true); }}
                >
                  <div className="polaroid-image-wrap">
                    <img src={galleryImages[3]} alt="Pre-wedding moment 4" />
                  </div>
                  <div className="polaroid-caption">Always</div>
                </div>
              </div>

              {/* Reset to Stack button */}
              <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
                <button 
                  className="btn-secondary" 
                  onClick={() => setInlineActiveIndex(0)}
                  style={{ borderRadius: '30px', padding: '10px 24px', fontSize: '0.75rem', gap: '4px' }}
                >
                  <span className="material-symbols-outlined text-[14px]">refresh</span>
                  Stack Photos Again
                </button>
              </div>
            </section>
          )}
        </div>
      </section>

      {/* ===== SECTION 4: Betrothal Ceremony ===== */}
      <section className="scroll-section scroll-section-event">
        <div className="ceremony-poster-card ceremony-poster-fullscreen">
          <img
            src="/assets/images/betrothal_bg.jpg"
            alt="Betrothal Ceremony"
            className="ceremony-poster-bg"
          />
          <div className="ceremony-poster-overlay">
            <h3 className="ceremony-poster-title">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                favorite
              </span>
              The Betrothal
            </h3>
            <p className="ceremony-poster-subtitle">Engagement &amp; Blessings</p>
            
            <div className="ceremony-poster-details">
              <div className="ceremony-detail-row">
                <span className="material-symbols-outlined">calendar_today</span>
                <div>
                  <p className="ceremony-detail-label">Date &amp; Time</p>
                  <p className="ceremony-detail-value">June 18th, 2026</p>
                  <p className="ceremony-detail-value-sub">At 10:30 AM IST</p>
                </div>
              </div>
              <div className="ceremony-detail-row">
                <span className="material-symbols-outlined">location_on</span>
                <div>
                  <p className="ceremony-detail-label">Venue</p>
                  <p className="ceremony-detail-value">GEC - St. Paul's Church (First Floor)</p>
                  <p className="ceremony-detail-value-sub">
                    No.20, Padar Salai Street, Kambar Nagar, Vanagaram, Adayalampattu, Chennai - 600 095.
                  </p>
                </div>
              </div>
            </div>

            <button className="btn-primary ceremony-poster-btn" onClick={() => window.open("https://maps.app.goo.gl/r2YzeQpWP4gUVUte6?g_st=ic", "_blank")}>
              Get Directions
              <span className="material-symbols-outlined text-[14px]">open_in_new</span>
            </button>
          </div>
        </div>
      </section>

      {/* ===== SECTION 5: Wedding Ceremony ===== */}
      <section className="scroll-section scroll-section-event">
        <div className="ceremony-poster-card ceremony-poster-fullscreen">
          <img
            src="/assets/images/ceremony_bg.jpg"
            alt="Wedding Ceremony"
            className="ceremony-poster-bg"
          />
          <div className="ceremony-poster-overlay">
            <h3 className="ceremony-poster-title">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                church
              </span>
              The Wedding Ceremony
            </h3>
            <p className="ceremony-poster-subtitle">Holy Matrimony &amp; Blessings</p>
            
            <div className="ceremony-poster-details">
              <div className="ceremony-detail-row">
                <span className="material-symbols-outlined">calendar_today</span>
                <div>
                  <p className="ceremony-detail-label">Date &amp; Time</p>
                  <p className="ceremony-detail-value">June 18th, 2026</p>
                  <p className="ceremony-detail-value-sub">At 6:00 PM IST</p>
                </div>
              </div>
              <div className="ceremony-detail-row">
                <span className="material-symbols-outlined">location_on</span>
                <div>
                  <p className="ceremony-detail-label">Venue</p>
                  <p className="ceremony-detail-value">GEC - St. Paul's Church (First Floor)</p>
                  <p className="ceremony-detail-value-sub">
                    No.20, Padar Salai Street, Kambar Nagar, Vanagaram, Adayalampattu, Chennai - 600 095.
                  </p>
                </div>
              </div>
            </div>

            <button className="btn-primary ceremony-poster-btn" onClick={() => window.open("https://maps.app.goo.gl/r2YzeQpWP4gUVUte6?g_st=ic", "_blank")}>
              Get Directions
              <span className="material-symbols-outlined text-[14px]">open_in_new</span>
            </button>
          </div>
        </div>
      </section>

      {/* ===== SECTION 6: Reception ===== */}
      <section className="scroll-section scroll-section-event">
        <div className="ceremony-poster-card ceremony-poster-fullscreen">
          <img
            src="/assets/images/reception_bg.png"
            alt="Wedding Reception"
            className="ceremony-poster-bg"
          />
          <div className="ceremony-poster-overlay reception-poster-overlay">
            <h3 className="ceremony-poster-title">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                celebration
              </span>
              The Reception
            </h3>
            <p className="ceremony-poster-subtitle">An Evening of Joy &amp; Celebration</p>
            
            <div className="ceremony-poster-details">
              <div className="ceremony-detail-row">
                <span className="material-symbols-outlined">event</span>
                <div>
                  <p className="ceremony-detail-label">Date &amp; Time</p>
                  <p className="ceremony-detail-value">June 23rd, 2026</p>
                  <p className="ceremony-detail-value-sub">At 6:00 PM IST</p>
                </div>
              </div>
              <div className="ceremony-detail-row">
                <span className="material-symbols-outlined">pin_drop</span>
                <div>
                  <p className="ceremony-detail-label">Location</p>
                  <p className="ceremony-detail-value">Golden Jubilee Hall</p>
                  <p className="ceremony-detail-value-sub">Calvary Baptist Church, Vishakapatnam</p>
                </div>
              </div>
            </div>

            <button className="btn-primary ceremony-poster-btn" onClick={() => window.open("https://maps.app.goo.gl/Kpw2ewuFuzC5MULX9?g_st=ic", "_blank")}>
              Get Directions
              <span className="material-symbols-outlined text-[14px]">open_in_new</span>
            </button>
          </div>
        </div>
      </section>

      {/* ===== SECTION 7: RSVP + Footer ===== */}
      <section className="scroll-section scroll-section-rsvp">
        <div className="details-wrapper" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: '2rem', padding: '3rem 1.5rem' }}>
          <section className="rsvp-trigger-section">
            <p className="script-italic" style={{ fontSize: '1.8rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>We'd Love to See You</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-secondary)', marginBottom: '2rem', textAlign: 'center' }}>Please let us know if you can make it to celebrate with us</p>
            <div className="rsvp-cta-border">
              <button className="btn-rsvp-launch" onClick={() => setRsvpOpen(true)}>
                Confirm Your RSVP
                <span className="material-symbols-outlined">mail</span>
              </button>
            </div>
          </section>

          <footer className="compliments-footer" style={{ marginTop: '2rem' }}>
            <h2>With Blessings</h2>
            <p className="footer-compliments-text">
              With Blessings & Compliments from the Komarapu & Vankara Families.
            </p>
            <div className="footer-dots">
              <div className="footer-dot"></div>
              <div className="footer-dot"></div>
              <div className="footer-dot"></div>
            </div>
          </footer>
        </div>
      </section>

      {/* RSVP DIALOG MODAL */}
      <dialog
        ref={rsvpDialogRef}
        className="rsvp-dialog"
        onClick={handleDialogBackdropClick}
      >
          <div className="rsvp-modal-content">
            <button className="rsvp-modal-close-btn" onClick={() => setRsvpOpen(false)}>
              <span className="material-symbols-outlined">close</span>
            </button>

            {!formSubmitted ? (
              <>
                <h3>R.S.V.P</h3>
                <p className="rsvp-modal-subtitle">We would love to celebrate with you</p>
                
                <form className="rsvp-form" onSubmit={handleRsvpSubmit}>
                  <div className="form-group">
                    <label htmlFor="rsvp-name">Full Name</label>
                    <input
                      id="rsvp-name"
                      type="text"
                      required
                      className="form-control-input"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                    />
                  </div>

                  <div className="form-group">
                    <label>Will You Attend?</label>
                    <div className="form-radio-group">
                      <div>
                        <input
                          type="radio"
                          id="attend-yes"
                          name="attendance"
                          value="attending"
                          checked={attendance === 'attending'}
                          onChange={() => setAttendance('attending')}
                        />
                        <label htmlFor="attend-yes" className="radio-tile-label">
                          <span className="material-symbols-outlined text-[16px]">check_circle</span>
                          Attending
                        </label>
                      </div>
                      <div>
                        <input
                          type="radio"
                          id="attend-no"
                          name="attendance"
                          value="declined"
                          checked={attendance === 'declined'}
                          onChange={() => setAttendance('declined')}
                        />
                        <label htmlFor="attend-no" className="radio-tile-label">
                          <span className="material-symbols-outlined text-[16px]">cancel</span>
                          Declined
                        </label>
                      </div>
                    </div>
                  </div>

                  {attendance === 'attending' && (
                    <div className="form-group">
                      <label htmlFor="rsvp-guests">Number of Guests</label>
                      <select
                        id="rsvp-guests"
                        className="form-control-input"
                        value={guests}
                        onChange={(e) => setGuests(e.target.value)}
                      >
                        <option value="1">1 Person</option>
                        <option value="2">2 People</option>
                        <option value="3">3 People</option>
                        <option value="4">4 People</option>
                        <option value="5">5+ People</option>
                      </select>
                    </div>
                  )}

                  <div className="form-group">
                    <label htmlFor="rsvp-wishes">Wishes for the Couple (Optional)</label>
                    <input
                      id="rsvp-wishes"
                      type="text"
                      className="form-control-input"
                      value={wishes}
                      onChange={(e) => setWishes(e.target.value)}
                      placeholder="Your warm message"
                    />
                  </div>

                  <div className="rsvp-submit-btn-wrap">
                    <button type="submit" className="btn-primary rsvp-submit-btn">
                      Submit Response
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="rsvp-success-view">
                <span className="material-symbols-outlined rsvp-success-icon">
                  celebration
                </span>
                <h3>Thank You!</h3>
                <p className="rsvp-success-text">
                  {attendance === 'attending' 
                    ? "We are thrilled that you can join us on our special day! Your response has been logged successfully."
                    : "We are sorry you won't be able to make it, but thank you for letting us know!"}
                </p>
                <button className="btn-secondary" onClick={handleResetForm}>
                  Edit Response
                </button>
              </div>
            )}
          </div>
        </dialog>


        {/* FULLSCREEN GALLERY CAROUSEL MODAL (Option 3: 3D Stacked Card Deck) */}
        <dialog
          ref={galleryDialogRef}
          className="gallery-modal"
          onClick={handleGalleryBackdropClick}
        >
          <div className="gallery-modal-content">
            <button className="gallery-close-btn" onClick={() => setGalleryOpen(false)} aria-label="Close gallery">
              <span className="material-symbols-outlined">close</span>
            </button>

            <div 
              className="gallery-slider-wrapper"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onClick={handleNextPhoto}
              style={{ cursor: 'pointer', position: 'relative' }}
            >
              {/* Prev Button (Desktop only) */}
              <button className="gallery-nav-btn gallery-nav-prev" onClick={(e) => { e.stopPropagation(); handlePrevPhoto(); }} aria-label="Previous photo">
                <span className="material-symbols-outlined">arrow_back_ios_new</span>
              </button>

              {galleryImages.map((imgUrl, index) => {
                let cardClass = "deck-card";
                
                if (index < activePhotoIndex) {
                  // Toss off in alternating directions
                  cardClass += index % 2 === 0 ? " swiped-left" : " swiped-right";
                } else if (index === activePhotoIndex) {
                  cardClass += " stack-depth-0";
                } else {
                  const depth = index - activePhotoIndex;
                  const depthIndex = depth > 3 ? 3 : depth;
                  cardClass += ` stack-depth-${depthIndex}`;
                }

                return (
                  <img
                    key={index}
                    src={imgUrl}
                    alt={`Wedding celebration ${index + 1}`}
                    className={cardClass}
                    style={{
                      pointerEvents: index === activePhotoIndex ? 'auto' : 'none'
                    }}
                  />
                );
              })}

              {/* Next Button (Desktop only) */}
              <button className="gallery-nav-btn gallery-nav-next" onClick={(e) => { e.stopPropagation(); handleNextPhoto(); }} aria-label="Next photo">
                <span className="material-symbols-outlined">arrow_forward_ios</span>
              </button>
            </div>

            {/* Pagination Indicators */}
            <div className="gallery-indicators">
              {galleryImages.map((_, index) => (
                <div 
                  key={index}
                  className={`gallery-indicator-dot ${index === activePhotoIndex ? 'active' : ''}`}
                  onClick={(e) => { e.stopPropagation(); setActivePhotoIndex(index); }}
                />
              ))}
            </div>
          </div>
        </dialog>
    </div>
  );
}

export default App;
