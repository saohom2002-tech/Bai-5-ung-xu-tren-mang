import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  buildSimulatedSubmission,
  buildSubmissionFromLessonState,
  CLASS_OPTIONS,
  createInitialLeaderboardState,
  formatNowTime,
  formatSeconds,
  getRankedSubmissions,
  getStudentBadge,
  loadLeaderboardState,
  PILLAR_KEYS,
  saveLeaderboardState,
  type ClassOption,
  type LeaderboardPersistedState,
  type LeaderboardSubmission,
  type PillarKey,
} from '../../data/leaderboardData';
import type { LessonState } from '../../types/lesson';
import { triggerFileDownload } from '../../utils/storage';

interface LeaderboardStageProps {
  lessonState: LessonState;
  tvMode: boolean;
  onToggleTvMode: () => void;
  onReturnHome: () => void;
}

interface ConfettiParticle {
  x: number;
  y: number;
  w: number;
  h: number;
  vx: number;
  vy: number;
  rot: number;
  vRot: number;
  color: string;
  alpha: number;
}

const MedalSvg: React.FC<{ rank: 1 | 2 | 3 }> = ({ rank }) => {
  const colorVar =
    rank === 1
      ? 'var(--lb-medal-gold)'
      : rank === 2
        ? 'var(--lb-medal-silver)'
        : 'var(--lb-medal-bronze)';
  return (
    <svg className="lb-medal-svg" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d="M16 4h6l4 10h-6L16 4z" fill={colorVar} opacity="0.55" />
      <path d="M32 4h-6l-4 10h6L32 4z" fill={colorVar} opacity="0.85" />
      <circle
        cx="24"
        cy="29"
        r="14"
        stroke={colorVar}
        strokeWidth="2.5"
        fill={colorVar}
        fillOpacity="0.16"
      />
      <circle
        cx="24"
        cy="29"
        r="10"
        stroke={colorVar}
        strokeWidth="1.2"
        strokeDasharray="2 2"
      />
      <text
        x="24"
        y="34"
        textAnchor="middle"
        fill={colorVar}
        fontFamily="'JetBrains Mono', ui-monospace, monospace"
        fontWeight="700"
        fontSize="13"
      >
        {rank}
      </text>
    </svg>
  );
};

export const LeaderboardStage: React.FC<LeaderboardStageProps> = ({
  lessonState,
  tvMode,
  onToggleTvMode,
  onReturnHome,
}) => {
  const [lbState, setLbState] = useState<LeaderboardPersistedState>(() =>
    loadLeaderboardState()
  );
  const [streamRunning, setStreamRunning] = useState(false);
  const [latestAddedId, setLatestAddedId] = useState<string | null>(null);
  const [filterClass, setFilterClass] = useState<string>('ALL');
  const [sortMode, setSortMode] = useState<'rank' | 'recent' | 'time'>('rank');
  const [searchQuery, setSearchQuery] = useState('');
  const [manualOpen, setManualOpen] = useState(false);
  const [manualName, setManualName] = useState('');
  const [manualClass, setManualClass] = useState<ClassOption>('7A1');
  const [manualScore, setManualScore] = useState('100');
  const [manualTime, setManualTime] = useState('112');
  const [manualPillar, setManualPillar] = useState<PillarKey>('Tôn trọng');
  const [manualFeedback, setManualFeedback] = useState<{
    text: string;
    isError: boolean;
  }>({ text: '', isError: false });
  const [syncNotice, setSyncNotice] = useState<string>('');
  const [celebration, setCelebration] = useState<LeaderboardSubmission | null>(
    null
  );
  const [resetArmed, setResetArmed] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const confettiCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const confettiAnimRef = useRef<number | null>(null);
  const celebrationTimerRef = useRef<number | null>(null);
  const resetTimerRef = useRef<number | null>(null);
  const syncNoticeTimerRef = useRef<number | null>(null);
  const soundEnabledRef = useRef<boolean>(lbState.soundEnabled);

  useEffect(() => {
    soundEnabledRef.current = lbState.soundEnabled;
    saveLeaderboardState(lbState);
  }, [lbState]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && tvMode) {
        onToggleTvMode();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [tvMode, onToggleTvMode]);

  useEffect(() => {
    return () => {
      if (confettiAnimRef.current) cancelAnimationFrame(confettiAnimRef.current);
      if (celebrationTimerRef.current) clearTimeout(celebrationTimerRef.current);
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      if (syncNoticeTimerRef.current) clearTimeout(syncNoticeTimerRef.current);
    };
  }, []);

  const ensureAudioContext = useCallback((): AudioContext | null => {
    if (!audioCtxRef.current) {
      const AudioCtor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (AudioCtor) {
        audioCtxRef.current = new AudioCtor();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      void audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  const playPingSound = useCallback(
    (forcePlay = false) => {
      if (!forcePlay && !soundEnabledRef.current) return;
      const ctx = ensureAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(660, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.26);
    },
    [ensureAudioContext]
  );

  const playFanfareSound = useCallback(() => {
    if (!soundEnabledRef.current) return;
    const ctx = ensureAudioContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5];
    const baseTime = ctx.currentTime;
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const start = baseTime + idx * 0.09;
      const duration = idx === notes.length - 1 ? 0.45 : 0.16;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.001, start);
      gain.gain.linearRampToValueAtTime(0.14, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + duration + 0.02);
    });
  }, [ensureAudioContext]);

  const launchConfetti = useCallback(() => {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }
    const canvas = confettiCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const palette = ['#f59e0b', '#2563eb', '#10b981', '#ec4899', '#7c3aed'];
    const particles: ConfettiParticle[] = [];
    for (let i = 0; i < 85; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: -15 - Math.random() * 140,
        w: 6 + Math.random() * 6,
        h: 4 + Math.random() * 5,
        vx: (Math.random() - 0.5) * 3.5,
        vy: 2.8 + Math.random() * 3.8,
        rot: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.2,
        color: palette[i % palette.length],
        alpha: 1,
      });
    }

    if (confettiAnimRef.current) {
      cancelAnimationFrame(confettiAnimRef.current);
    }

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let activeCount = 0;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vRot;
        if (p.y > canvas.height * 0.78) {
          p.alpha = Math.max(0, p.alpha - 0.03);
        }
        if (p.alpha > 0.02 && p.y < canvas.height + 20) {
          activeCount++;
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
          ctx.restore();
        }
      }
      if (activeCount > 0) {
        confettiAnimRef.current = requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        confettiAnimRef.current = null;
      }
    };
    confettiAnimRef.current = requestAnimationFrame(tick);
  }, []);

  const triggerMaxScoreCelebration = useCallback(
    (student: LeaderboardSubmission) => {
      setCelebration(student);
      launchConfetti();
      playFanfareSound();
      if (celebrationTimerRef.current) {
        clearTimeout(celebrationTimerRef.current);
      }
      celebrationTimerRef.current = window.setTimeout(() => {
        setCelebration(null);
      }, 6500);
    },
    [launchConfetti, playFanfareSound]
  );

  const pushSubmission = useCallback(
    (newItem: LeaderboardSubmission) => {
      setLbState((prev) => {
        const nextSubmissions = prev.submissions.slice();
        const existingIdx = nextSubmissions.findIndex(
          (s) =>
            s.name.toLowerCase() === newItem.name.toLowerCase() &&
            s.className === newItem.className
        );

        let selectedId = newItem.id;
        if (existingIdx >= 0) {
          const existing = nextSubmissions[existingIdx];
          if (
            newItem.score > existing.score ||
            (newItem.score === existing.score && newItem.timeSec < existing.timeSec)
          ) {
            nextSubmissions[existingIdx] = newItem;
          } else {
            nextSubmissions[existingIdx] = {
              ...existing,
              submittedAt: newItem.submittedAt,
              seq: newItem.seq,
            };
            selectedId = existing.id;
          }
        } else {
          nextSubmissions.push(newItem);
        }

        const latency = 18 + Math.floor(Math.random() * 29);
        const nextFeed = [
          {
            nodeId: newItem.id,
            name: newItem.name,
            className: newItem.className,
            score: newItem.score,
            timeSec: newItem.timeSec,
            time: newItem.submittedAt,
            latency,
          },
          ...prev.feedEvents,
        ].slice(0, 15);

        return {
          ...prev,
          submissions: nextSubmissions,
          selectedId,
          nextSeq: Math.max(prev.nextSeq + 1, newItem.seq + 1),
          feedEvents: nextFeed,
        };
      });

      setLatestAddedId(newItem.id);

      if (newItem.score === 100) {
        triggerMaxScoreCelebration(newItem);
      } else {
        playPingSound();
      }
    },
    [playPingSound, triggerMaxScoreCelebration]
  );

  const simulateSingleSubmission = useCallback(
    (forcePerfect: boolean) => {
      const sub = buildSimulatedSubmission(
        lbState.submissions,
        lbState.nextSeq,
        forcePerfect
      );
      pushSubmission(sub);
    },
    [lbState.submissions, lbState.nextSeq, pushSubmission]
  );

  const simulateRef = useRef(simulateSingleSubmission);
  useEffect(() => {
    simulateRef.current = simulateSingleSubmission;
  }, [simulateSingleSubmission]);

  useEffect(() => {
    if (!streamRunning) return;
    const id = window.setInterval(() => {
      simulateRef.current(false);
    }, lbState.streamSpeedMs);
    return () => window.clearInterval(id);
  }, [streamRunning, lbState.streamSpeedMs]);

  const handleToggleSound = () => {
    setLbState((prev) => {
      const nextSound = !prev.soundEnabled;
      if (nextSound) {
        playPingSound(true);
      }
      return {
        ...prev,
        soundEnabled: nextSound,
      };
    });
  };

  const handlePushCurrentLesson = () => {
    const sub = buildSubmissionFromLessonState(lessonState, lbState.nextSeq);
    pushSubmission(sub);
    setSyncNotice(
      `Đã gửi kết quả hiện tại của ${sub.name} (${sub.className}) — ${sub.score}/100 điểm lên Bảng Vàng!`
    );
    if (syncNoticeTimerRef.current) {
      clearTimeout(syncNoticeTimerRef.current);
    }
    syncNoticeTimerRef.current = window.setTimeout(() => {
      setSyncNotice('');
    }, 5000);
  };

  const handleManualSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const name = manualName.trim();
    const score = Number(manualScore);
    const timeSec = Number(manualTime);

    if (!name || name.length < 2) {
      setManualFeedback({
        text: 'Vui lòng nhập đầy đủ họ và tên học sinh (ít nhất 2 ký tự).',
        isError: true,
      });
      return;
    }
    if (Number.isNaN(score) || score < 0 || score > 100) {
      setManualFeedback({
        text: 'Điểm số phải nằm trong khoảng từ 0 đến 100.',
        isError: true,
      });
      return;
    }

    const newStudent: LeaderboardSubmission = {
      id: `fb-${100 + lbState.nextSeq}`,
      name,
      className: manualClass,
      score,
      timeSec: Math.max(20, Number.isNaN(timeSec) ? 120 : timeSec),
      topPillar: manualPillar,
      pillars: {
        'Tôn trọng': score,
        'Tử tế': score,
        'Thận trọng': score,
        'Tra cứu': score,
        'Trách nhiệm': score,
      },
      commitment:
        'Cam kết thực hành 5T: Tôn trọng — Tử tế — Thận trọng — Tra cứu — Trách nhiệm trên không gian mạng.',
      submittedAt: formatNowTime(),
      seq: lbState.nextSeq,
    };

    pushSubmission(newStudent);
    setManualName('');
    setManualFeedback({
      text: `Đã cập nhật kết quả của ${name} (${manualClass}) lên Bảng Vàng!`,
      isError: false,
    });
  };

  const handleExportCsv = () => {
    const ranked = getRankedSubmissions(lbState.submissions);
    const header = [
      'Hạng',
      'Họ và tên',
      'Lớp',
      'Điểm (100)',
      'Thời gian',
      'Trạm 5T nổi bật',
      'Danh hiệu',
      'Giờ nộp',
    ];
    const rows = ranked.map((s, idx) =>
      [
        idx + 1,
        `"${s.name.replace(/"/g, '""')}"`,
        s.className,
        s.score,
        formatSeconds(s.timeSec),
        `"${s.topPillar}"`,
        `"${getStudentBadge(s)}"`,
        s.submittedAt,
      ].join(',')
    );

    const csvContent = `\uFEFF${[header.join(','), ...rows].join('\n')}`;
    triggerFileDownload(
      'Bang_vang_Bai5_Ung_xu_tren_mang.csv',
      csvContent,
      'text/csv;charset=utf-8;'
    );
  };

  const handleResetClick = () => {
    if (!resetArmed) {
      setResetArmed(true);
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      resetTimerRef.current = window.setTimeout(() => {
        setResetArmed(false);
      }, 4000);
      return;
    }

    setResetArmed(false);
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    setStreamRunning(false);
    setLatestAddedId(null);
    setCelebration(null);
    setLbState(createInitialLeaderboardState());
  };

  const globalRanked = useMemo(
    () => getRankedSubmissions(lbState.submissions),
    [lbState.submissions]
  );

  const globalRankMap = useMemo(() => {
    const map: Record<string, number> = {};
    globalRanked.forEach((item, idx) => {
      map[item.id] = idx + 1;
    });
    return map;
  }, [globalRanked]);

  const filteredSubmissions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let list = lbState.submissions.filter((item) => {
      const matchClass = filterClass === 'ALL' || item.className === filterClass;
      const matchSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.className.toLowerCase().includes(q);
      return matchClass && matchSearch;
    });

    if (sortMode === 'recent') {
      list = list.slice().sort((a, b) => b.seq - a.seq);
    } else if (sortMode === 'time') {
      list = list
        .slice()
        .sort((a, b) => a.timeSec - b.timeSec || b.score - a.score);
    } else {
      list = getRankedSubmissions(list);
    }
    return list;
  }, [lbState.submissions, filterClass, searchQuery, sortMode]);

  const top10 = useMemo(() => filteredSubmissions.slice(0, 10), [filteredSubmissions]);

  const selectedStudent = useMemo(() => {
    const found = lbState.submissions.find((s) => s.id === lbState.selectedId);
    return found || globalRanked[0] || null;
  }, [lbState.submissions, lbState.selectedId, globalRanked]);

  const kpis = useMemo(() => {
    const all = lbState.submissions;
    const total = all.length;
    const avgScore = total
      ? all.reduce((sum, s) => sum + s.score, 0) / total
      : 0;
    const perfectCount = all.filter((s) => s.score === 100).length;
    const perfectPct = total ? Math.round((perfectCount / total) * 100) : 0;
    const avgTime = total
      ? all.reduce((sum, s) => sum + s.timeSec, 0) / total
      : 0;
    const latest = all.slice().sort((a, b) => b.seq - a.seq)[0] || null;
    return { total, avgScore, perfectCount, perfectPct, avgTime, latest };
  }, [lbState.submissions]);

  const pillarAverages = useMemo(() => {
    const all = lbState.submissions;
    return PILLAR_KEYS.map((key) => {
      if (!all.length) return { key, avg: 0 };
      const total = all.reduce(
        (sum, s) =>
          sum + (s.pillars && typeof s.pillars[key] === 'number' ? s.pillars[key] : s.score),
        0
      );
      return { key, avg: Math.round(total / all.length) };
    });
  }, [lbState.submissions]);

  const latestJsonPreview = useMemo(() => {
    if (!kpis.latest) return '';
    return JSON.stringify(
      {
        ref: `/thcs_tan_binh/tin7_bai5/submissions/${kpis.latest.id}`,
        event: 'child_added',
        payload: {
          hocSinh: kpis.latest.name,
          lop: kpis.latest.className,
          diem: kpis.latest.score,
          thoiGianGiay: kpis.latest.timeSec,
          tram5T: kpis.latest.topPillar,
          camKetTuTe: true,
        },
      },
      null,
      2
    );
  }, [kpis.latest]);

  const podiumSlots: Array<{
    rank: 1 | 2 | 3;
    item: LeaderboardSubmission | null;
    title: string;
  }> = [
    { rank: 2, item: globalRanked[1] || null, title: 'Huy chương Bạc' },
    { rank: 1, item: globalRanked[0] || null, title: 'Huy chương Vàng' },
    { rank: 3, item: globalRanked[2] || null, title: 'Huy chương Đồng' },
  ];

  return (
    <div className={`lb-root${tvMode ? ' lb-tv-mode' : ''}`}>
      <canvas
        ref={confettiCanvasRef}
        className="lb-confetti-canvas"
        aria-hidden="true"
      />

      <div className="lb-page-grid">
        {/* Top Header */}
        <header className="lb-top-header">
          <div className="lb-header-title-wrap">
            <span className="lb-header-meta">
              Chuyên đề Tin học 7 · Trường THCS Tân Bình · GV: Trần Thị Thanh Trúc
            </span>
            <h1 className="lb-page-title">
              Bảng Vàng Vinh Danh — Bài 5: Ứng Xử Trên Mạng
            </h1>
            <p className="lb-page-subtitle">
              Theo dõi kết quả thực hành 5T &amp; Cam kết tử tế theo thời gian thực (“Sau màn hình, là một trái tim”).
            </p>
          </div>

          <div className="lb-header-actions">
            <button
              type="button"
              className="lb-btn lb-btn-cyan-outline"
              onClick={onReturnHome}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M19 12H5" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              <span>Về trang chủ Bài 5</span>
            </button>

            <button
              type="button"
              className={`lb-btn${lbState.soundEnabled ? ' lb-btn-sage' : ''}`}
              onClick={handleToggleSound}
              aria-pressed={lbState.soundEnabled}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                {lbState.soundEnabled ? (
                  <>
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                  </>
                ) : (
                  <>
                    <line x1="23" y1="9" x2="17" y2="15" />
                    <line x1="17" y1="9" x2="23" y2="15" />
                  </>
                )}
              </svg>
              <span>{lbState.soundEnabled ? 'Âm thanh: Bật' : 'Âm thanh: Tắt'}</span>
            </button>

            <button
              type="button"
              className={`lb-btn${tvMode ? ' lb-btn-primary' : ''}`}
              onClick={onToggleTvMode}
              aria-pressed={tvMode}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <rect x="2" y="7" width="20" height="13" rx="2" />
                <polyline points="17 2 12 7 7 2" />
              </svg>
              <span>{tvMode ? 'Thoát Smart TV' : 'Chế độ Smart TV'}</span>
            </button>

            <button type="button" className="lb-btn" onClick={handleExportCsv}>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>Xuất CSV</span>
            </button>

            <button
              type="button"
              className={`lb-btn${resetArmed ? ' lb-btn-danger-armed' : ''}`}
              onClick={handleResetClick}
            >
              <span>
                {resetArmed ? 'Bấm lại để xác nhận khôi phục' : 'Khôi phục mẫu'}
              </span>
            </button>
          </div>
        </header>

        {/* Max Score Celebration Banner */}
        {celebration && (
          <section
            className="lb-celebration-banner"
            role="status"
            aria-live="polite"
          >
            <div className="lb-celebration-content">
              <div className="lb-celebration-badge" aria-hidden="true">
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="8" r="6" />
                  <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
                </svg>
              </div>
              <div>
                <h2 className="lb-celebration-title">
                  Chúc mừng {celebration.name} ({celebration.className}) đạt Điểm
                  Tối Đa 100/100!
                </h2>
                <p className="lb-celebration-desc">
                  Hoàn thành trong {formatSeconds(celebration.timeSec)} · Danh hiệu:{' '}
                  {getStudentBadge(celebration)} · Trạm mạnh nhất:{' '}
                  {celebration.topPillar}.
                </p>
              </div>
            </div>
            <button
              type="button"
              className="lb-btn"
              onClick={() => setCelebration(null)}
            >
              Đóng
            </button>
          </section>
        )}

        {/* Top-Line KPI Strip */}
        <section
          className="lb-kpi-grid"
          aria-label="Thống kê lớp học thời gian thực"
        >
          <article className="lb-kpi-card">
            <span className="lb-data-label">Tổng bài đã nộp</span>
            <div className="lb-kpi-value">{kpis.total}</div>
            <div className="lb-kpi-delta">
              {kpis.latest
                ? `Mới nhất: ${kpis.latest.name} (${kpis.latest.className})`
                : 'Chưa có bài nộp'}
            </div>
          </article>

          <article className="lb-kpi-card">
            <span className="lb-data-label">Điểm trung bình</span>
            <div className="lb-kpi-value">{kpis.avgScore.toFixed(1)} / 100</div>
            <div className="lb-kpi-delta">
              Quy đổi thang 10: {(kpis.avgScore / 10).toFixed(1)} điểm
            </div>
          </article>

          <article className="lb-kpi-card">
            <span className="lb-data-label">Đạt điểm tối đa (100/100)</span>
            <div className="lb-kpi-value">{kpis.perfectCount}</div>
            <div className="lb-kpi-delta">
              {kpis.perfectPct}% tổng số học sinh
            </div>
          </article>

          <article className="lb-kpi-card">
            <span className="lb-data-label">Thời gian hoàn thành TB</span>
            <div className="lb-kpi-value">{formatSeconds(kpis.avgTime)}</div>
            <div className="lb-kpi-delta lb-neutral">
              100% đã ký Cam kết tử tế
            </div>
          </article>
        </section>

        {/* Firebase Realtime Control & Filter Bar */}
        <section
          className="lb-control-panel"
          aria-label="Điều khiển mô phỏng Firebase và bộ lọc"
        >
          <div className="lb-control-row">
            <div className="lb-control-group">
              <div className="lb-field-group">
                <span className="lb-field-label">
                  Đồng bộ Firebase (Mô phỏng)
                </span>
                <div className="lb-inline-row">
                  <button
                    type="button"
                    className="lb-btn lb-btn-primary"
                    onClick={() => setStreamRunning((prev) => !prev)}
                  >
                    <span>
                      {streamRunning
                        ? 'Tạm dừng nhận bài'
                        : 'Bắt đầu nhận bài thời gian thực'}
                    </span>
                  </button>
                  <div className="lb-stream-indicator">
                    <span
                      className={`lb-stream-dot${streamRunning ? ' lb-active' : ''}`}
                    />
                    <span>
                      {streamRunning
                        ? `Đang lắng nghe Firebase · ${(lbState.streamSpeedMs / 1000).toFixed(1)}s`
                        : 'Đang tạm dừng · child_added'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="lb-field-group">
                <label className="lb-field-label" htmlFor="lb-select-speed">
                  Tốc độ gửi về
                </label>
                <select
                  className="lb-select-control"
                  id="lb-select-speed"
                  value={lbState.streamSpeedMs}
                  onChange={(e) =>
                    setLbState((prev) => ({
                      ...prev,
                      streamSpeedMs: Number(e.target.value) || 3200,
                    }))
                  }
                >
                  <option value={5500}>Chậm (5.5 giây/bài)</option>
                  <option value={3200}>Chuẩn lớp học (3.2 giây)</option>
                  <option value={1600}>Nhanh (1.6 giây)</option>
                </select>
              </div>
            </div>

            <div className="lb-control-group">
              <button
                type="button"
                className="lb-btn lb-btn-sage"
                onClick={() => simulateSingleSubmission(false)}
              >
                <span>+ Nhận 1 bài ngẫu nhiên</span>
              </button>
              <button
                type="button"
                className="lb-btn lb-btn-gold"
                onClick={() => simulateSingleSubmission(true)}
              >
                <span>★ Mô phỏng HS đạt 100/100</span>
              </button>
              <button
                type="button"
                className="lb-btn lb-btn-cyan-outline"
                onClick={handlePushCurrentLesson}
              >
                <span>↗ Gửi bài làm hiện tại</span>
              </button>
              <button
                type="button"
                className="lb-btn"
                onClick={() => setManualOpen((prev) => !prev)}
              >
                <span>Nhập tay kết quả</span>
              </button>
            </div>
          </div>

          {syncNotice && (
            <div className="lb-form-feedback" role="status" aria-live="polite">
              {syncNotice}
            </div>
          )}

          <div className="lb-control-row">
            <div className="lb-control-group lb-filter-grow">
              <div className="lb-field-group lb-search-grow">
                <label className="lb-field-label" htmlFor="lb-search-student">
                  Tìm học sinh trên Bảng Vàng
                </label>
                <input
                  className="lb-input-control"
                  id="lb-search-student"
                  type="search"
                  placeholder="Nhập họ tên học sinh..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="lb-field-group">
                <label className="lb-field-label" htmlFor="lb-filter-class">
                  Lọc theo lớp
                </label>
                <select
                  className="lb-select-control"
                  id="lb-filter-class"
                  value={filterClass}
                  onChange={(e) => setFilterClass(e.target.value)}
                >
                  <option value="ALL">Tất cả khối 7</option>
                  {CLASS_OPTIONS.map((cls) => (
                    <option key={cls} value={cls}>
                      Lớp {cls}
                    </option>
                  ))}
                </select>
              </div>

              <div className="lb-field-group">
                <label className="lb-field-label" htmlFor="lb-filter-sort">
                  Sắp xếp
                </label>
                <select
                  className="lb-select-control"
                  id="lb-filter-sort"
                  value={sortMode}
                  onChange={(e) =>
                    setSortMode(e.target.value as 'rank' | 'recent' | 'time')
                  }
                >
                  <option value="rank">
                    Điểm cao nhất → Thời gian nhanh nhất
                  </option>
                  <option value="recent">Mới gửi về gần nhất</option>
                  <option value="time">Hoàn thành nhanh nhất</option>
                </select>
              </div>
            </div>
          </div>

          {/* Manual Entry Drawer */}
          {manualOpen && (
            <div className="lb-manual-drawer">
              <form
                className="lb-manual-form-grid"
                onSubmit={handleManualSubmit}
              >
                <div className="lb-field-group">
                  <label className="lb-field-label" htmlFor="lb-manual-name">
                    Họ và tên học sinh
                  </label>
                  <input
                    className="lb-input-control"
                    id="lb-manual-name"
                    type="text"
                    placeholder="Ví dụ: Nguyễn Minh Khôi"
                    value={manualName}
                    onChange={(e) => setManualName(e.target.value)}
                    required
                  />
                </div>

                <div className="lb-field-group">
                  <label className="lb-field-label" htmlFor="lb-manual-class">
                    Lớp
                  </label>
                  <select
                    className="lb-select-control"
                    id="lb-manual-class"
                    value={manualClass}
                    onChange={(e) =>
                      setManualClass(e.target.value as ClassOption)
                    }
                  >
                    {CLASS_OPTIONS.map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="lb-field-group">
                  <label className="lb-field-label" htmlFor="lb-manual-score">
                    Điểm số (0–100)
                  </label>
                  <input
                    className="lb-input-control"
                    id="lb-manual-score"
                    type="number"
                    min={0}
                    max={100}
                    step={5}
                    value={manualScore}
                    onChange={(e) => setManualScore(e.target.value)}
                    required
                  />
                </div>

                <div className="lb-field-group">
                  <label className="lb-field-label" htmlFor="lb-manual-time">
                    Thời gian (giây)
                  </label>
                  <input
                    className="lb-input-control"
                    id="lb-manual-time"
                    type="number"
                    min={35}
                    max={900}
                    value={manualTime}
                    onChange={(e) => setManualTime(e.target.value)}
                    required
                  />
                </div>

                <div className="lb-field-group">
                  <label className="lb-field-label" htmlFor="lb-manual-pillar">
                    Trạm 5T nổi bật
                  </label>
                  <select
                    className="lb-select-control"
                    id="lb-manual-pillar"
                    value={manualPillar}
                    onChange={(e) =>
                      setManualPillar(e.target.value as PillarKey)
                    }
                  >
                    {PILLAR_KEYS.map((pillar) => (
                      <option key={pillar} value={pillar}>
                        {pillar}
                      </option>
                    ))}
                  </select>
                </div>

                <button type="submit" className="lb-btn lb-btn-primary">
                  Gửi lên Bảng Vàng
                </button>
              </form>

              {manualFeedback.text && (
                <div
                  className={`lb-form-feedback${manualFeedback.isError ? ' lb-error' : ''}`}
                  aria-live="polite"
                >
                  {manualFeedback.text}
                </div>
              )}
            </div>
          )}
        </section>

        {/* Top 3 Podium */}
        <section aria-label="Vinh danh Top 3 huy chương Vàng, Bạc, Đồng">
          {globalRanked.length === 0 ? (
            <div className="lb-empty-state">
              Chưa có dữ liệu xếp hạng. Hãy bật luồng mô phỏng hoặc nhập kết quả học sinh.
            </div>
          ) : (
            <div className="lb-podium-grid">
              {podiumSlots.map((slot) => {
                if (!slot.item) {
                  return (
                    <article
                      key={slot.rank}
                      className={`lb-podium-card lb-rank-${slot.rank}`}
                    >
                      <div className="lb-podium-top">
                        <span className="lb-podium-rank-label">
                          Hạng #{slot.rank} · {slot.title}
                        </span>
                        <MedalSvg rank={slot.rank} />
                      </div>
                      <h3 className="lb-podium-name">Đang chờ thí sinh</h3>
                      <div className="lb-podium-class">Chưa có dữ liệu</div>
                    </article>
                  );
                }

                const s = slot.item;
                return (
                  <article
                    key={slot.rank}
                    className={`lb-podium-card lb-rank-${slot.rank} lb-clickable`}
                    onClick={() =>
                      setLbState((prev) => ({ ...prev, selectedId: s.id }))
                    }
                  >
                    <div className="lb-podium-top">
                      <span className="lb-podium-rank-label">
                        Hạng #{slot.rank} · {slot.title}
                      </span>
                      <MedalSvg rank={slot.rank} />
                    </div>
                    <div>
                      <h3 className="lb-podium-name">{s.name}</h3>
                      <div className="lb-podium-class">
                        Lớp {s.className} · Nộp lúc {s.submittedAt}
                      </div>
                    </div>
                    <div className="lb-podium-metrics">
                      <span className="lb-podium-score">
                        {s.score}
                        <span className="lb-podium-score-max">/100</span>
                      </span>
                      <span className="lb-podium-time">
                        ⏱ {formatSeconds(s.timeSec)}
                      </span>
                    </div>
                    <div className="lb-podium-tag">
                      {getStudentBadge(s)} · 5T: {s.topPillar}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* Main Two-Column Workspace */}
        <section className="lb-workspace-grid">
          {/* Left: Top 10 Table + Inline Inspector */}
          <div className="lb-panel">
            <div className="lb-panel-header">
              <div>
                <span className="lb-data-label">
                  Xếp hạng thời gian thực · Thang 100 điểm
                </span>
                <h2 className="lb-panel-title">Top 10 Học Sinh Xuất Sắc Nhất</h2>
              </div>
              <span className="lb-data-label">
                Top {top10.length} / {filteredSubmissions.length} bài phù hợp
              </span>
            </div>

            <div className="lb-table-wrap">
              <table className="lb-leaderboard-table">
                <thead>
                  <tr>
                    <th>Hạng</th>
                    <th>Học sinh</th>
                    <th>Lớp</th>
                    <th className="lb-num-col">Điểm</th>
                    <th className="lb-num-col">Thời gian</th>
                    <th>Năng lực 5T</th>
                    <th>Danh hiệu</th>
                  </tr>
                </thead>
                <tbody>
                  {top10.length === 0 ? (
                    <tr>
                      <td colSpan={7}>
                        <div className="lb-empty-state">
                          Không tìm thấy học sinh phù hợp bộ lọc hiện tại. Hãy thử chọn “Tất cả khối 7” hoặc xóa từ khóa tìm kiếm.
                        </div>
                      </td>
                    </tr>
                  ) : (
                    top10.map((s) => {
                      const rank = globalRankMap[s.id] || 0;
                      const isSelected = selectedStudent?.id === s.id;
                      const isNew = latestAddedId === s.id;
                      const rowClass = [
                        isSelected ? 'lb-selected-row' : '',
                        isNew ? 'lb-new-entry' : '',
                      ]
                        .filter(Boolean)
                        .join(' ');

                      return (
                        <tr
                          key={s.id}
                          className={rowClass}
                          onClick={() =>
                            setLbState((prev) => ({ ...prev, selectedId: s.id }))
                          }
                        >
                          <td className="lb-rank-cell">
                            {rank === 1 ? (
                              <span className="lb-medal-pill lb-gold">
                                🥇 #01 Vàng
                              </span>
                            ) : rank === 2 ? (
                              <span className="lb-medal-pill lb-silver">
                                🥈 #02 Bạc
                              </span>
                            ) : rank === 3 ? (
                              <span className="lb-medal-pill lb-bronze">
                                🥉 #03 Đồng
                              </span>
                            ) : (
                              <span className="lb-rank-plain">
                                #{String(rank).padStart(2, '0')}
                              </span>
                            )}
                          </td>
                          <td>
                            <div className="lb-student-cell-name">{s.name}</div>
                            <div className="lb-student-cell-sub">
                              Gửi lúc {s.submittedAt}
                            </div>
                          </td>
                          <td>
                            <span className="lb-data-label">{s.className}</span>
                          </td>
                          <td className="lb-num-col">
                            <span
                              className={`lb-score-pill${s.score === 100 ? ' lb-perfect' : ''}`}
                            >
                              {s.score}/100
                            </span>
                          </td>
                          <td className="lb-num-col">
                            {formatSeconds(s.timeSec)}
                          </td>
                          <td>
                            <span className="lb-pillar-chip">
                              {s.topPillar}
                            </span>
                          </td>
                          <td>{getStudentBadge(s)}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Inline Detail Inspector */}
            <div className="lb-detail-card" aria-live="polite">
              {!selectedStudent ? (
                <div className="lb-data-label">
                  Chọn một học sinh trong bảng để xem chi tiết năng lực 5T và Cam kết tử tế.
                </div>
              ) : (
                <>
                  <div className="lb-detail-top">
                    <div>
                      <span className="lb-data-label">
                        Chi tiết bài làm &amp; Cam kết số
                      </span>
                      <div className="lb-detail-student-name">
                        {selectedStudent.name} · Lớp {selectedStudent.className}
                      </div>
                    </div>
                    <div className="lb-detail-badges">
                      <span
                        className={`lb-score-pill${selectedStudent.score === 100 ? ' lb-perfect' : ''}`}
                      >
                        {selectedStudent.score}/100 điểm
                      </span>
                      <span className="lb-data-label">
                        ⏱ {formatSeconds(selectedStudent.timeSec)}
                      </span>
                    </div>
                  </div>

                  <div className="lb-detail-bars">
                    {PILLAR_KEYS.map((k) => {
                      const val =
                        selectedStudent.pillars &&
                        typeof selectedStudent.pillars[k] === 'number'
                          ? selectedStudent.pillars[k]
                          : selectedStudent.score;
                      return (
                        <div key={k} className="lb-mini-pillar">
                          <div className="lb-mini-pillar-head">
                            <span>{k}</span>
                            <span className="lb-data-label">{val}%</span>
                          </div>
                          <div className="lb-mini-bar-track">
                            <div
                              className="lb-mini-bar-fill"
                              style={{ width: `${val}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <blockquote className="lb-commitment-quote">
                    “{selectedStudent.commitment}”
                  </blockquote>
                </>
              )}
            </div>
          </div>

          {/* Right: 5T Mastery Chart + Firebase Realtime Feed */}
          <aside className="lb-side-stack">
            <div className="lb-panel lb-non-tv-panel">
              <div className="lb-panel-header">
                <div>
                  <span className="lb-data-label">
                    Phân tích theo 5 phòng thử thách
                  </span>
                  <h2 className="lb-panel-title">Mức Độ Làm Chủ 5T</h2>
                </div>
              </div>

              <div
                className="lb-chart-rows"
                role="img"
                aria-label="Biểu đồ tỷ lệ làm chủ trung bình lớp theo 5 trụ cột 5T"
              >
                {pillarAverages.map(({ key, avg }) => (
                  <div key={key} className="lb-chart-row">
                    <div className="lb-chart-row-label">{key}</div>
                    <div className="lb-chart-track">
                      <div
                        className={`lb-chart-fill${avg >= 90 ? ' lb-sage' : ''}`}
                        style={{ width: `${avg}%` }}
                      />
                    </div>
                    <div className="lb-chart-val">{avg}%</div>
                  </div>
                ))}
                <div className="lb-chart-axis" aria-hidden="true">
                  <span>0%</span>
                  <span>25%</span>
                  <span>50%</span>
                  <span>75%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>

            <div className="lb-panel">
              <div className="lb-panel-header">
                <div>
                  <span className="lb-data-label">Firebase RTDB Listener</span>
                  <h2 className="lb-panel-title">Luồng Dữ Liệu Gửi Về</h2>
                </div>
                <span className="lb-data-label">
                  {lbState.feedEvents.length > 0
                    ? `${lbState.feedEvents[0].latency} ms`
                    : '24 ms'}
                </span>
              </div>

              <ul className="lb-feed-list">
                {lbState.feedEvents.length === 0 && kpis.latest ? (
                  <li className="lb-feed-item">
                    <div className="lb-feed-meta">
                      <span>snapshot · /tin7_bai5/submissions</span>
                      <span>{kpis.latest.submittedAt}</span>
                    </div>
                    <div className="lb-feed-msg">
                      Đã tải {lbState.submissions.length} bản ghi ban đầu từ kho dữ liệu lớp 7.
                    </div>
                  </li>
                ) : (
                  lbState.feedEvents.slice(0, 5).map((ev, idx) => (
                    <li
                      key={`${ev.nodeId}-${idx}`}
                      className={`lb-feed-item${ev.score === 100 ? ' lb-perfect-event' : ''}`}
                    >
                      <div className="lb-feed-meta">
                        <span>child_added · {ev.nodeId}</span>
                        <span>
                          {ev.time} · {ev.latency}ms
                        </span>
                      </div>
                      <div className="lb-feed-msg">
                        <strong>{ev.name}</strong> ({ev.className}) —{' '}
                        <strong>{ev.score}/100</strong> (
                        {formatSeconds(ev.timeSec)})
                      </div>
                    </li>
                  ))
                )}
              </ul>

              {latestJsonPreview && (
                <pre className="lb-json-well">{latestJsonPreview}</pre>
              )}
            </div>
          </aside>
        </section>

        {/* Source Footer */}
        <footer className="lb-source-footer">
          <span>
            Nguồn học liệu: Kế hoạch chuyên đề Tin học 7 cấp trường &amp; Bài 5: Ứng xử trên mạng (SGK Kết nối tri thức với cuộc sống) · Tổ Công nghệ - Tin học, Trường THCS Tân Bình.
          </span>
          <span>
            Hệ sinh thái Web App/Game “Gia Sư Tin Học” · Chuẩn 5T: Tôn trọng — Tử tế — Thận trọng — Tra cứu — Trách nhiệm.
          </span>
        </footer>
      </div>
    </div>
  );
};
