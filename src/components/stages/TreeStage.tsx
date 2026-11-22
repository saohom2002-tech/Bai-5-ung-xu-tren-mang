import React from 'react';
import { INTERNET_RISKS_VIDEO_SRC, LEAF_MEASURES } from '../../data/lessonData';
import type { LessonState } from '../../types/lesson';

interface TreeStageProps {
  state: LessonState;
  onToggleLeaf: (index: number, checked: boolean) => void;
  onFieldChange: (key: string, value: string) => void;
  onNextStage: () => void;
}

const LEAF_POSITIONS: Array<[number, number, string]> = [
  [113, 110, '#5a9e69'],
  [235, 105, '#81b975'],
  [107, 200, '#94c385'],
  [250, 200, '#3d8762'],
];

export const TreeStage: React.FC<TreeStageProps> = ({
  state,
  onToggleLeaf,
  onFieldChange,
  onNextStage,
}) => {
  return (
    <section className="panel">
      <span className="num">THỬ THÁCH 04 · NUÔI THÓI QUEN TỐT</span>
      <h2>Hồi sinh cây Internet lành mạnh</h2>

      <section
        aria-labelledby="internet-risks-video-title"
        className="stage-video-card"
      >
        <h3 id="internet-risks-video-title" className="stage-video-title">
          Xem clip: Mặt trái của Internet
        </h3>
        <video
          controls
          playsInline
          preload="metadata"
          aria-label="Clip Mặt trái của Internet"
          className="stage-video-player"
        >
          <source src={INTERNET_RISKS_VIDEO_SRC} type="video/mp4" />
          Trình duyệt chưa hỗ trợ phát video. Em hãy mở clip bằng liên kết bên dưới.
        </video>
        <p className="small">
          Thời lượng khoảng 2 phút 01 giây. Nhấn ▶ để xem; có thể tạm dừng, điều chỉnh âm lượng hoặc mở toàn màn hình.
        </p>
        <a href={INTERNET_RISKS_VIDEO_SRC} target="_blank" rel="noopener noreferrer">
          Mở clip riêng ↗
        </a>
      </section>

      <p>
        Mỗi biện pháp em chọn sẽ giúp cây mọc thêm tán lá. Hoàn thành đủ 4 nhóm biện pháp, sau đó viết kế hoạch cụ thể của mình.
      </p>

      <div className="treearea">
        <svg
          viewBox="0 0 360 360"
          role="img"
          aria-label={`Cây có ${state.tree.length} trên 4 tán lá xanh`}
        >
          <ellipse cx="180" cy="327" rx="130" ry="18" fill="#e1e9da" />
          <path
            d="M158 324 169 160 130 115 145 105 181 145 220 100 233 112 194 166 203 324Z"
            fill="#aa8159"
          />
          {LEAF_POSITIONS.map(([cx, cy, color], i) => (
            <ellipse
              key={i}
              cx={cx}
              cy={cy}
              rx="70"
              ry="58"
              fill={state.tree.includes(i) ? color : '#e7e8db'}
            />
          ))}
          <text x="180" y="350" textAnchor="middle" fill="#174c3d" fontSize="17">
            {state.tree.length}/4 tán lá xanh
          </text>
        </svg>

        <div>
          {LEAF_MEASURES.map((l, i) => (
            <label key={l.title} className="check">
              <input
                type="checkbox"
                checked={state.tree.includes(i)}
                onChange={(e) => onToggleLeaf(i, e.target.checked)}
              />
              <span>
                <b>{l.title}</b>
                <br />
                <span className="small">{l.description}</span>
              </span>
            </label>
          ))}
        </div>
      </div>

      {state.tree.length === 4 && (
        <div className="badge" role="status">
          Cây đã xanh trở lại! Hãy biến các lựa chọn thành hành động mỗi ngày.
        </div>
      )}

      <label htmlFor="plan">
        Kế hoạch của em: khi nào dùng mạng, khi nào dừng, hoạt động thay thế và ai hỗ trợ?
      </label>
      <textarea
        id="plan"
        placeholder="Ví dụ: Sau khi hoàn thành bài tập, em dùng mạng trong khoảng thời gian đã thống nhất với bố mẹ, đặt giờ nhắc dừng rồi đi chơi cầu lông."
        value={state.fields.plan || ''}
        onChange={(e) => onFieldChange('plan', e.target.value)}
      />

      <details>
        <summary>Tự nhìn lại · không tính điểm</summary>
        <p>
          Em có bỏ học để lên mạng, thức khuya, cáu gắt khi bị nhắc dừng hoặc giảm giao tiếp với gia đình? Nếu có điều khiến em lo lắng, hãy trao đổi với người lớn đáng tin cậy. Hoạt động này giúp tự nhìn lại thói quen, không dùng để kết luận em mắc bệnh.
        </p>
      </details>

      <button type="button" className="primary" onClick={onNextStage}>
        Tiếp: kiểm tra kiến thức →
      </button>
    </section>
  );
};
