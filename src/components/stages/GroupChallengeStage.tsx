import React, { useState } from 'react';
import { GROUP_TASKS } from '../../data/lessonData';
import type { LessonState } from '../../types/lesson';
import {
  buildGroupDraft,
  downloadGroupPostHtml,
  groupKey,
  STORAGE_KEY,
} from '../../utils/storage';

interface GroupChallengeStageProps {
  state: LessonState;
  onSelectGroup: (groupIndex: number) => void;
  onFieldChange: (key: string, value: string) => void;
  onFieldsBatchChange: (updates: Record<string, string | undefined>) => void;
  onNextStage: () => void;
}

export const GroupChallengeStage: React.FC<GroupChallengeStageProps> = ({
  state,
  onSelectGroup,
  onFieldChange,
  onFieldsBatchChange,
  onNextStage,
}) => {
  const [imageStatus, setImageStatus] = useState<string>('');
  const [copyStatus, setCopyStatus] = useState<string>('');

  const n = state.group;
  const g = GROUP_TASKS[n];
  const v = (k: string) => state.fields[groupKey(k, n)] || '';

  const handleGroupField = (k: string, value: string) => {
    onFieldChange(groupKey(k, n), value);
  };

  const chooseGroupImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(f.type) || f.size > 8 * 1024 * 1024) {
      setImageStatus('Chọn ảnh JPG, PNG hoặc WebP không quá 8 MB.');
      e.target.value = '';
      return;
    }

    setImageStatus('Đang chuẩn bị ảnh…');
    const reader = new FileReader();
    reader.onerror = () => setImageStatus('Không đọc được ảnh. Em hãy chọn lại.');
    reader.onload = () => {
      const im = new Image();
      im.onerror = () => setImageStatus('Ảnh không hợp lệ. Em hãy chọn ảnh khác.');
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
        const key = groupKey('image', n);
        const nameKey = groupKey('imageName', n);

        try {
          const testState: LessonState = {
            ...state,
            fields: {
              ...state.fields,
              [key]: data,
              [nameKey]: f.name,
            },
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(testState));
          onFieldsBatchChange({
            [key]: data,
            [nameKey]: f.name,
          });
          setImageStatus('');
        } catch {
          setImageStatus(
            'Bộ nhớ trình duyệt đã đầy hoặc không cho phép lưu. Hãy giữ ảnh gốc để đính kèm trực tiếp trên Padlet.'
          );
        }
      };
      im.src = String(reader.result);
    };
    reader.readAsDataURL(f);
  };

  const removeGroupImage = () => {
    onFieldsBatchChange({
      [groupKey('image', n)]: undefined,
      [groupKey('imageName', n)]: undefined,
    });
    setImageStatus('');
  };

  const downloadGroupImage = () => {
    const a = document.createElement('a');
    a.href = v('image');
    a.download = `Nhom${n + 1}_Minh_hoa.jpg`;
    a.click();
  };

  const copyGroupPost = async () => {
    try {
      await navigator.clipboard.writeText(buildGroupDraft(state, n));
      setCopyStatus('Đã sao chép nội dung. Hãy dán vào bài Padlet và đính kèm hình riêng.');
    } catch {
      setCopyStatus('Chưa sao chép tự động được. Hãy bôi đen phần xem trước và nhấn Ctrl+C.');
    }
  };

  return (
    <section className="panel">
      <span className="num">04 PHÒNG THỬ THÁCH · HOẠT ĐỘNG TRỌNG TÂM</span>
      <h2>HOẠT ĐỘNG 2. THỬ THÁCH 5 NHÓM</h2>
      <p>
        Mỗi nhóm giải quyết một tình huống riêng, đăng kết quả tương ứng lên Padlet. Chọn đúng nhóm được giao, cùng thảo luận và cử đại diện trình bày một ý kiến.
      </p>

      <div className="actions" aria-label="Chọn nhiệm vụ nhóm">
        {GROUP_TASKS.map((x, i) => (
          <button
            key={x.name}
            type="button"
            className={i === n ? 'active' : undefined}
            aria-pressed={i === n}
            onClick={() => {
              onSelectGroup(i);
              setImageStatus('');
              setCopyStatus('');
            }}
          >
            {i + 1}. {x.name}
          </button>
        ))}
      </div>

      <article className="card">
        <span className="num">NHÓM {n + 1}</span>
        <h2>{g.name}</h2>
        <p>
          <b>Chủ đề:</b> {g.topic}
          <br />
          <b>Nhiệm vụ:</b> {g.task}
        </p>
        <div className="feedback">
          <b>Tình huống:</b> {g.caseText}
        </div>
        <h3>Thử thách của nhóm</h3>
        <ol>
          {g.challenges.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ol>
        <h3>Sản phẩm cần đăng lên Padlet</h3>
        <ul>
          {g.products.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      </article>

      <h3>MẪU BÀI ĐĂNG CỦA HỌC SINH</h3>
      <p>
        <b>
          NHÓM: {n + 1} – {g.name}
        </b>
      </p>

      <label htmlFor="group-class">Lớp (không bắt buộc)</label>
      <input
        id="group-class"
        value={v('class')}
        onChange={(e) => handleGroupField('class', e.target.value)}
        placeholder="Ví dụ: 7A"
      />

      <label htmlFor={groupKey('analysis', n)}>1. Phân tích tình huống</label>
      <textarea
        id={groupKey('analysis', n)}
        placeholder="Ghi ý kiến thảo luận của nhóm…"
        value={v('analysis')}
        onChange={(e) => handleGroupField('analysis', e.target.value)}
      />

      <label htmlFor={groupKey('solution', n)}>2. Giải pháp đề xuất</label>
      <textarea
        id={groupKey('solution', n)}
        placeholder="Ghi những việc nên làm; trình bày đủ các yêu cầu của nhóm ở trên…"
        value={v('solution')}
        onChange={(e) => handleGroupField('solution', e.target.value)}
      />

      <label htmlFor={groupKey('message', n)}>3. Thông điệp của nhóm</label>
      <textarea
        id={groupKey('message', n)}
        placeholder="Viết một câu khẩu hiệu ngắn gọn…"
        value={v('message')}
        onChange={(e) => handleGroupField('message', e.target.value)}
      />

      <label htmlFor="group-image">4. Hình ảnh minh họa</label>
      <input
        id="group-image"
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={chooseGroupImage}
      />
      <p className="small">
        Đính kèm hình ảnh hoặc tranh do nhóm lựa chọn. Nhận JPG, PNG, WebP tối đa 8 MB; ảnh được thu nhỏ để lưu trên máy này. Hãy chọn ảnh được phép sử dụng, tránh thông tin riêng tư.
      </p>

      {v('image') && (
        <>
          <figure>
            <img
              src={v('image')}
              alt={`Hình minh họa của nhóm ${n + 1}`}
              style={{ maxWidth: '100%', maxHeight: '350px', borderRadius: '12px' }}
            />
            <figcaption>{v('imageName')}</figcaption>
          </figure>
          <div className="actions">
            <button type="button" onClick={downloadGroupImage}>
              Tải hình đã chọn
            </button>
            <button type="button" onClick={removeGroupImage}>
              Bỏ hình
            </button>
          </div>
        </>
      )}

      <p id="group-image-status" role="status">
        {imageStatus}
      </p>

      <label htmlFor="group-caption">Chú thích / nguồn hình minh họa</label>
      <input
        id="group-caption"
        value={v('caption')}
        onChange={(e) => handleGroupField('caption', e.target.value)}
        placeholder="Ví dụ: Tranh do nhóm tự vẽ"
      />

      <details open>
        <summary>Xem trước bài đăng của nhóm</summary>
        <pre id="group-preview" style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>
          {buildGroupDraft(state, n)}
        </pre>
      </details>

      <div className="actions">
        <button type="button" className="primary" onClick={copyGroupPost}>
          Sao chép bài đăng
        </button>
        <button type="button" onClick={() => downloadGroupPostHtml(state, n)}>
          Tải bài nhóm kèm hình (.html)
        </button>
      </div>

      <p id="group-copy-status" role="status">
        {copyStatus}
      </p>

      <div className="feedback">
        <b>Đăng lên Padlet:</b> Mở bảng Padlet do cô cung cấp → chọn cột đúng tên nhóm → tạo bài mới → dán phần nội dung vừa sao chép → đính kèm hình đã chọn → kiểm tra và đăng. Web này giúp soạn bài, chưa tự đăng lên Padlet.
      </div>

      <details>
        <summary>Hướng dẫn phối hợp và tự kiểm tra</summary>
        <p>
          Phân công người điều hành, thư ký, người chọn hình và đại diện trình bày. Trước khi đăng, đối chiếu đủ các sản phẩm cần có của nhóm. Giáo viên nhận xét việc phân tích tình huống, giải pháp, thông điệp và tinh thần hợp tác; không chấm tự động phần tự luận.
        </p>
        <p>
          Bản nháp mỗi nhóm lưu riêng trên trình duyệt này. Tải bài kèm hình để giữ sản phẩm; bản HTML tải xuống là sản phẩm nhóm, không phải toàn bộ ứng dụng.
        </p>
      </details>

      <button type="button" className="primary" onClick={onNextStage}>
        Tiếp: Nên hay không nên? →
      </button>
    </section>
  );
};
