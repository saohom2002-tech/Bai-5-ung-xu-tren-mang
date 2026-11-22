import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../../data/lessonData';
import type { LessonState } from '../../types/lesson';
import { getQuizScore, isQuizQuestionCorrect } from '../../utils/storage';

interface QuizStageProps {
  state: LessonState;
  onPickQuiz: (questionIdx: number, optionIdx: number, checked: boolean) => void;
  onSubmitQuiz: () => void;
  onRetryQuiz: () => void;
  onNextStage: () => void;
}

export const QuizStage: React.FC<QuizStageProps> = ({
  state,
  onPickQuiz,
  onSubmitQuiz,
  onRetryQuiz,
  onNextStage,
}) => {
  const [quizMsg, setQuizMsg] = useState<string>('');
  const score = getQuizScore(state);

  const handleSubmit = () => {
    if (QUIZ_QUESTIONS.some((_, i) => !state.quiz[i]?.length)) {
      setQuizMsg('Em hãy trả lời đủ 8 câu trước khi nộp.');
      return;
    }
    setQuizMsg('');
    onSubmitQuiz();
  };

  return (
    <section className="panel">
      <span className="num">THỬ THÁCH 05 · KIỂM TRA KIẾN THỨC</span>
      <h2>Em đã sẵn sàng lên mạng tử tế?</h2>
      <p>
        8 câu hỏi, mỗi câu đúng hoàn toàn được 1 điểm. Câu có nhiều đáp án phải chọn đủ và không chọn thừa. Sau khi nộp, em xem giải thích hoặc làm lại.
      </p>

      {QUIZ_QUESTIONS.map((q, i) => {
        const correct = state.submitted && isQuizQuestionCorrect(state, i);
        return (
          <article key={q.question}>
            <h3>
              Câu {i + 1}. {q.question}
            </h3>
            {q.options.map((a, j) => (
              <label key={a} className="check">
                <input
                  disabled={state.submitted}
                  type={q.correctIndices.length > 1 ? 'checkbox' : 'radio'}
                  name={`q${i}`}
                  checked={(state.quiz[i] || []).includes(j)}
                  onChange={(e) => {
                    setQuizMsg('');
                    onPickQuiz(i, j, e.target.checked);
                  }}
                />
                <span>
                  {String.fromCharCode(65 + j)}. {a}
                </span>
              </label>
            ))}
            {state.submitted && (
              <div className={`feedback ${correct ? '' : 'wrong'}`}>
                <b>
                  {correct ? '✓ Đúng' : '↺ Chưa đúng'} · Đáp án{' '}
                  {q.correctIndices.map((n) => String.fromCharCode(65 + n)).join(', ')}
                </b>
                <br />
                {q.explanation}
              </div>
            )}
          </article>
        );
      })}

      <div className="actions">
        <button
          type="button"
          className="primary"
          onClick={handleSubmit}
          disabled={state.submitted}
        >
          Nộp bài kiểm tra
        </button>
        <button
          type="button"
          onClick={() => {
            setQuizMsg('');
            onRetryQuiz();
          }}
        >
          Làm lại bài kiểm tra
        </button>
        <button type="button" onClick={onNextStage}>
          Xem kết quả &amp; sản phẩm →
        </button>
      </div>

      {state.submitted ? (
        <div className="badge" role="status">
          {score}/8 điểm ·{' '}
          {score >= 6
            ? 'Em đã nắm được phần lớn kiến thức.'
            : 'Hãy đọc lại phần Khám phá và luyện thêm.'}
        </div>
      ) : (
        <p id="quizmsg" role="status">
          {quizMsg}
        </p>
      )}
    </section>
  );
};
