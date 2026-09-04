import React, { useState } from 'react';
import { PathId, TraitId, StrengthFamily, QuizAnswers, ResultPayload } from '../types';

interface DebugPanelProps {
  /** Current screen name */
  screen: string;
  /** Character/avatar type selected */
  characterType: string;
  /** Current answers (partial during quiz, full after) */
  answers: QuizAnswers;
  /** Full result payload — available only after scoring completes */
  result?: ResultPayload | null;
}

const PATH_IDS: PathId[] = ['PED', 'MH', 'ER', 'OA', 'MAT', 'COMM', 'INT', 'TECH'];
const TRAIT_IDS: TraitId[] = ['EMP', 'OBS', 'ACT', 'COM', 'COL', 'INN'];
const FAMILY_IDS: StrengthFamily[] = ['HUMAN_CONNECTION', 'CLINICAL_AWARENESS', 'FUTURE_COLLABORATION'];

const FAMILY_LABELS: Record<StrengthFamily, string> = {
  HUMAN_CONNECTION:     'Heart Connector (EMP+COM)',
  CLINICAL_AWARENESS:   'Clinical Instinct (OBS+ACT)',
  FUTURE_COLLABORATION: 'Care Innovator (COL+INN)',
};

/**
 * DebugPanel
 *
 * Dev-only overlay showing all scoring data, answers, and result profile.
 * Rendered only when useDebugMode() returns true.
 * Has ZERO effect on scoring, navigation, or state.
 *
 * Toggle visibility with the 🐛 button (bottom-right corner).
 */
export const DebugPanel: React.FC<DebugPanelProps> = ({
  screen,
  characterType,
  answers,
  result,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Toggle button — fixed bottom-right */}
      <button
        onClick={() => setOpen(v => !v)}
        className="fixed bottom-4 right-4 z-[9999] w-10 h-10 rounded-full bg-slate-800 border border-yellow-400/60 text-yellow-400 text-lg flex items-center justify-center shadow-xl hover:bg-slate-700 transition-colors select-none"
        title="Toggle Debug Panel"
      >
        🐛
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed inset-y-0 right-0 z-[9998] w-80 bg-slate-950/95 border-l border-yellow-400/30 overflow-y-auto text-xs font-mono text-slate-300 p-4 space-y-4 shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <span className="font-bold text-yellow-400 tracking-wider text-sm">DEBUG PANEL</span>
            <button
              onClick={() => setOpen(false)}
              className="text-slate-500 hover:text-white transition-colors text-base"
            >
              ✕
            </button>
          </div>

          {/* Session */}
          <Section title="SESSION">
            <Row label="screen" value={screen} />
            <Row label="avatarStyle" value={characterType} />
          </Section>

          {/* Answers */}
          <Section title="ANSWERS">
            {(['q1','q2','q3','q4','q5'] as const).map(q => (
              <Row key={q} label={q.toUpperCase()} value={answers[q] ?? '—'} />
            ))}
          </Section>

          {result ? (
            <>
              {/* Path scores */}
              <Section title="PATH SCORES">
                {PATH_IDS.map(p => (
                  <Row
                    key={p}
                    label={p}
                    value={result.pathScores[p]}
                    highlight={p === result.pathId}
                    secondary={p === result.secondaryPathId}
                  />
                ))}
              </Section>

              {/* Trait scores */}
              <Section title="TRAIT SCORES">
                {TRAIT_IDS.map(t => (
                  <Row key={t} label={t} value={result.traitScores[t]} />
                ))}
              </Section>

              {/* Family scores */}
              <Section title="STRENGTH FAMILIES">
                {FAMILY_IDS.map(f => (
                  <Row
                    key={f}
                    label={FAMILY_LABELS[f]}
                    value={result.familyScores[f]}
                    highlight={f === result.strengthFamily}
                  />
                ))}
              </Section>

              {/* Result */}
              <Section title="RESULT">
                <Row label="Primary Path" value={result.pathId} highlight />
                <Row label="Secondary Path" value={result.secondaryPathId} secondary />
                <Row label="Strength Profile" value={result.strengthFamily} />
                <Row label="Superpower" value={result.superpower} />
                <Row label="AI Skill" value={result.aiSkill} />
              </Section>
            </>
          ) : (
            <div className="text-slate-500 italic text-center py-4">
              Scoring not yet run.<br />Complete all 5 questions.
            </div>
          )}

          <div className="pb-16 text-center text-slate-600 text-[10px]">
            Debug panel — dev only
          </div>
        </div>
      )}
    </>
  );
};

// ── Sub-components ────────────────────────────────────────────────────────────

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div>
    <div className="text-yellow-400/80 text-[10px] font-bold tracking-widest mb-1.5 uppercase">
      {title}
    </div>
    <div className="space-y-0.5">{children}</div>
  </div>
);

const Row: React.FC<{
  label: string;
  value: string | number;
  highlight?: boolean;
  secondary?: boolean;
}> = ({ label, value, highlight, secondary }) => (
  <div className={`flex items-center justify-between gap-2 py-0.5 px-1 rounded ${
    highlight ? 'bg-yellow-400/15 text-yellow-300' :
    secondary ? 'bg-sky-400/10 text-sky-300' :
    ''
  }`}>
    <span className="text-slate-400 truncate flex-1">{label}</span>
    <span className={`font-bold shrink-0 ${
      highlight ? 'text-yellow-400' :
      secondary ? 'text-sky-400' :
      'text-white'
    }`}>
      {value}
    </span>
  </div>
);
