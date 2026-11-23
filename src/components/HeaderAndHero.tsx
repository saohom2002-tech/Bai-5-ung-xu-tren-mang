import React, { useState } from 'react';
import { SELF_STUDY_GUIDE_VIDEO_SRC } from '../data/lessonData';

interface HeaderAndHeroProps {
  onNavigateStage: (stageIndex: number, scroll?: boolean) => void;
  onOpenSmartTv?: () => void;
}

export const HeaderAndHero: React.FC<HeaderAndHeroProps> = ({
  onNavigateStage,
  onOpenSmartTv,
}) => {
  return (
    <>
      <header>
        <div
          className="brand brand-home-link"
          role="button"
          tabIndex={0}
          title="Về trang chủ Bài 5"
          onClick={() => onNavigateStage(0, false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onNavigateStage(0, false);
            }
          }}
        >
          ◉ BÀI 5 ỨNG XỬ TRÊN MẠNG <span className="small">/ Tin học 7</span>
        </div>
        <div className="header-right">
          <button
            type="button"
            className="lb-header-launch"
            onClick={() => (onOpenSmartTv ? onOpenSmartTv() : onNavigateStage(8))}
          >
            🏆 Bảng Vàng Smart TV
          </button>
          <div className="small">
            THCS Tân Bình
            <br />
            Giáo viên tin học: Trần Thị Thanh Trúc
          </div>
        </div>
      </header>
    </>
  );
};

export const HeroSection: React.FC<HeaderAndHeroProps> = ({ onNavigateStage }) => {
  const [showGuideVideo, setShowGuideVideo] = useState(false);

  return (
    <>
      <section className="hero">
        <div>
          <span className="pill">CÔNG DÂN SỐ • HÀNH TRÌNH 02 TIẾT</span>
          <h1>
            Sau màn hình,
            <br />
            là một trái tim.
          </h1>
          <p className="lead">
            Cùng học cách giao tiếp văn minh, bảo vệ mình trên mạng và làm chủ thời gian sử dụng Internet.
          </p>
          <div className="hero-actions">
            <button type="button" className="primary" onClick={() => onNavigateStage(0)}>
              Xem clip khởi động →
            </button>
            <button
              type="button"
              className="guide-toggle-btn"
              aria-expanded={showGuideVideo}
              aria-controls="self-study-guide-video"
              onClick={() => setShowGuideVideo((prev) => !prev)}
            >
              {showGuideVideo ? '✕ Ẩn hướng dẫn tự học' : '▶ Hướng dẫn tự học (2 phút)'}
            </button>
          </div>
          <div className="stats">
            <div>
              <strong>3</strong>
              <small>Nội dung cốt lõi</small>
            </div>
            <div>
              <strong>5</strong>
              <small>Thử thách thực hành</small>
            </div>
            <div>
              <strong>1</strong>
              <small>Cam kết tử tế</small>
            </div>
          </div>
        </div>
        <div className="art">
          <svg
            viewBox="0 0 460 330"
            role="img"
            aria-label="Hai bạn giao tiếp tử tế qua màn hình, cùng bảo vệ trái tim số"
          >
            <rect x="20" y="20" width="420" height="290" rx="80" fill="#e0ebdb" />
            <circle cx="370" cy="70" r="30" fill="#f6d28d" />
            <rect x="100" y="63" width="260" height="180" rx="17" fill="#164b40" />
            <rect x="111" y="75" width="238" height="153" rx="10" fill="#f8fbf1" />
            <path
              d="M205 242v30h-55m55 0h85"
              fill="none"
              stroke="#164b40"
              strokeWidth="12"
              strokeLinecap="round"
            />
            <rect x="130" y="95" width="155" height="43" rx="15" fill="#d3e9d6" />
            <path d="m145 138 10 15 12-15" fill="#d3e9d6" />
            <rect x="195" y="158" width="130" height="43" rx="15" fill="#f9d59d" />
            <path d="M230 175c-20-23-41 10 0 29 41-19 20-52 0-29" fill="#de735c" />
            <circle cx="75" cy="232" r="28" fill="#e9b892" />
            <path d="M33 306v-25c0-39 82-39 82 0v25" fill="#cf795b" />
            <circle cx="385" cy="233" r="28" fill="#e9b892" />
            <path d="M345 306v-25c0-39 82-39 82 0v25" fill="#5e9681" />
            <path
              d="m324 45 13 12 24-26"
              fill="none"
              stroke="#218367"
              strokeWidth="9"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </section>

      {showGuideVideo && (
        <section
          id="self-study-guide-video"
          className="guide-video-card"
          aria-labelledby="guide-video-title"
        >
          <div className="guide-video-head">
            <div>
              <span className="num">HƯỚNG DẪN TỰ HỌC · CÁC BƯỚC SỬ DỤNG ỨNG DỤNG</span>
              <h2 id="guide-video-title" className="guide-video-title">
                Video hướng dẫn tự học Bài 5: Ứng xử trên mạng
              </h2>
            </div>
            <button
              type="button"
              className="guide-video-close"
              onClick={() => setShowGuideVideo(false)}
            >
              Thu gọn ✕
            </button>
          </div>

          <video
            controls
            playsInline
            preload="metadata"
            aria-label="Video hướng dẫn tự học Bài 5 Ứng xử trên mạng"
            className="stage-video-player"
          >
            <source src={SELF_STUDY_GUIDE_VIDEO_SRC} type="video/mp4" />
            Trình duyệt chưa hỗ trợ phát video. Em hãy mở clip bằng liên kết bên dưới.
          </video>

          <p className="small guide-video-meta">
            Thời lượng khoảng 2 phút 11 giây · Các em có thể tạm dừng video để vừa xem vừa thao tác theo từng mục.{' '}
            <a href={SELF_STUDY_GUIDE_VIDEO_SRC} target="_blank" rel="noopener noreferrer">
              Mở video hướng dẫn riêng ↗
            </a>
          </p>

          <div className="guide-video-note">
            <b>Lưu ý:</b> Video minh họa cách thao tác chung lần lượt các mục từ trái sang phải. Phiên bản hiện tại đánh số từ <b>01–09</b> và có bổ sung thêm video bài học (mục 05, 06), <b>Bài tập 1 &amp; Phiếu tự đánh giá</b> (mục 08) và <b>Bảng Vàng vinh danh</b> (mục 09).
          </div>
        </section>
      )}
    </>
  );
};
