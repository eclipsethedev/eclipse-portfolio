'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PLAYLIST = [
  { title: 'Mysëlf', file: '/music/Mysëlf.mp3' },
  { title: 'Resonance', file: '/music/Resonance.mp3' },
];

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.3);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [expanded, setExpanded] = useState(false);

  const track = PLAYLIST[trackIndex];

  // Sync volume
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // Load new track when index changes
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.src = track.file;
    audioRef.current.load();
    if (isPlaying) audioRef.current.play();
  }, [trackIndex]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    setTrackIndex((i) => (i + 1) % PLAYLIST.length);
  };

  const prevTrack = () => {
    // If more than 3s in, restart current track instead
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

  const onTimeUpdate = () => {
    if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
  };

  const onLoadedMetadata = () => {
    if (audioRef.current) setDuration(audioRef.current.duration);
  };

  const onEnded = () => {
    nextTrack();
  };

  const onScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (audioRef.current) audioRef.current.currentTime = val;
    setCurrentTime(val);
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1 }}
    >
      <div className="bg-black/95 backdrop-blur-md border border-neutral-800 rounded-xl overflow-hidden shadow-2xl"
        style={{ width: expanded ? 300 : 'auto' }}
      >
        {/* Collapsed bar */}
        <div className="flex items-center gap-2 px-3 py-2.5">
          {/* Expand toggle */}
          <motion.button
            onClick={() => setExpanded(!expanded)}
            className="text-neutral-500 hover:text-white transition-colors w-5 h-5 flex items-center justify-center"
            whileTap={{ scale: 0.9 }}
            aria-label="Expand player"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              {expanded
                ? <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                : <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
              }
            </svg>
          </motion.button>

          {/* Track name */}
          <span className="text-xs text-neutral-300 font-medium truncate" style={{ maxWidth: expanded ? 160 : 80 }}>
            {track.title}
          </span>

          {/* Prev */}
          <motion.button onClick={prevTrack} className="text-neutral-400 hover:text-white transition-colors" whileTap={{ scale: 0.9 }} aria-label="Previous">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
            </svg>
          </motion.button>

          {/* Play/Pause */}
          <motion.button
            onClick={togglePlay}
            className="relative w-8 h-8 flex items-center justify-center text-white bg-neutral-800 rounded-full hover:bg-neutral-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            <AnimatePresence mode="wait">
              {isPlaying ? (
                <motion.svg key="pause" className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"
                  initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.15 }}>
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </motion.svg>
              ) : (
                <motion.svg key="play" className="w-3.5 h-3.5 ml-0.5" fill="currentColor" viewBox="0 0 24 24"
                  initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.15 }}>
                  <path d="M8 5v14l11-7z" />
                </motion.svg>
              )}
            </AnimatePresence>
            {isPlaying && (
              <motion.div className="absolute inset-0 rounded-full border border-blue-500"
                initial={{ scale: 1, opacity: 0.5 }} animate={{ scale: 1.6, opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }} />
            )}
          </motion.button>

          {/* Next */}
          <motion.button onClick={nextTrack} className="text-neutral-400 hover:text-white transition-colors" whileTap={{ scale: 0.9 }} aria-label="Next">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
            </svg>
          </motion.button>
        </div>

        {/* Expanded panel */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden border-t border-neutral-900"
            >
              <div className="px-4 py-3 space-y-3">
                {/* Progress bar */}
                <div className="space-y-1">
                  <input
                    type="range"
                    min={0}
                    max={duration || 100}
                    value={currentTime}
                    onChange={onScrub}
                    className="w-full h-1 accent-white cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, white ${progress}%, #404040 ${progress}%)`,
                    }}
                  />
                  <div className="flex justify-between text-xs text-neutral-600">
                    <span>{fmt(currentTime)}</span>
                    <span>{fmt(duration)}</span>
                  </div>
                </div>

                {/* Skip controls */}
                <div className="flex items-center justify-center gap-4">
                  <motion.button
                    onClick={skipBackward}
                    className="flex items-center gap-1 text-xs text-neutral-400 hover:text-white transition-colors"
                    whileTap={{ scale: 0.9 }}
                    aria-label="Skip back 5 seconds"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
                    </svg>
                    <span>5s</span>
                  </motion.button>

                  <motion.button
                    onClick={skipForward}
                    className="flex items-center gap-1 text-xs text-neutral-400 hover:text-white transition-colors"
                    whileTap={{ scale: 0.9 }}
                    aria-label="Skip forward 5 seconds"
                  >
                    <span>5s</span>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8z"/>
                    </svg>
                  </motion.button>
                </div>

                {/* Volume slider */}
                <div className="flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 text-neutral-500 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
                  </svg>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="flex-1 h-1 accent-white cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, white ${volume * 100}%, #404040 ${volume * 100}%)`,
                    }}
                  />
                  <svg className="w-4 h-4 text-neutral-500 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                  </svg>
                </div>

                {/* Playlist */}
                <div className="space-y-1 pt-1 border-t border-neutral-900">
                  {PLAYLIST.map((t, i) => (
                    <button
                      key={t.file}
                      onClick={() => { setTrackIndex(i); setIsPlaying(true); }}
                      className={`w-full text-left px-2 py-1.5 rounded text-xs transition-colors flex items-center gap-2 ${
                        i === trackIndex ? 'text-white bg-neutral-800' : 'text-neutral-500 hover:text-white hover:bg-neutral-900'
                      }`}
                    >
                      {i === trackIndex && isPlaying ? (
                        <span className="text-blue-400">▶</span>
                      ) : (
                        <span className="text-neutral-700">{i + 1}</span>
                      )}
                      {t.title}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <audio
        ref={audioRef}
        src={track.file}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={onEnded}
      />
    </motion.div>
  );
}
