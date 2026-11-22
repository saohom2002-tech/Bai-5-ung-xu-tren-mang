import React, { useState } from 'react';
import { BEHAVIORS, EMOTION_VIDEO_SRC } from '../../data/lessonData';
import type { LessonState } from '../../types/lesson';
import { getSortScore } from '../../utils/storage';

interface ClassifyStageProps {
  state: LessonState;
  onSortPick: (index: number, value: boolean | undefined) => void;
  onCheckSort: () => void;
  onNextStage: () => void;
}

export const ClassifyStage: React.FC<ClassifyStageProps> = ({
  state,
  onSortPick,
  onCheckSort,
  onNextStage,
}) => {
  const [warnMsg, setWarnMsg] = useState<string>('');
  const score = getSortScore(state);

  const handleCheck = () => {
    if (Object.keys(state.sort).length < 10) {
      setWarnMsg('Em hãy phân loại đủ 10 hành vi trước khi kiểm tra.');
      return;
    }
    setWarnMsg('');
    onCheckSort();
  };

  return (
    <section className="panel">
      <span className="num">THỬ THÁCH 03 · CHỌN ĐÚNG THÓI QUEN</span>
      <h2>Nên hay không nên?</h2>

      <section
        aria-labelledby="emotion-video-title"
        style={{
          margin: '22px 0',
          padding: '20px',
          borderRadius: '16px',
          background: '#eff5ed',
        }}
      >
        <h3 id="emotion-video-title" style={{ marginTop: 0 }}>
          Xem clip: Thể hiện cảm xúc cá nhân trên mạng xã hội
        </h3>
        <video
          controls
          playsInline
          preload="metadata"
          aria-label="Clip Thể hiện cảm xúc cá nhân trên mạng xã hội"
          style={{
            display: 'block',
            width: '100%',
            maxHeight: '620px',
            aspectRatio: '16/9',
            background: '#163e35',
            borderRadius: '12px',
          }}
        >
          <source src={EMOTION_VIDEO_SRC} type="video/mp4" />
          Trình duyệt chưa hỗ trợ phát video. Em hãy mở clip bằng liên kết bên dưới.
        </video>
        <p className="small">
          Thời lượng khoảng 2 phút 42 giây. Nhấn ▶ để xem; có thể tạm dừng, điều chỉnh âm lượng hoặc mở toàn màn hình.
        </p>
        <a href={EMOTION_VIDEO_SRC} target="_blank" rel="noopener noreferrer">
          Mở clip riêng ↗
        </a>
      </section>

      <p>
        Chọn nhóm cho cả 10 hành vi, rồi bấm kiểm tra. Mỗi hành vi đúng được 1 điểm, tối đa 10. Em có thể sửa và kiểm tra lại.
      </p>

      {BEHAVIORS.map((b, i) => (
        <div key={b.text} className="row">
          <div>
            {i + 1}. {b.text}
            {state.sortChecked && (
              <div className="small">
                {state.sort[i] === b.shouldDo ? '✓ Đúng' : '↺ Cần sửa'} · {b.explanation}
              </div>
            )}
          </div>
          <select
            aria-label={`Phân loại hành vi ${i + 1}`}
            value={
              state.sort[i] === undefined ? '' : state.sort[i] ? 'yes' : 'no'
            }
            onChange={(e) => {
              setWarnMsg('');
              const val = e.target.value;
              onSortPick(i, val === '' ? undefined : val === 'yes');
            }}
          >
            <option value="">Chọn nhóm…</option>
            <option value="yes">Nên làm</option>
            <option value="no">Không nên làm</option>
          </select>
        </div>
      ))}

      <div className="actions">
        <button type="button" className="primary" onClick={handleCheck}>
          Kiểm tra phân loại
        </button>
        <button type="button" onClick={onNextStage}>
          Tiếp: Hồi sinh cây →
        </button>
      </div>

      {warnMsg && (
        <div role="status" className="feedback wrong">
          {warnMsg}
        </div>
      )}

      {state.sortChecked && (
        <div role="status" className="feedback">
          Kết quả: <b>{score}/10</b>.{' '}
          {score === 10
            ? 'Em đã phân loại chính xác!'
            : 'Đọc phản hồi rồi điều chỉnh các hành vi cần sửa.'}
        </div>
      )}
    </section>
  );
};
