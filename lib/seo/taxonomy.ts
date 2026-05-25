import { DEFAULT_STATES, getStateByCode } from "@/lib/states";
import type { CategorySlug, TestTypeSlug } from "@/lib/seo/types";

export type StateSeoProfile = {
  code: string;
  name: string;
  slug: string;
  dmvLabel: string;
  questionCount: number;
};

export type TestTypeDefinition = {
  slug: TestTypeSlug;
  label: string;
  shortLabel: string;
  searchIntent: string;
  practicePath: (stateCode: string) => string;
};

export type CategoryDefinition = {
  slug: CategorySlug;
  label: string;
  description: string;
};

export const TEST_TYPES: TestTypeDefinition[] = [
  {
    slug: "dmv-practice-test",
    label: "DMV Practice Test",
    shortLabel: "DMV practice",
    searchIntent: "learner permit and written knowledge exam",
    practicePath: (code) => `/states/${code.toLowerCase()}`,
  },
  {
    slug: "road-signs-test",
    label: "Road Signs Test",
    shortLabel: "Road signs",
    searchIntent: "road signs recognition and meaning",
    practicePath: () => `/road-signs`,
  },
  {
    slug: "hard-questions",
    label: "Hard DMV Questions",
    shortLabel: "Hard questions",
    searchIntent: "challenging permit exam questions",
    practicePath: (code) => `/states/${code.toLowerCase()}`,
  },
  {
    slug: "motorcycle-permit-test",
    label: "Motorcycle Permit Test",
    shortLabel: "Motorcycle permit",
    searchIntent: "motorcycle learner permit written test",
    practicePath: (code) => `/states/${code.toLowerCase()}`,
  },
  {
    slug: "cdl-permit-test",
    label: "CDL Permit Test",
    shortLabel: "CDL permit",
    searchIntent: "commercial driver license knowledge test",
    practicePath: (code) => `/states/${code.toLowerCase()}`,
  },
  {
    slug: "spanish-permit-test",
    label: "Spanish Permit Test",
    shortLabel: "Spanish permit prep",
    searchIntent: "Spanish-language permit exam preparation",
    practicePath: (code) => `/states/${code.toLowerCase()}`,
  },
];

export const CATEGORIES: CategoryDefinition[] = [
  { slug: "road-signs", label: "Road Signs", description: "Sign shapes, colors, and warnings" },
  { slug: "right-of-way", label: "Right of Way", description: "Intersections, pedestrians, and yielding" },
  { slug: "traffic-signals", label: "Traffic Signals", description: "Lights, arrows, and flashing signals" },
  { slug: "parking", label: "Parking", description: "Curbs, hills, and legal parking rules" },
  { slug: "speed-limits", label: "Speed Limits", description: "Posted limits and basic speed law" },
  { slug: "school-zones", label: "School Zones", description: "School buses and crossing safety" },
  { slug: "emergency-vehicles", label: "Emergency Vehicles", description: "Move-over laws and yielding" },
  { slug: "alcohol-dui", label: "Alcohol & DUI", description: "BAC limits and implied consent" },
  { slug: "defensive-driving", label: "Defensive Driving", description: "Hazards, space, and safe habits" },
  { slug: "lane-changes", label: "Lane Changes & Turning", description: "Signals, merges, and turns" },
];

/** Passing score notes — educational estimates; verify with official state DMV sources. */
export const PASSING_SCORE_NOTES: Record<string, string> = {
  CA: "California typically requires about 38 correct answers out of 46 (roughly 83%) on the knowledge test, but always confirm current DMV rules.",
  TX: "Texas learner license knowledge tests commonly require a passing score around 70% (21 of 30), depending on the test version.",
  FL: "Florida Class E knowledge exams usually require 40 correct out of 50 (80%). Check FLHSMV for the latest format.",
  NY: "New York permit tests generally require 14 correct out of 20 (70%) for the standard knowledge exam.",
  default:
    "Most states require roughly 70–80% to pass the written knowledge test. Verify the exact passing score with your state DMV before test day.",
};

export function toStateSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/\./g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function getStateProfiles(): StateSeoProfile[] {
  return DEFAULT_STATES.map((state) => ({
    code: state.code,
    name: state.name,
    slug: toStateSlug(state.name),
    dmvLabel: state.code === "DC" ? "DMV" : `${state.name} DMV / licensing office`,
    questionCount: state.questionCount,
  }));
}

export function getStateProfileBySlug(slug: string) {
  return getStateProfiles().find((state) => state.slug === slug.toLowerCase());
}

export function getStateProfileByCode(code: string) {
  const state = getStateByCode(code);
  if (!state) {
    return undefined;
  }
  return getStateProfiles().find((profile) => profile.code === state.code);
}

export function getTestType(slug: string) {
  return TEST_TYPES.find((type) => type.slug === slug);
}

export function getCategory(slug: string) {
  return CATEGORIES.find((category) => category.slug === slug);
}

export function getAllTestTypeParams() {
  return getStateProfiles().flatMap((state) =>
    TEST_TYPES.map((type) => ({
      stateSlug: state.slug,
      testType: type.slug,
    })),
  );
}

export function getAllCategoryParams() {
  return getStateProfiles().flatMap((state) =>
    CATEGORIES.map((category) => ({
      stateSlug: state.slug,
      categorySlug: category.slug,
    })),
  );
}
