import {
  BEHAVIORS,
  GROUP_TASKS,
  QUIZ_QUESTIONS,
  SCENARIO_CASES,
  SELF_ASSESSMENT_ITEMS,
} from '../data/lessonData';
import type { LessonState } from '../types/lesson';

export const STORAGE_KEY = 'online-tu-te-b5-v1';

export function createFreshState(): LessonState {
  return {
    schema: 2,
    group: 0,
    tab: 0,
    sort: {},
    sortChecked: false,
    scenario: {},
    tree: [],
    quiz: {},
    submitted: false,
    fields: {},
    visited: [0],
  };
}

export function loadLessonState(): LessonState {
  const base = createFreshState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return base;
    const parsed = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed === 'object' &&
      parsed.fields &&
      parsed.sort &&
      parsed.quiz &&
      parsed.scenario &&
      Array.isArray(parsed.tree)
    ) {
      const merged: LessonState = {
        ...base,
        ...parsed,
        schema: parsed.schema || 1,
      };
      if (merged.schema !== 2) {
        if (merged.tab >= 3) merged.tab += 1;
        merged.visited = Array.isArray(merged.visited)
          ? merged.visited.map((n: number) => (n >= 3 ? n + 1 : n))
          : [0];
        merged.schema = 2;
      }
      if (!Number.isInteger(merged.group) || merged.group < 0 || merged.group > 4) {
        merged.group = 0;
      }
      if (!Number.isInteger(merged.tab) || merged.tab < 0 || merged.tab > 8) {
        merged.tab = 0;
      }
      return merged;
    }
  } catch {
    // Fallback gracefully to clean state if storage is unavailable or corrupted
  }
  return base;
}

export function saveLessonState(state: LessonState): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

export function groupKey(key: string, groupIdx: number): string {
  return `group${groupIdx}_${key}`;
}

export function buildGroupDraft(state: LessonState, groupIdx = state.group): string {
  const g = GROUP_TASKS[groupIdx];
  const val = (k: string) => state.fields[groupKey(k, groupIdx)] || '';
  const classText = val('class') ? ` | LỚP: ${val('class')}` : '';
  const captionText = val('caption') ? `\nChú thích / nguồn ảnh: ${val('caption')}` : '';

  return [
    `NHÓM: ${groupIdx + 1} – ${g.name}${classText}`,
    '',
    '1. Phân tích tình huống:',
    val('analysis') || '[Ghi ý kiến thảo luận của nhóm]',
    '',
    '2. Giải pháp đề xuất:',
    val('solution') || '[Ghi những việc nên làm]',
    '',
    '3. Thông điệp của nhóm:',
    val('message') || '[Viết một câu khẩu hiệu ngắn gọn]',
    '',
    '4. Hình ảnh minh họa:',
    `${val('imageName') || '[Đính kèm hình ảnh hoặc tranh do nhóm lựa chọn]'}${captionText}`,
  ].join('\n');
}

export function isQuizQuestionCorrect(state: LessonState, idx: number): boolean {
  const picked = [...(state.quiz[idx] || [])].sort((a, b) => a - b);
  const expected = [...QUIZ_QUESTIONS[idx].correctIndices].sort((a, b) => a - b);
  return JSON.stringify(picked) === JSON.stringify(expected);
}

export function getQuizScore(state: LessonState): number {
  return QUIZ_QUESTIONS.filter((_, i) => isQuizQuestionCorrect(state, i)).length;
}

export function getSortScore(state: LessonState): number {
  return BEHAVIORS.filter((b, i) => state.sort[i] === b.shouldDo).length;
}

export function getCaseScore(state: LessonState): number {
  return SCENARIO_CASES.filter((c, i) => state.scenario[i] === c.ok).length;
}

export function getSelfAssessmentChecked(state: LessonState): number[] {
  try {
    const parsed = JSON.parse(state.fields.self_assessment_checked || '[]');
    if (!Array.isArray(parsed)) return [];
    return Array.from(
      new Set(
        parsed.filter(
          (n): n is number =>
            Number.isInteger(n) && n >= 0 && n < SELF_ASSESSMENT_ITEMS.length
        )
      )
    ).sort((a, b) => a - b);
  } catch {
    return [];
  }
}

export function buildFullReport(state: LessonState): string {
  const essayLabels: Array<[string, string]> = [
    ['empathy', 'Cảm xúc của An'],
    ['rewrite', 'Lời góp ý tử tế'],
    ['video_group_message', 'Thông điệp nhóm rút ra sau khi xem video'],
    ['chatroom_group_message', 'Nhóm chat tử tế — Thông điệp của nhóm'],
    ['chatroom_5k_answer', 'Nhóm chat tử tế — Câu 2 (Thông điệp 5K)'],
    ['plan', 'Kế hoạch cân bằng'],
    ['slogan', 'Thông điệp'],
    ['help', 'Giúp bạn'],
  ];

  const checkedSelfEval = getSelfAssessmentChecked(state);

  return [
    'PHIẾU KẾT QUẢ — BÀI 5: ỨNG XỬ TRÊN MẠNG',
    `Tên / nhóm / lớp: ${state.fields.identity || '(chưa điền)'}`,
    `Ngày xuất: ${new Date().toLocaleDateString('vi-VN')}`,
    '',
    'A. KẾT QUẢ LUYỆN TẬP',
    `Tình huống: ${getCaseScore(state)}/3 lựa chọn hợp lí`,
    `Phân loại: ${state.sortChecked ? `${getSortScore(state)}/10` : 'chưa kiểm tra'}`,
    `Cây xanh: ${state.tree.length}/4`,
    `Kiểm tra: ${state.submitted ? `${getQuizScore(state)}/8` : 'chưa nộp'}`,
    `Phiếu tự đánh giá: ${checkedSelfEval.length}/${SELF_ASSESSMENT_ITEMS.length} việc đã thực hiện`,
    '',
    ...SCENARIO_CASES.map(
      (c, i) => `Tình huống ${i + 1}: ${c.a[state.scenario[i]] || 'chưa chọn'}`
    ),
    '',
    ...BEHAVIORS.map(
      (b, i) =>
        `${i + 1}. ${b.text} — ${
          state.sort[i] === undefined
            ? 'chưa chọn'
            : state.sort[i]
              ? 'Nên làm'
              : 'Không nên làm'
        }`
    ),
    '',
    ...QUIZ_QUESTIONS.map(
      (_, i) =>
        `Câu ${i + 1}: ${
          (state.quiz[i] || []).map((n) => String.fromCharCode(65 + n)).join(', ') ||
          'chưa trả lời'
        }${state.submitted ? ` — ${isQuizQuestionCorrect(state, i) ? 'đúng' : 'chưa đúng'}` : ''}`
    ),
    '',
    'B. SẢN PHẨM TỰ LUẬN (GIÁO VIÊN NHẬN XÉT)',
    ...essayLabels.map(([k, label]) => `${label}:\n${state.fields[k] || '(chưa viết)'}`),
    '',
    'C. HOẠT ĐỘNG 2 — THỬ THÁCH 5 NHÓM',
    ...GROUP_TASKS.map((_, n) => buildGroupDraft(state, n)),
    '',
    'D. PHIẾU TỰ ĐÁNH GIÁ CỦA HỌC SINH',
    `Đã đánh dấu: ${checkedSelfEval.length}/${SELF_ASSESSMENT_ITEMS.length} việc`,
    ...SELF_ASSESSMENT_ITEMS.map(
      (item, idx) => `${checkedSelfEval.includes(idx) ? '[x]' : '[ ]'} ${item}`
    ),
    '',
    'Điều em sẽ thay đổi để sử dụng Internet tốt hơn:',
    state.fields.self_assessment_change?.trim() || '(chưa viết)',
    '',
    'Kết quả tự luyện trên thiết bị học sinh; chưa gửi tự động cho giáo viên.',
  ].join('\n');
}

export function triggerFileDownload(filename: string, content: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function escapeHtml(str: string): string {
  return String(str ?? '').replace(/[&<>"']/g, (ch) => {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };
    return map[ch] || ch;
  });
}

export function downloadGroupPostHtml(state: LessonState, groupIdx = state.group): void {
  const g = GROUP_TASKS[groupIdx];
  const image = state.fields[groupKey('image', groupIdx)];
  const caption = state.fields[groupKey('caption', groupIdx)] || '';
  const draft = buildGroupDraft(state, groupIdx);

  const html = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8" />
  <title>Nhóm ${groupIdx + 1} – ${escapeHtml(g.name)}</title>
</head>
<body style="font:18px/1.6 system-ui,sans-serif;max-width:900px;margin:30px auto;padding:20px;color:#0f172a">
  <h1>BÀI 5: ỨNG XỬ TRÊN MẠNG</h1>
  <pre style="font:inherit;white-space:pre-wrap;overflow-wrap:anywhere">${escapeHtml(draft)}</pre>
  ${
    image
      ? `<figure style="margin:20px 0"><img alt="Hình minh họa của nhóm" style="max-width:100%;border-radius:12px" src="${escapeHtml(image)}" /><figcaption style="margin-top:8px;color:#475569">${escapeHtml(caption)}</figcaption></figure>`
      : ''
  }
</body>
</html>`;

  triggerFileDownload(`Bai_dang_Nhom${groupIdx + 1}.html`, html, 'text/html;charset=utf-8');
}
