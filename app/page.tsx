"use client";

import { useState } from "react";
import AnalysisResult from "./components/AnalysisResult";
import {
  ANALYSIS_MODELS,
  DEFAULT_ANALYSIS_MODEL,
  DEFAULT_TRANSCRIPTION_MODEL,
  TRANSCRIPTION_MODELS,
  type AnalysisModelValue,
  type TranscriptionModelValue,
} from "./lib/models";
import type { AnalyzeResponse, AnalyzeResponseData } from "./lib/types";

const EXAMPLE_URL =
  "https://app.comagic.ru/system/media/talk/5604973206/88cdb13182d8cb3848f4d645c9264fb7/";

export default function Home() {
  const [audioUrl, setAudioUrl] = useState("");
  const [operatorHint, setOperatorHint] = useState("");
  const [transcriptionModel, setTranscriptionModel] =
    useState<TranscriptionModelValue>(DEFAULT_TRANSCRIPTION_MODEL);
  const [analysisModel, setAnalysisModel] =
    useState<AnalysisModelValue>(DEFAULT_ANALYSIS_MODEL);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalyzeResponseData | null>(null);
  const [elapsed, setElapsed] = useState<number | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    setElapsed(null);
    const start = performance.now();

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audio_url: audioUrl.trim(),
          operator_hint: operatorHint.trim() || undefined,
          transcription_model: transcriptionModel,
          analysis_model: analysisModel,
        }),
      });

      const json = (await res.json()) as AnalyzeResponse;
      if (!json.success) {
        setError(json.error);
      } else {
        setResult(json.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setLoading(false);
      setElapsed(Math.round(performance.now() - start));
    }
  };

  const sttHint = TRANSCRIPTION_MODELS.find(
    (m) => m.value === transcriptionModel,
  )?.hint;
  const llmHint = ANALYSIS_MODELS.find((m) => m.value === analysisModel)?.hint;

  return (
    <div className="flex flex-1 flex-col bg-zinc-50">
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
        <header className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
            Анализ звонка автосервиса
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            Вставь ссылку на mp3 звонка — на выходе транскрипт + структурированная сводка по стандарту обслуживания.
          </p>
        </header>

        <form
          onSubmit={submit}
          className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-5"
        >
          <div>
            <label
              htmlFor="audio_url"
              className="mb-1 block text-sm font-medium text-zinc-700"
            >
              Ссылка на mp3
            </label>
            <input
              id="audio_url"
              type="url"
              required
              placeholder="https://app.comagic.ru/..."
              value={audioUrl}
              onChange={(e) => setAudioUrl(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
            />
            <button
              type="button"
              onClick={() => setAudioUrl(EXAMPLE_URL)}
              className="mt-1.5 text-xs text-zinc-500 underline-offset-2 hover:text-zinc-800 hover:underline"
            >
              использовать пример
            </button>
          </div>

          <div>
            <label
              htmlFor="operator_hint"
              className="mb-1 block text-sm font-medium text-zinc-700"
            >
              Подсказка имени оператора <span className="text-zinc-400">(необязательно)</span>
            </label>
            <input
              id="operator_hint"
              type="text"
              placeholder="Вероника"
              value={operatorHint}
              onChange={(e) => setOperatorHint(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="transcription_model"
                className="mb-1 block text-sm font-medium text-zinc-700"
              >
                Модель распознавания
              </label>
              <select
                id="transcription_model"
                value={transcriptionModel}
                onChange={(e) =>
                  setTranscriptionModel(e.target.value as TranscriptionModelValue)
                }
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
              >
                {TRANSCRIPTION_MODELS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
              {sttHint && (
                <p className="mt-1 text-xs text-zinc-500">{sttHint}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="analysis_model"
                className="mb-1 block text-sm font-medium text-zinc-700"
              >
                Модель анализа
              </label>
              <select
                id="analysis_model"
                value={analysisModel}
                onChange={(e) =>
                  setAnalysisModel(e.target.value as AnalysisModelValue)
                }
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
              >
                {ANALYSIS_MODELS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
              {llmHint && (
                <p className="mt-1 text-xs text-zinc-500">{llmHint}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <button
              type="submit"
              disabled={loading || !audioUrl.trim()}
              className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-400"
            >
              {loading ? (
                <>
                  <Spinner /> Анализирую…
                </>
              ) : (
                "Проанализировать"
              )}
            </button>
            {elapsed !== null && !loading && (
              <span className="text-xs text-zinc-500">
                {(elapsed / 1000).toFixed(1)} c
              </span>
            )}
          </div>
        </form>

        {loading && (
          <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-5 text-sm text-zinc-600">
            Скачиваю аудио → транскрипция → анализ. Обычно 20–60 секунд.
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-5">
            <div className="text-sm font-medium text-rose-900">Ошибка</div>
            <div className="mt-1 text-sm text-rose-800">{error}</div>
          </div>
        )}

        {result && !loading && (
          <div className="mt-6">
            <AnalysisResult data={result} />
          </div>
        )}
      </main>
    </div>
  );
}

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <circle cx="12" cy="12" r="9" opacity="0.25" />
      <path d="M21 12a9 9 0 0 0-9-9" strokeLinecap="round" />
    </svg>
  );
}
