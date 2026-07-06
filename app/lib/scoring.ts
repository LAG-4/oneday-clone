/**
 * Monument Solutions qualification engine — Spec v1.
 * Point values and fit-gate rules mirror the rubric confirmed with the
 * client. The complexity score is never shown to the visitor.
 */

export type Option = { value: string; label: string; points?: number };

export const PAIN_POINTS: Option[] = [
  { value: "slow-reports", label: "Reports take too long" },
  { value: "untrusted-numbers", label: "Nobody trusts the numbers" },
  { value: "bad-inventory", label: "Inventory or data is wrong" },
  { value: "owner-bottleneck", label: "Every decision routes to the owner" },
  { value: "silos", label: "Teams work in silos" },
  { value: "disconnected-software", label: "Software doesn't talk" },
  { value: "growth-chaos", label: "Growth creates more chaos than profit" },
];

export const LOCATIONS: Option[] = [
  { value: "1", label: "1 location", points: 0 },
  { value: "2-3", label: "2–3 locations", points: 3 },
  { value: "4-10", label: "4–10 locations", points: 6 },
  { value: "11+", label: "11+ locations", points: 10 },
];

export const REVENUE: Option[] = [
  { value: "under-5m", label: "Under $5M", points: 1 },
  { value: "5m-15m", label: "$5M–$15M", points: 2 },
  { value: "15m-50m", label: "$15M–$50M", points: 4 },
  { value: "50m-100m", label: "$50M–$100M", points: 6 },
  { value: "100m+", label: "$100M+", points: 8 },
];

export const EMPLOYEES: Option[] = [
  { value: "under-15", label: "Under 15", points: 1 },
  { value: "15-50", label: "15–50", points: 2 },
  { value: "51-150", label: "51–150", points: 4 },
  { value: "151-250", label: "151–250", points: 6 },
  { value: "250+", label: "250+", points: 8 },
];

export const INDUSTRIES: Option[] = [
  { value: "manufacturing", label: "Manufacturing" },
  { value: "food-beverage", label: "Food & beverage" },
  { value: "distribution", label: "Distribution" },
  { value: "logistics", label: "Logistics" },
  { value: "finance", label: "Finance" },
  { value: "lead-gen", label: "Lead-gen & sales ops" },
  { value: "real-estate", label: "Real estate operations" },
  { value: "multi-unit-service", label: "Multi-unit service" },
  { value: "other", label: "Other" },
];

export const SYSTEMS: Option[] = [
  { value: "erp", label: "ERP" },
  { value: "crm", label: "CRM" },
  { value: "accounting", label: "Accounting" },
  { value: "inventory", label: "Inventory / WMS" },
  { value: "scheduling", label: "Scheduling" },
  { value: "bi", label: "BI / dashboards" },
  { value: "spreadsheets", label: "Mostly spreadsheets" },
  { value: "none-talk", label: "None of them talk to each other" },
];

export const DECISION: Option[] = [
  { value: "solo", label: "Just me (owner)", points: 0 },
  { value: "small-group", label: "2–3 of us", points: 2 },
  { value: "leadership-team", label: "A leadership team / committee", points: 4 },
  { value: "board-pe", label: "Board / PE involved", points: 4 },
];

export const TIMELINE: Option[] = [
  { value: "now", label: "Actively now" },
  { value: "1-3-months", label: "Next 1–3 months" },
  { value: "3-6-months", label: "3–6 months" },
  { value: "exploring", label: "Just exploring" },
];

export const INTENT: Option[] = [
  { value: "diagnose", label: "Diagnose where we're losing time and money" },
  { value: "build", label: "Build systems to fix it" },
  { value: "chatbot", label: "Just want a chatbot / quick automation" },
  { value: "unsure", label: "Not sure yet" },
];

export type QualificationAnswers = {
  painPoints: string[];
  locations: string;
  revenue: string;
  employees: string;
  industry: string;
  systems: string[];
  decision: string;
  timeline: string;
  intent: string;
  acknowledged: boolean;
};

export type Tier = "T1" | "T2" | "T3";
export type FitStatus = "qualified" | "nurture" | "declined" | "review";

export type QualificationResult = {
  score: number;
  tier: Tier;
  fit: FitStatus;
};

const pointsFor = (options: Option[], value: string) =>
  options.find((option) => option.value === value)?.points ?? 0;

const painPoints = (count: number) => (count >= 4 ? 6 : count >= 2 ? 3 : count >= 1 ? 1 : 0);

const fragmentationPoints = (systems: string[]) => {
  if (systems.includes("none-talk")) return 7;
  const count = systems.filter((value) => value !== "none-talk").length;
  if (count >= 5) return 7;
  if (count >= 3) return 4;
  return 1;
};

export function scoreQualification(answers: QualificationAnswers): QualificationResult {
  const score =
    pointsFor(LOCATIONS, answers.locations) +
    pointsFor(REVENUE, answers.revenue) +
    pointsFor(EMPLOYEES, answers.employees) +
    fragmentationPoints(answers.systems) +
    painPoints(answers.painPoints.length) +
    pointsFor(DECISION, answers.decision);

  const tier: Tier = score >= 25 ? "T3" : score >= 14 ? "T2" : "T1";

  let fit: FitStatus = "qualified";
  if (answers.intent === "chatbot") {
    fit = "declined";
  } else if (answers.timeline === "exploring" && answers.decision === "solo") {
    fit = "nurture";
  } else if (!answers.acknowledged) {
    fit = "review";
  }

  return { score, tier, fit };
}

const labelFor = (options: Option[], value: string) =>
  options.find((option) => option.value === value)?.label ?? value;

const labelsFor = (options: Option[], values: string[]) =>
  values.map((value) => labelFor(options, value));

/** Human-readable answers for CRM fields and webhook payloads. */
export function describeAnswers(answers: QualificationAnswers) {
  return {
    functionalScope: labelsFor(PAIN_POINTS, answers.painPoints).join(", "),
    locations: labelFor(LOCATIONS, answers.locations),
    annualRevenue: labelFor(REVENUE, answers.revenue),
    employeeRange: labelFor(EMPLOYEES, answers.employees),
    industry: labelFor(INDUSTRIES, answers.industry),
    systemFragmentation: labelsFor(SYSTEMS, answers.systems).join(", "),
    decisionComplexity: labelFor(DECISION, answers.decision),
    buyingTimeline: labelFor(TIMELINE, answers.timeline),
    auditGoal: labelFor(INTENT, answers.intent),
    auditAcknowledgement: answers.acknowledged ? "Understood" : "Not acknowledged",
  };
}
