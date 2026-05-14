import type { CallOutcome, WorkerErrorCategory } from "./types";

export const CALL_OUTCOME_LABEL: Record<CallOutcome, string> = {
  scheduled: "Записан",
  next_contact_date: "След. контакт",
  refused: "Отказ",
  info_only: "Консультация",
  no_answer: "Разговор не состоялся",
  other: "Иное",
};

export const CALL_OUTCOME_COLOR: Record<CallOutcome, string> = {
  scheduled: "bg-emerald-100 text-emerald-800 ring-emerald-200",
  next_contact_date: "bg-blue-100 text-blue-800 ring-blue-200",
  refused: "bg-rose-100 text-rose-800 ring-rose-200",
  info_only: "bg-amber-100 text-amber-800 ring-amber-200",
  no_answer: "bg-zinc-100 text-zinc-700 ring-zinc-200",
  other: "bg-zinc-100 text-zinc-700 ring-zinc-200",
};

export const CATEGORY_LABEL: Record<WorkerErrorCategory, string> = {
  greeting: "Приветствие",
  needs_identification: "Выявление потребностей",
  expectations_confirmation: "Подтверждение ожиданий",
  objections_handling: "Работа с возражениями",
  closure: "Завершение диалога",
  additional: "Доп. нарушения стандарта",
};

export const CATEGORY_ORDER: WorkerErrorCategory[] = [
  "greeting",
  "needs_identification",
  "expectations_confirmation",
  "objections_handling",
  "closure",
  "additional",
];
