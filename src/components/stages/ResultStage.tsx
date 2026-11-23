import React, { useState } from 'react';
import {
  APPLICATION_PRODUCT_TYPES,
  APPLICATION_TASK_IMAGE_SRC,
  SELF_ASSESSMENT_ITEMS,
} from '../../data/lessonData';
import type { LessonState } from '../../types/lesson';
import {
  buildFullReport,
  getCaseScore,
  getQuizScore,
  getSelfAssessmentChecked,
  getSortScore,
  STORAGE_KEY,
  triggerFileDownload,
} from '../../utils/storage';

interface ResultStageProps {
  state: LessonState;
  onFieldChange: (key: string, value: string) => void;
  onFieldsBatchChange: (updates: Record<string, string | undefined>) => void;
  onResetAll: () => void;
  onOpenLeaderboard: () => void;
}

export const ResultStage: React.FC<ResultStageProps> = ({
  state,
  onFieldChange,
  onFieldsBatchChange,
  onResetAll,
  onOpenLeaderboard,
}) => {
  const [confirmReset, setConfirmReset] = useState(false);
  const [appImageStatus, setAppImageStatus] = useState('');

  const reportText = buildFullReport(state);
  const sortScore = getSortScore(state);
  const quizScore = getQuizScore(state);
  const caseScore = getCaseScore(state);
  const checkedSelfEval = getSelfAssessmentChecked(state);

  const hasAppTaskWork = Boolean(
    state.fields.app_task_idea?.trim() ||
      state.fields.app_task_link?.trim() ||
      state.fields.app_task_image
  );

  const handleToggleSelfEval = (idx: number, isChecked: boolean) => {
    const next = isChecked
      ? Array.from(new Set([...checkedSelfEval, idx])).sort((a, b) => a - b)
      : checkedSelfEval.filter((n) => n !== idx);
    onFieldChange('self_assessment_checked', JSON.stringify(next));
  };

  const handleAppTaskImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (
      !['image/jpeg', 'image/png', 'image/webp'].includes(file.type) ||
      file.size > 8 * 1024 * 1024
    ) {
      setAppImageStatus('Chọn ảnh JPG, PNG hoặc WebP không quá 8 MB.');
      e.target.value = '';
      return;
    }

    setAppImageStatus('Đang chuẩn bị ảnh sản phẩm…');
    const reader = new FileReader();
    reader.onerror = () => setAppImageStatus('Không đọc được ảnh. Em hãy chọn lại.');
    reader.onload = () => {
      const im = new Image();
      im.onerror = () => setAppImageStatus('Ảnh không hợp lệ. Em hãy chọn ảnh khác.');
      im.onload = () => {
        const canvas = document.createElement('canvas');
        const scale = Math.min(1, 1000 / im.width, 1000 / im.height);
        canvas.width = Math.max(1, Math.round(im.width * scale));
        canvas.height = Math.max(1, Math.round(im.height * scale));
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(im, 0, 0, canvas.width, canvas.height);
        const data = canvas.toDataURL('image/jpeg', 0.72);

        try {
          const testState: LessonState = {
            ...state,
            fields: {
              ...state.fields,
              app_task_image: data,
              app_task_image_name: file.name,
            },
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(testState));
          onFieldsBatchChange({
            app_task_image: data,
            app_task_image_name: file.name,
          });
          setAppImageStatus('');
        } catch {
          setAppImageStatus(
            'Bộ nhớ trình duyệt đã đầy. Các em hãy giữ ảnh gốc để gửi trực tiếp cho giáo viên hoặc dán lên Padlet.'
          );
        }
      };
      im.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeAppTaskImage = () => {
    onFieldsBatchChange({
      app_task_image: undefined,
      app_task_image_name: undefined,
    });
    setAppImageStatus('');
  };

  const checklist: Array<[string, boolean]> = [
    ['Tên / mã nhóm', Boolean(state.fields.identity)],
    ['Phân loại 10 hành vi', Boolean(state.sortChecked)],
    ['Xử lí 3 tình huống', Object.keys(state.scenario).length === 3],
    ['Kế hoạch cân bằng', Boolean(state.fields.plan?.trim())],
    ['Bài kiểm tra', Boolean(state.submitted)],
    [
      'Thông điệp và giúp bạn',
      Boolean(state.fields.slogan?.trim() && state.fields.help?.trim()),
    ],
    [
      'Phiếu tự đánh giá của học sinh',
      checkedSelfEval.length > 0 && Boolean(state.fields.self_assessment_change?.trim()),
    ],
    [
      'Bài tập 1 — Sản phẩm nhóm (khuyến khích, không bắt buộc)',
      hasAppTaskWork,
    ],
  ];

  const downloadReport = () => {
    triggerFileDownload(
      'Phieu_ket_qua_Bai5.txt',
      `\ufeff${reportText}`,
      'text/plain;charset=utf-8'
    );
  };

  const downloadSource = async () => {
    try {
      const resp = await fetch('/assets/aistudio/index_804ee8b2.html');
      if (resp.ok) {
        const htmlText = await resp.text();
        triggerFileDownload(
          'Bai5_Ung_xu_tren_mang.html',
          htmlText,
          'text/html;charset=utf-8'
        );
        return;
      }
    } catch {
      // Fallback below
    }
    const copy = document.documentElement.cloneNode(true) as HTMLElement;
    triggerFileDownload(
      'Bai5_Ung_xu_tren_mang.html',
      `<!DOCTYPE html>\n${copy.outerHTML}`,
      'text/html;charset=utf-8'
    );
  };

  const printResult = () => {
    window.print();
  };

  return (
    <section className="panel" id="resultpage">
      <span className="num">VẬN DỤNG · DẤU CHÂN SỐ TỬ TẾ</span>
      <h2>Sản phẩm nhỏ. Thay đổi thật.</h2>
      <p>
        Viết thông điệp 2–3 câu; nêu cách giúp một người bạn đang dành quá nhiều thời gian cho trò chơi trực tuyến. Giáo viên nhận xét phần tự luận dựa vào sự tôn trọng, giải pháp phù hợp và tính cụ thể.
      </p>

      <label htmlFor="slogan">Thông điệp / khẩu hiệu của em hoặc nhóm</label>
      <textarea
        id="slogan"
        placeholder="Nhập câu trả lời của em…"
        value={state.fields.slogan || ''}
        onChange={(e) => onFieldChange('slogan', e.target.value)}
      />

      <label htmlFor="help">
        Nếu bạn có biểu hiện sử dụng trò chơi trực tuyến quá mức, em sẽ giúp bạn thế nào?
      </label>
      <textarea
        id="help"
        placeholder="Nhập câu trả lời của em…"
        value={state.fields.help || ''}
        onChange={(e) => onFieldChange('help', e.target.value)}
      />

      <article className="app-task-card" aria-labelledby="app-task-heading">
        <div className="app-task-head">
          <div>
            <span className="num">VẬN DỤNG MỞ RỘNG · HOẠT ĐỘNG NHÓM</span>
            <h3 id="app-task-heading" className="app-task-title">
              BÀI TẬP 1: TẠO SẢN PHẨM NHÓM VỀ CHỦ ĐỀ ỨNG XỬ TRÊN MẠNG
            </h3>
          </div>
          <span className="app-task-optional-tag">
            Khuyến khích thực hiện · Không bắt buộc
          </span>
        </div>

        <p className="app-task-prompt">
          <b>Bài tập 1:</b> Em hãy cùng một nhóm bạn của mình tạo ra một sản phẩm (áp phích, đoạn kịch ngắn, sơ đồ tư duy, bài trình chiếu,...) về chủ đề <b>Ứng xử trên mạng</b> để trình bày với các bạn trong lớp.
        </p>

        <div className="app-task-note">
          <b>Ghi chú:</b> Hoạt động này <b>khuyến khích học sinh thực hiện, không bắt buộc</b>. Các nhóm hoàn thành và trình bày trước lớp sẽ được giáo viên tuyên dương và ghi nhận cộng điểm thực hành.
        </div>

        <figure className="app-task-figure">
          <img
            src={APPLICATION_TASK_IMAGE_SRC}
            alt="Gợi ý Bài tập 1 Vận dụng: tạo sản phẩm áp phích, đoạn kịch ngắn, sơ đồ tư duy hoặc bài trình chiếu về chủ đề Ứng xử trên mạng"
            className="app-task-suggestion-img"
          />
          <figcaption className="small app-task-caption">
            Hình gợi ý minh họa cho sản phẩm nhóm (áp phích, tranh vẽ, sơ đồ tư duy, bài trình chiếu hoặc tiểu phẩm ngắn).
          </figcaption>
        </figure>

        <div className="app-task-grid">
          <div>
            <label htmlFor="app_task_type" className="app-task-label">
              Hình thức sản phẩm nhóm dự định làm
            </label>
            <select
              id="app_task_type"
              value={state.fields.app_task_type || ''}
              onChange={(e) => onFieldChange('app_task_type', e.target.value)}
            >
              <option value="">-- Chọn hình thức sản phẩm --</option>
              {APPLICATION_PRODUCT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="app_task_members" className="app-task-label">
              Tên nhóm và các thành viên tham gia
            </label>
            <input
              id="app_task_members"
              type="text"
              placeholder="Ví dụ: Nhóm 2 (7/1) — Minh Anh, Gia Bảo, Thảo Vy..."
              value={state.fields.app_task_members || ''}
              onChange={(e) => onFieldChange('app_task_members', e.target.value)}
            />
          </div>
        </div>

        <label htmlFor="app_task_idea" className="app-task-label">
          Ý tưởng chính / nội dung trình bày của nhóm
        </label>
        <textarea
          id="app_task_idea"
          className="app-task-textarea"
          placeholder="Mô tả ngắn gọn thông điệp chính, bố cục áp phích / nội dung kịch ngắn / các nhánh sơ đồ tư duy của nhóm…"
          value={state.fields.app_task_idea || ''}
          onChange={(e) => onFieldChange('app_task_idea', e.target.value)}
        />

        <label htmlFor="app_task_link" className="app-task-label">
          Đường dẫn sản phẩm (Canva, Google Slides, Padlet, video…) — nếu có
        </label>
        <input
          id="app_task_link"
          type="url"
          placeholder="https://..."
          value={state.fields.app_task_link || ''}
          onChange={(e) => onFieldChange('app_task_link', e.target.value)}
        />

        <label htmlFor="app_task_image" className="app-task-label">
          Đính kèm ảnh chụp sản phẩm (JPG, PNG, WebP tối đa 8 MB) — nếu có
        </label>
        <input
          id="app_task_image"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleAppTaskImage}
        />

        {appImageStatus && (
          <p className="small" role="status">
            {appImageStatus}
          </p>
        )}

        {state.fields.app_task_image && (
          <div className="app-task-preview">
            <figure className="app-task-preview-figure">
              <img
                src={state.fields.app_task_image}
                alt="Ảnh sản phẩm vận dụng của nhóm"
                className="app-task-preview-img"
              />
              <figcaption className="small">{state.fields.app_task_image_name}</figcaption>
            </figure>
            <button type="button" onClick={removeAppTaskImage}>
              Bỏ ảnh đã chọn
            </button>
          </div>
        )}
      </article>

      <article className="self-eval-card" aria-labelledby="self-eval-heading">
        <div className="self-eval-head">
          <div>
            <span className="num">TỰ ĐÁNH GIÁ · RÈN LUYỆN THÓI QUEN TỐT</span>
            <h3 id="self-eval-heading" className="self-eval-title">
              PHIẾU TỰ ĐÁNH GIÁ CỦA HỌC SINH
            </h3>
            <p className="self-eval-subtitle">
              Đánh dấu vào những việc em đã thực hiện:
            </p>
          </div>
          <span className="self-eval-count" aria-live="polite">
            Đã đánh dấu: {checkedSelfEval.length}/{SELF_ASSESSMENT_ITEMS.length}
          </span>
        </div>

        <progress
          className="self-eval-meter"
          value={checkedSelfEval.length}
          max={SELF_ASSESSMENT_ITEMS.length}
          aria-label="Tiến độ hoàn thành phiếu tự đánh giá"
        />

        <div
          className="self-eval-list"
          role="group"
          aria-label="Danh sách các việc em đã thực hiện khi sử dụng Internet"
        >
          {SELF_ASSESSMENT_ITEMS.map((item, idx) => {
            const isChecked = checkedSelfEval.includes(idx);
            return (
              <label
                key={item}
                className={`self-eval-item${isChecked ? ' is-checked' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={(e) => handleToggleSelfEval(idx, e.target.checked)}
                />
                <span>{item}</span>
              </label>
            );
          })}
        </div>

        <label htmlFor="self_assessment_change" className="self-eval-change-label">
          Điều em sẽ thay đổi để sử dụng Internet tốt hơn:
        </label>
        <textarea
          id="self_assessment_change"
          className="self-eval-textarea"
          placeholder="Nhập điều em dự định thay đổi để sử dụng Internet an toàn, lành mạnh và hiệu quả hơn…"
          value={state.fields.self_assessment_change || ''}
          onChange={(e) => onFieldChange('self_assessment_change', e.target.value)}
        />
      </article>

      <div className="badge">
        {state.fields.identity || 'Chưa điền tên / mã nhóm'}
        <br />
        Phân loại: {state.sortChecked ? `${sortScore}/10` : 'chưa kiểm tra'} · Kiểm tra:{' '}
        {state.submitted ? `${quizScore}/8` : 'chưa nộp'}
        <br />
        Cây xanh: {state.tree.length}/4 · Tình huống hợp lí: {caseScore}/3 · Tự đánh giá:{' '}
        {checkedSelfEval.length}/{SELF_ASSESSMENT_ITEMS.length}
      </div>

      <h3>Kiểm tra trước khi nộp</h3>
      <ul>
        {checklist.map(([label, done]) => (
          <li key={label}>
            {done ? '✓' : '○'} {label}
          </li>
        ))}
      </ul>

      <p>
        <b>Cách nộp:</b> tải phiếu kết quả .txt và gửi theo hướng dẫn của giáo viên (Padlet hoặc LMS). Nút tải không tự gửi bài. File HTML cần đi kèm thư mục assets để phát clip Cẩn thận khi kết bạn; bộ ZIP đã có đủ các tệp. Có thể in hoặc chọn “Lưu thành PDF” trong hộp thoại in.
      </p>

      <div className="actions">
        <button type="button" className="primary" onClick={downloadReport}>
          ↓ Tải phiếu kết quả (.txt)
        </button>
        <button type="button" onClick={printResult}>
          In / lưu PDF
        </button>
        <button type="button" onClick={downloadSource}>
          ↓ Tải HTML (giữ kèm thư mục assets)
        </button>
        <button type="button" className="primary" onClick={onOpenLeaderboard}>
          🏆 Mở Bảng Vàng vinh danh →
        </button>
      </div>

      <details>
        <summary>Xem toàn bộ phiếu kết quả</summary>
        <pre id="report">{reportText}</pre>
      </details>

      <details>
        <summary>Bắt đầu lượt học mới</summary>
        <p>
          Xóa toàn bộ tiến độ trên trình duyệt này. Tải phiếu trước nếu cần lưu bài.
        </p>
        {!confirmReset ? (
          <button type="button" onClick={() => setConfirmReset(true)}>
            Xóa tiến độ và bắt đầu lại
          </button>
        ) : (
          <div className="actions">
            <button
              type="button"
              className="primary"
              onClick={() => {
                setConfirmReset(false);
                onResetAll();
              }}
            >
              Xác nhận xóa tiến độ
            </button>
            <button type="button" onClick={() => setConfirmReset(false)}>
              Hủy
            </button>
          </div>
        )}
      </details>
    </section>
  );
};
