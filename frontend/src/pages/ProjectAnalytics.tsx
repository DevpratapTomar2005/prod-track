import React, { useState } from "react";
import ArrowRight from "../assets/arrow_right.svg";
import Checkbox from "../components/ui/Checkbox.tsx";
import Dot from "../assets/dot.svg";
import {
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import  ProjectTimeline  from "../components/ProjectTimeline.tsx";

// ─── Half-donut progress gauge ────────────────────────────────────────────────
// SVG arc convention:
//   sweep-flag=1 → clockwise
//   The track goes from LEFT (180°) → RIGHT (0°) clockwise across the TOP.
//   A point at angle θ (measured from positive-x axis, standard math) maps to:
//     x = cx + r·cos(θ),  y = cy - r·sin(θ)   (SVG y is flipped)
//   Left end  → θ = 180° → (cx-r, cy)
//   Right end → θ =   0° → (cx+r, cy)
//   For p% filled we travel p% of 180° clockwise from the left end,
//   so the fill end-angle = 180° - p%·180° = (1 - p/100)·180°.
const HalfDonut = ({ percentage }: { percentage: number }) => {
  const r = 70;
  const cx = 100;
  const cy = 90;

  // Fixed endpoints of the semicircle
  const startX = cx - r; // left  (0%)
  const startY = cy;
  const endX = cx + r; // right (100%)
  const endY = cy;

  // End-point of the filled arc
  // θ in radians, going from π (left) toward 0 (right) as percentage rises
  const theta = Math.PI * (1 - percentage / 100);
  const fillX = cx + r * Math.cos(theta); // cos(π→0) goes -1→+1  ✓
  const fillY = cy - r * Math.sin(theta); // sin is always ≥0 for θ∈[0,π], so y ≤ cy ✓

  // large-arc-flag = 1 when the arc spans > 180° — impossible here (max is exactly 180°),
  // so we need flag=1 only when percentage === 100 to close the full semicircle.
  const largeArc = percentage >= 100 ? 1 : 0;

  // Colour ramp: red → amber → green
  const gaugeColor =
    percentage >= 66 ? "#22c55e" : percentage >= 33 ? "#00d3f2" : "#ef4444";

  return (
    <svg
      viewBox="0 0 200 100"
      className="w-full"
      style={{ overflow: "visible" }}
    >
      {/* Track (full background semicircle, left → right, clockwise) */}
      <path
        d={`M ${startX} ${startY} A ${r} ${r} 0 0 1 ${endX} ${endY}`}
        fill="none"
        stroke="#e5e7eb"
        strokeWidth={14}
        strokeLinecap="round"
      />

      {/* Filled arc (left → fill point, clockwise) */}
      {percentage > 0 && percentage < 100 && (
        <path
          d={`M ${startX} ${startY} A ${r} ${r} 0 ${largeArc} 1 ${fillX} ${fillY}`}
          fill="none"
          stroke={gaugeColor}
          strokeWidth={14}
          strokeLinecap="round"
        />
      )}

      {percentage >= 100 && (
        <path
          d={`M ${startX} ${startY} A ${r} ${r} 0 0 1 ${endX} ${endY}`}
          fill="none"
          stroke={gaugeColor}
          strokeWidth={14}
          strokeLinecap="round"
        />
      )}

      

      {/* Centre label */}
      <text
        x={cx}
        y={cy - 14}
        textAnchor="middle"
        fontSize={22}
        fontWeight="700"
        fill={gaugeColor}
        fontFamily="Inter, sans-serif"
      >
        {percentage}%
      </text>
      <text
        x={cx}
        y={cy + 2}
        textAnchor="middle"
        fontSize={8}
        fill="#9ca3af"
        fontFamily="Poppins, sans-serif"
      >
        completed
      </text>

      {/* End labels */}
      <text
        x={startX - 2}
        y={cy + 14}
        textAnchor="middle"
        fontSize={8}
        fill="#9ca3af"
        fontFamily="Poppins, sans-serif"
      >
        0%
      </text>
      <text
        x={endX + 2}
        y={cy + 14}
        textAnchor="middle"
        fontSize={8}
        fill="#9ca3af"
        fontFamily="Poppins, sans-serif"
      >
        100%
      </text>
    </svg>
  );
};

// ─── Chart configs ────────────────────────────────────────────────────────────
const statusChartConfig: ChartConfig = {
  Done: { label: "Done", color: "hsl(160 60% 45%)" },
  "In Progress": { label: "In Progress", color: "hsl(217 80% 55%)" },
  "To Do": { label: "To Do", color: "hsl(43  90% 55%)" },
};

const completionChartConfig: ChartConfig = {
  Completed: { label: "Completed", color: "hsl(262 70% 58%)" },
};

const ProjectAnalytics = () => {
  const [tasks] = useState<
    Array<{
      id: number;
      task: string;
      status: string;
      project: string;
      estDuration: string;
      estDurationUnit: string;
      startDate: string;
      dueDate: string;
      startTime: string;
      subtasks: Array<{ id: number; subtask: string }>;
    }>
  >([
    {
      id: 1111,
      task: "FIX: Resolve login issue",
      status: "Done",
      project: "Project Alpha",
      estDuration: "2.5",
      estDurationUnit: "hours",
      startDate: "10 April, 2026",
      dueDate: "12 April, 2026",
      startTime: "9:00 AM",
      subtasks: [
        { id: 2278, subtask: "Work on frontend" },
        { id: 2279, subtask: "Work on backend" },
      ],
    },
    {
      id: 1112,
      task: "Implement user profile page",
      status: "In Progress",
      project: "Project Alpha",
      estDuration: "2.5",
      estDurationUnit: "hours",
      startDate: "13 April, 2026",
      dueDate: "14 April, 2026",
      startTime: "9:00 AM",
      subtasks: [],
    },
    {
      id: 2925,
      task: "Implement project analytics",
      status: "Todo",
      project: "Project Alpha",
      estDuration: "3.5",
      estDurationUnit: "hours",
      startDate: "15 April, 2026",
      dueDate: "15 April, 2026",
      startTime: "9:00 AM",
      subtasks: [],
    },
    {
      id: 1112,
      task: "Implement user profile page",
      status: "In Progress",
      project: "Project Alpha",
      estDuration: "2.5",
      estDurationUnit: "hours",
      startDate: "13 April, 2026",
      dueDate: "14 April, 2026",
      startTime: "9:00 AM",
      subtasks: [],
    },
    {
      id: 2925,
      task: "Implement project analytics",
      status: "Todo",
      project: "Project Alpha",
      estDuration: "3.5",
      estDurationUnit: "hours",
      startDate: "15 April, 2026",
      dueDate: "15 April, 2026",
      startTime: "9:00 AM",
      subtasks: [],
    },
    {
      id: 1112,
      task: "Implement user profile page",
      status: "In Progress",
      project: "Project Alpha",
      estDuration: "2.5",
      estDurationUnit: "hours",
      startDate: "13 April, 2026",
      dueDate: "14 April, 2026",
      startTime: "9:00 AM",
      subtasks: [],
    },
    {
      id: 2925,
      task: "Implement project analytics",
      status: "Todo",
      project: "Project Alpha",
      estDuration: "3.5",
      estDurationUnit: "hours",
      startDate: "15 April, 2026",
      dueDate: "15 April, 2026",
      startTime: "9:00 AM",
      subtasks: [],
    },
    {
      id: 1112,
      task: "Implement user profile page",
      status: "In Progress",
      project: "Project Alpha",
      estDuration: "2.5",
      estDurationUnit: "hours",
      startDate: "13 April, 2026",
      dueDate: "14 April, 2026",
      startTime: "9:00 AM",
      subtasks: [],
    },
    {
      id: 2925,
      task: "Implement project analytics",
      status: "Todo",
      project: "Project Alpha",
      estDuration: "3.5",
      estDurationUnit: "hours",
      startDate: "15 April, 2026",
      dueDate: "15 April, 2026",
      startTime: "9:00 AM",
      subtasks: [],
    },
    {
      id: 1112,
      task: "Implement user profile page",
      status: "In Progress",
      project: "Project Alpha",
      estDuration: "2.5",
      estDurationUnit: "hours",
      startDate: "13 April, 2026",
      dueDate: "14 April, 2026",
      startTime: "9:00 AM",
      subtasks: [],
    },
    {
      id: 2925,
      task: "Implement project analytics",
      status: "Todo",
      project: "Project Alpha",
      estDuration: "3.5",
      estDurationUnit: "hours",
      startDate: "15 April, 2026",
      dueDate: "15 April, 2026",
      startTime: "9:00 AM",
      subtasks: [],
    },
   
  ]);

  const statusCounts = tasks.reduce<Record<string, number>>((acc, p) => {
    acc[p.status] = (acc[p.status] ?? 0) + 1;
    return acc;
  }, {});

  const statusColors: Record<string, string> = {
    Done: "oklch(27.8% 0.033 256.848)",
    "In Progress": "oklch(78.9% 0.154 211.53)",
    "To Do": "oklch(87.2% 0.01 258.338)",
  };
  // fill embedded in data — Cell is deprecated in Recharts v3+
  const statusPieData = Object.entries(statusCounts).map(([name, value]) => ({
    name,
    value,
    fill: statusColors[name] ?? "#d1d5db",
  }));

   const completionData = [
    { week: "Wk 1", Completed: 1 },
    { week: "Wk 2", Completed: 1 },
    { week: "Wk 3", Completed: 2 },
    { week: "Wk 4", Completed: 3 },
  ];

  return (
    <div className="w-full h-[calc(100vh-53px)] mt-[53px] overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-cyan-100 [&::-webkit-scrollbar-track]:bg-gray-100/40">
      <div className="w-[90%] max-w-[1050px] mt-2 mx-auto">
        <h1 className="text-2xl font-inter text-gray-800 font-bold mt-10 flex items-center">
          Project Analytics{" "}
          <img
            src={ArrowRight}
            alt="Arrow Right"
            className="invert-80 h-7 w-7"
          />
        </h1>
        <h3 className="text-[12px] text-gray-400 font-poppins mt-1">
          Insights into project progress and task analytics
        </h3>
      </div>
      <div className="border border-gray-200 w-[90%] max-w-[1050px] mx-auto p-4 rounded-md mt-8 flex items-center justify-between shadow-sm">
        <div>
        <h1 className="text-lg font-inter text-gray-800 font-semibold flex items-center">
          Project Alpha{" "}
         
        </h1>
        <h3 className="text-[12px] text-gray-400 font-poppins mt-1 bg-gray-50 w-fit p-1 rounded-lg">
          #PROJECT-2001
        </h3>
        </div>
        <div>
          <h3 className="text-[13px] text-cyan-400 font-poppins mt-1 bg-green-50 border border-cyan-300 w-fit py-1.5 px-4 rounded-lg ">
          In Progress
        </h3>
        </div>
      </div>
      <div className="w-[90%] max-w-[1050px] mt-2 mx-auto">
        <div className="grid grid-cols-3 gap-3 mb-3">
          <div className="bg-white border border-gray-200 rounded-md p-4 col-span-2 shadow-sm">
            
              <p className="text-[12px] font-semibold text-gray-700 font-inter">
                Project Velocity
              </p>
              <p className="text-[10px] text-gray-400 font-poppins mb-2">
                Your weekly project velocity
              </p>
              <ChartContainer
                config={completionChartConfig}
                className="h-[170px] w-full"
              >
                <AreaChart
                  data={completionData}
                  margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="completionFill"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="hsl(262 70% 58%)"
                        stopOpacity={0.15}
                      />
                      <stop
                        offset="95%"
                        stopColor="hsl(262 70% 58%)"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f3f4f6"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="week"
                    tick={{ fontSize: 10, fill: "#9ca3af" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: "#9ca3af" }}
                    tickLine={false}
                    axisLine={false}
                    width={24}
                    allowDecimals={false}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="linear"
                    dataKey="Completed"
                    stroke="oklch(27.8% 0.033 256.848)"
                    strokeWidth={2}
                    fill="url(#completionFill)"
                    activeDot={{ r: 5, strokeWidth: 0 }}
                  />
                </AreaChart>
              </ChartContainer>
            
          </div>
          {/* Project progress half-donut */}
          <div className="bg-white border border-gray-200 rounded-md p-4 pb-6 col-span-1 shadow-sm">
            <p className="text-[12px] font-semibold text-gray-700 font-inter">
              Project progress
            </p>
            <p className="text-[10px] text-gray-400 font-poppins mb-3">
              Overall completion based on done tasks
            </p>

            <div className="flex flex-col items-center justify-center gap-2 px-4">
              <div className="w-full max-w-[300px]">
                <HalfDonut
                  percentage={Math.round(
                    ((statusCounts["Done"] ?? 0) / tasks.length) * 100,
                  )}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mx-1 mb-3">
          {/* Status donut */}
          <div className="bg-white border border-gray-200 rounded-md p-4 col-span-1 shadow-sm">
            <p className="text-[12px] font-semibold text-gray-700 font-inter">
              Status breakdown
            </p>
            <p className="text-[10px] text-gray-400 font-poppins mb-1">
              Tasks by current status
            </p>

            <div className="flex items-center gap-3 ">
              {/* Donut via shadcn ChartContainer */}
              <ChartContainer
                config={statusChartConfig}
                className="h-[200px] w-[200px] flex-shrink-0"
              >
                <PieChart>
                  <ChartTooltip
                    content={<ChartTooltipContent hideLabel nameKey="name" />}
                  />
                  <Pie
                    data={statusPieData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={58}
                    outerRadius={86}
                    strokeWidth={2}
                    stroke="white"
                    labelLine={false}
                    cornerRadius={4}
                  ></Pie>
                </PieChart>
              </ChartContainer>

              {/* Custom legend */}
              <div className="flex flex-col gap-2.5 flex-1 mr-5">
                {statusPieData.map((s) => (
                  <div
                    key={s.name}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-2 h-2 rounded-sm flex-shrink-0"
                        style={{ background: s.fill }}
                      />
                      <span className="text-[11px] text-gray-600 font-poppins">
                        {s.name}
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-gray-800 font-poppins tabular-nums">
                      {s.value}
                    </span>
                  </div>
                ))}
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-[10px] text-gray-400 font-poppins">
                    {Math.round(
                      ((statusCounts["Done"] ?? 0) / tasks.length) * 100,
                    )}
                    % completion rate
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-md p-4 col-span-1 shadow-sm">
            
              <p className="text-[12px] font-semibold text-gray-700 font-inter">
                Task Completion Stats
              </p>
              <p className="text-[10px] text-gray-400 font-poppins mb-2">
                Tasks completed per week
              </p>
              <ChartContainer
                config={completionChartConfig}
                className="h-[170px] w-full"
              >
                <AreaChart
                  data={completionData}
                  margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="completionFill"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="hsl(262 70% 58%)"
                        stopOpacity={0.15}
                      />
                      <stop
                        offset="95%"
                        stopColor="hsl(262 70% 58%)"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f3f4f6"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="week"
                    tick={{ fontSize: 10, fill: "#9ca3af" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: "#9ca3af" }}
                    tickLine={false}
                    axisLine={false}
                    width={24}
                    allowDecimals={false}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="stepAfter"
                    dataKey="Completed"
                    stroke="oklch(27.8% 0.033 256.848)"
                    strokeWidth={2}
                    fill="url(#completionFill)"
                    dot={{
                      r: 3,
                      fill: "oklch(78.9% 0.154 211.53)",
                      strokeWidth: 0,
                    }}
                    activeDot={{ r: 5, strokeWidth: 0 }}
                  />
                </AreaChart>
              </ChartContainer>
            
          </div>
        </div>
      </div>
      <div className="bg-slate-50 w-[90%] max-w-[1050px] my-10 rounded-lg p-1 shadow mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-inter text-gray-800 font-bold mt-3 mb-2 mx-2 flex items-center">
            Tasks{" "}
            <img
              src={ArrowRight}
              alt="Arrow Right"
              className="invert-80 h-7 w-7"
            />
          </h1>
          <div className="w-fit p-1 rounded-md hover:bg-neutral-100 cursor-pointer mr-2 transition-all duration-200 ease-in-out">
            <img src={Dot} alt="Dot" className="" />
          </div>
        </div>
        <div className="border border-gray-200 rounded-md w-full bg-white overflow-x-auto scroll-smooth [&::-webkit-scrollbar]:h-0.5 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:bg-gray-100">
          <table className="w-full min-w-[1000px] border-collapse">
            <thead className="text-sm text-neutral-800 font-inter">
              <tr>
                <th className="w-[110px] border-r border-b border-gray-200 text-left px-1 py-2">
                  <span className="flex items-center gap-1.5">
                    <Checkbox size="sm" />
                    <span className="ml-2">Id</span>
                  </span>
                </th>
                <th className="w-[320px] border-r border-b border-gray-200 text-center py-2">
                  Task
                </th>
                <th className="w-[100px] border-r border-b border-gray-200 text-center py-2">
                  Status
                </th>
                <th className="w-[100px] border-r border-b border-gray-200 text-center py-2">
                  Project
                </th>
                <th className="w-[110px] border-r border-b border-gray-200 text-center py-2">
                  Duration
                </th>
                <th className="w-[110px] border-r border-b border-gray-200 text-center py-2">
                  Start Date
                </th>
                <th className="w-[110px] border-r border-b border-gray-200 text-center py-2">
                  Due Date
                </th>
                <th className="w-[110px] border-b border-gray-200 text-center py-2">
                  Start Time
                </th>
              </tr>
            </thead>
            <tbody className="text-[12px] text-gray-600 font-poppins">
              {tasks.map((task, index) => (
                <React.Fragment key={task.id}>
                  <tr key={task.id} className="hover:bg-gray-50 cursor-pointer">
                    <td
                      className="w-[110px] text-left px-1 py-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span className="flex items-center gap-1.5">
                        <Checkbox size="sm" />
                        <span>#TASK-{task.id}</span>
                      </span>
                    </td>
                    <td className="w-[320px] text-center px-2 py-2">
                      {task.task}
                    </td>
                    <td className="w-[100px] text-center py-2">
                      {task.status}
                    </td>
                    <td className="w-[100px] text-center py-2">
                      {task.project}
                    </td>
                    <td className="w-[110px] text-center py-2">
                      {task.estDuration}
                    </td>
                    <td className="w-[110px] text-center py-2">
                      {task.startDate}
                    </td>
                    <td className="w-[110px] text-center py-2">
                      {task.dueDate}
                    </td>
                    <td className="w-[110px] text-center py-2">
                      {task.startTime}
                    </td>
                  </tr>
                  {index !== tasks.length - 1 && (
                    <tr key={`divider-${task.id}`}>
                      <td colSpan={9}>
                        <div className="h-px w-full bg-gray-200" />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
       <div className="relative">
        <ProjectTimeline tasks={tasks} />
      </div>
    </div>
  );
};

export default ProjectAnalytics;
