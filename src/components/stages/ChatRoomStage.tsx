import React from 'react';
import { FRIEND_VIDEO_SRC, RULES_5K } from '../../data/lessonData';
import type { LessonState } from '../../types/lesson';

interface ChatRoomStageProps {
  state: LessonState;
  onFieldChange: (key: string, value: string) => void;
  onFieldsBatchChange: (updates: Record<string, string | undefined>) => void;
  onNextStage: () => void;
}

export const ChatRoomStage: React.FC<ChatRoomStageProps> = ({
  state,
  onFieldChange,
  onFieldsBatchChange,
  onNextStage,
}) => {
  const checked5K: number[] = (() => {
    try {
      const parsed = JSON.parse(state.fields.chatroom_5k_checked || '[]');
      return Array.isArray(parsed)
        ? parsed.filter((n): n is number => Number.isInteger(n) && n >= 0 && n < RULES_5K.length)
        : [];
    } catch {
      return [];
    }
  })();

  const known5KLines = new Set(RULES_5K.map((item) => `- Không ${item}`));

  const handleToggle5K = (index: number, isChecked: boolean) => {
    const nextChecked = isChecked
      ? Array.from(new Set([...checked5K, index])).sort((a, b) => a - b)
      : checked5K.filter((n) => n !== index);

    const existingCustomLines = (state.fields.chatroom_5k_answer || '')
      .split('\n')
      .filter((line) => line.trim() !== '' && !known5KLines.has(line.trim()));

    const selectedLines = nextChecked.map((i) => `- Không ${RULES_5K[i]}`);
    const combinedAnswer = [...selectedLines, ...existingCustomLines].join('\n');

    onFieldsBatchChange({
      chatroom_5k_checked: JSON.stringify(nextChecked),
      chatroom_5k_answer: combinedAnswer,
    });
  };

  return (
    <section className="panel">
      <span className="num">THỬ THÁCH 01 · PHÒNG TÌNH HUỐNG</span>
      <h2>Em hãy xem video sau và cho biết nhóm em rút ra được thông điệp gì?</h2>

      <section
        aria-labelledby="friend-video-title"
        style={{
          margin: '22px 0',
          padding: '20px',
          borderRadius: '16px',
          background: '#eff5ed',
        }}
      >
        <h3 id="friend-video-title" style={{ marginTop: 0 }}>
          Xem clip: Cẩn thận khi kết bạn
        </h3>
        <video
          controls
          playsInline
          preload="metadata"
          aria-label="Clip Cẩn thận khi kết bạn"
          style={{
            display: 'block',
            width: '100%',
            maxHeight: '620px',
            aspectRatio: '16/9',
            background: '#163e35',
            borderRadius: '12px',
          }}
        >
          <source src={FRIEND_VIDEO_SRC} type="video/mp4" />
          Trình duyệt chưa hỗ trợ phát video. Em hãy mở clip bằng liên kết bên dưới.
        </video>
        <p className="small">
          Thời lượng khoảng 1 phút 55 giây. Nhấn ▶ để xem; có thể tạm dừng, điều chỉnh âm lượng hoặc mở toàn màn hình.
        </p>
        <a href={FRIEND_VIDEO_SRC} target="_blank" rel="noopener noreferrer">
          Mở clip riêng ↗
        </a>
        <p>
          <b>Cùng trao đổi:</b> Khi kết bạn qua mạng, em cần thận trọng điều gì? Khi gặp lời mời hoặc tin nhắn khiến em lo lắng, em sẽ nhờ ai hỗ trợ?
        </p>
      </section>

      <label htmlFor="chatroom_group_message">Thông điệp của nhóm</label>
      <textarea
        id="chatroom_group_message"
        placeholder="Viết một câu khẩu hiệu ngắn gọn…"
        value={state.fields.chatroom_group_message || ''}
        onChange={(e) => onFieldChange('chatroom_group_message', e.target.value)}
      />

      <article className="card" style={{ marginTop: '22px' }}>
        <span className="num">THÔNG ĐIỆP 5K · CÂU HỎI &amp; TRẢ LỜI</span>
        <h3 style={{ marginTop: '6px' }}>
          Câu 2. Là một người ứng xử có văn hóa khi tham gia giao tiếp qua mạng, em sẽ có những hành động cụ thể nào?
        </h3>

        <p className="small" style={{ marginBottom: '10px' }}>
          Em hãy đánh dấu vào ô vuông trước các hành động phù hợp ({checked5K.length}/{RULES_5K.length} đã chọn). Các mục đã chọn sẽ tự động hiện vào ô câu trả lời bên dưới:
        </p>

        <div role="group" aria-label="Chọn các hành động theo Thông điệp 5K">
          {RULES_5K.map((item, idx) => (
            <label
              key={item}
              className="check"
              style={{ margin: '10px 0', cursor: 'pointer' }}
            >
              <input
                type="checkbox"
                checked={checked5K.includes(idx)}
                onChange={(e) => handleToggle5K(idx, e.target.checked)}
              />
              <span>
                <b style={{ color: '#c62828' }}>Không</b> {item}
              </span>
            </label>
          ))}
        </div>

        <label htmlFor="chatroom_5k_answer">Câu trả lời của em / nhóm</label>
        <textarea
          id="chatroom_5k_answer"
          style={{ minHeight: '150px' }}
          placeholder="Đánh dấu chọn các hành động ở trên để hiện vào đây, hoặc nhập thêm ý kiến của em / nhóm…"
          value={state.fields.chatroom_5k_answer || ''}
          onChange={(e) => onFieldChange('chatroom_5k_answer', e.target.value)}
        />
      </article>

      <div className="actions">
        <button type="button" onClick={onNextStage} className="primary">
          Tiếp: PHÒNG THỬ THÁCH →
        </button>
      </div>
    </section>
  );
};
