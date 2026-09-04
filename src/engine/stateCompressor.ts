import { calculateResult } from './scoringEngine';
import { ResultPayload, CharacterType, QuizAnswers } from '../types';

export interface CompactState {
  q1: string;
  q2: string;
  q3: string;
  q4: string;
  q5: string;
  c: 'f' | 'm';
  t?: number;
}

export function encodeResultState(result: ResultPayload): string {
  const compact: CompactState = {
    q1: result.answers.q1,
    q2: result.answers.q2,
    q3: result.answers.q3,
    q4: result.answers.q4,
    q5: result.answers.q5,
    c: result.characterType === 'female_student' ? 'f' : 'm',
    t: Math.floor(result.timestamp / 1000)
  };

  const jsonStr = JSON.stringify(compact);
  return btoa(encodeURIComponent(jsonStr));
}

export function decodeResultState(encodedStr: string): ResultPayload | null {
  try {
    const decodedJson = decodeURIComponent(atob(encodedStr));
    const compact: CompactState = JSON.parse(decodedJson);

    if (!compact.q1 || !compact.q2 || !compact.q3 || !compact.q4 || !compact.q5 || !compact.c) {
      return null;
    }

    const characterType: CharacterType = compact.c === 'f' ? 'female_student' : 'male_student';
    const answers: Required<QuizAnswers> = {
      q1: compact.q1,
      q2: compact.q2,
      q3: compact.q3,
      q4: compact.q4,
      q5: compact.q5,
    };

    return calculateResult(answers, characterType);
  } catch (err) {
    console.error('Failed to decode result state:', err);
    return null;
  }
}
