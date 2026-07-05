import React, { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import type {
  EventClickArg,
  DateSelectArg,
  EventInput,
} from "@fullcalendar/core";
import { useDispatch, useSelector } from "react-redux";
import { resetGlobalModalState } from "../slices/globalModalStateSlice.ts";
import { format } from "date-fns";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Plus from "../assets/plus.svg";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end?: string;
  color?: string;
  extendedProps?: {
    description?: string;
    project?: string;
    status?: string;
  };
}

// ─── Event Detail Modal ───────────────────────────────────────────────────────

const EventDetailModal = ({
  event,
  onClose,
  onDelete,
}: {
  event: CalendarEvent;
  onClose: () => void;
  onDelete: (id: string) => void;
}) => {
  const statusColor: Record<string, string> = {
    "In Progress": "bg-cyan-100 text-cyan-700",
    "To Do": "bg-gray-100 text-gray-600",
    Done: "bg-green-100 text-green-700",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/1 backdrop-blur-[1px]">
      <div className="bg-white rounded-xl shadow-lg w-[360px] p-5 font-inter border border-gray-200">
        <div className="flex items-start justify-between mb-3">
          <div
            className="w-3 h-3 rounded-full mt-1 flex-shrink-0"
            style={{ backgroundColor: event.color ?? "#6366f1" }}
          />
          <h2 className="text-[14px] font-semibold text-gray-800 flex-1 ml-2 leading-snug">
            {event.title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none font-inter ml-2"
          >
            ×
          </button>
        </div>

        <div className="text-[11px] text-gray-500 font-poppins space-y-1 mb-4">
          <p>
            <span className="font-medium text-gray-600">Start:</span>{" "}
            {new Date(event.start).toLocaleString("en-IN", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
          {event.end && (
            <p>
              <span className="font-medium text-gray-600">End:</span>{" "}
              {new Date(event.end).toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
          )}
          {event.extendedProps?.project && (
            <p>
              <span className="font-medium text-gray-600">Project:</span>{" "}
              {event.extendedProps.project}
            </p>
          )}
          {event.extendedProps?.status && (
            <span
              className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                statusColor[event.extendedProps.status] ??
                "bg-gray-100 text-gray-500"
              }`}
            >
              {event.extendedProps.status}
            </span>
          )}
          {event.extendedProps?.description && (
            <p className="mt-1 text-gray-400 italic">
              {event.extendedProps.description}
            </p>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => {
              onDelete(event.id);
              onClose();
            }}
            className="text-[11px] font-poppins text-red-500 hover:text-red-700 border border-red-200 rounded-md px-3 py-1.5 transition-colors"
          >
            Delete
          </button>
          <button
            onClick={onClose}
            className="ml-auto text-[11px] font-poppins text-white bg-gray-800 rounded-md px-4 py-1.5 hover:bg-gray-700 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Mock project data (replace fetchProjects with your real API call) ────────

interface Project {
  id: number;
  name: string;
  color: string;
}

const MOCK_PROJECTS: Project[] = [
  { id: 1, name: "Project Alpha", color: "#6366f1" },
  { id: 2, name: "Project Beta", color: "#10b981" },
  { id: 3, name: "Brand Refresh", color: "#f59e0b" },
  { id: 4, name: "Mobile App v2", color: "#ef4444" },
  { id: 5, name: "Data Pipeline", color: "#06b6d4" },
  { id: 6, name: "Design System", color: "#8b5cf6" },
  { id: 7, name: "Marketing Q3", color: "#f59e0b" },
  { id: 8, name: "Infrastructure Upgrade", color: "#6366f1" },
];

async function fetchProjects(query: string): Promise<Project[]> {
  // Replace with your real API: const res = await fetch(`/api/projects?q=${encodeURIComponent(query)}`); return res.json();
  await new Promise((r) => setTimeout(r, 400));
  const q = query.toLowerCase().trim();
  return q === ""
    ? MOCK_PROJECTS
    : MOCK_PROJECTS.filter((p) => p.name.toLowerCase().includes(q));
}

// ─── Project Combobox ─────────────────────────────────────────────────────────

const ProjectCombobox = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Project[]>([]);
  const [noResults, setNoResults] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const runSearch = async (q: string) => {
    setLoading(true);
    setNoResults(false);
    const data = await fetchProjects(q);
    setResults(data);
    setNoResults(data.length === 0);
    setLoading(false);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    onChange(q);
    setOpen(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setLoading(true);
    debounceRef.current = setTimeout(() => runSearch(q), 400);
  };

  const handleFocus = () => {
    setOpen(true);
    runSearch(value);
  };

  const handleSelect = (name: string) => {
    onChange(name);
    setOpen(false);
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={handleInput}
          onFocus={handleFocus}
          placeholder="Search project…"
          autoComplete="off"
          className="mt-1 w-full border border-gray-200 rounded-lg px-2 py-1.5 pr-7 text-[11px] font-poppins text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
        />
        <svg
          className="pointer-events-none absolute right-2 top-[calc(50%+2px)] -translate-y-1/2 text-gray-400"
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
        >
          <path
            d="M3 4.5L6 7.5L9 4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {open && (
        <div className="absolute top-[calc(100%+2px)] left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden max-h-44 overflow-y-auto">
          {loading ? (
            <div className="flex items-center gap-2 px-3 py-2.5 text-[11px] font-poppins text-gray-400">
              <svg
                className="animate-spin"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="#e5e7eb"
                  strokeWidth="3"
                />
                <path
                  d="M12 2a10 10 0 0 1 10 10"
                  stroke="#6b7280"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
              Searching…
            </div>
          ) : noResults ? (
            <div className="px-3 py-2.5 text-[11px] font-poppins text-gray-400">
              No projects found
            </div>
          ) : (
            results.map((p) => (
              <button
                key={p.id}
                type="button"
                onMouseDown={() => handleSelect(p.name)}
                className="w-full flex items-center gap-2 px-3 py-2 text-[11px] font-poppins text-gray-600 hover:bg-gray-100 transition-colors text-left"
              >
                {p.name}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

// ─── Status Select ────────────────────────────────────────────────────────────

const STATUS_OPTIONS = [
  { value: "To Do", color: "#f59e0b" },
  { value: "In Progress", color: "#6366f1" },
  { value: "Done", color: "#10b981" },
];

const StatusSelect = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="mt-1 w-full flex items-center justify-between gap-2 border border-gray-200 rounded-lg px-2 py-1.5 text-[11px] font-poppins text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-gray-300"
      >
        <span className="flex items-center gap-1.5">{value}</span>
        <svg
          className={`text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
        >
          <path
            d="M3 4.5L6 7.5L9 4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute top-[calc(100%+2px)] left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onMouseDown={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-3 py-2 text-[11px] font-poppins text-left transition-colors hover:bg-gray-100 ${
                value === opt.value
                  ? "text-gray-800 font-medium"
                  : "text-gray-600"
              }`}
            >
              {opt.value}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Calendar Date Picker (same as TaskCreateModal) ──────────────────────────

const CalendarDatePicker = ({
  value,
  onChange,
}: {
  value: Date | undefined;
  onChange: (d: Date | undefined) => void;
}) => (
  <Popover>
    <PopoverTrigger asChild>
      <Button
        type="button"
        variant="outline"
        data-empty={!value}
        className="mt-1 w-full justify-between text-left font-normal text-[11px] font-poppins text-gray-600 border-gray-200 rounded-lg px-2 py-1.5 h-auto data-[empty=true]:text-gray-400"
      >
        {value ? format(value, "MMM d, yyyy") : <span>Pick a date</span>}
        <ChevronDownIcon className="w-3 h-3 text-gray-400" />
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-auto p-0 z-[60]" align="start">
      <Calendar
        mode="single"
        selected={value}
        onSelect={onChange}
        defaultMonth={value}
      />
    </PopoverContent>
  </Popover>
);

// ─── Time Select ──────────────────────────────────────────────────────────────

const TIME_OPTIONS: string[] = [];
for (let h = 0; h < 24; h++) {
  for (const m of ["00", "30"]) {
    const ampm = h < 12 ? "AM" : "PM";
    const displayH = h % 12 === 0 ? 12 : h % 12;
    TIME_OPTIONS.push(`${String(displayH).padStart(2, "0")}:${m} ${ampm}`);
  }
}

function timeToISO(date: Date | undefined, time: string): string {
  const base = date ?? new Date();
  const [hm, ampm] = time.split(" ");
  const [hStr, mStr] = hm.split(":");
  let h = parseInt(hStr);
  if (ampm === "PM" && h !== 12) h += 12;
  if (ampm === "AM" && h === 12) h = 0;
  return `${format(base, "yyyy-MM-dd")}T${String(h).padStart(2, "0")}:${mStr}`;
}

function isoToTimeParts(iso: string): { date: Date; time: string } {
  const d = iso ? new Date(iso) : new Date();
  const h24 = d.getHours();

  const mStr = String(d.getMinutes()).padStart(2, "0");
  const snappedMin =
    parseInt(mStr) < 15 ? "00" : parseInt(mStr) < 45 ? "30" : "00";
  const snappedH = parseInt(mStr) >= 45 ? (h24 + 1) % 24 : h24;
  const snappedAmpm = snappedH < 12 ? "AM" : "PM";
  const snappedDisplayH = snappedH % 12 === 0 ? 12 : snappedH % 12;
  return {
    date: d,
    time: `${String(snappedDisplayH).padStart(2, "0")}:${snappedMin} ${snappedAmpm}`,
  };
}

const TimeSelect = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Auto-scroll selected option into view when dropdown opens
  const listRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (open && listRef.current) {
      const selected = listRef.current.querySelector(
        "[data-selected='true']",
      ) as HTMLElement;
      if (selected) selected.scrollIntoView({ block: "center" });
    }
  }, [open]);

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="mt-1 w-full flex items-center justify-between gap-2 border border-gray-200 rounded-lg px-2 py-1.5 text-[11px] font-poppins text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-gray-300"
      >
        <span>{value}</span>
        <ChevronDownIcon
          className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          ref={listRef}
          className="absolute top-[calc(100%+4px)] left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-[60] overflow-y-auto max-h-40 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-cyan-100 [&::-webkit-scrollbar-track]:bg-gray-100/40"
        >
          {TIME_OPTIONS.map((t) => (
            <button
              key={t}
              type="button"
              data-selected={value === t}
              onMouseDown={() => {
                onChange(t);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-1.5 text-[11px] font-poppins transition-colors ${
                value === t
                  ? "bg-gray-800 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Create Event Modal ───────────────────────────────────────────────────────

const CreateEventModal = ({
  defaultStart,
  onClose,
  onCreate,
}: {
  defaultStart: string;
  onClose: () => void;
  onCreate: (event: CalendarEvent) => void;
}) => {
  const initialParts = isoToTimeParts(defaultStart);
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(
    initialParts.date,
  );
  const [startTime, setStartTime] = useState(initialParts.time);
  const [endDate, setEndDate] = useState<Date | undefined>(initialParts.date);
  const [endTime, setEndTime] = useState(initialParts.time);
  const [project, setProject] = useState("");
  const [status, setStatus] = useState("To Do");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#6366f1");

  const colorOptions = [
    { value: "#6f72ff", label: "Indigo" },
    { value: "#0dc9e9", label: "Cyan" },
    { value: "#00cb88", label: "Green" },
    { value: "#ffaa1a", label: "Amber" },
    { value: "#fb4848", label: "Red" },
    { value: "#9371e1", label: "Purple" },
  ];

  const handleSubmit = () => {
    if (!title.trim()) return;
    onCreate({
      id: Date.now().toString(),
      title: title.trim(),
      start: timeToISO(startDate, startTime),
      end: timeToISO(endDate, endTime),
      color,
      extendedProps: { project, status, description },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/1 backdrop-blur-[1px]">
      <div className="bg-white rounded-xl shadow-lg w-[400px] p-5 font-inter border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[14px] font-semibold text-gray-800">New Event</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none font-inter"
          >
            ×
          </button>
        </div>

        <div className="space-y-3">
          {/* Title */}
          <div>
            <label className="text-[11px] font-inter font-semibold text-gray-800">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Event title"
              className="mt-1 w-full border border-gray-200 rounded-md px-3 py-1.5 text-[12px] font-poppins text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>

          {/* Start date + time */}
          <div>
            <label className="text-[11px] font-medium text-gray-800 font-poppins">
              Start
            </label>
            <div className="grid grid-cols-2 gap-2">
              <CalendarDatePicker value={startDate} onChange={setStartDate} />
              <TimeSelect value={startTime} onChange={setStartTime} />
            </div>
          </div>

          {/* End date + time */}
          <div>
            <label className="text-[11px] font-medium text-gray-800 font-poppins">
              End
            </label>
            <div className="grid grid-cols-2 gap-2">
              <CalendarDatePicker value={endDate} onChange={setEndDate} />
              <TimeSelect value={endTime} onChange={setEndTime} />
            </div>
          </div>

          {/* Project + Status */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-medium text-gray-800 font-poppins">
                Project
              </label>
              <ProjectCombobox value={project} onChange={setProject} />
            </div>
            <div>
              <label className="text-[11px] font-medium text-gray-800 font-poppins">
                Status
              </label>
              <StatusSelect value={status} onChange={setStatus} />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-[11px] font-medium text-gray-800 font-poppins">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Optional note..."
              className="mt-1 w-full border border-gray-200 rounded-md px-3 py-1.5 text-[11px] font-poppins text-gray-600 resize-none focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>

          {/* Color */}
          <div>
            <label className="text-[11px] font-medium text-gray-800 font-poppins mb-1.5 block">
              Color
            </label>
            <div className="flex gap-2">
              {colorOptions.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setColor(c.value)}
                  className={`w-5 h-5 rounded-full transition-transform ${color === c.value ? "ring-2 ring-offset-1 ring-gray-400 scale-110" : ""}`}
                  style={{ backgroundColor: c.value }}
                  title={c.label}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-5">
          <Button
            variant="outline"
            onClick={onClose}
            className="px-2 py-2 m-0 text-neutral-800 text-[13px] font-poppins"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!title.trim()}
            className="ml-auto text-[12px] text-white bg-cyan-400 px-2 py-2 hover:bg-cyan-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer font-poppins font-md"
          >
            Create Event
          </Button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const EventCalendarPage = () => {
  const calendarRef = useRef<FullCalendar>(null);
  const dispatch = useDispatch();
  const globalModalState = useSelector((state: any) => state.globalModalState);

  const [currentViewTitle, setCurrentViewTitle] = useState("");
  const [activeView, setActiveView] = useState("dayGridMonth");
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null,
  );
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createModalStart, setCreateModalStart] = useState("");

  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: "e1",
      title: "Sprint Planning",
      start: "2026-06-22T10:00:00",
      end: "2026-06-22T11:30:00",
      color: "#6f72ff",
      extendedProps: {
        project: "Project Alpha",
        status: "To Do",
        description: "Q3 sprint kickoff",
      },
    },
    {
      id: "e2",
      title: "UI Review – Fintech Dashboard",
      start: "2026-06-24T14:00:00",
      end: "2026-06-24T15:00:00",
      color: "#0dc9e9",
      extendedProps: { project: "Fintech Dashboard", status: "In Progress" },
    },
    {
      id: "e3",
      title: "Client Demo",
      start: "2026-06-25T09:00:00",
      end: "2026-06-25T10:00:00",
      color: "#00cb88",
      extendedProps: { project: "Nexis Quiz App", status: "To Do" },
    },
    {
      id: "e4",
      title: "AI Chatbot Standup",
      start: "2026-06-23T09:30:00",
      end: "2026-06-23T09:50:00",
      color: "#9371e1",
      extendedProps: { project: "AI Chatbot", status: "In Progress" },
    },
    {
      id: "e5",
      title: "Portfolio Launch",
      start: "2026-06-27T10:00:00",
      end: "2026-06-27T11:00:00",
      color: "#ffaa1a",
      extendedProps: { project: "Portfolio Website", status: "Done" },
    },
    {
      id: "e6",
      title: "E-commerce Kickoff",
      start: "2026-06-30T11:00:00",
      end: "2026-06-30T12:00:00",
      color: "#fb4848",
      extendedProps: { project: "E-commerce Website", status: "To Do" },
    },
  ]);

  // Sync global modal state (e.g. from sidebar "Create Event" button)
  useEffect(() => {
    if (globalModalState.type === "createEvent" && globalModalState.isOpen) {
      setCreateModalStart(new Date().toISOString());
      setShowCreateModal(true);
      dispatch(resetGlobalModalState());
    }
  }, [globalModalState]);

  // Update the title whenever the calendar view changes
  const handleDatesSet = (info: { view: { title: string } }) => {
    setCurrentViewTitle(info.view.title);
  };

  const navigate = (action: "prev" | "next" | "today") => {
    const api = calendarRef.current?.getApi();
    if (!api) return;
    if (action === "prev") api.prev();
    if (action === "next") api.next();
    if (action === "today") api.today();
  };

  const switchView = (view: string) => {
    calendarRef.current?.getApi().changeView(view);
    setActiveView(view);
  };

  const handleEventClick = (info: EventClickArg) => {
    const ev = info.event;
    setSelectedEvent({
      id: ev.id,
      title: ev.title,
      start: ev.startStr,
      end: ev.endStr || undefined,
      color: ev.backgroundColor,
      extendedProps: ev.extendedProps as CalendarEvent["extendedProps"],
    });
  };

  const handleDateSelect = (info: DateSelectArg) => {
    setCreateModalStart(info.startStr);
    setShowCreateModal(true);
    calendarRef.current?.getApi().unselect();
  };

  const handleCreateEvent = (event: CalendarEvent) => {
    setEvents((prev) => [...prev, event]);
  };

  const handleDeleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  const viewButtons = [
    { key: "dayGridMonth", label: "Month" },
    { key: "timeGridWeek", label: "Week" },
    { key: "timeGridDay", label: "Day" },
    { key: "listWeek", label: "List" },
  ];

  return (
    <div className="w-full h-screen overflow-y-hidden bg-white [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-cyan-100 [&::-webkit-scrollbar-track]:bg-gray-100/40  transition-width duration-20 ease-in-out">
      {/* ── Page header ──────────────────────────────────────────────── */}
      <div className="w-full mx-auto mb-4">
        {/* ── Calendar card ──────────────────────────────────────────── */}
        <div className="bg-white h-screen">
          {/* Toolbar */}
          <div className="flex items-center justify-between flex-wrap gap-3 h-[66px] p-4 ">
            {/* Navigation */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate("prev")}
                className="w-7 h-7 flex items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 text-sm transition-colors"
              >
                ‹
              </button>
              <button
                onClick={() => navigate("today")}
                className="text-[11px] font-poppins text-white bg-gray-800 rounded-md px-3 py-1 hover:bg-gray-700 transition-colors"
              >
                Today
              </button>
              <button
                onClick={() => navigate("next")}
                className="w-7 h-7 flex items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 text-sm transition-colors"
              >
                ›
              </button>
              <span className="text-[13px] font-inter font-semibold text-gray-700 ml-1">
                {currentViewTitle}
              </span>
            </div>

            {/* View switcher + Add */}
            <div className="flex items-center gap-2">
              <div className="flex rounded-md overflow-hidden border border-gray-200 bg-white">
                {viewButtons.map((v) => (
                  <button
                    key={v.key}
                    onClick={() => switchView(v.key)}
                    className={`text-[11px] font-poppins px-3 py-1.5 transition-colors ${
                      activeView === v.key
                        ? "bg-gray-800 text-white"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
              <button
                onClick={() => {
                  setCreateModalStart(new Date().toISOString());
                  setShowCreateModal(true);
                }}
                className="text-[11px] font-poppins text-white bg-gray-800 rounded-md px-4 py-1.5 hover:bg-gray-700 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span className="text-[15px] leading-none">
                  <img src={Plus} alt="Plus" className="h-3.4 w-3 invert-100" />
                </span>{" "}
                Add Event
              </button>
            </div>
          </div>

          {/* FullCalendar */}
          <div className="h-[calc(100%-66px)]">
            <style>{`
              .fc { font-family: 'Poppins', sans-serif; font-size: 12px; }
              .fc-toolbar { display: none !important; }
              .fc-col-header-cell { background: #f8fafc; border-color: #e5e7eb !important; }
              .fc-col-header-cell-cushion { color: #6b7280; font-size: 11px; font-weight: 500; padding: 6px 0; text-decoration: none !important; }
              .fc-daygrid-day-number { color: #374151; font-size: 11px; text-decoration: none !important; }
              .fc-day-today { background: #f0f9ff !important; }
              .fc-day-today .fc-daygrid-day-number { color: #0891b2; font-weight: 700; }
              .fc-event { border-radius: 5px !important; border: 1px solid inherit !important; font-size: 9.5px !important; padding: 1px 4px !important; cursor: pointer; }
              .fc-event-title { font-weight: 500; }
              .fc-timegrid-slot { height: 36px !important; }
              .fc-timegrid-slot-label { font-size: 10px; color: #9ca3af; }
              .fc-list-event:hover td { background: #f8fafc !important; cursor: pointer; }
              .fc-list-day-cushion { background: #f1f5f9 !important; color: #374151 !important; font-size: 11px; }
              .fc-list-event-title a { text-decoration: none; color: #374151; }
              .fc-list-event-dot { border-color: currentColor !important; }
              td.fc-daygrid-day, th { border-color: #e5e7eb !important; }

              /* ── Hide scrollbar ONLY on the column header row ── */
              .fc-scrollgrid-section-header .fc-scroller {
                scrollbar-width: none !important;
                -ms-overflow-style: none !important;
              }
              .fc-scrollgrid-section-header .fc-scroller::-webkit-scrollbar {
                display: none !important;
                width: 0 !important;
              }

              /* ── Custom cyan scrollbar on all-day row + time-body ── */
              .fc-scrollgrid-section-body .fc-scroller {
                scrollbar-width: thin !important;
                scrollbar-color: #cffafe rgba(243,244,246,0.4) !important;
              }
              .fc-scrollgrid-section-body .fc-scroller::-webkit-scrollbar {
                width: 4px !important;
              }
              .fc-scrollgrid-section-body .fc-scroller::-webkit-scrollbar-thumb {
                background-color: #cffafe !important;
                border-radius: 9999px !important;
              }
              .fc-scrollgrid-section-body .fc-scroller::-webkit-scrollbar-track {
                background-color: rgba(243,244,246,0.4) !important;
              }
            `}</style>
            <FullCalendar
              ref={calendarRef}
              plugins={[
                dayGridPlugin,
                timeGridPlugin,
                interactionPlugin,
                listPlugin,
              ]}
              initialView="dayGridMonth"
              headerToolbar={false}
              selectable
              selectMirror
              dayMaxEvents={3}
              events={events as EventInput[]}
              select={handleDateSelect}
              eventClick={handleEventClick}
              datesSet={handleDatesSet}
              height="100%"
              expandRows={true}
              allDaySlot={false}
              nowIndicator
              eventDisplay="block"
            />
          </div>
        </div>
      </div>

      {/* ── Modals ─────────────────────────────────────────────────── */}
      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onDelete={handleDeleteEvent}
        />
      )}
      {showCreateModal && (
        <CreateEventModal
          defaultStart={createModalStart}
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateEvent}
        />
      )}
    </div>
  );
};

export default EventCalendarPage;
