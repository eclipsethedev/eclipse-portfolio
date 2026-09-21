'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PLAYLIST = [
  { title: 'Nights', artist: 'Frank Ocean', file: '/music/Frank Ocean - Nights.mp3' },
  { title: 'Sativa', artist: 'Jhené Aiko ft. Swae Lee', file: '/music/Jhené Aiko - Sativa ft. Swae Lee (Official Audio).mp3' },
  { title: 'Mysëlf', artist: '', file: '/music/Mysëlf.mp3' },
  { title: 'Resonance', artist: '', file: '/music/Resonance.mp3' },
];

type LoopMode = 'none' | 'all' | 'one';

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(1); // Sativa first
  const [volume, setVolume] = useState(0.3);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [loopMode, setLoopMode] = useState<LoopMode>('all');
  const [speed, setSpeed] = useState(1);
  const [autoplayed, setAutoplayed] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Spacebar play/pause
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code !== 'Space') return;
      const tag = (e.target as HTMLElement).tagName.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
      e.preventDefault();
      if (!audioRef.current) return;
      if (audioRef.current.paused) {
        audioRef.current.play();
        setIsPlaying(true);
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const track = PLAYLIST[trackIndex];

  // Autoplay on first interaction
  useEffect(() => {
    const tryAutoplay = () => {
      if (autoplayed || !audioRef.current) return;
      audioRef.current.volume = isMuted ? 0 : volume;
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        setAutoplayed(true);
      }).catch(() => {});
    };
    document.addEventListener('click', tryAutoplay, { once: true });
    document.addEventListener('scroll', tryAutoplay, { once: true });
    return () => {
      document.removeEventListener('click', tryAutoplay);
      document.removeEventListener('scroll', tryAutoplay);
    };
  }, [autoplayed]);

  // Sync volume + mute
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  // Sync playback speed
  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = speed;
  }, [speed]);

  // Load track on index change
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.src = PLAYLIST[trackIndex].file;
    audioRef.current.load();
    audioRef.current.volume = isMuted ? 0 : volume;
    audioRef.current.playbackRate = speed;
    if (isPlaying) audioRef.current.play();
  }, [trackIndex]);

  const getNextIndex = useCallback(() => {
    if (shuffle) {
      let next;
      do { next = Math.floor(Math.random() * PLAYLIST.length); }
      while (next === trackIndex && PLAYLIST.length > 1);
      return next;
    }
    return (trackIndex + 1) % PLAYLIST.length;
  }, [shuffle, trackIndex]);

  const handleEnded = () => {
    if (loopMode === 'one') {
      audioRef.current?.play();
      return;
    }
    if (loopMode === 'none' && trackIndex === PLAYLIST.length - 1) {
      setIsPlaying(false);
      return;
    }
    setTrackIndex(getNextIndex());
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); }
    else { audioRef.current.play(); setIsPlaying(true); }
  };

  const nextTrack = () => setTrackIndex(getNextIndex());

  const prevTrack = () => {
    if (currentTime > 3 && audioRef.current) { audioRef.current.currentTime = 0; return; }
    setTrackIndex((i) => (i - 1 + PLAYLIST.length) % PLAYLIST.length);
  };

  const skipForward = () => { if (audioRef.current) audioRef.current.currentTime = Math.min(currentTime + 5, duration); };
  const skipBackward = () => { if (audioRef.current) audioRef.current.currentTime = Math.max(currentTime - 5, 0); };

  const cycleLoop = () => {
    setLoopMode((m) => m === 'none' ? 'all' : m === 'all' ? 'one' : 'none');
  };

  const fmt = (s: number) => {
    if (!s || isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;
  const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

  // Minimized dot view
  if (minimized) {
    return (
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <motion.button
          onClick={() => setMinimized(false)}
          className="w-12 h-12 rounded-full bg-neutral-950 border border-neutral-700 flex items-center justify-center shadow-2xl relative"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title="Expand player"
        >
          <div className="flex items-end gap-px h-4 w-4">
            {[0.4, 1, 0.6, 0.9, 0.5].map((h, i) => (
              <motion.div
                key={i}
                className={`w-1 rounded-sm ${isPlaying ? 'bg-blue-400' : 'bg-neutral-600'}`}
                animate={isPlaying ? { scaleY: [h, 1, 0.3, 0.8, h] } : { scaleY: 0.3 }}
                transition={isPlaying ? { duration: 0.8, repeat: Infinity, delay: i * 0.1, ease: 'easeInOut' } : { duration: 0.3 }}
                style={{ height: 16, originY: 1 }}
              />
            ))}
          </div>
          {isPlaying && (
            <motion.div className="absolute inset-0 rounded-full border border-blue-500/40"
              animate={{ scale: [1, 1.3], opacity: [0.5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
            />
          )}
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1.5 }}
    >
      <motion.div
        className="bg-neutral-950 border border-neutral-700 shadow-2xl overflow-hidden"
        animate={{ width: expanded ? 300 : 260 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        style={{ borderRadius: 12 }}
      >
        {/* Expand tab */}
        <motion.button
          onClick={() => { setExpanded(!expanded); setShowSettings(false); }}
          className="w-full flex items-center justify-center gap-1.5 py-1.5 border-b border-neutral-800 hover:bg-neutral-900 transition-colors group"
          whileTap={{ scale: 0.98 }}
        >
          <motion.svg className="w-3 h-3 text-neutral-500 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24"
            animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
            <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
          </motion.svg>
          <span className="text-xs text-neutral-500 group-hover:text-white transition-colors">
            {expanded ? 'collapse' : 'expand'}
          </span>
        </motion.button>

        {/* Main bar */}
        <div className="flex items-center gap-3 px-4 py-3">
          {/* Equalizer */}
          <div className="shrink-0 flex items-end gap-px h-5 w-5">
            {[0.4, 1, 0.6, 0.9, 0.5].map((h, i) => (
              <motion.div key={i}
                className={`w-1 rounded-sm ${isPlaying ? 'bg-blue-400' : 'bg-neutral-600'}`}
                animate={isPlaying ? { scaleY: [h, 1, 0.3, 0.8, h] } : { scaleY: 0.3 }}
                transition={isPlaying ? { duration: 0.8, repeat: Infinity, delay: i * 0.1, ease: 'easeInOut' } : { duration: 0.3 }}
                style={{ height: 20, originY: 1 }}
              />
            ))}
          </div>

          {/* Track info */}
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-white text-xs font-medium truncate leading-tight">{track.title}</span>
            {track.artist && <span className="text-neutral-500 text-xs truncate leading-tight">{track.artist}</span>}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1.5 shrink-0">
            <motion.button onClick={prevTrack} className="text-neutral-500 hover:text-white transition-colors p-1" whileTap={{ scale: 0.85 }}>
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" /></svg>
            </motion.button>

            <motion.button onClick={togglePlay}
              className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:bg-neutral-200 transition-colors relative"
              whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}>
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
              {isPlaying && (
                <motion.div className="absolute inset-0 rounded-full"
                  style={{ boxShadow: '0 0 12px rgba(255,255,255,0.25)' }} />
              )}
            </motion.button>

            <motion.button onClick={nextTrack} className="text-neutral-500 hover:text-white transition-colors p-1" whileTap={{ scale: 0.85 }}>
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" /></svg>
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
                {/* Progress bar */}
                <div className="space-y-1">
                  <input type="range" min={0} max={duration || 100} value={currentTime}
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
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" /></svg>
                    5s
                  </motion.button>
                  <motion.button onClick={skipForward} className="flex items-center gap-1 text-xs text-neutral-400 hover:text-white transition-colors" whileTap={{ scale: 0.9 }}>
                    5s
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8z" /></svg>
                  </motion.button>
                </div>

                {/* Volume */}
                <div className="flex items-center gap-2">
                  <motion.button onClick={() => setIsMuted(!isMuted)} className="shrink-0 text-neutral-500 hover:text-white transition-colors" whileTap={{ scale: 0.9 }}>
                    {isMuted ? (
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4 9.91 6.09 12 8.18V4z" /></svg>
                    ) : (
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" /></svg>
                    )}
                  </motion.button>
                  <input type="range" min={0} max={1} step={0.01} value={isMuted ? 0 : volume}
                    onChange={(e) => { setVolume(parseFloat(e.target.value)); setIsMuted(false); }}
                    className="flex-1 h-1 cursor-pointer accent-white"
                    style={{ background: `linear-gradient(to right, white ${(isMuted ? 0 : volume) * 100}%, #333 ${(isMuted ? 0 : volume) * 100}%)` }}
                  />
                  <svg className="w-4 h-4 text-neutral-500 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" /></svg>
                </div>

                {/* Settings row */}
                <div className="flex items-center justify-between pt-1 border-t border-neutral-800">
                  {/* Shuffle */}
                  <motion.button onClick={() => setShuffle(!shuffle)}
                    className={`flex items-center gap-1 text-xs transition-colors px-2 py-1 rounded ${shuffle ? 'text-blue-400' : 'text-neutral-500 hover:text-white'}`}
                    whileTap={{ scale: 0.9 }} title="Shuffle">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M10.59 9.17 5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z" /></svg>
                    Shuffle
                  </motion.button>

                  {/* Loop */}
                  <motion.button onClick={cycleLoop}
                    className={`flex items-center gap-1 text-xs transition-colors px-2 py-1 rounded ${loopMode !== 'none' ? 'text-blue-400' : 'text-neutral-500 hover:text-white'}`}
                    whileTap={{ scale: 0.9 }} title="Loop mode">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" /></svg>
                    {loopMode === 'none' ? 'Off' : loopMode === 'all' ? 'All' : 'One'}
                  </motion.button>

                  {/* Settings toggle */}
                  <motion.button onClick={() => setShowSettings(!showSettings)}
                    className={`flex items-center gap-1 text-xs transition-colors px-2 py-1 rounded ${showSettings ? 'text-blue-400' : 'text-neutral-500 hover:text-white'}`}
                    whileTap={{ scale: 0.9 }} title="More settings">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" /></svg>
                  </motion.button>

                  {/* Minimize */}
                  <motion.button onClick={() => setMinimized(true)}
                    className="flex items-center gap-1 text-xs text-neutral-500 hover:text-white transition-colors px-2 py-1 rounded"
                    whileTap={{ scale: 0.9 }} title="Minimize to dot">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 13H5v-2h14v2z" /></svg>
                  </motion.button>
                </div>

                {/* Extended settings panel */}
                <AnimatePresence>
                  {showSettings && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden border-t border-neutral-800 pt-3 space-y-3"
                    >
                      {/* Playback speed */}
                      <div>
                        <div className="text-xs text-neutral-500 mb-2">Playback Speed</div>
                        <div className="flex gap-1 flex-wrap">
                          {SPEEDS.map((s) => (
                            <motion.button key={s} onClick={() => setSpeed(s)}
                              className={`px-2 py-1 text-xs rounded transition-colors ${speed === s ? 'bg-white text-black' : 'bg-neutral-800 text-neutral-400 hover:text-white'}`}
                              whileTap={{ scale: 0.9 }}>
                              {s}x
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Playlist */}
                <div className="space-y-0.5 border-t border-neutral-800 pt-2">
                  {PLAYLIST.map((t, i) => (
                    <button key={t.file}
                      onClick={() => {
                        setTrackIndex(i);
                        if (audioRef.current) {
                          audioRef.current.src = t.file;
                          audioRef.current.load();
                          audioRef.current.volume = isMuted ? 0 : volume;
                          audioRef.current.playbackRate = speed;
                          audioRef.current.play();
                          setIsPlaying(true);
                        }
                      }}
                      className={`w-full text-left px-2 py-2 rounded text-xs transition-colors flex items-center gap-2 ${i === trackIndex ? 'text-white bg-neutral-800' : 'text-neutral-500 hover:text-white hover:bg-neutral-900'}`}
                    >
                      <span className={`w-3 text-center ${i === trackIndex && isPlaying ? 'text-blue-400' : 'text-neutral-700'}`}>
                        {i === trackIndex && isPlaying ? '▶' : i + 1}
                      </span>
                      <div className="min-w-0">
                        <div className="truncate">{t.title}</div>
                        {t.artist && <div className="text-neutral-600 truncate">{t.artist}</div>}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <audio ref={audioRef} src={track.file}
        onTimeUpdate={() => { if (audioRef.current) setCurrentTime(audioRef.current.currentTime); }}
        onLoadedMetadata={() => { if (audioRef.current) setDuration(audioRef.current.duration); }}
        onEnded={handleEnded}
      />
    </motion.div>
  );
}
