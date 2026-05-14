"use client";

import { useState } from "react";
import type {
  AnalyzeResponseData,
  CallAnalysis,
  CategorySummaryItem,
  LeadConfidence,
  UsageInfo,
  WorkerErrorCategory,
} from "../lib/types";
import {
  CALL_OUTCOME_COLOR,
  CALL_OUTCOME_LABEL,
  CATEGORY_LABEL,
  CATEGORY_ORDER,
} from "../lib/labels";

interface Props {
  data: AnalyzeResponseData;
}

export default function AnalysisResult({ data }: Props) {
  const { transcript, analysis, usage } = data;
  return (
    <div className="space-y-6">
      <LeadBadge analysis={analysis} />
      {usage && <UsageBlock usage={usage} />}
      <CarHeader analysis={analysis} />
      <QuickFacts analysis={analysis} />
      <ManagerNoteBlock note={analysis.manager_note} />
      <Agreements list={analysis.agreements} />
      <DetectedErrors analysis={analysis} />
      <CategorySummary analysis={analysis} />
      <CallbackBlock analysis={analysis} />
      <Strengths list={analysis.strengths} />
      <TranscriptBlock transcript={transcript} />
    </div>
  );
}

function UsageBlock({ usage }: { usage: UsageInfo }) {
  const fmtSec = (s: number) =>
    s < 60 ? `${s}s` : `${Math.floor(s / 60)}m ${s % 60}s`;
  const fmtCost = (c: number) => `$${c.toFixed(5)}`;
  const cachedPct =
    usage.analysis.input_tokens > 0
      ? Math.round(
          (usage.analysis.cached_tokens / usage.analysis.input_tokens) * 100,
        )
      : 0;
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Стоимость и токены
        </div>
        <div className="font-mono text-base font-semibold text-zinc-900">
          {fmtCost(usage.total_cost_usd)}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
        <Stat
          label="Время"
          value={`${(usage.elapsed_ms / 1000).toFixed(1)} c`}
        />
        <Stat
          label="Аудио"
          value={`~${fmtSec(usage.audio_seconds_estimated)}`}
          sub={`${(usage.audio_bytes / 1024).toFixed(0)} KB`}
        />
        <Stat
          label="Транскрипция"
          value={fmtCost(usage.transcription.cost_usd)}
          sub={usage.transcription.model}
        />
        <Stat
          label="Анализ"
          value={fmtCost(usage.analysis.cost_usd)}
          sub={usage.analysis.model}
        />
      </div>

      <div className="mt-3 rounded-lg bg-zinc-50 p-3 font-mono text-xs text-zinc-700">
        input <strong>{usage.analysis.input_tokens}</strong>
        {usage.analysis.cached_tokens > 0 && (
          <span className="text-emerald-700">
            {" "}
            (cached {usage.analysis.cached_tokens} = {cachedPct}%)
          </span>
        )}{" "}
        · output <strong>{usage.analysis.output_tokens}</strong>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div>
      <div className="text-xs font-medium uppercase tracking-wider text-zinc-500">
        {label}
      </div>
      <div className="mt-0.5 font-mono text-sm font-medium text-zinc-900">
        {value}
      </div>
      {sub && <div className="text-[10px] text-zinc-500">{sub}</div>}
    </div>
  );
}

const CONFIDENCE_LABEL: Record<LeadConfidence, string> = {
  high: "высокая уверенность",
  medium: "средняя уверенность",
  low: "низкая уверенность",
};

function LeadBadge({ analysis }: { analysis: CallAnalysis }) {
  const { is_lead, confidence, rationale, signals } = analysis.lead;
  const wrapper = is_lead
    ? "border-emerald-300 bg-emerald-50"
    : "border-zinc-300 bg-zinc-50";
  const pill = is_lead
    ? "bg-emerald-600 text-white"
    : "bg-zinc-600 text-white";
  return (
    <div className={`rounded-2xl border p-5 ${wrapper}`}>
      <div className="flex items-center gap-3">
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold tracking-wide ${pill}`}
        >
          {is_lead ? "ЛИД" : "НЕ ЛИД"}
        </span>
        <span className="text-xs uppercase tracking-wider text-zinc-500">
          {CONFIDENCE_LABEL[confidence]}
        </span>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-zinc-800">{rationale}</p>
      {signals.length > 0 && (
        <ul className="mt-3 space-y-1">
          {signals.map((s, i) => (
            <li key={i} className="flex gap-2 text-xs text-zinc-700">
              <span className="select-none text-zinc-400">•</span>
              <span>{s}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function CarHeader({ analysis }: { analysis: CallAnalysis }) {
  const { make, model, year } = analysis.car;
  const carTitle = [make, model, year].filter(Boolean).join(" ");
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6">
      <div className="text-xs font-medium uppercase tracking-wider text-zinc-500">
        Автомобиль
      </div>
      <div className="mt-1 text-2xl font-semibold text-zinc-900">
        {carTitle || "Не указан"}
      </div>
      {analysis.contact_reason && (
        <div className="mt-3 text-sm text-zinc-700">
          <span className="font-medium text-zinc-500">Причина обращения: </span>
          {analysis.contact_reason}
        </div>
      )}
    </div>
  );
}

function QuickFacts({ analysis }: { analysis: CallAnalysis }) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      <Fact label="Статус звонка">
        <span
          className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${CALL_OUTCOME_COLOR[analysis.call_outcome]}`}
        >
          {CALL_OUTCOME_LABEL[analysis.call_outcome]}
        </span>
      </Fact>
      <Fact label="Оператор" value={analysis.operator_name} />
      <Fact label="Клиент" value={analysis.client_name} />
      <Fact label="Телефон клиента" value={analysis.client_phone} mono />
      <Fact label="Сумма штрафа">
        <span
          className={`font-mono text-sm ${analysis.total_penalty > 0 ? "text-rose-700" : "text-emerald-700"}`}
        >
          {analysis.total_penalty}
        </span>
      </Fact>
      <Fact label="Ошибок найдено">
        <span
          className={`font-mono text-sm ${analysis.detected_errors.length > 0 ? "text-rose-700" : "text-emerald-700"}`}
        >
          {analysis.detected_errors.length}
        </span>
      </Fact>
    </div>
  );
}

function Fact({
  label,
  value,
  children,
  mono,
}: {
  label: string;
  value?: string | null;
  children?: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white px-4 py-3">
      <div className="text-xs font-medium uppercase tracking-wider text-zinc-500">
        {label}
      </div>
      <div
        className={`mt-1 text-sm text-zinc-900 ${mono ? "font-mono" : ""}`}
      >
        {children ?? value ?? <span className="text-zinc-400">—</span>}
      </div>
    </div>
  );
}

function ManagerNoteBlock({ note }: { note: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(note);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="text-xs font-medium uppercase tracking-wider text-zinc-500">
          Заметка для CRM
        </div>
        <button
          onClick={copy}
          className="rounded-md border border-zinc-300 bg-white px-2 py-1 text-xs text-zinc-700 transition hover:bg-zinc-100"
        >
          {copied ? "Скопировано" : "Скопировать"}
        </button>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-zinc-900">{note}</p>
    </div>
  );
}

function Agreements({ list }: { list: string[] }) {
  if (list.length === 0) return null;
  return (
    <Section title="Договорённости">
      <ul className="space-y-1.5">
        {list.map((item, i) => (
          <li key={i} className="flex gap-2 text-sm text-zinc-800">
            <span className="select-none text-emerald-600">✓</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </Section>
  );
}

function DetectedErrors({ analysis }: { analysis: CallAnalysis }) {
  if (analysis.detected_errors.length === 0) {
    return (
      <Section title="Нарушения по чеклисту">
        <div className="text-sm text-emerald-700">
          Нарушений не найдено.
        </div>
      </Section>
    );
  }
  const byCategory = new Map<WorkerErrorCategory, typeof analysis.detected_errors>();
  for (const err of analysis.detected_errors) {
    const list = byCategory.get(err.category) ?? [];
    list.push(err);
    byCategory.set(err.category, list);
  }

  return (
    <Section title={`Нарушения по чеклисту (${analysis.detected_errors.length})`}>
      <div className="space-y-4">
        {CATEGORY_ORDER.filter((c) => byCategory.has(c)).map((cat) => (
          <div key={cat}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
              {CATEGORY_LABEL[cat]}
            </div>
            <ul className="space-y-2">
              {byCategory.get(cat)!.map((err) => (
                <li
                  key={`${err.id}-${err.label}`}
                  className="rounded-lg border border-rose-200 bg-rose-50 p-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="text-sm font-medium text-rose-900">
                      {err.label}
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className="rounded bg-white px-1.5 py-0.5 font-mono text-xs text-rose-700 ring-1 ring-rose-200">
                        id {err.id}
                      </span>
                      <span className="rounded bg-rose-600 px-1.5 py-0.5 font-mono text-xs text-white">
                        −{err.score}
                      </span>
                    </div>
                  </div>
                  {err.evidence && (
                    <div className="mt-1.5 text-xs italic text-rose-800/80">
                      {err.evidence}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}

function CategorySummary({ analysis }: { analysis: CallAnalysis }) {
  return (
    <Section title="Сводка по категориям">
      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {CATEGORY_ORDER.map((cat) => {
          const item: CategorySummaryItem = analysis.category_summary[cat];
          return (
            <li
              key={cat}
              className="flex items-start gap-2 rounded-lg border border-zinc-200 bg-white p-3"
            >
              <span
                className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  item.passed
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-rose-100 text-rose-700"
                }`}
              >
                {item.passed ? "✓" : "✕"}
              </span>
              <div className="min-w-0">
                <div className="text-sm font-medium text-zinc-900">
                  {CATEGORY_LABEL[cat]}
                </div>
                <div className="text-xs text-zinc-600">{item.comment}</div>
              </div>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}

function CallbackBlock({ analysis }: { analysis: CallAnalysis }) {
  const c = analysis.callback_commitment;
  return (
    <Section title="Обязательство перезвонить">
      {!c.promised ? (
        <div className="text-sm text-zinc-600">
          Оператор не обещал перезванивать.
        </div>
      ) : (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          <div className="font-medium">Обещание зафиксировано</div>
          {c.deadline_text && (
            <div className="mt-1">
              <span className="text-amber-700">Срок:</span> {c.deadline_text}
            </div>
          )}
          {c.reason && (
            <div className="mt-1">
              <span className="text-amber-700">Причина:</span> {c.reason}
            </div>
          )}
          {c.quote && (
            <div className="mt-2 border-l-2 border-amber-300 pl-2 italic text-amber-800/80">
              «{c.quote}»
            </div>
          )}
        </div>
      )}
    </Section>
  );
}

function Strengths({ list }: { list: string[] }) {
  if (list.length === 0) return null;
  return (
    <Section title="Сильные стороны">
      <ul className="space-y-1.5">
        {list.map((s, i) => (
          <li key={i} className="flex gap-2 text-sm text-zinc-800">
            <span className="select-none text-emerald-600">+</span>
            <span>{s}</span>
          </li>
        ))}
      </ul>
    </Section>
  );
}

function TranscriptBlock({ transcript }: { transcript: string }) {
  return (
    <Section title="Транскрипт">
      <details className="group">
        <summary className="cursor-pointer text-sm text-zinc-600 hover:text-zinc-900">
          <span className="group-open:hidden">Показать ({transcript.length} символов)</span>
          <span className="hidden group-open:inline">Скрыть</span>
        </summary>
        <div className="mt-3 whitespace-pre-wrap rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-sm leading-relaxed text-zinc-800">
          {transcript}
        </div>
      </details>
    </Section>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5">
      <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
        {title}
      </div>
      {children}
    </div>
  );
}
