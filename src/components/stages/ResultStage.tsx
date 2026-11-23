import React, { useState } from 'react';
import { SELF_ASSESSMENT_ITEMS } from '../../data/lessonData';
import type { LessonState } from '../../types/lesson';
import {
  buildFullReport,
  getCaseScore,
  getQuizScore,
  getSelfAssessmentChecked,
  getSortScore,
  triggerFileDownload,
} from '../../utils/storage';

interface ResultStageProps {
  state: LessonState;
  onFieldChange: (key: string, value: string) => void;
  onResetAll: () => void;
  onOpenLeaderboard: () => void;
}

export const ResultStage: React.FC<ResultStageProps> = ({
  state,
  onFieldChange,
  onResetAll,
  onOpenLeaderboard,
}) => {
  const [confirmReset, setConfirmReset] = useState(false);

  const reportText = buildFullReport(state);
  const sortScore = getSortScore(state);
  const quizScore = getQuizScore(state);
  const caseScore = getCaseScore(state);
  const checkedSelfEval = getSelfAssessmentChecked(state);

  const handleToggleSelfEval = (idx: number, isChecked: boolean) => {
    const next = isChecked
      ? Array.from(new Set([...checkedSelfEval, idx])).sort((a, b) => a - b)
      : checkedSelfEval.filter((n) => n !== idx);
    onFieldChange('self_assessment_checked', JSON.stringify(next));
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
