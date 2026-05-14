import React,{ useState, useEffect } from "react";
import ArrowRight from "../assets/arrow_right.svg";
import Checkbox from "../components/ui/Checkbox.tsx";
import Dot from "../assets/dot.svg";
import ProjectCreateModal from "../components/ProjectCreateModal.tsx";
import { useDispatch, useSelector } from "react-redux";
import {useNavigate, useParams} from "react-router"
import {resetGlobalModalState} from "../slices/globalModalStateSlice.ts";
// shadcn chart primitives (wraps recharts)
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

// recharts primitives used directly inside ChartContainer
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Project {
  id: number;
  project: string;
  status: string;
  progress: number;
  startDate: string;
  estEndDate: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const mayDay = (dateStr: string): number =>
  new Date(dateStr.replace(",", "")).getDate();



// ─── Gantt Row ────────────────────────────────────────────────────────────────

const GanttRow = ({
  project,
  minDay,
  maxDay,
}: {
  project: Project;
  minDay: number;
  maxDay: number;
}) => {
  const totalDays = maxDay - minDay || 1;
  const start     = mayDay(project.startDate) - minDay;
  const end       = mayDay(project.estEndDate) - minDay;
  const leftPct   = (start / totalDays) * 100;
  const widthPct  = Math.max(((end - start) / totalDays) * 100, 2);

  const colorMap: Record<string, string> = {
    Done:          "bg-gray-800",
    "In Progress": "bg-cyan-400",
    "To Do":       "bg-gray-400",
  };

  return (
    <div className="flex items-center gap-3 py-[5px] group">
      <div className="w-[120px] flex-shrink-0 text-[11px] text-gray-500 font-poppins truncate group-hover:text-gray-800 transition-colors">
        {project.project}
      </div>
      <div className="flex-1 relative h-4">
        <div className="absolute inset-0 rounded-full bg-gray-100" />
        <div
          className={`absolute top-0 h-4 rounded-full opacity-80 ${colorMap[project.status] ?? "bg-gray-300"}`}
          style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
        />
      </div>
      <div className="w-[52px] flex-shrink-0 text-[10px] text-gray-400 font-poppins text-right tabular-nums">
        {mayDay(project.startDate)}–{mayDay(project.estEndDate)}
      </div>
    </div>
  );
};


// ─── Chart configs ────────────────────────────────────────────────────────────

const statusChartConfig: ChartConfig = {
  Done:          { label: "Done",        color: "hsl(160 60% 45%)" },
  "In Progress": { label: "In Progress", color: "hsl(217 80% 55%)" },
  "To Do":       { label: "To Do",       color: "hsl(43  90% 55%)" },
};

const progressChartConfig: ChartConfig = {
  progress: { label: "Progress %", color: "hsl(199 80% 48%)" },
};

const completionChartConfig: ChartConfig = {
  Completed: { label: "Completed", color: "hsl(262 70% 58%)" },
};

// ─── Main component ───────────────────────────────────────────────────────────

const ProjectsPage = () => {
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
  const dispatch = useDispatch();
  const navigate= useNavigate();
  const {name} = useParams()
  const globalModalState = useSelector((state: any) => state.globalModalState);
  const [projects] = useState<Project[]>([
    { id: 2001, project: "Project Alpha",      status: "Done",        progress: 100, startDate: "1 May, 2026",  estEndDate: "1 May, 2026"  },
    { id: 2002, project: "Nexis Quiz App",     status: "In Progress", progress: 90,  startDate: "2 May, 2026",  estEndDate: "4 May, 2026"  },
    { id: 2003, project: "Fintech Dashboard",  status: "Done",        progress: 100, startDate: "5 May, 2026",  estEndDate: "7 May, 2026"  },
    { id: 2004, project: "E-commerce Website", status: "To Do",       progress: 0,   startDate: "6 May, 2026",  estEndDate: "8 May, 2026"  },
    { id: 2995, project: "AI Chatbot",         status: "In Progress", progress: 2,   startDate: "7 May, 2026",  estEndDate: "9 May, 2026"  },
    { id: 2006, project: "Social Media App",   status: "To Do",        progress: 0, startDate: "8 May, 2026",  estEndDate: "10 May, 2026" },
    { id: 2007, project: "Portfolio Website",  status: "Done",       progress: 100,   startDate: "9 May, 2026",  estEndDate: "11 May, 2026" },
    { id: 2008, project: "E-commerce Website", status: "To Do",       progress: 0,   startDate: "10 May, 2026", estEndDate: "12 May, 2026" },
    { id: 2009, project: "AI Extension",       status: "To Do",       progress: 0,   startDate: "11 May, 2026", estEndDate: "13 May, 2026" },
    { id: 2010, project: "Social Media App",   status: "To Do",       progress: 0,   startDate: "12 May, 2026", estEndDate: "14 May, 2026" },
  ]);
  // ── Derived chart data ─────────────────────────────────────────────────────

  useEffect(() => {
    if (globalModalState.type === "createProject" && globalModalState.isOpen) {
      setShowCreateProjectModal(true);
    }
    else{
      setShowCreateProjectModal(false);
    }
   
  }, [globalModalState]);

  const handleCloseModal = () => {
    setShowCreateProjectModal(false);
    dispatch(resetGlobalModalState());
  };

  const statusCounts = projects.reduce<Record<string, number>>((acc, p) => {
    acc[p.status] = (acc[p.status] ?? 0) + 1;
    return acc;
  }, {});
  const statusColors: Record<string, string> = {
    Done:          "oklch(27.8% 0.033 256.848)",
    "In Progress": "oklch(78.9% 0.154 211.53)",
    "To Do":       "oklch(87.2% 0.01 258.338)",
  };
  // fill embedded in data — Cell is deprecated in Recharts v3+
  const statusPieData = Object.entries(statusCounts).map(([name, value]) => ({
    name,
    value,
    fill: statusColors[name] ?? "#d1d5db",
  }));

  const progressBarData = projects
    .filter((p) => p.progress > 0)
    .map((p) => ({
      name:     p.project.length > 13 ? p.project.slice(0, 12) + "…" : p.project,
      progress: p.progress,
    }));

  const allDays = projects.flatMap((p) => [mayDay(p.startDate), mayDay(p.estEndDate)]);
  const minDay  = Math.min(...allDays);
  const maxDay  = Math.max(...allDays);

  const completionData = [
    { week: "Wk 1", Completed: 1 },
    { week: "Wk 2", Completed: 1 },
    { week: "Wk 3", Completed: 2 },
    { week: "Wk 4", Completed: 3 },
  ];

  const handleProjectAnalyticsNavigation = (projectName:string, projectId:any) => {
    navigate(`/${name}/projects/${projectName.replaceAll(" ","-").toLowerCase() + `-${projectId}`}`);
  };


  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div>
      <div className="w-full h-[calc(100vh-53px)] mt-[53px] overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-cyan-100 [&::-webkit-scrollbar-track]:bg-gray-100/40">

        {/* ── Row 1: Status breakdown + Progress distribution ──────────── */}
        <div className="w-[90%] max-w-[1050px] mt-10 mx-auto">
          <div className="grid grid-cols-2 gap-3 mx-1 mb-3">

            {/* Status donut */}
            <div className="bg-white border border-gray-200 rounded-md p-4">
              <p className="text-[12px] font-semibold text-gray-700 font-inter">Status breakdown</p>
              <p className="text-[10px] text-gray-400 font-poppins mb-1">Projects by current status</p>

              <div className="flex items-center gap-3 ">
                {/* Donut via shadcn ChartContainer */}
                <ChartContainer config={statusChartConfig} className="h-[200px] w-[200px] flex-shrink-0">
                  <PieChart>
                    <ChartTooltip content={<ChartTooltipContent hideLabel nameKey="name" />} />
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
                      
                      
                    >
                    </Pie>
                  </PieChart>
                </ChartContainer>

                {/* Custom legend */}
                <div className="flex flex-col gap-2.5 flex-1 mr-5">
                  {statusPieData.map((s) => (
                    <div key={s.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-2 h-2 rounded-sm flex-shrink-0"
                          style={{ background: s.fill }}
                        />
                        <span className="text-[11px] text-gray-600 font-poppins">{s.name}</span>
                      </div>
                      <span className="text-[11px] font-semibold text-gray-800 font-poppins tabular-nums">
                        {s.value}
                      </span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-[10px] text-gray-400 font-poppins">
                      {Math.round(((statusCounts["Done"] ?? 0) / projects.length) * 100)}% completion rate
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress horizontal bar */}
            <div className="bg-white border border-gray-200 rounded-md p-4">
              <p className="text-[12px] font-semibold text-gray-700 font-inter">Progress distribution</p>
              <p className="text-[10px] text-gray-400 font-poppins mb-2">Completion % for active projects</p>
              <ChartContainer config={progressChartConfig} className="h-[200px] w-full">
                <BarChart
                  data={progressBarData}
                  layout="vertical"
                  margin={{ top: 0, right: 18, bottom: 0, left: 10 }}
                  barSize={9}
                >
                  <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    tick={{ fontSize: 9, fill: "#9ca3af" }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 9, fill: "#9ca3af" }}
                    tickLine={false}
                    axisLine={false}
                    width={72}
                  />
                  <ChartTooltip
                    cursor={{ fill: "#f9fafb" }}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Bar dataKey="progress" fill="oklch(78.9% 0.154 211.53)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ChartContainer>
            </div>
          </div>

          {/* ── Row 2: Gantt + Completion rate ──────────────────────────── */}
          <div className="grid grid-cols-2 gap-3 mx-1 mb-3">

            {/* Gantt */}
            <div className="bg-white border border-gray-200 rounded-md p-4">
              <p className="text-[12px] font-semibold text-gray-700 font-inter">Project timeline</p>
              <p className="text-[10px] text-gray-400 font-poppins mb-2">Start → estimated end · May 2026</p>

              {/* Gantt legend */}
              <div className="flex items-center gap-3 mb-2">
                {[
                  { label: "Done",        color: "bg-gray-800" },
                  { label: "In Progress", color: "bg-cyan-400"    },
                  { label: "To Do",       color: "bg-gray-300"   },
                ].map((l) => (
                  <div key={l.label} className="flex items-center gap-1">
                    <span className={`w-2 h-2 rounded-sm ${l.color}`} />
                    <span className="text-[9px] text-gray-400 font-poppins">{l.label}</span>
                  </div>
                ))}
              </div>

              {/* Day ruler */}
              <div className="flex ml-[132px] mb-1 pr-[56px]">
                {Array.from({ length: maxDay - minDay + 1 }, (_, i) => minDay + i).map((d) => (
                  <div key={d} className="flex-1 text-[8px] text-gray-300 font-poppins text-center tabular-nums">
                    {d}
                  </div>
                ))}
              </div>

              <div className="flex flex-col">
                {projects.map((p) => (
                  <GanttRow key={p.id} project={p} minDay={minDay} maxDay={maxDay} />
                ))}
              </div>
            </div>

            {/* Completion rate area chart */}
            <div className="bg-white border border-gray-200 rounded-md p-4">
              <p className="text-[12px] font-semibold text-gray-700 font-inter">Completion rate over time</p>
              <p className="text-[10px] text-gray-400 font-poppins mb-2">Projects completed per week</p>
              <ChartContainer config={completionChartConfig} className="h-[250px] w-full">
                <AreaChart data={completionData} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id="completionFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="hsl(262 70% 58%)" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="hsl(262 70% 58%)" stopOpacity={0}    />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
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
                  <ChartTooltip  content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="Completed"
                    stroke="oklch(27.8% 0.033 256.848)"
                    strokeWidth={2}
                    fill="url(#completionFill)"
                    dot={{ r: 3, fill: "oklch(78.9% 0.154 211.53)", strokeWidth: 0 }}
                    activeDot={{ r: 5, strokeWidth: 0 }}
                  />
                </AreaChart>
              </ChartContainer>
            </div>
          </div>
        </div>

        {/* ── Projects table container ─────────────────────────────────── */}
        <div className="bg-slate-50 w-[90%] max-w-[1050px] my-15 rounded-lg p-1 shadow mx-auto">

          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-inter text-gray-800 font-bold mt-3 mb-2 mx-2 flex items-center">
              Projects{" "}
              <img src={ArrowRight} alt="Arrow Right" className="invert-80 h-7 w-7" />
            </h1>
            <div className="w-fit p-1 rounded-md hover:bg-neutral-100 cursor-pointer mr-2 transition-all duration-200 ease-in-out">
              <img src={Dot} alt="Dot" className="" />
            </div>
          </div>

          {/* ── Projects table ───────────────────────────────────────────── */}
          <div
            className="border border-gray-200 rounded-md w-full bg-white overflow-x-auto scroll-smooth mx-1 [&::-webkit-scrollbar]:h-0.5 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:bg-gray-100"
            style={{ width: "calc(100% - 8px)" }}
          >
            <table className="w-full min-w-[1000px] border-collapse">
              <thead className="text-sm text-neutral-800 font-inter">
                <tr>
                  <th className="w-[110px] border-r border-b border-gray-200 text-left px-1 py-2">
                    <span className="flex items-center gap-1.5">
                      <Checkbox size="sm" />
                      <span className="ml-2">Id</span>
                    </span>
                  </th>
                  <th className="w-[120px] border-r border-b border-gray-200 text-center py-2">Project</th>
                  <th className="w-[100px] border-r border-b border-gray-200 text-center py-2">Status</th>
                  <th className="w-[200px] border-r border-b border-gray-200 text-center py-2">Progress</th>
                  <th className="w-[110px] border-r border-b border-gray-200 text-center py-2">Start Date</th>
                  <th className="w-[110px] border-b border-gray-200 text-center py-2">Est. End Date</th>
                </tr>
              </thead>
              <tbody className="text-[12px] text-gray-600 font-poppins">
                {projects.map((project, index) => (
                  <React.Fragment key={project.id}>
                    <tr
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleProjectAnalyticsNavigation(project.project,project.id)}
                    >
                      <td className="w-[110px] text-left px-1 py-2" onClick={(e) => e.stopPropagation()}>
                        <span className="flex items-center gap-1.5">
                          <Checkbox size="sm" />
                          <span>#PROJECT-{project.id}</span>
                        </span>
                      </td>
                      <td className="w-[120px] text-center px-2 py-2">{project.project}</td>
                      <td className="w-[100px] text-center py-2">
                        {project.status}
                      </td>
                      <td className="w-[200px] text-center py-2 px-3">
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-linear-to-r from-cyan-200 via-rose-200 to-fuchsia-400 h-1.5 rounded-full"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </td>
                      <td className="w-[110px] text-center py-2">{project.startDate}</td>
                      <td className="w-[110px] text-center py-2">{project.estEndDate}</td>
                    </tr>
                    {index !== projects.length - 1 && (
                      <tr key={`divider-${project.id}`}>
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

          {/* Pagination */}
          <div className="flex items-center justify-between my-3 mt-5 mx-2">
            <div className="text-[10px] text-gray-600 font-poppins">
              Showing 1 to {projects.length} of {projects.length} entries
            </div>
            <div className="flex items-center justify-center gap-2 mt-3 mr-2">
              <span className="text-[12px] font-poppins text-white bg-gray-800 p-2 rounded-lg cursor-pointer">Previous</span>
              <span className="text-[12px] font-semibold text-gray-600 font-poppins px-4 py-1 bg-white rounded border border-dotted border-gray-300">1</span>
              <span className="text-[12px] font-poppins text-white bg-gray-800 p-2 px-5 rounded-lg cursor-pointer">Next</span>
            </div>
          </div>

        </div>
      </div>
      {showCreateProjectModal && <ProjectCreateModal  onCancel={handleCloseModal}/>}
    </div>
  );
};

export default ProjectsPage;