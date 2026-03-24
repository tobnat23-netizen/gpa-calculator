import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Calculator, Download, FileText, GraduationCap, Info, Lock, Plus, Search, Sparkles, Trash2 } from "lucide-react";
// Simple replacements for UI components so the project works without shadcn/ui
const Card = ({ children, className="" }) => <div className={className}>{children}</div>;
const CardHeader = ({ children, className="" }) => <div className={className}>{children}</div>;
const CardContent = ({ children, className="" }) => <div className={className}>{children}</div>;
const CardTitle = ({ children, className="" }) => <div className={className}>{children}</div>;
const CardDescription = ({ children, className="" }) => <div className={className}>{children}</div>;

const Button = ({ children, className="", ...props }) => (
  <button className={"px-4 py-2 bg-slate-900 text-white rounded-xl " + className} {...props}>
    {children}
  </button>
);

const Input = ({ className="", ...props }) => (
  <input className={"border border-slate-300 px-3 py-2 rounded-xl w-full " + className} {...props} />
);

const Label = ({ children }) => (
  <label className="text-sm font-medium text-slate-700">{children}</label>
);

const Select = ({ value, onValueChange, children }) => (
  <select
    className="border border-slate-300 px-3 py-2 rounded-xl w-full mt-2"
    value={value}
    onChange={(e) => onValueChange(e.target.value)}
  >
    {children}
  </select>
);

const SelectContent = ({ children }) => <>{children}</>;
const SelectItem = ({ value, children }) => <option value={value}>{children}</option>;
const SelectTrigger = ({ children }) => <>{children}</>;
const SelectValue = () => null;

const SAMPLE_PAYMENT_LINK = "https://buy.stripe.com/test_3cIcN7645fgEf9E2i2djO00";
const STORAGE_KEY = "gpa_calculator_checkout_state";

const COURSE_SUGGESTIONS = [
  "Algebra I",
  "Algebra II",
  "American Government",
  "Anatomy",
  "AP Biology",
  "AP Calculus AB",
  "AP Calculus BC",
  "AP Chemistry",
  "AP English Language and Composition",
  "AP English Literature and Composition",
  "AP Environmental Science",
  "AP European History",
  "AP Human Geography",
  "AP Physics 1",
  "AP Psychology",
  "AP Statistics",
  "Art",
  "Biology",
  "Calculus",
  "Chemistry",
  "Civics",
  "Computer Science",
  "Economics",
  "English",
  "English Literature",
  "French",
  "Geometry",
  "Health",
  "History",
  "Journalism",
  "Language Arts",
  "Music",
  "Physics",
  "Pre-Calculus",
  "Psychology",
  "Science",
  "Social Studies",
  "Spanish",
  "Statistics",
  "Trigonometry",
  "U.S. History",
  "World History",
];

const GRADE_POINTS = {
  "A+": 4.0,
  A: 4.0,
  "A-": 3.7,
  "B+": 3.3,
  B: 3.0,
  "B-": 2.7,
  "C+": 2.3,
  C: 2.0,
  "C-": 1.7,
  "D+": 1.3,
  D: 1.0,
  "D-": 0.7,
  F: 0.0,
};

const LETTERS = [
  { min: 97, letter: "A+" },
  { min: 93, letter: "A" },
  { min: 90, letter: "A-" },
  { min: 87, letter: "B+" },
  { min: 83, letter: "B" },
  { min: 80, letter: "B-" },
  { min: 77, letter: "C+" },
  { min: 73, letter: "C" },
  { min: 70, letter: "C-" },
  { min: 67, letter: "D+" },
  { min: 63, letter: "D" },
  { min: 60, letter: "D-" },
  { min: 0, letter: "F" },
];

function getLetter(score) {
  for (const item of LETTERS) {
    if (score >= item.min) return item.letter;
  }
  return "F";
}

function numberOrZero(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function ResultCard({ title, value, locked = false, subtext = "" }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className={locked ? "select-none blur-md" : ""}>
        <div className="text-sm text-slate-500">{title}</div>
        <div className="mt-2 text-3xl font-bold text-slate-900">{value}</div>
        {subtext ? <div className="mt-2 text-sm text-slate-500">{subtext}</div> : null}
      </div>
      {locked && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-white/70 backdrop-blur-sm">
          <Lock className="h-6 w-6 text-slate-700" />
          <div className="text-sm font-medium text-slate-700">Unlock to see your result</div>
        </div>
      )}
    </div>
  );
}

function Mascot({ visible }) {
  return (
    <motion.div
      initial={{ scale: 0, y: 40, opacity: 0 }}
      animate={visible ? { scale: 1, y: 0, opacity: 1 } : { scale: 0, y: 40, opacity: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className="flex items-center justify-center gap-3 rounded-2xl bg-white p-4 shadow-md"
    >
      <span className="text-3xl">🎓</span>
      <span className="text-2xl">🤔</span>
      <div className="text-sm text-slate-600">
        Thinking about your GPA...
      </div>
    </motion.div>
  );
}

function CourseAutocomplete({ value, onChange, inputId }) {
  const [isOpen, setIsOpen] = useState(false);

  const filteredSuggestions = useMemo(() => {
    const trimmed = value.trim().toLowerCase();
    if (!trimmed) return COURSE_SUGGESTIONS.slice(0, 8);
    return COURSE_SUGGESTIONS.filter((course) => course.toLowerCase().includes(trimmed)).slice(0, 8);
  }, [value]);

  return (
    <div className="relative">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          id={inputId}
          value={value}
          placeholder="Start typing a course name"
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => {
            window.setTimeout(() => setIsOpen(false), 120);
          }}
          className="mt-2 rounded-xl bg-white pl-9"
        />
      </div>

      {isOpen && filteredSuggestions.length > 0 && (
        <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
          {filteredSuggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              className="block w-full border-b border-slate-100 px-4 py-3 text-left text-sm text-slate-700 transition hover:bg-slate-50 last:border-b-0"
              onMouseDown={() => {
                onChange(suggestion);
                setIsOpen(false);
              }}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function formatToday() {
  return new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function buildCourseSummary(courses) {
  return courses
    .filter((course) => course.name.trim() !== "")
    .map((course) => {
      const numericScore = numberOrZero(course.score);
      const credits = numberOrZero(course.credits);
      const letter = getLetter(numericScore);
      const points = GRADE_POINTS[letter] ?? 0;
      return {
        ...course,
        credits,
        numericScore,
        letter,
        points,
        qualityPoints: (points * credits).toFixed(2),
      };
    });
}

function downloadReportPdf({ totals, courses, schoolMode }) {
  const rows = buildCourseSummary(courses)
    .map(
      (course) => `
        <tr>
          <td>${course.name}</td>
          <td>${course.credits}</td>
          <td>${course.numericScore.toFixed(2)}%</td>
          <td>${course.letter}</td>
          <td>${course.points.toFixed(1)}</td>
          <td>${course.qualityPoints}</td>
        </tr>
      `
    )
    .join("");

  const reportWindow = window.open("", "_blank", "width=1100,height=800");
  if (!reportWindow) return;

  reportWindow.document.write(`
    <html>
      <head>
        <title>GPA Report</title>
        <style>
          body { font-family: Arial, Helvetica, sans-serif; margin: 0; color: #0f172a; background: #f8fafc; }
          .page { max-width: 980px; margin: 0 auto; padding: 36px; }
          .hero { background: linear-gradient(135deg, #020617, #0f172a 65%, #1e293b); color: white; padding: 32px; border-radius: 28px; }
          .eyebrow { display: inline-block; padding: 8px 14px; border-radius: 999px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12); font-size: 13px; }
          h1 { margin: 16px 0 10px; font-size: 42px; line-height: 1.05; }
          .muted { color: #cbd5e1; font-size: 16px; line-height: 1.6; }
          .meta { margin-top: 18px; font-size: 14px; color: #e2e8f0; }
          .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 24px; }
          .card { background: white; border: 1px solid #e2e8f0; border-radius: 22px; padding: 20px; }
          .label { font-size: 13px; color: #64748b; margin-bottom: 8px; }
          .value { font-size: 34px; font-weight: 700; color: #0f172a; }
          .sub { margin-top: 8px; color: #64748b; font-size: 14px; }
          .section { margin-top: 22px; }
          .section-title { font-size: 22px; font-weight: 700; margin-bottom: 12px; }
          table { width: 100%; border-collapse: collapse; overflow: hidden; background: white; border-radius: 18px; border: 1px solid #e2e8f0; }
          th, td { padding: 14px 16px; border-bottom: 1px solid #e2e8f0; text-align: left; font-size: 14px; }
          th { background: #f8fafc; color: #334155; }
          tr:last-child td { border-bottom: none; }
          .two-col { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 18px; margin-top: 22px; }
          .note { font-size: 14px; color: #475569; line-height: 1.7; }
          .badge { display: inline-block; padding: 6px 10px; border-radius: 999px; background: #eef2ff; color: #334155; font-size: 12px; }
          @media print {
            body { background: white; }
            .page { padding: 20px; }
          }
        </style>
      </head>
      <body>
        <div class="page">
          <div class="hero">
            <div class="eyebrow">GPA & Grade Calculator Report</div>
            <h1>Your academic summary is ready.</h1>
            <div class="muted">A polished GPA report based on the courses, credits, and grades entered into the calculator.</div>
            <div class="meta">Generated on ${formatToday()} • ${schoolMode === "highschool" ? "High School" : "College"} mode</div>
          </div>
          <div class="grid">
            <div class="card"><div class="label">Weighted GPA</div><div class="value">${totals.gpa}</div><div class="sub">Based on a 4.0 GPA scale</div></div>
            <div class="card"><div class="label">Average Percentage</div><div class="value">${totals.averagePercent}%</div><div class="sub">Credit-weighted class average</div></div>
            <div class="card"><div class="label">Final Letter Grade</div><div class="value">${totals.letterGrade}</div><div class="sub">Estimated from the weighted average</div></div>
          </div>
          <div class="section">
            <div class="section-title">Course breakdown</div>
            <table>
              <thead><tr><th>Course</th><th>Credits</th><th>Grade</th><th>Letter</th><th>GPA Points</th><th>Quality Points</th></tr></thead>
              <tbody>${rows || '<tr><td colspan="6">No course data available.</td></tr>'}</tbody>
            </table>
          </div>
          <div class="two-col">
            <div class="card"><div class="section-title">Report notes</div><div class="note">This report provides an estimate based on the data entered by the user. Final official GPA values may differ depending on the school or college policy, weighting rules, and transcript methods.</div></div>
            <div class="card"><div class="section-title">Method used</div><div class="note"><span class="badge">4.0 scale</span><br/><br/>Each course is converted from percentage to letter grade and GPA points, then weighted by credits to estimate the final GPA and overall average.</div></div>
          </div>
        </div>
        <script>window.onload = function() { window.print(); }</script>
      </body>
    </html>
  `);
  reportWindow.document.close();
}

function ResultsPage({ totals, courses, schoolMode, onBack, onDownloadPdf }) {
  const courseSummary = buildCourseSummary(courses);
  const highestCourse = courseSummary.length ? [...courseSummary].sort((a, b) => b.numericScore - a.numericScore)[0] : null;
  const lowestCourse = courseSummary.length ? [...courseSummary].sort((a, b) => a.numericScore - b.numericScore)[0] : null;

  return (
    <div className="grid gap-6">
      <Card className="overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white/90 shadow-2xl backdrop-blur">
        <div className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8 text-white md:p-10">
          <div className="absolute right-6 top-6 hidden rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white/80 md:block">Payment confirmed</div>
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-sm font-medium text-white/90"><Sparkles className="h-4 w-4" />GPA Results</div>
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Your academic summary is ready.</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 md:text-lg">Here is your finished GPA report with your weighted GPA, class average, detailed course breakdown, and printable PDF export.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button onClick={onDownloadPdf} className="rounded-2xl bg-white !text-slate-900 hover:bg-slate-100"><Download className="mr-2 h-4 w-4" />Download PDF report</Button>
              <Button onClick={onBack} className="rounded-2xl border border-white/15 bg-white/10 text-white hover:bg-white/15"><ArrowLeft className="mr-2 h-4 w-4" />Back to calculator</Button>
            </div>
          </div>
        </div>
      </Card>
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="grid gap-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="rounded-[1.75rem] border border-slate-200/70 bg-white/90 p-6 shadow-xl backdrop-blur"><div className="text-sm text-slate-500">Weighted GPA</div><div className="mt-2 text-4xl font-bold text-slate-900">{totals.gpa}</div><div className="mt-2 text-sm text-slate-500">Based on a 4.0 GPA scale</div></Card>
            <Card className="rounded-[1.75rem] border border-slate-200/70 bg-white/90 p-6 shadow-xl backdrop-blur"><div className="text-sm text-slate-500">Average Percentage</div><div className="mt-2 text-4xl font-bold text-slate-900">{totals.averagePercent}%</div><div className="mt-2 text-sm text-slate-500">Credit-weighted course average</div></Card>
            <Card className="rounded-[1.75rem] border border-slate-200/70 bg-white/90 p-6 shadow-xl backdrop-blur"><div className="text-sm text-slate-500">Final Letter Grade</div><div className="mt-2 text-4xl font-bold text-slate-900">{totals.letterGrade}</div><div className="mt-2 text-sm text-slate-500">Estimated from your weighted average</div></Card>
          </div>
          <Card className="rounded-[1.75rem] border border-slate-200/70 bg-white/90 shadow-xl backdrop-blur">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-slate-900">Course breakdown</CardTitle>
              <CardDescription>Every course included in your GPA estimate and PDF report.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-hidden rounded-2xl border border-slate-200">
                <div className="grid grid-cols-6 gap-2 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600"><div className="col-span-2">Course</div><div>Credits</div><div>Grade</div><div>Letter</div><div>Points</div></div>
                <div className="divide-y divide-slate-200 bg-white">
                  {courseSummary.length === 0 ? <div className="px-4 py-6 text-sm text-slate-500">Add at least one course to generate a full report.</div> : courseSummary.map((course) => (
                    <div key={course.id} className="grid grid-cols-6 gap-2 px-4 py-4 text-sm text-slate-700">
                      <div className="col-span-2 font-medium text-slate-900">{course.name}</div>
                      <div>{course.credits}</div>
                      <div>{course.numericScore.toFixed(2)}%</div>
                      <div>{course.letter}</div>
                      <div>{course.points.toFixed(1)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-6">
          <Card className="rounded-[1.75rem] border border-slate-200/70 bg-white/90 shadow-xl backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-semibold text-slate-900"><FileText className="h-5 w-5" />Downloadable PDF report</CardTitle>
              <CardDescription>A print-friendly finished report styled to match the calculator.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-50">
                <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-5 text-white">
                  <div className="inline-flex rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium text-white/90">GPA Report</div>
                  <div className="mt-3 text-2xl font-bold">Your academic summary</div>
                  <div className="mt-2 text-sm text-slate-300">Generated on {formatToday()}</div>
                </div>
                <div className="grid gap-3 p-5">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-2xl border border-slate-200 bg-white p-4"><div className="text-xs text-slate-500">GPA</div><div className="mt-1 text-2xl font-bold text-slate-900">{totals.gpa}</div></div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-4"><div className="text-xs text-slate-500">Average</div><div className="mt-1 text-2xl font-bold text-slate-900">{totals.averagePercent}%</div></div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-4"><div className="text-xs text-slate-500">Letter</div><div className="mt-1 text-2xl font-bold text-slate-900">{totals.letterGrade}</div></div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-4"><div className="text-xs font-medium uppercase tracking-wide text-slate-500">Included in the PDF</div><div className="mt-3 space-y-2 text-sm text-slate-600"><div>• Finished GPA summary page</div><div>• Full course breakdown table</div><div>• Report notes and method used</div></div></div>
                </div>
              </div>
              <Button onClick={onDownloadPdf} className="w-full rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-slate-800"><Download className="mr-2 h-4 w-4" />Download PDF report</Button>
            </CardContent>
          </Card>
          <Card className="rounded-[1.75rem] border border-slate-200/70 bg-white/90 shadow-xl backdrop-blur">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-slate-900">Summary insights</CardTitle>
              <CardDescription>Helpful context to make the result page feel complete and premium.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-slate-600">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="font-medium text-slate-900">School system</div><div className="mt-1">{schoolMode === "highschool" ? "High School" : "College"}</div></div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="font-medium text-slate-900">Total credits counted</div><div className="mt-1">{totals.totalCredits}</div></div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="font-medium text-slate-900">Highest course result</div><div className="mt-1">{highestCourse ? `${highestCourse.name} — ${highestCourse.numericScore.toFixed(2)}%` : "Not available yet"}</div></div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="font-medium text-slate-900">Lowest course result</div><div className="mt-1">{lowestCourse ? `${lowestCourse.name} — ${lowestCourse.numericScore.toFixed(2)}%` : "Not available yet"}</div></div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function GradeCalculatorSite() {
  const [courses, setCourses] = useState([
    { id: 1, name: "", credits: "3", score: "" },
  ]);
  const [nextId, setNextId] = useState(2);
  const [schoolMode, setSchoolMode] = useState("college");
  const [gradingScale, setGradingScale] = useState("percent");
  const [showPaywall, setShowPaywall] = useState(false);
  const [currentView, setCurrentView] = useState("calculator");
  const [hasPaid, setHasPaid] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const calculateButtonRef = useRef(null);

  const progress = useMemo(() => {
    const namedCourses = courses.filter((course) => course.name.trim() !== "").length;
    const creditsFilled = courses.filter((course) => course.name.trim() !== "" && course.credits !== "").length;
    const gradesFilled = courses.filter((course) => course.name.trim() !== "" && course.score !== "").length;

    return {
      hasCourses: namedCourses > 0,
      hasCredits: creditsFilled > 0,
      hasGrades: gradesFilled > 0,
    };
  }, [courses]);

  const totals = useMemo(() => {
    const totalCredits = courses.reduce((sum, course) => sum + numberOrZero(course.credits), 0);

    const qualityPoints = courses.reduce((sum, course) => {
      const credits = numberOrZero(course.credits);
      const numericScore = numberOrZero(course.score);
      const letter = getLetter(numericScore);
      const points = GRADE_POINTS[letter] ?? 0;
      return sum + points * credits;
    }, 0);

    const weightedPercentTotal = courses.reduce((sum, course) => {
      const credits = numberOrZero(course.credits);
      const numericScore = numberOrZero(course.score);
      return sum + numericScore * credits;
    }, 0);

    const gpa = totalCredits > 0 ? qualityPoints / totalCredits : 0;
    const averagePercent = totalCredits > 0 ? weightedPercentTotal / totalCredits : 0;
    const letterGrade = getLetter(averagePercent);

    return {
      totalCredits,
      averagePercent: averagePercent.toFixed(2),
      gpa: gpa.toFixed(2),
      letterGrade,
      classCount: courses.length,
    };
  }, [courses]);

  function updateCourse(id, field, value) {
    setCourses((current) =>
      current.map((course) => (course.id === id ? { ...course, [field]: value } : course))
    );
  }

  function addCourse() {
    const defaultCredits = schoolMode === "highschool" ? "1" : "3";

    setCourses((current) => [
      ...current,
      { id: nextId, name: "", credits: defaultCredits, score: "" },
    ]);
    setNextId((n) => n + 1);
  }

  function handleSchoolModeChange(value) {
    const nextDefault = value === "highschool" ? "1" : "3";
    setSchoolMode(value);
    setCourses((current) =>
      current.map((course) => {
        if (course.credits === "4") {
          return course;
        }

        if (course.credits === "1" || course.credits === "3" || course.credits === "") {
          return { ...course, credits: nextDefault };
        }

        return course;
      })
    );
  }

  function removeCourse(id) {
    setCourses((current) => current.filter((course) => course.id !== id));
  }

  function handleCalculateAverage() {
    setIsCalculating(true);

    setTimeout(() => {
      setIsCalculating(false);
      setShowPaywall(true);
    }, 1500);
  }

  function handleUnlockResults() {
    const checkoutState = {
      courses,
      schoolMode,
      nextId,
      savedAt: Date.now(),
    };

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(checkoutState));
    window.location.href = SAMPLE_PAYMENT_LINK;
  }

  function handlePreviewResults() {
    setCurrentView("results");
  }

  function handleBackToCalculator() {
    setCurrentView("calculator");
  }

  function handleDownloadPdf() {
    downloadReportPdf({ totals, courses, schoolMode });
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paid = params.get("paid");

    const savedStateRaw = window.localStorage.getItem(STORAGE_KEY);
    if (savedStateRaw) {
      try {
        const savedState = JSON.parse(savedStateRaw);
        if (Array.isArray(savedState.courses) && savedState.courses.length > 0) {
          setCourses(savedState.courses);
        }
        if (savedState.schoolMode === "highschool" || savedState.schoolMode === "college") {
          setSchoolMode(savedState.schoolMode);
        }
        if (typeof savedState.nextId === "number") {
          setNextId(savedState.nextId);
        }
      } catch (error) {
        console.error("Failed to restore saved calculator state", error);
      }
    }

    if (paid === "1") {
      setHasPaid(true);
      setShowPaywall(false);
      setCurrentView("results");
    }
  }, []);

  const legalLinks = {
    terms: "#terms-of-service",
    privacy: "#privacy-policy",
  };

  if (currentView === "results") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-900">
        <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
          <ResultsPage
            totals={totals}
            courses={courses}
            schoolMode={schoolMode}
            onBack={handleBackToCalculator}
            onDownloadPdf={handleDownloadPdf}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="grid gap-6"
        >
          <Card className="overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white/90 shadow-2xl backdrop-blur">
            <div className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8 text-white md:p-10">
              <div className="absolute right-6 top-6 hidden rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white/80 md:block">
                Trusted by students
              </div>
              <div className="relative z-10 max-w-3xl">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-sm font-medium text-white/90">
                  <GraduationCap className="h-4 w-4" />
                  GPA & Grade Calculator
                </div>
                <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
                  Calculate your GPA and class average.
                </h1>
                <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 md:text-lg">
                  Built for the U.S. school system. Add your course names, credits, and grade percentages,
                  then calculate your overall academic average.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white/90">
                    Fast course entry
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white/90">
                    4.0 GPA conversion
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white/90">
                    High school & college modes
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <Card className="rounded-[1.75rem] border border-slate-200/70 bg-white/90 shadow-xl backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Calculator className="h-6 w-6" />
                  U.S. Grade Calculator
                </CardTitle>
                <CardDescription>
                  Add courses, input credits, and enter each percentage score.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-[220px_1fr] md:items-end">
                  <div>
                    <Label>School system</Label>
                    <Select value={schoolMode} onValueChange={handleSchoolModeChange}>
                      <SelectTrigger className="mt-2 rounded-xl bg-white">
                        <SelectValue placeholder="Choose system" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="highschool">High School</SelectItem>
                        <SelectItem value="college">College</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                    {schoolMode === "highschool" ? "High School mode uses 1 credit per class by default." : "College mode uses 3 credits per course by default and a 4.0 GPA scale."}
                  </div>
                </div>

                <div className="grid gap-4">
                  {courses.map((course) => (
                    <div
                      key={course.id}
                      className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-[1.5fr_0.6fr_0.6fr_auto] md:items-end"
                    >
                      <div>
                        <Label>Course name</Label>
                        <CourseAutocomplete
                          inputId={`course-name-${course.id}`}
                          value={course.name}
                          onChange={(value) => updateCourse(course.id, "name", value)}
                        />
                      </div>
                      <div>
                        <Label>{schoolMode === "highschool" ? "Credits (default 1)" : "Credits (default 3)"}</Label>
                        <Input
                          type="number"
                          value={course.credits}
                          onChange={(e) => updateCourse(course.id, "credits", e.target.value)}
                          className="mt-2 rounded-xl bg-white"
                        />
                      </div>
                      <div>
                        <Label>Grade (%)</Label>
                        <Input
                          type="number"
                          value={course.score}
                          onChange={(e) => updateCourse(course.id, "score", e.target.value)}
                          className="mt-2 rounded-xl bg-white"
                        />
                      </div>
                      <Button
                        variant="outline"
                        className="rounded-xl"
                        onClick={() => removeCourse(course.id)}
                        disabled={courses.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="text-sm text-slate-600 bg-slate-50 rounded-xl px-4 py-3">
                    <span className={progress.hasCourses ? "font-medium text-slate-900" : "text-slate-400"}>
                      {progress.hasCourses ? "✓" : "○"} Courses added
                    </span>
                    <span className="mx-2 text-slate-300">•</span>
                    <span className={progress.hasCredits ? "font-medium text-slate-900" : "text-slate-400"}>
                      {progress.hasCredits ? "✓" : "○"} Credits counted
                    </span>
                    <span className="mx-2 text-slate-300">•</span>
                    <span className={progress.hasGrades ? "font-medium text-slate-900" : "text-slate-400"}>
                      {progress.hasGrades ? "✓" : "○"} GPA ready to calculate
                    </span>
                  </div>
                  <Button onClick={addCourse} className="rounded-2xl">
                    <Plus className="mr-2 h-4 w-4" />
                    Add course
                  </Button>
                  <Button
                    ref={calculateButtonRef}
                    onClick={handleCalculateAverage}
                    className="w-full rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-slate-800 sm:w-auto"
                  >
                    Calculate your GPA
                  </Button>
                </div>

                {isCalculating && (
                  <Mascot visible={true} />
                )}

                {isCalculating && (
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm text-center">
                    <div className="text-lg font-semibold text-slate-900">Analyzing your grades...</div>
                    <div className="mt-2 text-sm text-slate-600">Calculating GPA and weighted average</div>
                  </div>
                )}

                {showPaywall && (
                  <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-lg">
                    <div className="text-lg font-semibold text-slate-900">Unlock your results</div>
                    <div className="mt-2 text-sm leading-6 text-slate-600">
                      To see your weighted GPA, final average percentage, and letter grade, you need to complete a one-time $0.99 payment.
                    </div>
                    <div className="mt-3 text-xs leading-5 text-slate-500">
                      By continuing, users accept the <a href={legalLinks.terms} className="underline">Terms of Service</a> and <a href={legalLinks.privacy} className="underline">Privacy Policy</a>.
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Button className="rounded-2xl" onClick={handleUnlockResults}>
                        Unlock my GPA for $0.99
                      </Button>
                      
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid gap-6">
              <Card className="rounded-[1.75rem] border border-slate-200/70 bg-white/90 shadow-xl backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-slate-900">
                    Your results will appear here
                  </CardTitle>
                  <CardDescription>
                    After you calculate your grades, your GPA, average percentage, and letter grade will appear here.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                    Your weighted GPA, percentage average, and letter grade update instantly from your inputs.
                  </div>
                  <ResultCard
                    title="Weighted GPA"
                    value={totals.gpa}
                    locked
                    subtext="Based on a 4.0 GPA scale"
                  />
                  <ResultCard
                    title="Average Percentage"
                    value={`${totals.averagePercent}%`}
                    locked
                    subtext="Credit-weighted class average"
                  />
                  <ResultCard
                    title="Final Letter Grade"
                    value={totals.letterGrade}
                    locked
                    subtext="Calculated from the weighted average"
                  />
                </CardContent>
              </Card>

              <Card className="rounded-[1.75rem] border border-slate-200/70 bg-white/90 shadow-xl backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    Setup Notes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm leading-6 text-slate-600">
                  <p>
                    Replace <code className="rounded bg-slate-100 px-1 py-0.5">SAMPLE_PAYMENT_LINK</code> with your real Stripe Payment Link.
                  </p>
                  <p>
                    In Stripe, set a success URL that sends users back to this app with <code className="rounded bg-slate-100 px-1 py-0.5">?paid=1</code> at the end.
                  </p>
                  <p>
                    Example success URL while testing locally: <code className="rounded bg-slate-100 px-1 py-0.5">http://localhost:5174/?paid=1</code>. After deployment, replace that with your real domain.
                  </p>
                  <p>
                    For a real paid flow, the strongest version is still to verify the payment on a backend or serverless function before showing unlocked results.
                  </p>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-700">
                    <div className="font-medium">Current input summary</div>
                    <div className="mt-2 text-sm">Courses entered: {totals.classCount}</div>
                    <div className="text-sm">Total credits: {totals.totalCredits}</div>
                  </div>
                  
                </CardContent>
              </Card>

              <Card id="terms-of-service" className="rounded-3xl border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Terms of Service</CardTitle>
                  <CardDescription>
                    Short terms text you can keep on the site before going live.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm leading-6 text-slate-600">
                  <p>This tool provides GPA estimates based only on the grades and credits entered by the user.</p>
                  <p>Results are informational only and may not match official school or college records.</p>
                  <p>Payments are one-time digital access fees and are non-refundable except where required by law.</p>
                </CardContent>
              </Card>

              <Card id="privacy-policy" className="rounded-3xl border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Privacy Policy</CardTitle>
                  <CardDescription>
                    Basic privacy wording for a simple calculator with Stripe checkout.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm leading-6 text-slate-600">
                  <p>We do not store personal information entered into the calculator unless you later add account or save features.</p>
                  <p>Payments are securely processed by Stripe, and payment details are handled by Stripe rather than this site.</p>
                  <p>You may also add analytics or cookie disclosures if you connect tracking tools before launch.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
