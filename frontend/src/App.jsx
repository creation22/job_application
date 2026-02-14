import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Analytics } from '@vercel/analytics/react'
import './App.css'

const noButtonTexts = [
  "No thanks",
  "Why ??? 😭",
  "Netflix & Chill ?? 🍿",
  "I am rich 💰💎",
  "Please ?? 🥺",
  "I'll buy you food 🍕🍔",
  "Think again... 🤔",
  "You sure?? 😢",
  "Last chance... ⏳",
  "I won't stop asking 😤",
];

function App() {
  const [hearts, setHearts] = useState([]);
  const [yesPressed, setYesPressed] = useState(false);
  const [noBtnPosition, setNoBtnPosition] = useState({ x: 0, y: 0 });
  const [noHasMoved, setNoHasMoved] = useState(false);
  const [noTextIndex, setNoTextIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const colors = ['text-pink-500', 'text-pink-600', 'text-pink-700', 'text-rose-500', 'text-rose-600'];
    const newHearts = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      animDuration: Math.random() * 5 + 5,
      animDelay: Math.random() * 5,
      size: Math.random() * 20 + 15,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    setHearts(newHearts);
  }, []);

  const moveNoButton = () => {
    setNoHasMoved(true);
    const x = Math.random() * (window.innerWidth - 200) - window.innerWidth / 2 + 100;
    const y = Math.random() * (window.innerHeight - 200) - window.innerHeight / 2 + 100;
    setNoBtnPosition({ x, y });

    // Cycle through button texts
    setNoTextIndex((prev) => (prev + 1) % noButtonTexts.length);
  };

  const handleYes = () => {
    const audio = new Audio('/Rick-Roll-Sound-Effect.mp3');
    audioRef.current = audio;
    audio.play();
    setYesPressed(true);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.muted = false;
      } else {
        audioRef.current.muted = true;
      }
    }
    setIsMuted(!isMuted);
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Will you be my Valentine? 💕',
      text: 'Someone wants you to be their Valentine! 🌹',
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard! 📋');
      }
    } catch (err) {
      console.log('Share failed', err);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-pink-100 to-white selection:bg-pink-200"
      style={{ fontFamily: "'Playfair Display', serif" }}>

      {/* Top Right Buttons */}
      <div className="absolute top-4 right-4 z-50 flex items-center gap-3">
        {yesPressed && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            onClick={toggleMute}
            className="w-11 h-11 flex items-center justify-center bg-white/80 backdrop-blur-md rounded-full shadow-lg border border-slate-200 text-slate-600 hover:bg-white hover:scale-110 transition-all cursor-pointer"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              </svg>
            )}
          </motion.button>
        )}

        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3 }}
          onClick={handleShare}
          className="w-11 h-11 flex items-center justify-center bg-white/80 backdrop-blur-md rounded-full shadow-lg border border-slate-200 text-slate-600 hover:bg-white hover:scale-110 transition-all cursor-pointer"
          title="Share"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
        </motion.button>
      </div>

      {/* Falling Hearts */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {hearts.map((heart) => (
          <div
            key={heart.id}
            className={`heart absolute opacity-70 ${heart.color} drop-shadow-md`}
            style={{
              left: `${heart.left}%`,
              animationDuration: `${heart.animDuration}s`,
              animationDelay: `${heart.animDelay}s`,
              width: `${heart.size}px`,
              height: `${heart.size}px`,
            }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
        <AnimatePresence mode="wait">
          {yesPressed ? (
            <motion.div
              key="success"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="text-center bg-white/90 backdrop-blur-xl rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] p-6 max-w-lg w-full"
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <img
                  src="https://media.tenor.com/kHcmsxlKHEAAAAAM/hehe-hehehe.gif"
                  alt="hehe"
                  className="w-16 h-16 rounded-full object-cover"
                />
                <h2 className="text-2xl font-bold text-slate-800">Great! Now fill this out 😏</h2>
              </div>
              <img
                src="/job-application.jpg"
                alt="Job Application Form"
                className="w-full rounded-xl shadow-md border border-slate-200"
              />
            </motion.div>
          ) : (
            <motion.div
              key="card"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white/85 backdrop-blur-xl rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.12)] border border-white/60 text-center max-w-md w-full relative px-10 pt-16 pb-10"
            >
              {/* Top Heart Icon */}
              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
                <div className="bg-white p-5 rounded-full shadow-xl heart-waves border border-rose-100">
                  <div className="premium-heart text-4xl leading-none">
                    ❤️
                  </div>
                </div>
              </div>

              <h1 className="text-4xl font-bold text-slate-800 mb-2 leading-snug">
                Will you be my<br />Valentine?
              </h1>

              <p className="text-slate-400 text-base mb-8 font-medium italic">
                Pleaseeeeee !!!!
              </p>

              {/* Buttons */}
              <div className="flex flex-row items-center justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleYes}
                  className="shadow-[0_0_0_3px_#e11d48_inset] px-8 py-3 bg-white border border-rose-500 text-rose-600 rounded-lg font-bold transition duration-200 text-lg cursor-pointer"
                >
                  YESSSS! 💖
                </motion.button>

                <motion.button
                  style={noHasMoved ? { position: "fixed" } : {}}
                  animate={noHasMoved ? { x: noBtnPosition.x, y: noBtnPosition.y } : {}}
                  transition={{ type: "tween", duration: 0.15, ease: "easeOut" }}
                  onHoverStart={moveNoButton}
                  onClick={moveNoButton}
                  className="shadow-[0_0_0_3px_#94a3b8_inset] px-8 py-3 bg-white border border-slate-300 text-slate-500 rounded-lg font-bold text-lg whitespace-nowrap cursor-pointer z-50"
                >
                  {noButtonTexts[noTextIndex]}
                </motion.button>
              </div>

              <div className="mt-10 pt-5 border-t border-slate-100">
                <p className="text-xs text-slate-400 font-medium tracking-widest uppercase">
                  Made with 🩷 for you
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Analytics />
    </div>
  )
}

export default App
