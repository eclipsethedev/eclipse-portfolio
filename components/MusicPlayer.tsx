'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PLAYLIST = [
  { title: 'Nights', artist: 'Frank Ocean', file: '/music/Frank Ocean - Nights.mp3' },
  { title: 'Sativa', artist: 'Jhené Aiko ft. Swae Lee', file: '/music/Jhené Aiko - Sativa ft. Swae Lee (Official Audio).mp3' },
  { title: 'Mysëlf', artist: '', file: '/music/Mysëlf.mp3' },
  { title: 'Resonance', artist: '', file: '/music/Resonance.mp3' },
];

// Autoplay starts on Sativa (index 1)
const AUTOPLAY_INDEX = 1;

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(AUTOPLAY_INDEX);
  const [volume, setVolume] = useState(0.3);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [autoplayed, setAutoplayed] = useState(false);

  const track = PLAYLIST[trackIndex];

  // Try autoplay on first user interaction with the page
  useEffect(() => {
    const tryAutoplay = () => {
      if (autoplayed || !audioRef.current) return;
      audioRef.current.volume = volume;
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        setAutoplayed(true);
      }).catch(() => {
        // Browser blocked autoplay — that's fine, user can click play
      });
      document.removeEventListener('click', tryAutoplay);
      document.removeEventListener('keydown', tryAutoplay);
      document.removeEventListener('scroll', tryAutoplay);
    };

    document.addEventListener('click', tryAutoplay, { once: true });
    document.addEventListener('keydown', tryAutoplay, { once: true });
    document.addEventListener('scroll', tryAutoplay, { once: true });

    return () => {
      document.removeEventListener('click', tryAutoplay);
      document.removeEventListener('keydown', tryAutoplay);
      document.removeEventListener('scroll', tryAutoplay);
    };
  }, [autoplayed]);

  // Sync volume
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // Load new track when index changes
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.src = PLAYLIST[trackIndex].file;
    audioRef.current.load();
    audioRef.current.volume = volume;
    if (isPlaying) audioRef.current.play();
  }, [trackIndex]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const nextTrack = () => setTrackIndex((i) => (i + 1) % PLAYLIST.length);

  const prevTrack = () => {
    if (currentTime > 3 && audioRef.current) {
      audioRef.current.currentTime = 0;
      return;
    }
    setTrackIndex((i) => (i - 1 + PLAYLIST.length) % PLAYLIST.length);
  };

  const skipForward = () => {
    if (audioRef.current) audioRef.current.currentTime = Math.min(currentTime + 5, duration);
  };

  const skipBackward = () => {
    if (audioRef.current) audioRef.current.currentTime = Math.max(currentTime - 5, 0);
  };

  const fmt = (s: number) => {
    if (!s || isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1.5 }}
    >
      <motion.div
        className="bg-neutral-950 border border-neutral-700 shadow-2xl overflow-hidden"
        animate={{ width: expanded ? 300 : 'auto' }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        style={{ borderRadius: 12 }}
      >
        {/* Main bar */}
        <div className="flex items-center gap-3 px-4 py-3">
          {/* Visualizer bars when playing */}
          <motion.button
            onClick={() => setExpanded(!expanded)}
            className="shrink-0 flex items-end gap-px h-5 w-5 cursor-pointer"
            aria-label="Toggle player"
            whileTap={{ scale: 0.9 }}
          >
            {[0.4, 1, 0.6, 0.9, 0.5].map((h, i) => (
              <motion.div
                key={i}
                className={`w-1 rounded-sm ${isPlaying ? 'bg-blue-400' : 'bg-neutral-600'}`}
                animate={isPlaying ? {
                  scaleY: [h, 1, 0.3, 0.8, h],
                } : { scaleY: 0.3 }}
                transition={isPlaying ? {
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: 'easeInOut',
                } : { duration: 0.3 }}
                style={{ height: 20, originY: 1 }}
              />
            ))}
          </motion.button>

          {/* Track info */}
          <div className="flex flex-col min-w-0" style={{ maxWidth: expanded ? 160 : 100 }}>
            <span className="text-white text-xs font-medium truncate leading-tight">{track.title}</span>
            {track.artist && (
              <span className="text-neutral-500 text-xs truncate leading-tight">{track.artist}</span>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1.5 shrink-0 ml-auto">
            {/* Prev */}
            <motion.button onClick={prevTrack} className="text-neutral-500 hover:text-white transition-colors p-1" whileTap={{ scale: 0.85 }}>
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" />
              </svg>
            </motion.button>

            {/* Play/pause */}
            <motion.button
              onClick={togglePlay}
              className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:bg-neutral-200 transition-colors shrink-0 relative"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
            >
              <AnimatePresence mode="wait">
                {isPlaying ? (
                  <motion.svg key="pause" className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"
                    initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.7 }} transition={{ duration: 0.1 }}>
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                  </motion.svg>
                ) : (
                  <motion.svg key="play" className="w-3 h-3 ml-0.5" fill="currentColor" viewBox="0 0 24 24"
                    initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.7 }} transition={{ duration: 0.1 }}>
                    <path d="M8 5v14l11-7z" />
                  </motion.svg>
                )}
              </AnimatePresence>
              {/* Pulse ring when playing */}
              {isPlaying && (
                <motion.div
                  className="absolute inset-0 rounded-full border border-blue-400"
                  initial={{ scale: 1, opacity: 0.6 }}
                  animate={{ scale: 1.7, opacity: 0 }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut' }}
                />
              )}
            </motion.button>

            {/* Next */}
            <motion.button onClick={nextTrack} className="text-neutral-500 hover:text-white transition-colors p-1" whileTap={{ scale: 0.85 }}>
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
              </svg>
            </motion.button>
          </div>
        </div>

        {/* Expanded panel */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden border-t border-neutral-800"
            >
              <div className="px-4 py-3 space-y-3">
                {/* Progress */}
                <div className="space-y-1">
                  <input
                    type="range" min={0} max={duration || 100} value={currentTime}
                    onChange={(e) => { const v = parseFloat(e.target.value); if (audioRef.current) audioRef.current.currentTime = v; setCurrentTime(v); }}
                    className="w-full h-1 cursor-pointer accent-white"
                    style={{ background: `linear-gradient(to right, white ${progress}%, #333 ${progress}%)` }}
                  />
                  <div className="flex justify-between text-xs text-neutral-600">
                    <span>{fmt(currentTime)}</span>
                    <span>{fmt(duration)}</span>
                  </div>
                </div>

                {/* Skip buttons */}
                <div className="flex items-center justify-center gap-6">
                  <motion.button onClick={skipBackward} className="flex items-center gap-1 text-xs text-neutral-400 hover:text-white transition-colors" whileTap={{ scale: 0.9 }}>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
                    </svg>
                    5s
                  </motion.button>
                  <motion.button onClick={skipForward} className="flex items-center gap-1 text-xs text-neutral-400 hover:text-white transition-colors" whileTap={{ scale: 0.9 }}>
                    5s
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8z" />
                    </svg>
                  </motion.button>
                </div>

                {/* Volume */}
                <div className="flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 text-neutral-500 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
                  </svg>
                  <input
                    type="range" min={0} max={1} step={0.01} value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="flex-1 h-1 cursor-pointer accent-white"
                    style={{ background: `linear-gradient(to right, white ${volume * 100}%, #333 ${volume * 100}%)` }}
                  />
                  <svg className="w-4 h-4 text-neutral-500 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                  </svg>
                </div>

                {/* Playlist */}
                <div className="space-y-0.5 pt-1 border-t border-neutral-800">
                  {PLAYLIST.map((t, i) => (
                    <button
                      key={t.file}
                      onClick={() => { setTrackIndex(i); if (audioRef.current) { audioRef.current.src = t.file; audioRef.current.load(); audioRef.current.play(); setIsPlaying(true); } }}
                      className={`w-full text-left px-2 py-2 rounded text-xs transition-colors flex items-center gap-2 ${
                        i === trackIndex ? 'text-white bg-neutral-800' : 'text-neutral-500 hover:text-white hover:bg-neutral-900'
                      }`}
                    >
                      <span className={`w-3 text-center ${i === trackIndex && isPlaying ? 'text-blue-400' : 'text-neutral-700'}`}>
                        {i === trackIndex && isPlaying ? '▶' : i + 1}
                      </span>
                      <div className="min-w-0">
                        <div className="truncate">{t.title}</div>
                        {t.artist && <div className="text-neutral-600 truncate text-xs">{t.artist}</div>}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <audio
        ref={audioRef}
        src={track.file}
        onTimeUpdate={() => { if (audioRef.current) setCurrentTime(audioRef.current.currentTime); }}
        onLoadedMetadata={() => { if (audioRef.current) setDuration(audioRef.current.duration); }}
        onEnded={nextTrack}
      />
    </motion.div>
  );
}
