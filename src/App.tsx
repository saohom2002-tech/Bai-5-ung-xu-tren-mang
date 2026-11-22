import { useEffect, useRef, useState } from 'react';
import { HeaderAndHero, HeroSection } from './components/HeaderAndHero';
import { StageNav } from './components/StageNav';
import { ChatRoomStage } from './components/stages/ChatRoomStage';
import { ClassifyStage } from './components/stages/ClassifyStage';
import { ExploreStage } from './components/stages/ExploreStage';
import { GroupChallengeStage } from './components/stages/GroupChallengeStage';
import { LeaderboardStage } from './components/stages/LeaderboardStage';
import { QuizStage } from './components/stages/QuizStage';
import { ResultStage } from './components/stages/ResultStage';
import { TreeStage } from './components/stages/TreeStage';
import { WarmupStage } from './components/stages/WarmupStage';
import { QUIZ_QUESTIONS } from './data/lessonData';
import type { LessonState } from './types/lesson';
import {
  buildFullReport,
  createFreshState,
  loadLessonState,
  saveLessonState,
} from './utils/storage';

export default function App() {
  const [state, setState] = useState<LessonState>(() => loadLessonState());
  const [storageBlocked, setStorageBlocked] = useState(false);
  const [tvMode, setTvMode] = useState(false);
  const navRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const ok = saveLessonState(state);
    setStorageBlocked(!ok);
  }, [state]);

  const go = (index: number, scroll = true) => {
    if (index !== 8 && tvMode) {
      setTvMode(false);
    }
    setState((prev) => ({
      ...prev,
      tab: index,
      visited: prev.visited.includes(index) ? prev.visited : [...prev.visited, index],
    }));
    if (scroll && navRef.current) {
      navRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const openSmartTvLeaderboard = () => {
    setState((prev) => ({
      ...prev,
      tab: 8,
      visited: prev.visited.includes(8) ? prev.visited : [...prev.visited, 8],
    }));
    setTvMode(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const returnHome = () => {
    setTvMode(false);
    setState((prev) => ({
      ...prev,
      tab: 0,
      visited: prev.visited.includes(0) ? prev.visited : [...prev.visited, 0],
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFieldChange = (key: string, value: string) => {
    setState((prev) => ({
      ...prev,
      fields: {
        ...prev.fields,
        [key]: value,
      },
    }));
  };

  const handleFieldsBatchChange = (updates: Record<string, string | undefined>) => {
    setState((prev) => {
      const nextFields = { ...prev.fields };
      for (const [k, v] of Object.entries(updates)) {
        if (v === undefined) {
          delete nextFields[k];
        } else {
          nextFields[k] = v;
        }
      }
      return {
        ...prev,
        fields: nextFields,
      };
    });
  };

  const handleChooseCase = (caseIdx: number, optionIdx: number) => {
    setState((prev) => ({
      ...prev,
      scenario: {
        ...prev.scenario,
        [caseIdx]: optionIdx,
      },
    }));
  };

  const handleSelectGroup = (groupIndex: number) => {
    setState((prev) => ({
      ...prev,
      group: groupIndex,
    }));
  };

  const handleSortPick = (index: number, value: boolean | undefined) => {
    setState((prev) => {
      const nextSort = { ...prev.sort };
      if (value === undefined) {
        delete nextSort[index];
      } else {
        nextSort[index] = value;
      }
      return {
        ...prev,
        sortChecked: false,
        sort: nextSort,
      };
    });
  };

  const handleCheckSort = () => {
    setState((prev) => ({
      ...prev,
      sortChecked: true,
    }));
  };

  const handleToggleLeaf = (index: number, checked: boolean) => {
    setState((prev) => {
      const filtered = prev.tree.filter((n) => n !== index);
      return {
        ...prev,
        tree: checked ? [...filtered, index] : filtered,
      };
    });
  };

  const handlePickQuiz = (questionIdx: number, optionIdx: number, checked: boolean) => {
    setState((prev) => {
      if (prev.submitted) return prev;
      const isSingle = QUIZ_QUESTIONS[questionIdx].correctIndices.length === 1;
      const current = prev.quiz[questionIdx] || [];
      const nextChoices = isSingle
        ? [optionIdx]
        : checked
          ? Array.from(new Set([...current, optionIdx]))
          : current.filter((n) => n !== optionIdx);

      return {
        ...prev,
        quiz: {
          ...prev.quiz,
          [questionIdx]: nextChoices,
        },
      };
    });
  };

  const handleSubmitQuiz = () => {
    setState((prev) => ({
      ...prev,
      submitted: true,
    }));
  };

  const handleRetryQuiz = () => {
    setState((prev) => ({
      ...prev,
      quiz: {},
      submitted: false,
    }));
  };

  const handleResetAll = () => {
    const fresh = createFreshState();
    setTvMode(false);
    setState(fresh);
    saveLessonState(fresh);
    go(0);
  };

  const renderPage = () => {
    switch (state.tab) {
      case 0:
        return (
          <WarmupStage
            state={state}
            onFieldChange={handleFieldChange}
            onChooseCase={handleChooseCase}
            onNextStage={() => go(1)}
          />
        );
      case 1:
        return <ExploreStage onNextStage={() => go(2)} />;
      case 2:
        return (
          <ChatRoomStage
            state={state}
            onFieldChange={handleFieldChange}
            onFieldsBatchChange={handleFieldsBatchChange}
            onNextStage={() => go(3)}
          />
        );
      case 3:
        return (
          <GroupChallengeStage
            state={state}
            onSelectGroup={handleSelectGroup}
            onFieldChange={handleFieldChange}
            onFieldsBatchChange={handleFieldsBatchChange}
            onNextStage={() => go(4)}
          />
        );
      case 4:
        return (
          <ClassifyStage
            state={state}
            onSortPick={handleSortPick}
            onCheckSort={handleCheckSort}
            onNextStage={() => go(5)}
          />
        );
      case 5:
        return (
          <TreeStage
            state={state}
            onToggleLeaf={handleToggleLeaf}
            onFieldChange={handleFieldChange}
            onNextStage={() => go(6)}
          />
        );
      case 6:
        return (
          <QuizStage
            state={state}
            onPickQuiz={handlePickQuiz}
            onSubmitQuiz={handleSubmitQuiz}
            onRetryQuiz={handleRetryQuiz}
            onNextStage={() => go(7)}
          />
        );
      case 7:
        return (
          <ResultStage
            state={state}
            onFieldChange={handleFieldChange}
            onResetAll={handleResetAll}
            onOpenLeaderboard={() => go(8)}
          />
        );
      case 8:
        return (
          <LeaderboardStage
            lessonState={state}
            tvMode={tvMode}
            onToggleTvMode={() => setTvMode((prev) => !prev)}
            onReturnHome={returnHome}
          />
        );
      default:
        return (
          <WarmupStage
            state={state}
            onFieldChange={handleFieldChange}
            onChooseCase={handleChooseCase}
            onNextStage={() => go(1)}
          />
        );
    }
  };

  const isFullscreenTv = tvMode && state.tab === 8;

  if (isFullscreenTv) {
    return (
      <>
        <LeaderboardStage
          lessonState={state}
          tvMode={true}
          onToggleTvMode={() => setTvMode(false)}
          onReturnHome={returnHome}
        />
        <pre className="printonly" style={{ whiteSpace: 'pre-wrap' }}>
          {buildFullReport(state)}
        </pre>
      </>
    );
  }

  return (
    <>
      <HeaderAndHero onNavigateStage={go} onOpenSmartTv={openSmartTvLeaderboard} />
      <main className={state.tab === 8 ? 'main-wide' : undefined}>
        <HeroSection onNavigateStage={go} />
        <StageNav
          activeStage={state.tab}
          onSelectStage={(idx) => go(idx)}
          navRef={navRef}
        />
        <div id="content">{renderPage()}</div>
        <p id="notice">
          {storageBlocked
            ? 'Trình duyệt không cho lưu tiến độ. Hãy tải phiếu kết quả trước khi đóng trang.'
            : 'Tiến độ được lưu trên trình duyệt này khi có thể. Không tự gửi bài cho giáo viên. Hãy tải phiếu kết quả để nộp.'}
        </p>
        <footer>
          Nguồn kiến thức: SGK Tin học 7, Kết nối tri thức với cuộc sống, Bài 5, trang 23–27; kế hoạch bài dạy và phiếu “Online Tử Tế” do giáo viên cung cấp. Tình huống và câu hỏi được biên soạn lại phục vụ học tập. 5T là thông điệp bổ trợ từ học liệu.
        </footer>
      </main>
      <pre className="printonly" style={{ whiteSpace: 'pre-wrap' }}>
        {buildFullReport(state)}
      </pre>
    </>
  );
}
