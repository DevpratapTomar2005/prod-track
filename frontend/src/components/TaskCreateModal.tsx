import { useState } from "react";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import Plus from "../assets/plus.svg";
import { format, set } from "date-fns";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticTimePicker } from "@mui/x-date-pickers/StaticTimePicker";
import { ThemeProvider } from "@mui/material/styles";
import { timePickerTheme } from "../lib/theme.ts";
import dayjs, { Dayjs } from "dayjs";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import Checkbox from "./ui/Checkbox.tsx";

const TaskCreateModal = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [dueDate, setDueDate] = useState<Date | undefined>(new Date());
  const [startTime, setStartTime] = useState<Dayjs | null>(dayjs(new Date()));
  const [subtaskInput, setSubtaskInput] = useState("");
  const [subtasks, setSubtasks] = useState<Array<{ id: number; name: string }>>([
    {
      id:1111,
      name: "Work on frontend",
    },
    {
      id:2222,
      name: "Work on backend",
    },
  ]);
  const onSubmit = (data) => console.log(data);

  

  const addSubtask = (e,name: string) => {
   e.preventDefault();
    if (name === "") return;
    setSubtasks((prev) => [...prev, { id: Math.floor(Math.random() * 9000) + 1000, name: name }]);
   
  };

  return (
    <div className="p-4 w-full min-h-screen border-l border-gray-200">
      <form action="" onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-5">
          <label
            htmlFor="task"
            className="text-lg font-inter font-semibold text-neutral-800 "
          >
            Your Task
          </label>
          <Input
            type="text"
            id="task"
            placeholder="Enter the task"
            className="text-sm p-2 h-10 text-neutral-600"
            {...register("task", {
              required: "Task is required",
              maxLength: {
                value: 34,
                message: "Task cannot exceed 34 characters",
              },
            })}
          />
          {errors.task && (
            <span className="text-red-500 text-sm">
              {errors.task.message as string}
            </span>
          )}
        </div>
        <div className="mt-5">
          <div className="flex items-center  gap-1">
            <Input
              type="text"
              id="subtask"
              placeholder="Enter the subtask"
              className="text-sm p-2 h-10 text-neutral-600"
              onChange={(e)=>setSubtaskInput(e.target.value)}
             
            />
            <button onClick={(e)=>addSubtask(e,subtaskInput)} className="bg-cyan-400 text-white h-10 px-1 w-[100px] text-sm flex items-center justify-center cursor-pointer hover:bg-cyan-500 transition-all duration-250 ease-in-out rounded font-poppins font-semibold rounded-lg">
              <img
                src={Plus}
                alt="add subtask"
                className="invert-100 h-5 w-5"
              />
              <span>ADD</span>
            </button>
          </div>
        </div>
        {
        subtasks.length > 0 &&
        <div className="w-full border rounded-lg mt-5">
          <table className="w-full">
            <div className="text-[13px] text-neutral-800 font-inter my-1">
              <thead>
                <th className="w-[85px] border-r text-left px-1 flex items-center">
                  <Checkbox size="xs" />
                  <span className="ml-2">Id</span>
                </th>
                <th className="text-center w-[270px]">Subtask</th>
              </thead>
            </div>
            <div className="h-px bg-gray-200 w-full"></div>
            <div className="text-[10px] text-gray-600 font-poppins my-2">
              <tbody className="text-[10px] text-gray-600 font-poppins">
                {subtasks.map((item, index) => (
                  <>
                    <tr key={item.id} >
                      <td className="w-[85px] px-1 text-left">
                        <Checkbox size="xs" />
                        <span className="ml-1">#SUB-{item.id}</span>
                      </td>
                      <td className="w-[270px] px-2 text-center">
                        {item.name}
                      </td>
                    </tr>

                    {index !== subtasks.length - 1 && (
                      <tr>
                        <td colSpan={2}>
                          <div className="h-px w-full bg-gray-200 my-1" />
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </div>
          </table>
        </div>
        }
        <div className="mt-10 flex items-center gap-4">
          <div className="w-1/2">
            <span className="text-lg font-inter font-semibold text-neutral-800 mb-2">
              Start Date
            </span>
            <Popover
              {...register("startDate", { required: "Start date is required" })}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  data-empty={!startDate}
                  className="w-[160px] justify-between text-left font-normal data-[empty=true]:text-muted-foreground text-neutral-600"
                >
                  {startDate ? (
                    format(startDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                  <ChevronDownIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  defaultMonth={startDate}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="w-1/2">
            <span className="text-lg font-inter font-semibold text-neutral-800 mb-2">
              Due Date
            </span>
            <Popover
              {...register("dueDate", { required: "Due date is required" })}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  data-empty={!dueDate}
                  className="w-[160px] justify-between text-left font-normal data-[empty=true]:text-muted-foreground text-neutral-600"
                >
                  {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                  <ChevronDownIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  defaultMonth={dueDate}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="flex items-center gap-5">
          {errors.startDate && (
            <div className="text-red-500 text-sm w-1/2">
              {errors.startDate.message as string}
            </div>
          )}
          {errors.dueDate && (
            <div className="text-red-500 text-sm w-1/2">
              {errors.dueDate.message as string}
            </div>
          )}
        </div>
        <div className="mt-10">
          <div className="text-lg font-inter font-semibold text-neutral-800 mb-2">
            Start Time
          </div>
          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            localeText={{ timePickerToolbarTitle: "" }}
          >
            <ThemeProvider theme={timePickerTheme}>
              <StaticTimePicker
                value={startTime}
                onChange={setStartTime}
                slotProps={{
                  actionBar: { actions: [] },
                }}
              />
            </ThemeProvider>
          </LocalizationProvider>
        </div>
        <div className="mt-10 flex items-center gap-4">
          <div className="w-1/2">
            <span className="text-lg font-inter font-semibold text-neutral-800 mb-2">
              Est. Duration
            </span>
            <div className="grid grid-cols-5 gap-1">
              <Input
                type="number"
                placeholder="Enter estimated duration"
                defaultValue={1}
                id="estimatedDuration"
                className="col-span-2 text-neutral-600"
                {...register("estimatedDuration", {
                  required: "Estimated duration is required",
                  min: {
                    value: 1,
                    message: "Estimated duration must be at least 1 min.",
                  },
                })}
              />
              <Select
                {...register("estimatedDurationUnit", {
                  required: "Unit is required",
                })}
              >
                <SelectTrigger className="w-full col-span-3 text-neutral-600">
                  <SelectValue placeholder="Unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Unit</SelectLabel>
                    <SelectItem value="minutes">minutes</SelectItem>
                    <SelectItem value="hours">hours</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="w-1/2">
            <span className="text-lg font-inter font-semibold text-neutral-800 mb-2">
              Status
            </span>
            <Select {...register("status", { required: "Status is required" })}>
              <SelectTrigger className="w-full max-w-48 text-neutral-600">
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Status</SelectLabel>
                  <SelectItem value="todo">Todo</SelectItem>
                  <SelectItem value="in progress">In Progress</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center justify-between gap-5">
          <div className="w-1/2">
            {errors.estimatedDuration && (
              <p className="text-red-500 text-sm mt-1">
                {errors.estimatedDuration.message as string}
              </p>
            )}
            {errors.estimatedDurationUnit && (
              <p className="text-red-500 text-sm mt-1">
                {errors.estimatedDurationUnit.message as string}
              </p>
            )}
          </div>
          <div className="w-1/2">
            {errors.status && (
              <p className="text-red-500 text-sm mt-1">
                {errors.status.message as string}
              </p>
            )}
          </div>
        </div>
        <div className="mt-5">
          <span className="text-lg font-inter font-semibold text-neutral-800 mb-2">
            Project
          </span>
          <Select {...register("project", { required: "Project is required" })}>
            <SelectTrigger className="w-full max-w-48 text-neutral-600">
              <SelectValue placeholder="Select a project" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Projects</SelectLabel>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="ecommerce">E-Commerce</SelectItem>
                <SelectItem value="crm">CRM</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.project && (
            <p className="text-red-500 text-sm mt-1">
              {errors.project.message as string}
            </p>
          )}
        </div>
        <div className="w-full flex items-center justify-end mt-10 gap-2">
          <Button variant="outline" className="px-2 py-4 m-0 text-neutral-800">
            Cancel
          </Button>
          <Button
            type="submit"
            className="mt-10 bg-cyan-400 hover:bg-cyan-500 px-2 py-4 transition-all duration-200 ease-in-out cursor-pointer text-white m-0"
          >
            Create Task
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TaskCreateModal;
