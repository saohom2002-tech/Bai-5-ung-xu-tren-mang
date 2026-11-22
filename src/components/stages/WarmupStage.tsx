import React, { useState } from 'react';
import {
  LESSON_OBJECTIVES,
  RULES_5T,
  SCENARIO_CASES,
  WARMUP_YOUTUBE_EMBED,
  WARMUP_YOUTUBE_URL,
} from '../../data/lessonData';
import type { LessonState } from '../../types/lesson';

interface WarmupStageProps {
  state: LessonState;
  onFieldChange: (key: string, value: string) => void;
  onChooseCase: (caseIndex: number, optionIndex: number) => void;
  onNextStage: () => void;
}

export const WarmupStage: React.FC<WarmupStageProps> = ({
  state,
  onFieldChange,
  onChooseCase,
  onNextStage,
}) => {
  const [videoLoaded, setVideoLoaded] = useState(false);

  return (
    <>
      <section className="panel" id="warmup">
        <span className="num">KHỞI ĐỘNG · XEM – CẢM NHẬN – CHIA SẺ</span>
        <h2>Một clip. Một điều em muốn thay đổi.</h2>
        <p>
          Cùng xem clip cô chọn, chú ý lời nói, hành động và thông điệp liên quan đến cách ứng xử trên mạng.
        </p>

        <div
          id="warmup-video"
          style={{
            aspectRatio: '16/9',
            background: '#e6f2e9',
            borderRadius: '16px',
            display: 'grid',
            placeItems: 'center',
            overflow: 'hidden',
          }}
        >
          {videoLoaded ? (
            <iframe
              src={WARMUP_YOUTUBE_EMBED}
              title="Clip khởi động Bài 5: Ứng xử trên mạng"
              style={{ width: '100%', height: '100%', border: 0 }}
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          ) : (
            <div style={{ padding: '25px', textAlign: 'center' }}>
              <b>Clip khởi động Bài 5</b>
              <p>Nhấn nút để tải trình phát YouTube.</p>
              <button
                type="button"
                className="primary"
                onClick={() => setVideoLoaded(true)}
              >
                ▶ Mở trình phát clip
              </button>
            </div>
          )}
        </div>

        <div className="actions">
          <a href={WARMUP_YOUTUBE_URL} target="_blank" rel="noopener noreferrer">
            Mở clip trực tiếp trên YouTube ↗
          </a>
        </div>
        <p className="small">
          Cần Internet để xem clip. Nếu trình phát không hiện hoặc báo không cho phép nhúng, hãy dùng liên kết YouTube bên trên. Clip không tự phát.
        </p>

        <div className="feedback">
          <b>Nhiệm vụ khi xem:</b> Ghi nhớ một chi tiết khiến em chú ý và một thông điệp em rút ra. Không cần ghi chép toàn bộ clip.
        </div>

        <details>
          <summary>Gợi ý tổ chức khởi động cho giáo viên · khoảng 10 phút</summary>
          <p>
            Trước khi xem (1 phút): giao nhiệm vụ quan sát. Xem clip hoặc đoạn cô lựa chọn trong khoảng thời gian khởi động (khoảng 4 phút). Trao đổi cặp đôi (2 phút), mời 2–3 học sinh chia sẻ và kết nối bài học (3 phút). Điều chỉnh thời gian theo độ dài clip thực tế.
          </p>
          <p>
            Gợi ý dẫn vào bài: “Mỗi lời nói và hành động của chúng ta trên mạng đều có thể ảnh hưởng tới người khác. Làm thế nào để giao tiếp có văn hóa, tránh nội dung xấu và sử dụng Internet hợp lí? Chúng ta cùng tìm hiểu Bài 5: Ứng xử trên mạng.”
          </p>
          <p>
            Câu trả lời khởi động là cảm nhận cá nhân, không chấm đúng sai tự động. Giáo viên đối chiếu với nội dung thực tế của clip để nhận xét.
          </p>
        </details>

        <button
          type="button"
          onClick={() =>
            document.getElementById('lesson-goals')?.scrollIntoView({ behavior: 'smooth' })
          }
        >
          Tiếp: mục tiêu bài học ↓
        </button>
      </section>

      <section className="panel" id="lesson-goals">
        <span className="num">ĐÍCH ĐẾN CỦA EM</span>
        <h2>Học để biết. Thực hành để làm được.</h2>
        <ul>
          {LESSON_OBJECTIVES.map((o) => (
            <li key={o}>{o}</li>
          ))}
        </ul>
        <label htmlFor="identity">
          Tên hoặc mã nhóm · lớp (không cần thông tin riêng tư)
        </label>
        <input
          id="identity"
          value={state.fields.identity || ''}
          placeholder="Ví dụ: Nhóm 2 — lớp 7A"
          onChange={(e) => onFieldChange('identity', e.target.value)}
        />
      </section>

      <div className="grid">
        <div className="card">
          <span className="num">01 · VĂN MINH</span>
          <h3>Nói lời tử tế</h3>
          <p>Thấu hiểu cảm xúc, bảo vệ riêng tư và biết tìm trợ giúp.</p>
        </div>
        <div className="card">
          <span className="num">02 · AN TOÀN</span>
          <h3>Dừng trước nội dung xấu</h3>
          <p>Nhận diện rủi ro, đóng trang và hỏi người lớn khi cần.</p>
        </div>
        <div className="card">
          <span className="num">03 · TỰ CHỦ</span>
          <h3>Cân bằng cuộc sống</h3>
          <p>Hồi sinh cây bằng những thói quen sử dụng mạng hợp lí.</p>
        </div>
      </div>

      <section className="panel" style={{ marginTop: '20px' }}>
        <h3>Thông điệp 5T · từ học liệu Online Tử Tế</h3>
        {RULES_5T.map((r) => (
          <p key={r.title}>
            <b>{r.title}</b> — {r.description}
          </p>
        ))}
        <p className="small">
          5T là cách ghi nhớ bổ trợ. Dừng lại trước khi chia sẻ để kiểm chứng; thời gian “3 giây” là lời nhắc suy nghĩ, không bảo đảm thông tin đã đúng.
        </p>
      </section>

      <section className="panel">
        <p>
          Đọc từng tình huống, chọn một cách xử lí và xem giải thích. Có thể chọn lại để học từ sai sót.
        </p>

        <div className="chat">
          <b>Nhóm chat lớp 7A · Tình huống giả định</b>
          <div className="bubble">“Có tin về An nè, share nhanh kẻo nguội!”</div>
          <div className="bubble">Một số bạn hùa theo trêu chọc. An đọc được và rất buồn.</div>
          <div className="bubble me">Thế giới ảo. Cảm xúc thật.</div>
        </div>

        {SCENARIO_CASES.map((c, i) => (
          <article key={c.q}>
            <h3>
              {i + 1}. {c.q}
            </h3>
            {c.a.map((a, j) => (
              <button
                key={a}
                type="button"
                className={`choice ${state.scenario[i] === j ? 'active' : ''}`}
                onClick={() => onChooseCase(i, j)}
              >
                {String.fromCharCode(65 + j)}. {a}
              </button>
            ))}
            {state.scenario[i] !== undefined && (
              <div
                role="status"
                className={`feedback ${state.scenario[i] === c.ok ? '' : 'wrong'}`}
              >
                <b>{state.scenario[i] === c.ok ? 'Hợp lí!' : 'Hãy cân nhắc lại.'}</b> {c.e}
              </div>
            )}
          </article>
        ))}

        <label htmlFor="empathy">
          Vì sao lời trêu đùa trên mạng có thể làm An tổn thương?
        </label>
        <textarea
          id="empathy"
          placeholder="Nhập câu trả lời của em…"
          value={state.fields.empathy || ''}
          onChange={(e) => onFieldChange('empathy', e.target.value)}
        />

        <label htmlFor="rewrite">
          Viết lại câu “Bài này dở ẹc, đừng đăng nữa!” thành lời góp ý tử tế.
        </label>
        <textarea
          id="rewrite"
          placeholder="Nhập câu trả lời của em…"
          value={state.fields.rewrite || ''}
          onChange={(e) => onFieldChange('rewrite', e.target.value)}
        />

        <details>
          <summary>Tham khảo sau khi em đã viết</summary>
          <p>
            “Mình thấy ý ở đoạn này chưa rõ. Bạn thử bổ sung một ví dụ nhé!” Góp ý vào sản phẩm, không công kích người làm.
          </p>
        </details>

        <label htmlFor="video_group_message">
          Sau khi xem video và cho biết nhóm em rút ra được thông điệp gì?
        </label>
        <textarea
          id="video_group_message"
          placeholder="Nhóm em hãy thảo luận và ghi thông điệp rút ra sau khi xem video…"
          value={state.fields.video_group_message || ''}
          onChange={(e) => onFieldChange('video_group_message', e.target.value)}
        />
      </section>

      <section className="panel">
        <h3>Luật chơi &amp; cách học</h3>
        <p>
          Đọc phần Khám phá, rồi hoàn thành 5 thử thách ở các mục 03–07. Không tính tốc độ: ưu tiên suy nghĩ và thảo luận. Mỗi trò có hướng dẫn và phản hồi riêng. Bài kiểm tra tính 1 điểm mỗi câu đúng hoàn toàn, tổng 8 điểm; câu tự luận do giáo viên nhận xét.
        </p>
        <p>
          Có thể học cá nhân hoặc nhóm 4–6 bạn. Nhóm cử người thao tác, thư ký và người trình bày, đổi vai giữa các hoạt động.
        </p>
        <button type="button" className="primary" onClick={onNextStage}>
          Khám phá kiến thức →
        </button>
        <details>
          <summary>Gợi ý tổ chức cho giáo viên · 90 phút</summary>
          <p>
            Tiết 1: khởi động 10 phút; khám phá 10 phút; Phòng thử thách 5 nhóm 20 phút; chốt xử lí rủi ro 5 phút. Tiết 2: tác hại và Hồi sinh cây 15 phút; kiểm tra, chữa bài 15 phút; sản phẩm nhóm 10 phút; tổng kết, nộp phiếu 5 phút.
          </p>
          <p>
            Bài kiểm tra là luyện tập có đáp án, không phải bài thi được giám sát. Kết quả trên từng máy độc lập, chưa có bảng tổng hợp trực tuyến.
          </p>
        </details>
      </section>
    </>
  );
};
