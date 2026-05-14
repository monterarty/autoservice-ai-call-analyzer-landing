export const TRANSCRIPTION_MODELS = [
  { value: "gpt-4o-transcribe", label: "gpt-4o-transcribe", hint: "$0.006/мин · лучшее качество для русского" },
  { value: "gpt-4o-mini-transcribe", label: "gpt-4o-mini-transcribe", hint: "$0.003/мин · в 2 раза дешевле, чуть слабее" },
  { value: "whisper-1", label: "whisper-1", hint: "$0.006/мин · старая модель" },
] as const;

export const ANALYSIS_MODELS = [
  // GPT-5.4/5.5 — current flagship
  { value: "gpt-5.4", label: "gpt-5.4", hint: "$2.50 / $0.25 / $15 · флагман, кеш в 10× дешевле gpt-4o" },
  { value: "gpt-5.4-mini", label: "gpt-5.4-mini", hint: "$0.75 / $0.075 / $4.50 · средняя" },
  { value: "gpt-5.4-nano", label: "gpt-5.4-nano", hint: "$0.20 / $0.02 / $1.25 · топчик по цене" },
  { value: "gpt-5.5", label: "gpt-5.5", hint: "$5.00 / $0.50 / $30 · самый умный" },

  // GPT-5.x older
  { value: "gpt-5.2", label: "gpt-5.2", hint: "$1.75 / $0.175 / $14" },
  { value: "gpt-5.1", label: "gpt-5.1", hint: "$1.25 / $0.125 / $10 · хороший компромисс" },
  { value: "gpt-5", label: "gpt-5", hint: "$1.25 / $0.125 / $10" },
  { value: "gpt-5-mini", label: "gpt-5-mini", hint: "$0.25 / $0.025 / $2.00" },
  { value: "gpt-5-nano", label: "gpt-5-nano", hint: "$0.05 / $0.005 / $0.40 · ~$0.001/звонок" },

  // GPT-4.1
  { value: "gpt-4.1", label: "gpt-4.1", hint: "$2.00 / $0.50 / $8.00" },
  { value: "gpt-4.1-mini", label: "gpt-4.1-mini", hint: "$0.40 / $0.10 / $1.60" },
  { value: "gpt-4.1-nano", label: "gpt-4.1-nano", hint: "$0.10 / $0.025 / $0.40" },

  // Legacy gpt-4o
  { value: "gpt-4o-2024-08-06", label: "gpt-4o-2024-08-06", hint: "$2.50 / $1.25 / $10 · проверено работает с json_schema strict" },
  { value: "gpt-4o", label: "gpt-4o (alias)", hint: "$2.50 / $1.25 / $10 · alias на последний gpt-4o" },
  { value: "gpt-4o-mini", label: "gpt-4o-mini", hint: "$0.15 / $0.075 / $0.60" },
] as const;

export type TranscriptionModelValue = (typeof TRANSCRIPTION_MODELS)[number]["value"];
export type AnalysisModelValue = (typeof ANALYSIS_MODELS)[number]["value"];

export const DEFAULT_TRANSCRIPTION_MODEL: TranscriptionModelValue = "gpt-4o-transcribe";
export const DEFAULT_ANALYSIS_MODEL: AnalysisModelValue = "gpt-4o-2024-08-06";
