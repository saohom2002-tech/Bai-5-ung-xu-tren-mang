import type { LessonState } from '../types/lesson';
import { getCaseScore, getQuizScore, getSortScore } from '../utils/storage';

export type PillarKey = 'Tôn trọng' | 'Tử tế' | 'Thận trọng' | 'Tra cứu' | 'Trách nhiệm';
export type ClassOption = '7A1' | '7A2' | '7A3' | '7A4' | '7A5';

export const PILLAR_KEYS: readonly PillarKey[] = [
  'Tôn trọng',
  'Tử tế',
  'Thận trọng',
  'Tra cứu',
  'Trách nhiệm',
] as const;

export const CLASS_OPTIONS: readonly ClassOption[] = [
  '7A1',
  '7A2',
  '7A3',
  '7A4',
  '7A5',
] as const;

export interface LeaderboardSubmission {
  id: string;
  name: string;
  className: string;
  score: number;
  timeSec: number;
  topPillar: PillarKey;
  pillars: Record<PillarKey, number>;
  commitment: string;
  submittedAt: string;
  seq: number;
}

export interface FeedEvent {
  nodeId: string;
  name: string;
  className: string;
  score: number;
  timeSec: number;
  time: string;
  latency: number;
}

export interface LeaderboardPersistedState {
  submissions: LeaderboardSubmission[];
  selectedId: string;
  soundEnabled: boolean;
  streamSpeedMs: number;
  nextSeq: number;
  feedEvents: FeedEvent[];
}

export const LEADERBOARD_STORAGE_KEY = 'online-tu-te-b5-leaderboard-v1';

export const INITIAL_SUBMISSIONS: LeaderboardSubmission[] = [
  {
    id: 'fb-101',
    name: 'Nguyễn Ngọc Minh Anh',
    className: '7A1',
    score: 100,
    timeSec: 114,
    topPillar: 'Tử tế',
    pillars: {
      'Tôn trọng': 100,
      'Tử tế': 100,
      'Thận trọng': 100,
      'Tra cứu': 100,
      'Trách nhiệm': 100,
    },
    commitment:
      'Dừng lại 3 giây trước khi nhấn Share, luôn dùng lời nói ấm áp với bạn bè trong nhóm chat.',
    submittedAt: '15:52:18',
    seq: 1,
  },
  {
    id: 'fb-102',
    name: 'Trần Gia Bảo',
    className: '7A2',
    score: 100,
    timeSec: 129,
    topPillar: 'Thận trọng',
    pillars: {
      'Tôn trọng': 100,
      'Tử tế': 100,
      'Thận trọng': 100,
      'Tra cứu': 100,
      'Trách nhiệm': 100,
    },
    commitment:
      'Quà lạ đừng ham, link lạ đừng nhấn; bảo vệ tuyệt đối mật khẩu và mã OTP cá nhân.',
    submittedAt: '15:52:45',
    seq: 2,
  },
  {
    id: 'fb-103',
    name: 'Lê Hoàng Nam',
    className: '7A1',
    score: 95,
    timeSec: 121,
    topPillar: 'Tra cứu',
    pillars: {
      'Tôn trọng': 100,
      'Tử tế': 95,
      'Thận trọng': 90,
      'Tra cứu': 100,
      'Trách nhiệm': 90,
    },
    commitment:
      'Kiểm chứng thông tin trên website chính thức của trường trước khi chia sẻ cho lớp.',
    submittedAt: '15:53:04',
    seq: 3,
  },
  {
    id: 'fb-104',
    name: 'Phạm Thảo Nhi',
    className: '7A3',
    score: 95,
    timeSec: 142,
    topPillar: 'Tôn trọng',
    pillars: {
      'Tôn trọng': 100,
      'Tử tế': 95,
      'Thận trọng': 95,
      'Tra cứu': 90,
      'Trách nhiệm': 95,
    },
    commitment:
      'Khác ý kiến vẫn tôn trọng, góp ý vào vấn đề chứ không công kích cá nhân.',
    submittedAt: '15:53:29',
    seq: 4,
  },
  {
    id: 'fb-105',
    name: 'Võ Quốc Huy',
    className: '7A2',
    score: 90,
    timeSec: 136,
    topPillar: 'Trách nhiệm',
    pillars: {
      'Tôn trọng': 90,
      'Tử tế': 90,
      'Thận trọng': 85,
      'Tra cứu': 90,
      'Trách nhiệm': 95,
    },
    commitment:
      'Cân bằng thời gian Internet dưới 2 giờ mỗi ngày, ưu tiên thể thao và trò chuyện cùng gia đình.',
    submittedAt: '15:53:50',
    seq: 5,
  },
  {
    id: 'fb-106',
    name: 'Đặng Khánh Linh',
    className: '7A4',
    score: 90,
    timeSec: 158,
    topPillar: 'Tử tế',
    pillars: {
      'Tôn trọng': 90,
      'Tử tế': 100,
      'Thận trọng': 85,
      'Tra cứu': 85,
      'Trách nhiệm': 90,
    },
    commitment:
      'Khi thấy bạn bị trêu chọc trên mạng, chủ động hỏi thăm và báo cho cô chủ nhiệm hỗ trợ.',
    submittedAt: '15:54:11',
    seq: 6,
  },
  {
    id: 'fb-107',
    name: 'Bùi Tấn Phát',
    className: '7A3',
    score: 85,
    timeSec: 148,
    topPillar: 'Thận trọng',
    pillars: {
      'Tôn trọng': 85,
      'Tử tế': 85,
      'Thận trọng': 95,
      'Tra cứu': 80,
      'Trách nhiệm': 80,
    },
    commitment:
      'Không tự ý chụp ảnh dìm hàng bạn bè đăng lên mạng khi chưa được cho phép.',
    submittedAt: '15:54:33',
    seq: 7,
  },
  {
    id: 'fb-108',
    name: 'Huỳnh Ngọc Hân',
    className: '7A5',
    score: 85,
    timeSec: 164,
    topPillar: 'Tôn trọng',
    pillars: {
      'Tôn trọng': 95,
      'Tử tế': 85,
      'Thận trọng': 80,
      'Tra cứu': 85,
      'Trách nhiệm': 80,
    },
    commitment:
      'Mỗi click chuột là một dấu chân số tử tế để lại trong tập thể lớp 7.',
    submittedAt: '15:54:57',
    seq: 8,
  },
  {
    id: 'fb-109',
    name: 'Ngô Đức Thịnh',
    className: '7A4',
    score: 80,
    timeSec: 171,
    topPillar: 'Tra cứu',
    pillars: {
      'Tôn trọng': 80,
      'Tử tế': 80,
      'Thận trọng': 75,
      'Tra cứu': 90,
      'Trách nhiệm': 75,
    },
    commitment:
      'Không tin ngay các bài đăng giật tít thiếu nguồn rõ ràng trên mạng xã hội.',
    submittedAt: '15:55:19',
    seq: 9,
  },
  {
    id: 'fb-110',
    name: 'Trịnh Phương Uyên',
    className: '7A5',
    score: 80,
    timeSec: 185,
    topPillar: 'Trách nhiệm',
    pillars: {
      'Tôn trọng': 80,
      'Tử tế': 85,
      'Thận trọng': 75,
      'Tra cứu': 75,
      'Trách nhiệm': 85,
    },
    commitment:
      'Nếu lỡ đăng sai thông tin, dũng cảm gỡ bài, đính chính và nhắc bạn bè ngừng chia sẻ.',
    submittedAt: '15:55:42',
    seq: 10,
  },
];

export interface SimulatedStudentSeed {
  name: string;
  className: ClassOption;
  topPillar: PillarKey;
  commitment: string;
}

export const SIMULATED_POOL: SimulatedStudentSeed[] = [
  {
    name: 'Nguyễn Hoàng Thiên Ân',
    className: '7A1',
    topPillar: 'Tử tế',
    commitment:
      'Thế giới ảo nhưng cảm xúc thật — luôn lắng nghe và bảo vệ bạn bè trước bạo lực mạng.',
  },
  {
    name: 'Lý Minh Quân',
    className: '7A2',
    topPillar: 'Thận trọng',
    commitment:
      'Không chia sẻ địa chỉ nhà, số điện thoại hay mật khẩu tài khoản cho người lạ.',
  },
  {
    name: 'Trương Bảo Ngọc',
    className: '7A3',
    topPillar: 'Tra cứu',
    commitment:
      'Kiểm chứng trước, chia sẻ sau — hỏi thầy cô hoặc website trường khi gặp tin đồn.',
  },
  {
    name: 'Phan Anh Khoa',
    className: '7A1',
    topPillar: 'Trách nhiệm',
    commitment:
      'Không thức khuya chơi game trực tuyến, lập thời gian biểu sử dụng Internet hợp lý.',
  },
  {
    name: 'Đoàn Ngọc Diệp',
    className: '7A4',
    topPillar: 'Tôn trọng',
    commitment:
      'Sử dụng ngôn ngữ lịch sự, biểu tượng cảm xúc thân thiện khi thảo luận nhóm.',
  },
  {
    name: 'Lâm Gia Hưng',
    className: '7A5',
    topPillar: 'Thận trọng',
    commitment:
      'Đóng ngay trang web có nội dung xấu và nhờ ba mẹ, thầy cô tư vấn kịp thời.',
  },
  {
    name: 'Vũ Khánh Vy',
    className: '7A2',
    topPillar: 'Tử tế',
    commitment:
      'Chạm màn hình — lan tỏa yêu thương, không hùa theo bình luận chế giễu người khác.',
  },
  {
    name: 'Tô Nhật Minh',
    className: '7A3',
    topPillar: 'Trách nhiệm',
    commitment:
      'Nghĩ trước khi đăng, có sai có sửa — giữ gìn hình ảnh văn minh học sinh THCS Tân Bình.',
  },
];

export function formatSeconds(sec: number): string {
  const safe = Math.max(0, Math.round(Number(sec) || 0));
  const m = String(Math.floor(safe / 60)).padStart(2, '0');
  const s = String(safe % 60).padStart(2, '0');
  return `${m}:${s}`;
}

export function formatNowTime(): string {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
}

export function getStudentBadge(student: LeaderboardSubmission): string {
  if (student.score === 100 && student.timeSec <= 150) {
    return '🎯 Tay Thiện Xạ Điểm 10';
  }
  if (student.score === 100) {
    return '👑 Đại Sứ 5T Hoàn Hảo';
  }
  if (student.score >= 85 && student.timeSec < 150) {
    return '⚡ Vua Tốc Độ';
  }
  if (student.score >= 90) {
    return '🌟 Công Dân Số Tiêu Biểu';
  }
  return '🌱 Học Sinh Tích Cực';
}

export function getRankedSubmissions(
  list: LeaderboardSubmission[]
): LeaderboardSubmission[] {
  const copy = list.slice();
  copy.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (a.timeSec !== b.timeSec) return a.timeSec - b.timeSec;
    return a.seq - b.seq;
  });
  return copy;
}

export function buildSimulatedSubmission(
  existing: LeaderboardSubmission[],
  nextSeq: number,
  forcePerfect: boolean
): LeaderboardSubmission {
  const usedNames = new Set(existing.map((s) => s.name));
  let candidates = SIMULATED_POOL.filter((p) => !usedNames.has(p.name));
  if (candidates.length === 0) candidates = SIMULATED_POOL;
  const pick = candidates[Math.floor(Math.random() * candidates.length)];

  const scorePool = [80, 85, 90, 90, 95, 95, 100];
  const score = forcePerfect
    ? 100
    : scorePool[Math.floor(Math.random() * scorePool.length)];
  const timeSec = forcePerfect
    ? 88 + Math.floor(Math.random() * 48)
    : 105 + Math.floor(Math.random() * 85);

  const makePillarScore = (pillarName: PillarKey): number => {
    if (score === 100) return 100;
    if (pillarName === pick.topPillar) return Math.min(100, score + 5);
    return Math.max(70, Math.min(100, score + (Math.random() > 0.5 ? 0 : -5)));
  };

  return {
    id: `fb-${100 + nextSeq}`,
    name: pick.name,
    className: pick.className,
    score,
    timeSec,
    topPillar: pick.topPillar,
    pillars: {
      'Tôn trọng': makePillarScore('Tôn trọng'),
      'Tử tế': makePillarScore('Tử tế'),
      'Thận trọng': makePillarScore('Thận trọng'),
      'Tra cứu': makePillarScore('Tra cứu'),
      'Trách nhiệm': makePillarScore('Trách nhiệm'),
    },
    commitment: pick.commitment,
    submittedAt: formatNowTime(),
    seq: nextSeq,
  };
}

export function buildSubmissionFromLessonState(
  lessonState: LessonState,
  nextSeq: number
): LeaderboardSubmission {
  const rawIdentity = (lessonState.fields.identity || '').trim();
  const classMatch = rawIdentity.match(/7A[1-5]/i);
  const className = classMatch ? classMatch[0].toUpperCase() : '7A1';
  const cleanedName = rawIdentity
    .replace(/[-–—,|/]*\s*lớp\s*7A[1-5]/i, '')
    .replace(/[-–—,|/]*\s*7A[1-5]/i, '')
    .trim();
  const name = cleanedName || 'Học sinh / Nhóm hiện tại';

  const caseScore = getCaseScore(lessonState); // 0..3 -> 20 pts
  const sortScore = getSortScore(lessonState); // 0..10 -> 30 pts
  const treeScore = lessonState.tree.length; // 0..4 -> 10 pts
  const quizScore = getQuizScore(lessonState); // 0..8 -> 40 pts

  const rawPoints =
    (caseScore / 3) * 20 +
    (sortScore / 10) * 30 +
    (treeScore / 4) * 10 +
    (quizScore / 8) * 40;
  const score = Math.min(100, Math.max(0, Math.round(rawPoints / 5) * 5));

  const topPillar: PillarKey = PILLAR_KEYS[lessonState.group] || 'Tử tế';
  const casePct = Math.round((caseScore / 3) * 100);
  const sortPct = Math.round((sortScore / 10) * 100);
  const treePct = Math.round((treeScore / 4) * 100);
  const quizPct = Math.round((quizScore / 8) * 100);

  const pillars: Record<PillarKey, number> = {
    'Tôn trọng': Math.min(100, Math.max(score, casePct)),
    'Tử tế': Math.min(100, Math.max(score, Math.round((casePct + sortPct) / 2))),
    'Thận trọng': Math.min(100, Math.max(score, quizPct)),
    'Tra cứu': Math.min(100, Math.max(score, sortPct)),
    'Trách nhiệm': Math.min(100, Math.max(score, treePct)),
  };

  if (score === 100) {
    for (const k of PILLAR_KEYS) {
      pillars[k] = 100;
    }
  }

  const commitment =
    (lessonState.fields.slogan || '').trim() ||
    (lessonState.fields.chatroom_group_message || '').trim() ||
    (lessonState.fields.plan || '').trim() ||
    'Cam kết thực hành 5T: Tôn trọng — Tử tế — Thận trọng — Tra cứu — Trách nhiệm trên không gian mạng.';

  return {
    id: `fb-${100 + nextSeq}`,
    name,
    className,
    score,
    timeSec: 120 + Math.floor(Math.random() * 40),
    topPillar,
    pillars,
    commitment,
    submittedAt: formatNowTime(),
    seq: nextSeq,
  };
}

export function createInitialLeaderboardState(): LeaderboardPersistedState {
  return {
    submissions: INITIAL_SUBMISSIONS.map((s) => ({
      ...s,
      pillars: { ...s.pillars },
    })),
    selectedId: 'fb-101',
    soundEnabled: false,
    streamSpeedMs: 3200,
    nextSeq: 11,
    feedEvents: [],
  };
}

export function loadLeaderboardState(): LeaderboardPersistedState {
  const fallback = createInitialLeaderboardState();
  try {
    const raw = localStorage.getItem(LEADERBOARD_STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed === 'object' &&
      Array.isArray(parsed.submissions) &&
      parsed.submissions.length > 0
    ) {
      return {
        submissions: parsed.submissions,
        selectedId:
          typeof parsed.selectedId === 'string'
            ? parsed.selectedId
            : parsed.submissions[0].id,
        soundEnabled: Boolean(parsed.soundEnabled),
        streamSpeedMs: Number(parsed.streamSpeedMs) || 3200,
        nextSeq: Number(parsed.nextSeq) || parsed.submissions.length + 1,
        feedEvents: Array.isArray(parsed.feedEvents) ? parsed.feedEvents : [],
      };
    }
  } catch {
    // Ignore storage read errors and use defaults
  }
  return fallback;
}

export function saveLeaderboardState(state: LeaderboardPersistedState): void {
  try {
    localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage quota / privacy mode errors
  }
}
