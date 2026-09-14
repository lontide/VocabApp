import { WordItem, QuizMode, QuizQuestion, QuizOption } from '../types/vocab';

export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function generateQuizQuestion(
  item: WordItem,
  mode: QuizMode,
  allPool: WordItem[]
): QuizQuestion {
  let questionText = '';
  let promptType = '';
  let answerType = '';
  let correctAnswerText = '';
  let ttsText: string | undefined;

  switch (mode) {
    case 'word_to_meaning':
      promptType = '영어 표현 (Word)';
      answerType = '한국어 뜻 (Meaning)';
      questionText = item.word;
      correctAnswerText = item.meaning;
      ttsText = item.word;
      break;

    case 'meaning_to_word':
      promptType = '한국어 뜻 (Meaning)';
      answerType = '영어 표현 (Word)';
      questionText = item.meaning;
      correctAnswerText = item.word;
      ttsText = item.word;
      break;

    case 'sentence_to_meaning':
      promptType = '영어 예제 문장 (Example Sentence)';
      answerType = '표현의 뜻 및 뉘앙스 (Meaning)';
      questionText = item.ex_en;
      correctAnswerText = item.meaning;
      ttsText = item.ex_en;
      break;

    case 'korean_to_sentence':
      promptType = '한국어 예문 해석 (Korean Sentence)';
      answerType = '영어 예문 (English Sentence)';
      questionText = item.ex_ko;
      correctAnswerText = item.ex_en;
      ttsText = item.ex_en;
      break;
  }

  // Generate 4 options for quiz mode
  // Filter out items with the same answer text to prevent ambiguous options
  const potentialDistractors = allPool.filter(
    other => other.id !== item.id && getAnswerText(other, mode) !== correctAnswerText
  );

  const shuffledDistractors = shuffleArray(potentialDistractors);
  const selectedDistractors = shuffledDistractors.slice(0, 3);

  const options: QuizOption[] = [
    {
      id: item.id,
      text: correctAnswerText,
      isCorrect: true,
      item
    },
    ...selectedDistractors.map(d => ({
      id: d.id,
      text: getAnswerText(d, mode),
      isCorrect: false,
      item: d
    }))
  ];

  return {
    item,
    questionText,
    promptType,
    answerType,
    correctAnswerText,
    options: shuffleArray(options),
    ttsText
  };
}

export function getAnswerText(item: WordItem, mode: QuizMode): string {
  switch (mode) {
    case 'word_to_meaning':
    case 'sentence_to_meaning':
      return item.meaning;
    case 'meaning_to_word':
      return item.word;
    case 'korean_to_sentence':
      return item.ex_en;
  }
}
