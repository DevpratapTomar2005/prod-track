import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { ExternalLink } from "lucide-react";
import Timer from "./Timer.tsx";
import type { TimerRecord, TimerResult } from "./Timer.tsx";
import ArrowRight from "../assets/arrow_right.svg";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const todaysTasks = [
  { id: 1, title: "Fix login issue", project: "Project Alpha", status: "Done", time: "9:00 AM" },
  { id: 2, title: "User profile page", project: "Nova Quiz", status: "In Progress", time: "10:30 AM" },
  { id: 3, title: "Payment gateway UI", project: "J-fintech", status: "Paused", time: "12:00 PM" },
  { id: 4, title: "Analytics SDK integration", project: "AI Chatbot", status: "In Progress", time: "2:00 PM" },
  { id: 5, title: "Write API docs", project: "", status: "Expired", time: "4:00 PM" },
];

const taskStatusData = [
  { day: "Mon", Done: 4, "In Progress": 3, Paused: 1, Expired: 0 },
  { day: "Tue", Done: 3, "In Progress": 5, Paused: 2, Expired: 1 },
  { day: "Wed", Done: 6, "In Progress": 2, Paused: 1, Expired: 0 },
  { day: "Thu", Done: 2, "In Progress": 4, Paused: 3, Expired: 2 },
  { day: "Fri", Done: 5, "In Progress": 3, Paused: 0, Expired: 1 },
  { day: "Sat", Done: 1, "In Progress": 1, Paused: 0, Expired: 0 },
  { day: "Sun", Done: 0, "In Progress": 0, Paused: 0, Expired: 0 },
];

const completionRateData = [
  { name: "On time", value: 58, color: "#00d3f3" },
  { name: "With overrun", value: 24, color: "#1e2939" },
  { name: "Incomplete", value: 18, color: "#d1d5dc" },
];

const avgCompletionCategories = [
  { name: "Fix / bugs", avg: 0.8 },
  { name: "Feature dev", avg: 0.7 },
  { name: "Design", avg: 0.6 },
  { name: "Docs / QA", avg: 0.4 },
];

const velocityData = [
  { week: "Wk 1", "Project Alpha": 3, "Nova Quiz": 2, "AI Chatbot": 1, "Fintech Dashboard": 4 },
  { week: "Wk 2", "Project Alpha": 5, "Nova Quiz": 3, "AI Chatbot": 2, "Fintech Dashboard": 3 },
  { week: "Wk 3", "Project Alpha": 4, "Nova Quiz": 4, "AI Chatbot": 4, "Fintech Dashboard": 2 },
  { week: "Wk 4", "Project Alpha": 6, "Nova Quiz": 2, "AI Chatbot": 3, "Fintech Dashboard": 5 },
];

const stuckTasks = [
  { title: "Implement user auth flow", project: "Project Alpha", status: "In Progress", days: 5 },
  { title: "Employee onboarding UI", project: "Fintech Dashboard", status: "In Progress", days: 4 },
  { title: "Integrate analytics SDK", project: "AI Chatbot", status: "In Progress", days: 7 },
  { title: "Write API documentation", project: "Nova Quiz", status: "In Progress", days: 3 },
];

const dueSoonProjects = [
  { name: "AI Chatbot", status: "In Progress", daysLeft: 1, urgent: true },
  { name: "Nova Quiz App", status: "In Progress", daysLeft: 2, urgent: true },
  { name: "Ecommerce Website", status: "Todo", daysLeft: 5, urgent: false },
  { name: "Social Media App", status: "Todo", daysLeft: 6, urgent: false },
];

const hoursVsProgressData = [
  { project: "Project Alpha", hours: 124, progress: 68 },
  { project: "Nova Quiz", hours: 89, progress: 45 },
  { project: "AI Chatbot", hours: 210, progress: 30 },
  { project: "Fintech Dashboard", hours: 55, progress: 82 },
  { project: "Project Apex", hours: 40, progress: 15 },
];

const deliveryBreakdown = [
  { name: "On time", value: 40, color: "#00d3f3" },
  { name: "With overrun", value: 20, color: "#1e2939" },
  { name: "Pending", value: 40, color: "#d1d5dc" },
];

const overrunProjects = [
  { name: "AI Chatbot", hours: 48 },
  { name: "Nova Quiz App", hours: 30 },
  { name: "Fintech Dashboard", hours: 22 },
  { name: "Project Micro", hours: 12 },
  { name: "Project Apex", hours: 5 },
];

const productivityData = [
  { week: "Wk 1", efficiency: 72 },
  { week: "Wk 2", efficiency: 100 },
  { week: "Wk 3", efficiency: 80 },
  { week: "Wk 4", efficiency: 58 },
];



const tasksDueByProject = [
  { project: "Alpha", overdue: 1, today: 0, week: 2 },
  { project: "Nexis", overdue: 2, today: 1, week: 4 },
  { project: "Chatbot", overdue: 3, today: 0, week: 5 },
  { project: "Fintech", overdue: 0, today: 1, week: 1 },
];

const tasksDueSummary = { overdue: 5, today: 3, week: 11, total: 10 };

// ─── Sub-components ──────────────────────────────────────────────────────────

const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, string> = {
    Done: "bg-emerald-50 text-emerald-600 border border-emerald-200",
    "In Progress": "bg-blue-50 text-blue-600 border border-blue-200",
    Paused: "bg-amber-50 text-amber-600 border border-amber-200",
    Expired: "bg-red-50 text-red-500 border border-red-200",
    Todo: "bg-gray-50 text-gray-500 border border-gray-200",
  };
  return (
    <span className={`text-[10px] font-poppins font-semibold px-1.5 py-0.5 rounded ${map[status] ?? "bg-gray-100 text-gray-500"}`}>
      {status}
    </span>
  );
};

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[10px] font-poppins font-semibold tracking-widest text-cyan-500 uppercase mb-1">{children}</p>
);

const CardTitle = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[12px] font-inter font-semibold text-gray-800">{children}</p>
);

const CardSubtitle = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[10px] font-poppins text-gray-400 mb-3">{children}</p>
);

// ─── Dashboard ────────────────────────────────────────────────────────────────

const Dashboard = () => {
  const [timerRecord, setTimerRecord] = useState<TimerRecord>({
    state: "idle",
    elapsedSec: 0,
    startedAt: null,
  });
  const [activeTaskFilter, setActiveTaskFilter] = useState<"Daily" | "Monthly" | "Yearly">("Daily");
  const [avgFilter, setAvgFilter] = useState<"<1h" | "<2h" | "<3h">("<1h");

  const filterMaxHours = avgFilter === "<1h" ? 1 : avgFilter === "<2h" ? 2 : 3;
  const filteredCategories = avgCompletionCategories.filter((c) => c.avg < filterMaxHours);

  const totalTasks = todaysTasks.length;
  const doneTasks = todaysTasks.filter((t) => t.status === "Done").length;
  const inProgressTasks = todaysTasks.filter((t) => t.status === "In Progress").length;

  return (
    <div className="w-full h-[calc(100vh-53px)] mt-[53px] overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-cyan-100 [&::-webkit-scrollbar-track]:bg-gray-100/40 bg-white">
      <div className="max-w-[1200px] mx-auto px-6 py-6 space-y-8">

        {/* ── Section header ── */}
        <div>
          <h1 className="text-2xl font-inter text-gray-800 font-bold mt-5 flex items-center">
            Dashboard{" "}
          <img
            src={ArrowRight}
            alt="Arrow Right"
            className="invert-80 h-7 w-7"
          />
        </h1>
          <p className="text-[11px] text-gray-400 font-poppins">Your productivity overview</p>
        </div>

        {/* ══════════ OVERALL MATRICES ══════════ */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-4 rounded-full bg-cyan-400" />
            <h2 className="text-[13px] font-inter font-semibold text-gray-700">Overall Matrices</h2>
          </div>
          <div className="grid grid-cols-3 gap-4">

            {/* Timer card */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm ">
              <SectionLabel>Current Task</SectionLabel>
              <Timer
                value={0}
                unit="minutes"
                label="Choose a task and start the timer"
                timerRecord={timerRecord}
                onStateChange={setTimerRecord}
                onStop={(result: TimerResult) => console.log("Timer stopped", result)}
              />
            </div>

            {/* User Productivity */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <SectionLabel>Productivity Trend</SectionLabel>
              <CardTitle>User Productivity</CardTitle>
              <CardSubtitle>Efficiency % (tasks completed ÷ planned) — last 4 weeks</CardSubtitle>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={productivityData} margin={{ top: 4, right: 4, bottom: 0, left: -35 }}>
                  <defs>
                    <linearGradient id="prodGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                  <XAxis dataKey="week" tick={{ fontSize: 10, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ fontSize: 11, fontFamily: "Poppins" }} />
                  <Area type="monotone" dataKey="efficiency" stroke="#06b6d4" strokeWidth={2} fill="url(#prodGrad)" dot={{ r: 3, fill: "#06b6d4", strokeWidth: 0 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Actionable Task Focus — Due Widget */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <p className="text-[9px] font-poppins font-semibold tracking-widest text-gray-400 uppercase mb-0.5">
                {tasksDueSummary.total} · Tasks due today / this week
              </p>
              <CardTitle>Actionable task focus widget</CardTitle>
              <CardSubtitle>Cross-project task urgency — your morning priority view</CardSubtitle>

              {/* Summary counts */}
              <div className="flex gap-3 mb-3">
                {[
                  { label: "Overdue", value: tasksDueSummary.overdue, color: "text-[#8b5cf6]" },
                  { label: "Due today", value: tasksDueSummary.today, color: "text-[#fb4848]" },
                  { label: "Due this week", value: tasksDueSummary.week, color: "text-[#60a5fa]" },
                ].map(({ label, value, color }) => (
                  <div key={label} className="flex-1 bg-gray-50 border border-gray-100 rounded-lg px-2.5 py-2">
                    <p className={`text-[18px] font-inter font-bold ${color} text-center`}>{value}</p>
                    <p className="text-[9px] font-poppins text-gray-400 text-center w-full">{label}</p>
                  </div>
                ))}
              </div>

              {/* By project label */}
              <p className="text-[9px] font-poppins text-gray-400 mb-1">By project</p>

              {/* Grouped bar chart */}
              <ResponsiveContainer width="100%" height={100}>
                <BarChart data={tasksDueByProject} margin={{ top: 2, right: 4, bottom: 0, left: -28 }} barSize={8} barGap={2} barCategoryGap="28%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                  <XAxis dataKey="project" tick={{ fontSize: 9, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: "#9ca3af" }} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={{ fontSize: 10, fontFamily: "Poppins" }} />
                  <Bar dataKey="overdue" fill="#8b5cf6" radius={[2, 2, 0, 0]} name="Overdue" />
                  <Bar dataKey="today" fill="#fb4848" radius={[2, 2, 0, 0]} name="Due today" />
                  <Bar dataKey="week" fill="#60a5fa" radius={[2, 2, 0, 0]} name="Due this week" />
                </BarChart>
              </ResponsiveContainer>

              {/* Legend */}
              <div className="flex gap-3 mt-1.5 justify-center">
                {[["#8b5cf6", "Overdue"], ["#fb4848", "Due today"], ["#60a5fa", "Due this week"]].map(([color, label]) => (
                  <span key={label} className="flex items-center gap-1 text-[9px] font-poppins text-gray-500">
                    <span className="w-2 h-2 rounded-sm" style={{ background: color }} />
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══════════ TASKS MATRICES ══════════ */}
        <section className="mt-15">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-4 rounded-full bg-violet-400" />
            <h2 className="text-[13px] font-inter font-semibold text-gray-700">Tasks Matrices</h2>
          </div>
          <div className="grid grid-cols-4 gap-4">

            {/* Matrix 1 — Today's tasks */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm col-span-1">
              <SectionLabel>Task Matrix · 1</SectionLabel>
              <CardTitle>Today's Tasks</CardTitle>
              <CardSubtitle>Sorted by time, showing {Math.min(5, totalTasks)} of {totalTasks}</CardSubtitle>
              <div className="flex gap-4 mb-3 justify-evenly">
                <div>
                  <p className="text-[18px] font-inter font-bold text-gray-800 text-center">{totalTasks}</p>
                  <p className="text-[9px] font-poppins text-gray-400 text-center">Total</p>
                </div>
                <div>
                  <p className="text-[18px] font-inter font-bold text-blue-500 text-center">{inProgressTasks}</p>
                  <p className="text-[9px] font-poppins text-gray-400 text-center">In progress</p>
                </div>
                <div>
                  <p className="text-[18px] font-inter font-bold text-emerald-500 text-center">{doneTasks}</p>
                  <p className="text-[9px] font-poppins text-gray-400 text-center">Done</p>
                </div>
              </div>
              <div className="space-y-1.5">
                {todaysTasks.slice(0, 5).map((t) => (
                  <div key={t.id} className="flex items-center justify-between py-1 border-b border-gray-50">
                    <div className="min-w-0">
                      <p className="text-[10px] font-inter font-medium text-gray-700 truncate">{t.title}</p>
                      <p className="text-[9px] font-poppins text-gray-400">{t.time}{t.project ? ` · ${t.project}` : ""}</p>
                    </div>
                    <StatusBadge status={t.status} />
                  </div>
                ))}
              </div>
              <button className="mt-3 text-[10px] font-poppins text-cyan-500 hover:text-cyan-600 flex items-center gap-1">
                View all {totalTasks} tasks <ExternalLink className="h-3 w-3" />
              </button>
            </div>

            {/* Matrix 2 — Task status breakdown */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm col-span-1">
              <SectionLabel>Task Matrix · 2</SectionLabel>
              <CardTitle>Task Status Breakdown</CardTitle>
              <div className="flex gap-1.5 mb-3 mt-3">
                {(["Daily", "Monthly", "Yearly"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setActiveTaskFilter(f)}
                    className={`text-[10px] font-poppins px-2.5 py-1 rounded-md transition-all ${activeTaskFilter === f ? "bg-cyan-400 text-white font-semibold" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 flex-wrap mb-3 w-fit mx-auto">
                {[["Done", "#7ae5a2"], ["In Progress", "#60a5fa"], ["Paused", "#8b5cf6"], ["Expired", "#fb4848"]].map(([label, color]) => (
                  <span key={label} className="flex items-center gap-1 text-[9px] font-poppins text-gray-500">
                    <span className="w-2 h-2 rounded-sm" style={{ background: color as string }} />
                    {label}
                  </span>
                ))}
              </div>
              <ResponsiveContainer width="100%" height={230}>
                <BarChart data={taskStatusData} margin={{ top: 0, right: 0, bottom: 0, left: -24 }} barSize={9} barGap={1}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 9, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: "#9ca3af" }} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={{ fontSize: 10, fontFamily: "Poppins" }} />
                  <Bar dataKey="Done" stackId="a" fill="#7ae5a2" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="In Progress" stackId="a" fill="#60a5fa" />
                  <Bar dataKey="Paused" stackId="a" fill="#8b5cf6" />
                  <Bar dataKey="Expired" stackId="a" fill="#fb4848" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Matrix 3 — Task completion rate */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm col-span-1">
              <SectionLabel>Task Matrix · 3</SectionLabel>
              <CardTitle>Task Completion Rate</CardTitle>
              <CardSubtitle>On-time vs with overrun — all tasks</CardSubtitle>
              <div className="flex items-center justify-center">
                <div className="relative">
                  <PieChart width={160} height={160}>
                    <Pie
                      data={completionRateData}
                      cx={75}
                      cy={75}
                      innerRadius={50}
                      outerRadius={72}
                      startAngle={90}
                      endAngle={-270}
                      cornerRadius={4}
                      dataKey="value"
                      strokeWidth={2}
                      stroke="white"
                    >
                      {completionRateData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-[22px] font-inter font-bold text-gray-800">58%</p>
                    <p className="text-[9px] font-poppins text-gray-400">on time</p>
                  </div>
                </div>
              </div>
              <div className="space-y-1.5 mt-6">
                {completionRateData.map((d) => (
                  <div key={d.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                      <span className="text-[10px] font-poppins text-gray-600">{d.name}</span>
                    </div>
                    <span className="text-[10px] font-semibold text-gray-800 font-poppins">{d.value}%</span>
                  </div>
                ))}
                <p className="text-[9px] font-poppins text-gray-400 pt-1">Based on 148 tasks total</p>
              </div>
            </div>

            {/* Matrix 4 — Avg completion time */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm col-span-1">
              <SectionLabel>Task Matrix · 4</SectionLabel>
              <CardTitle>Avg Completion Time</CardTitle>
              <CardSubtitle>Filtered by max allocated duration</CardSubtitle>
              <div className="flex gap-1.5 mb-5">
                {(["<1h", "<2h", "<3h"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setAvgFilter(f)}
                    className={`text-[10px] font-poppins px-2 py-1 rounded-md transition-all ${avgFilter === f ? "bg-cyan-400 text-white font-semibold" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-2 mb-6">
                <div className="text-center">
                  <p className="text-[16px] font-inter font-bold text-cyan-500">0.7h</p>
                  <p className="text-[9px] font-poppins text-gray-400">Avg time</p>
                </div>
                <div className="text-center">
                  <p className="text-[16px] font-inter font-bold text-gray-700">24</p>
                  <p className="text-[9px] font-poppins text-gray-400">Tasks included</p>
                </div>
                <div className="text-center">
                  <p className="text-[16px] font-inter font-bold text-violet-500">70%</p>
                  <p className="text-[9px] font-poppins text-gray-400">vs limit</p>
                </div>
              </div>
              <div className="space-y-2">
                {filteredCategories.map((c) => (
                  <div key={c.name} className="flex items-center gap-2">
                    <p className="text-[10px] font-poppins text-gray-600 w-20 shrink-0">{c.name}</p>
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-cyan-500"
                        style={{ width: `${(c.avg / filterMaxHours) * 100}%` }}
                      />
                    </div>
                    <p className="text-[10px] font-poppins font-semibold text-gray-700 w-8 text-right">{c.avg}h</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
     
        </section>

        {/* ══════════ PROJECT MATRICES ══════════ */}
        <section className="mt-15">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-4 rounded-full bg-violet-500" />
            <h2 className="text-[13px] font-inter font-semibold text-gray-700">Project Matrices</h2>
          </div>

          {/* Row 1 */}
          <div className="grid grid-cols-4 gap-4 mb-4">

            {/* Weekly velocity */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm col-span-2">
              <SectionLabel>Project Matrix · 1</SectionLabel>
              <CardTitle>Weekly Velocity Across Active Projects</CardTitle>
              <CardSubtitle>Tasks completed per week per project</CardSubtitle>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={velocityData} margin={{ top: 4, right: 4, bottom: 0, left: -24 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                  <XAxis dataKey="week" tick={{ fontSize: 9, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: "#9ca3af" }} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={{ fontSize: 10, fontFamily: "Poppins" }} />
                  <Line type="monotone" dataKey="Project Alpha" stroke="#06b6d4" strokeWidth={1.5} dot={{ r: 2 }} />
                  <Line type="monotone" dataKey="Nova Quiz" stroke="#8b5cf6" strokeWidth={1.5} dot={{ r: 2 }} />
                  <Line type="monotone" dataKey="AI Chatbot" stroke="#f59e0b" strokeWidth={1.5} dot={{ r: 2 }} />
                  <Line type="monotone" dataKey="Fintech Dashboard" stroke="#10b981" strokeWidth={1.5} dot={{ r: 2 }} />
                </LineChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-x-3 gap-y-1 mt-4 w-fit mx-auto">
                {[["Project Alpha", "#06b6d4"], ["Nova Quiz", "#8b5cf6"], ["AI Chatbot", "#f59e0b"], ["Fintech Dashboard", "#10b981"]].map(([name, color]) => (
                  <span key={name} className="flex items-center gap-1 text-[9px] font-poppins text-gray-500">
                    <span className="w-2 h-1 rounded-full inline-block" style={{ background: color as string }} />
                    {name}
                  </span>
                ))}
              </div>
            </div>

            {/* Stuck in progress */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm col-span-1">
              <SectionLabel>Project Matrix · 2</SectionLabel>
              <CardTitle>Tasks Stuck in "In Progress" Too Long</CardTitle>
              <CardSubtitle>No update detected for more than 3 days</CardSubtitle>
              <div className="flex gap-4 mb-3 justify-center">
                <div>
                  <p className="text-[22px] font-inter font-bold text-gray-800 text-center">7</p>
                  <p className="text-[9px] font-poppins text-gray-400">Stale tasks</p>
                </div>
                <div>
                  <p className="text-[22px] font-inter font-bold text-[#ffb940] text-center">5.4</p>
                  <p className="text-[9px] font-poppins text-gray-400">Avg days idle</p>
                </div>
                <div>
                  <p className="text-[22px] font-inter font-bold text-[#fb4848] text-center">3</p>
                  <p className="text-[9px] font-poppins text-gray-400">Projects affected</p>
                </div>
              </div>
              <div className="space-y-1.5">
                {stuckTasks.map((t, i) => (
                  <div key={i} className="flex items-center justify-between py-1 border-b border-gray-50">
                    <div className="min-w-0">
                      <p className="text-[10px] font-inter font-medium text-gray-700 truncate">{t.title}</p>
                      <p className="text-[9px] font-poppins text-gray-400">{t.project}</p>
                    </div>
                    <span className={`text-[10px] font-poppins font-semibold shrink-0 ml-2 ${t.days >= 5 ? "text-[#fb4848]" : "text-[#ffb940]"}`}>
                      {t.days}d idle
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Due in 7 days */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm col-span-1">
              <SectionLabel>Project Matrix · 3</SectionLabel>
              <CardTitle>Due in the Next 7 Days</CardTitle>
              <CardSubtitle>Projects nearing estimated end date — sorted by urgency</CardSubtitle>
              <div className="flex gap-4 mb-3 justify-center">
                {[["Due Today", 1], ["Due 2-3 Days", 1], ["Due This Week", 4]].map(([label, count]) => (
                  <div key={label as string}>
                    <p className="text-[22px] font-inter font-bold text-gray-800 text-center">{count}</p>
                    <p className="text-[9px] font-poppins text-gray-400">{label}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                {dueSoonProjects.map((p, i) => (
                  <div key={i} className="flex items-center justify-between py-1.5 border-b border-gray-50">
                    <div>
                      <p className="text-[10px] font-inter font-medium text-gray-700">{p.name}</p>
                      <StatusBadge status={p.status} />
                    </div>
                    <span className={`text-[10px] font-poppins font-semibold ${p.daysLeft <= 2 ? "text-[#fb4848]" : "text-gray-500"}`}>
                      {p.daysLeft <= 2 ? `${p.daysLeft} days left` : `${p.daysLeft} days left`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-3 gap-4">

            {/* Hours vs Progress */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <SectionLabel>Project Matrix · 4</SectionLabel>
              <CardTitle>Hours Invested vs Progress Achieved</CardTitle>
              <CardSubtitle>High hours for low progress signals a struggling project</CardSubtitle>
              <div className="flex gap-4 mb-4">
                <div>
                  <p className="text-[18px] font-inter font-bold text-gray-800 text-center">184</p>
                  <p className="text-[9px] font-poppins text-gray-400 text-center">Total hours</p>
                </div>
                <div>
                  <p className="text-[18px] font-inter font-bold text-[#ffb940] text-center">AI Chatbot</p>
                  <p className="text-[9px] font-poppins text-gray-400 text-center">Most inefficient</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={150}>
                <BarChart data={hoursVsProgressData} margin={{ top: 4, right: 4, bottom: 0, left: -24 }} barSize={10} barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                  <XAxis dataKey="project" tick={{ fontSize: 8, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ fontSize: 10, fontFamily: "Poppins" }} />
                  <Bar dataKey="hours" fill="#06b6d4" radius={[2, 2, 0, 0]} name="Hours" />
                  <Bar dataKey="progress" fill="#8b5cf6" radius={[2, 2, 0, 0]} name="Progress %" />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex gap-3 mt-2 w-fit mx-auto">
                <span className="flex items-center gap-1 text-[9px] font-poppins text-gray-500"><span className="w-2 h-2 rounded-sm bg-cyan-400" />Hours</span>
                <span className="flex items-center gap-1 text-[9px] font-poppins text-gray-500"><span className="w-2 h-2 rounded-sm bg-violet-500" />Progress %</span>
              </div>
            </div>

            {/* Project delivery breakdown */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <SectionLabel>Project Matrix · 5</SectionLabel>
              <CardTitle>Project Delivery Breakdown</CardTitle>
              <CardSubtitle>Share of projects completed on time, with overrun, or still pending</CardSubtitle>
              <div className="flex items-center justify-center">
                <div className="relative">
                  <PieChart width={160} height={160}>
                    <Pie
                      data={deliveryBreakdown}
                      cx={75}
                      cy={75}
                      innerRadius={50}
                      outerRadius={72}
                      startAngle={90}
                      endAngle={-270}
                      cornerRadius={4}
                      dataKey="value"
                      strokeWidth={2}
                      stroke="white"
                    >
                      {deliveryBreakdown.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-[9px] font-poppins text-gray-400">Out of</p>
                    <p className="text-[18px] font-inter font-bold text-gray-800">5</p>
                    <p className="text-[9px] font-poppins text-gray-400">projects</p>
                  </div>
                </div>
              </div>
              <div className="space-y-1.5">
                {deliveryBreakdown.map((d) => (
                  <div key={d.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                      <span className="text-[10px] font-poppins text-gray-600">{d.name}</span>
                    </div>
                    <span className="text-[10px] font-semibold text-gray-800 font-poppins">{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Most overrun projects */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <SectionLabel>Project Matrix · 6</SectionLabel>
              <CardTitle>Most Overrun Projects</CardTitle>
              <CardSubtitle>Total overrun hours ranked — highlights which projects need immediate attention</CardSubtitle>
              <div className="space-y-3 mt-8">
                {overrunProjects.map((p, i) => {
                  const max = overrunProjects[0].hours;
                  return (
                    <div key={i} className="flex items-center gap-2">
                      <p className="text-[10px] font-poppins text-gray-600 w-28 shrink-0 truncate">{p.name}</p>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${(p.hours / max) * 100}%`,
                            background: i === 0 ? "#fb4848" : i === 1 ? "#fbbf24" : i === 2 ? "#fbbf55" : "#d1d5db",
                          }}
                        />
                      </div>
                      <p className="text-[10px] font-poppins font-semibold text-gray-700 w-8 text-right shrink-0">{p.hours}h</p>
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                <p className="text-[10px] font-poppins text-gray-500">Total overrun hours</p>
                <p className="text-[14px] font-inter font-bold text-red-500">
                  {overrunProjects.reduce((s, p) => s + p.hours, 0)}h
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="h-8" />
      </div>
    </div>
  );
};

export default Dashboard;