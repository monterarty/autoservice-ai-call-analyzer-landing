export type CallOutcome =
  | "scheduled"
  | "next_contact_date"
  | "refused"
  | "info_only"
  | "no_answer"
  | "other";

export type WorkerErrorCategory =
  | "greeting"
  | "needs_identification"
  | "expectations_confirmation"
  | "objections_handling"
  | "closure"
  | "additional";

export interface DetectedError {
  id: number;
  category: WorkerErrorCategory;
  label: string;
  score: number;
  evidence: string;
}

export interface CategorySummaryItem {
  passed: boolean;
  comment: string;
}

export interface CategorySummary {
  greeting: CategorySummaryItem;
  needs_identification: CategorySummaryItem;
  expectations_confirmation: CategorySummaryItem;
  objections_handling: CategorySummaryItem;
  closure: CategorySummaryItem;
  additional: CategorySummaryItem;
}

export interface CallbackCommitment {
  promised: boolean;
  deadline_text: string | null;
  quote: string | null;
  reason: string | null;
}

export type LeadConfidence = "high" | "medium" | "low";

export interface LeadAssessment {
  is_lead: boolean;
  confidence: LeadConfidence;
  rationale: string;
  signals: string[];
}

export interface CallAnalysis {
  car: {
    make: string | null;
    model: string | null;
    year: number | null;
  };
  client_name: string | null;
  client_phone: string | null;
  contact_reason: string | null;
  agreements: string[];
  call_outcome: CallOutcome;
  operator_name: string | null;
  detected_errors: DetectedError[];
  category_summary: CategorySummary;
  total_penalty: number;
  callback_commitment: CallbackCommitment;
  lead: LeadAssessment;
  strengths: string[];
  manager_note: string;
}

export interface AnalyzeResponseData {
  transcript: string;
  analysis: CallAnalysis;
}

export type AnalyzeResponse =
  | { success: true; data: AnalyzeResponseData }
  | { success: false; error: string };
