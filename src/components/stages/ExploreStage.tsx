import React from 'react';
import { LEAF_MEASURES } from '../../data/lessonData';

interface ExploreStageProps {
  onNextStage: () => void;
}

export const ExploreStage: React.FC<ExploreStageProps> = ({ onNextStage }) => {
  return (
    <section className="panel">
      <span className="num">ĐỌC · SUY NGHĨ · GHI NHỚ</span>
      <h2>Ba điều cần mang theo khi lên mạng</h2>

      <details open>
        <summary>1. Giao tiếp, ứng xử có văn hóa qua mạng</summary>
        <p>
          Email, nhắn tin, trò chuyện trực tuyến, diễn đàn và mạng xã hội giúp kết nối rộng hơn nhưng khó kiểm soát hơn giao tiếp trực tiếp. Hãy dùng ngôn ngữ, hình ảnh và biểu tượng lịch sự; tôn trọng người khác, bảo vệ tài khoản và tự chủ thời gian.
        </p>
        <p>
          Không nói xấu, xúc phạm; không tự ý đăng thông tin, ảnh riêng của người khác; không đọc thư hay dùng tài khoản khi chưa được phép. Khi gặp việc gây lo lắng, sợ hãi hoặc bị bắt nạt, hãy nhờ bố mẹ, thầy cô giúp đỡ.
        </p>
        <div className="feedback">
          Chỉ vì một việc diễn ra trên mạng không có nghĩa em có thể làm điều mình sẽ không làm khi gặp trực tiếp.
        </div>
      </details>

      <details open>
        <summary>2. Làm gì khi gặp thông tin có nội dung xấu?</summary>
        <p>
          Nội dung bạo lực, kích động, cờ bạc hoặc không phù hợp lứa tuổi cần tránh. Chỉ truy cập nguồn phù hợp; nếu vô tình mở phải, đóng ngay trang đó, không chia sẻ và hỏi người lớn khi cần. Nhờ người lớn hỗ trợ dùng phần mềm chặn trang xấu; ý thức tự bảo vệ vẫn rất quan trọng.
        </p>
        <p>
          Ví dụ truy cập không hợp lệ: tự ý đọc hộp thư của bạn hoặc dùng tài khoản người khác khi chưa được đồng ý.
        </p>
      </details>

      <details open>
        <summary>3. Tác hại và cách phòng tránh nghiện Internet</summary>
        <p>
          Dùng mạng quá mức, không kiểm soát, ảnh hưởng đến học tập và quan hệ là biểu hiện cần chú ý. Ví dụ: bỏ bê việc học, thức khuya, cáu gắt khi không được dùng mạng, giấu thời gian sử dụng, giảm hứng thú với hoạt động ngoài đời.
        </p>
        <p>
          Tác hại: suy giảm sức khỏe, giảm giao tiếp, khó tập trung, học tập sa sút; dễ bị dẫn vào trang xấu hoặc cuốn vào trò chơi trực tuyến, có nguy cơ tham gia bắt nạt trên mạng.
        </p>
        <div className="grid two">
          {LEAF_MEASURES.map((l) => (
            <div key={l.title} className="card">
              <b>{l.title}</b>
              <p>{l.description}</p>
            </div>
          ))}
        </div>
      </details>

      <div className="actions">
        <button type="button" className="primary" onClick={onNextStage}>
          Vào phòng tình huống →
        </button>
      </div>
    </section>
  );
};
