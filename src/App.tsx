import { useState, useEffect, useCallback } from 'react';
import questionsData from './data/questions.json';
import { Header } from './components/Header';
import { IdleModal } from './components/IdleModal';
import { DebugPanel } from './components/DebugPanel';
import { WelcomeView } from './views/WelcomeView';
import { CharacterSelectView } from './views/CharacterSelectView';
import { QuizView } from './views/QuizView';
import { AnalysisView } from './views/AnalysisView';
import { RevealView } from './views/RevealView';
import { CardPreviewView } from './views/CardPreviewView';
import { SaveShareView } from './views/SaveShareView';
import { ThankYouResetView } from './views/ThankYouResetView';
import { MobileResultView } from './views/MobileResultView';
import { CharacterType, QuizAnswers, ResultPayload } from './types';
import { preloadProcessingAssets } from './assets/registry';
import { calculateResult } from './engine/scoringEngine';
import { decodeResultState } from './engine/stateCompressor';
import { useIdleTimer } from './engine/idleManager';
import { incrementSession } from './engine/sessionManager';
import { useDebugMode } from './hooks/useDebugMode';
import { resetAudioState } from './engine/audioManager';
import { ASSETS } from './assets/registry';

// ── Screen type ───────────────────────────────────────────────────────────────
// Full kiosk flow: welcome → quiz → character → analysis → reveal → card_preview → save_share → thank_you_reset
// QR hand-off:     mobile_result (standalone, no kiosk chrome)
type Screen =
  | 'welcome'
  | 'character'
  | 'quiz'
  | 'analysis'
  | 'reveal'
  | 'card_preview'
  | 'save_share'
  | 'thank_you_reset'
  | 'mobile_result';

// ── App ───────────────────────────────────────────────────────────────────────

export function App() {
  const [screen, setScreen]                   = useState<Screen>('welcome');
  const [characterType, setCharacterType]     = useState<CharacterType>('female_student');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [answers, setAnswers]                 = useState<QuizAnswers>({});
  const [result, setResult]                   = useState<ResultPayload | null>(null);
  // Card data URL stored here so both CardPreviewView and SaveShareView can use it
  const [cardDataUrl, setCardDataUrl]         = useState<string>('');

  const isDebugMode = useDebugMode();

  // ── QR hand-off: decode #result= URL hash & Preload processing assets ────
  useEffect(() => {
    preloadProcessingAssets();
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#result=')) {
        const encoded = hash.replace('#result=', '');
        const decoded = decodeResultState(encoded);
        if (decoded) { setResult(decoded); setScreen('mobile_result'); }
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // ── Global Preloader: Preload all 5 quiz presenter characters immediately ───
  useEffect(() => {
    [
      ASSETS.questions.q1,
      ASSETS.questions.q2,
      ASSETS.questions.q3,
      ASSETS.questions.q4,
      ASSETS.questions.q5,
    ].forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // ── Reset — clears all session state ──────────────────────────────────────
  const handleReset = useCallback(() => {
    if (window.location.hash) window.history.replaceState(null, '', window.location.pathname);
    incrementSession();
    setAnswers({});
    setCurrentQuestionIdx(0);
    setResult(null);
    setCharacterType('female_student');
    setCardDataUrl('');
    resetAudioState();
    setScreen('welcome');
  }, []);

  // ── Idle timer (kiosk only, disabled on welcome + mobile_result) ──────────
  const isKiosk = screen !== 'mobile_result';
  const { isWarning, secondsRemaining, resetActivity } = useIdleTimer({
    warningThresholdMs: 45000,
    resetThresholdMs:   60000,
    onReset:            handleReset,
    enabled:            isKiosk && screen !== 'welcome',
  });

  // ── Screen handlers ────────────────────────────────────────────────────────

  const handleStart = () => {
    resetActivity();
    setCurrentQuestionIdx(0);
    setScreen('quiz');
  };

  const handleSelectOption = (optionKey: string) => {
    resetActivity();
    const currentQ = questionsData.questions[currentQuestionIdx];
    setAnswers(prev => ({ ...prev, [currentQ.id]: optionKey }));
  };

  const handleNextQuestion = () => {
    resetActivity();
    if (currentQuestionIdx < questionsData.questions.length - 1) {
      setCurrentQuestionIdx(i => i + 1);
    } else {
      // All 5 answered — proceed to Choose Future Look
      setScreen('character');
    }
  };

  const handleBackQuestion = () => {
    resetActivity();
    if (currentQuestionIdx > 0) {
      setCurrentQuestionIdx(i => i - 1);
    } else {
      setScreen('welcome');
    }
  };

  const handleSelectCharacter = (c: CharacterType) => {
    resetActivity();
    setCharacterType(c);

    // All 5 answered + character selected — compute result then go to analysis
    const { q1, q2, q3, q4, q5 } = answers;
    if (q1 && q2 && q3 && q4 && q5) {
      const r = calculateResult({ q1, q2, q3, q4, q5 }, c);
      setResult(r);
      setScreen('analysis');
    }
  };

  // analysis complete → reveal
  const handleAnalysisComplete = () => { resetActivity(); setScreen('reveal'); };

  // reveal → card_preview
  const handleRevealNext = () => { resetActivity(); setScreen('card_preview'); };

  // card_preview → save_share (card data URL arrives here from CardPreviewView)
  const handleCardReady = (url: string) => { setCardDataUrl(url); };
  const handleCardPreviewNext = () => { resetActivity(); setScreen('save_share'); };

  // save_share → thank_you_reset
  const handleSaveShareNext = () => { resetActivity(); setScreen('thank_you_reset'); };

  // ── Mobile QR hand-off view (standalone, no kiosk chrome) ─────────────────
  if (screen === 'mobile_result' && result) {
    return <MobileResultView result={result} onPlayAgain={handleReset} />;
  }

  const currentQuestion = questionsData.questions[currentQuestionIdx];
  const selectedOption  = currentQuestion
    ? answers[currentQuestion.id as keyof QuizAnswers]
    : undefined;

  return (
    <div className="min-h-[100dvh] h-[100dvh] w-full flex items-center justify-center bg-gradient-to-b from-mahidol-deep via-[#05142B] to-[#020B18] text-slate-100 overflow-hidden">
      {/* 3:4 Portrait Content Canvas: fixed 3:4 composition, centered, background-filled around */}
      <div className="canvas-3-4 flex flex-col relative shadow-2xl">
        {/* Kiosk chrome: header with step indicator + reset (shown on quiz/result flow) */}
        {screen !== 'welcome' && screen !== 'quiz' && screen !== 'character' && screen !== 'analysis' && screen !== 'reveal' && screen !== 'thank_you_reset' && (
          <Header
            showReset={true}
            onReset={handleReset}
          />
        )}

        {/* Main content area */}
        <main className="flex-1 flex flex-col relative z-10 min-h-0 h-full overflow-hidden">
        {screen === 'welcome'      && <WelcomeView onStart={handleStart} />}
        {screen === 'character'    && (
          <CharacterSelectView
            initialCharacter={characterType}
            onConfirm={handleSelectCharacter}
            onBack={() => {
              resetActivity();
              setCurrentQuestionIdx(questionsData.questions.length - 1);
              setScreen('quiz');
            }}
          />
        )}
        {screen === 'quiz' && currentQuestion && (
          <QuizView
            question={currentQuestion as any}
            currentStep={currentQuestionIdx + 1}
            totalSteps={questionsData.questions.length}
            selectedOption={selectedOption}
            onSelectOption={handleSelectOption}
            onNext={handleNextQuestion}
            onBack={handleBackQuestion}
          />
        )}
        {screen === 'analysis'     && (
          <AnalysisView
            onComplete={handleAnalysisComplete}
            characterType={characterType}
            totalQuestions={questionsData.questions.length}
            onBack={() => {
              resetActivity();
              setScreen('character');
            }}
          />
        )}
        {screen === 'reveal'       && result && (
          <RevealView
            result={result}
            onNext={handleRevealNext}
            onBack={() => {
              resetActivity();
              setScreen('character');
            }}
          />
        )}
        {screen === 'card_preview' && result && (
          <CardPreviewView
            result={result}
            onCardReady={handleCardReady}
            onNext={handleCardPreviewNext}
          />
        )}
        {screen === 'save_share'   && result && (
          <SaveShareView
            result={result}
            cardDataUrl={cardDataUrl}
            onNext={handleSaveShareNext}
          />
        )}
        {screen === 'thank_you_reset' && (
          <ThankYouResetView
            result={result}
            cardDataUrl={cardDataUrl}
            onReset={handleReset}
            onViewCardAgain={() => {
              resetActivity();
              setScreen('card_preview');
            }}
          />
        )}
      </main>
      </div>

      {/* Idle warning modal */}
      <IdleModal
        isWarning={isWarning}
        secondsRemaining={secondsRemaining}
        onContinue={resetActivity}
      />

      {/* Debug panel — only rendered when useDebugMode() is true */}
      {isDebugMode && (
        <DebugPanel
          screen={screen}
          characterType={characterType}
          answers={answers}
          result={result}
        />
      )}
    </div>
  );
}

export default App;
