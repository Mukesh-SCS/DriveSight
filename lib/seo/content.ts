import {
  CATEGORIES,
  getCategory,
  getStateProfileBySlug,
  getTestType,
  PASSING_SCORE_NOTES,
  TEST_TYPES,
  type StateSeoProfile,
} from "@/lib/seo/taxonomy";
import { categoryPath, guidesPath, testTypePath } from "@/lib/seo/urls";
import type {
  CategorySlug,
  RelatedLink,
  SeoPageContent,
  TestTypeSlug,
} from "@/lib/seo/types";

function passingScoreFor(state: StateSeoProfile) {
  return PASSING_SCORE_NOTES[state.code] ?? PASSING_SCORE_NOTES.default;
}

function stateSpecificTip(state: StateSeoProfile, index: number) {
  const tips: Record<string, string[]> = {
    CA: [
      "Review California right-on-red rules and bike lane turning requirements.",
      "Study freeway merging and HOV lane basics if you will drive in metro areas.",
      "Know California BAC limits and zero-tolerance rules for under-21 drivers.",
    ],
    TX: [
      "Texas tests often emphasize right-of-way at uncontrolled intersections.",
      "Understand school bus stopping rules on undivided roads.",
      "Review implied consent and DUI penalties covered on Texas exams.",
    ],
    FL: [
      "Florida exams frequently test road signs and pavement markings.",
      "Study move-over laws for emergency and service vehicles.",
      "Know child restraint and school zone speed expectations.",
    ],
    NY: [
      "New York questions often cover pedestrians, school zones, and city driving.",
      "Learn restrictions on turning right on red where posted.",
      "Review defensive driving in heavy traffic and weather.",
    ],
  };

  const custom = tips[state.code];
  if (custom) {
    return custom[index % custom.length];
  }

  const generic = [
    `Learn how ${state.name} treats four-way stops and yield situations.`,
    `Study ${state.name} school zone and school bus rules before your permit test.`,
    `Review ${state.name} speed limits in residential, business, and highway zones.`,
  ];
  return generic[index % generic.length];
}

function buildRelatedForTestType(state: StateSeoProfile, testType: TestTypeSlug): RelatedLink[] {
  const links: RelatedLink[] = TEST_TYPES.filter((type) => type.slug !== testType)
    .slice(0, 3)
    .map((type) => ({
      label: `${state.name} ${type.shortLabel}`,
      href: testTypePath(state.slug, type.slug),
      description: type.searchIntent,
    }));

  links.push({
    label: `${state.name} category quizzes`,
    href: categoryPath(state.slug, "road-signs"),
    description: "Focused practice by topic",
  });

  return links;
}

function buildFaqsForTestType(state: StateSeoProfile, testType: TestTypeSlug) {
  const type = getTestType(testType)!;
  const common = [
    {
      question: `Is this ${state.name} ${type.shortLabel} free?`,
      answer:
        "You can browse study content on DriveSight for free. Creating an account lets you save progress, review missed questions, and track weak categories.",
    },
    {
      question: `How many questions are on the ${state.name} permit test?`,
      answer: `Formats vary by ${state.dmvLabel}. Use official state materials for the exact number; our practice bank includes ${state.questionCount.toLocaleString()}+ style questions where available.`,
    },
    {
      question: `What score do I need to pass in ${state.name}?`,
      answer: passingScoreFor(state),
    },
    {
      question: `Does DriveSight replace the official ${state.name} handbook?`,
      answer:
        "No. Use the official state driver handbook as your primary source. DriveSight is supplemental practice with explanations and category review.",
    },
  ];

  if (testType === "road-signs-test") {
    common.unshift({
      question: `How should I study road signs for ${state.name}?`,
      answer:
        "Learn sign shapes and colors first, then practice meaning and required actions. Our road sign sheets show groups of symbols used on US roads.",
    });
  }

  if (testType === "spanish-permit-test") {
    common.unshift({
      question: `Is the ${state.name} exam available in Spanish?`,
      answer:
        "Many states offer Spanish-language testing options. Confirm availability and scheduling with your local licensing office before you book.",
    });
  }

  return common;
}

export function buildTestTypePageContent(
  stateSlug: string,
  testTypeSlug: TestTypeSlug,
): SeoPageContent | null {
  const state = getStateProfileBySlug(stateSlug);
  const testType = getTestType(testTypeSlug);
  if (!state || !testType) {
    return null;
  }

  const path = testTypePath(state.slug, testType.slug);
  const h1 = `${state.name} ${testType.label}`;
  const title = `${state.name} ${testType.label} (Free Quiz)`;
  const description = `Free ${state.name} ${testType.shortLabel} for ${testType.searchIntent}. Study by category, review explanations, and track missed questions on DriveSight.`;

  const keywords = [
    `${state.name} ${testType.shortLabel}`,
    `${state.name} permit test`,
    `${state.name} DMV practice test`,
    `${state.name} learner permit quiz`,
    `free ${state.name} driving test`,
  ];

  const intro = `Prepare for your ${state.name} ${testType.searchIntent} with realistic multiple-choice practice. DriveSight groups questions by topic, shuffles answers each session, and highlights weak areas so you study smarter—not just longer.`;

  const permitTips = [
    stateSpecificTip(state, 0),
    stateSpecificTip(state, 1),
    "Take practice tests on your phone until you consistently score above your target passing percentage.",
    "Review every missed question explanation before scheduling your real exam.",
  ];

  const practiceSection = {
    title: `${state.name} practice test features`,
    body: `Start a timed-style session with shuffled questions, instant feedback, and category breakdowns after each run. Adaptive difficulty increases challenge as your accuracy improves.`,
  };

  const roadSignsSection = {
    title: "Road signs study material",
    body:
      testType.slug === "road-signs-test"
        ? `Use our US road symbol sign sheets alongside ${state.name} practice questions. Signs are organized for quick scanning and repeat review.`
        : `Even when studying ${testType.shortLabel}, spend time on signs—they appear on nearly every knowledge test. Open the road signs library for visual review.`,
  };

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Guides", href: guidesPath() },
    { label: state.name, href: `/dmv/${state.slug}/dmv-practice-test` },
    { label: testType.shortLabel },
  ];

  return {
    kind: "test-type",
    stateCode: state.code,
    stateName: state.name,
    stateSlug: state.slug,
    testType: testType.slug,
    path,
    h1,
    title,
    description,
    keywords,
    intro,
    permitTips,
    passingScore: passingScoreFor(state),
    practiceSection,
    roadSignsSection,
    faqs: buildFaqsForTestType(state, testType.slug),
    relatedLinks: buildRelatedForTestType(state, testType.slug),
    cta: {
      label: `Start ${state.name} practice`,
      href: testType.practicePath(state.code),
      secondary:
        testType.slug !== "road-signs-test"
          ? { label: "Study road signs", href: "/road-signs" }
          : undefined,
    },
    breadcrumbs,
  };
}

export function buildCategoryPageContent(
  stateSlug: string,
  categorySlug: CategorySlug,
): SeoPageContent | null {
  const state = getStateProfileBySlug(stateSlug);
  const category = getCategory(categorySlug);
  if (!state || !category) {
    return null;
  }

  const path = categoryPath(state.slug, category.slug);
  const h1 = `${state.name} ${category.label} Practice Questions`;
  const title = `${state.name} ${category.label} DMV Questions`;
  const description = `Practice ${state.name} ${category.label.toLowerCase()} questions for your learner permit exam. ${category.description} with explanations and weak-area tracking.`;

  const keywords = [
    `${state.name} ${category.label} test`,
    `${state.name} ${category.slug.replace(/-/g, " ")} questions`,
    `${state.name} DMV ${category.label}`,
  ];

  const intro = `Master ${category.label.toLowerCase()} for your ${state.name} written test. This page focuses on ${category.description}—one of the highest-yield topics on permit exams nationwide.`;

  const permitTips = [
    `Drill ${category.label.toLowerCase()} until you can answer without guessing.`,
    stateSpecificTip(state, 2),
    "Combine category practice with full-length mixed quizzes before test day.",
  ];

  const practiceSection = {
    title: "How category practice works",
    body: `Questions are tagged by topic so you can repeat weak areas. After each session you will see which categories need more review.`,
  };

  const roadSignsSection = {
    title: "Road signs crossover",
    body:
      category.slug === "road-signs"
        ? "Pair these questions with our visual sign sheets for faster memorization."
        : "Road sign questions often overlap with this category—review signs if you miss similar prompts.",
  };

  const categorySection = {
    title: `What ${category.label} covers`,
    body: `${category.description}. Expect scenario-based wording that tests what you should do, not just definitions.`,
  };

  const relatedLinks: RelatedLink[] = CATEGORIES.filter((item) => item.slug !== category.slug)
    .slice(0, 4)
    .map((item) => ({
      label: `${state.name} ${item.label}`,
      href: categoryPath(state.slug, item.slug),
    }));

  relatedLinks.unshift({
    label: `${state.name} full DMV practice test`,
    href: testTypePath(state.slug, "dmv-practice-test"),
    description: "Mixed-topic exam-style quiz",
  });

  const faqs = [
    {
      question: `How many ${category.label.toLowerCase()} questions should I practice?`,
      answer:
        "Aim for at least 15–20 correct in a row in this category before moving on. Mix in full exams so you do not only memorize isolated facts.",
    },
    {
      question: `Are these questions specific to ${state.name}?`,
      answer:
        "Where possible, prompts reflect rules commonly tested in your state. Always verify unusual cases in the official driver handbook.",
    },
    {
      question: "Can I review only questions I missed?",
      answer:
        "Yes. After you submit a practice session, use the wrong-answer-only mode to repeat missed prompts.",
    },
  ];

  return {
    kind: "category",
    stateCode: state.code,
    stateName: state.name,
    stateSlug: state.slug,
    categorySlug: category.slug,
    path,
    h1,
    title,
    description,
    keywords,
    intro,
    permitTips,
    passingScore: passingScoreFor(state),
    practiceSection,
    roadSignsSection,
    categorySection,
    faqs,
    relatedLinks,
    cta: {
      label: `Practice ${category.label} in ${state.name}`,
      href: `/states/${state.code.toLowerCase()}`,
    },
    breadcrumbs: [
      { label: "Home", href: "/" },
      { label: "Guides", href: guidesPath() },
      { label: state.name, href: testTypePath(state.slug, "dmv-practice-test") },
      { label: category.label },
    ],
  };
}

export function buildGuidesHubContent() {
  return {
    title: "DMV Practice Test Guides by State",
    description:
      "Browse free DMV learner permit practice tests, road signs study guides, and topic quizzes for all 50 US states.",
    path: guidesPath(),
    h1: "DMV practice test guides",
    intro:
      "DriveSight publishes state-specific study hubs so you can start with the exam you actually take—not generic driving trivia. Pick your state, choose a test type, and drill weak categories until you are exam-ready.",
  };
}
