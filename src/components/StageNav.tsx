import React from 'react';

const NAV_TITLES = [
  'Khởi động & mục tiêu',
  'Khám phá',
  'Nhóm chat tử tế',
  'Phòng thử thách',
  'Nên hay không nên',
  'Hồi sinh cây',
  'Kiểm tra',
  'Sản phẩm và kết quả',
  'Bảng Vàng vinh danh',
];

interface StageNavProps {
  activeStage: number;
  onSelectStage: (index: number) => void;
  navRef: React.RefObject<HTMLElement | null>;
}

export const StageNav: React.FC<StageNavProps> = ({
  activeStage,
  onSelectStage,
  navRef,
}) => {
  return (
    <nav id="nav" ref={navRef} aria-label="Các hoạt động bài học">
      {NAV_TITLES.map((title, index) => (
        <button
          key={title}
          type="button"
          className={activeStage === index ? 'active' : undefined}
          aria-current={activeStage === index ? 'page' : 'false'}
          onClick={() => onSelectStage(index)}
        >
          {String(index + 1).padStart(2, '0')} {title}
        </button>
      ))}
    </nav>
  );
};
