import { useState } from "react";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import Plus from "../assets/plus.svg";
import { format } from "date-fns";
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

const TaskCreateModal = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [dueDate, setDueDate] = useState<Date | undefined>(new Date());
  const [startTime, setStartTime] = useState<Dayjs | null>(dayjs(new Date()));
  const onSubmit = (data) => console.log(data);

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
              {...register("subtask", {
                maxLength: {
                  value: 25,
                  message: "Subtask cannot exceed 25 characters",
                },
              })}
            />
            <button className="bg-cyan-400 text-white h-10 px-1 w-[100px] text-sm flex items-center justify-center cursor-pointer hover:bg-cyan-500 transition-all duration-250 ease-in-out rounded font-poppins font-semibold rounded-lg">
              <img
                src={Plus}
                alt="add subtask"
                className="invert-100 h-5 w-5"
              />
              <span>ADD</span>
            </button>
          </div>
          {errors.subtask && (
            <span className="text-red-500 text-sm">
              {errors.subtask.message as string}
            </span>
          )}
        </div>
        <div>

        </div>
        <div className="mt-10 flex items-center gap-4">
          <div className="w-1/2">
            <span className="text-lg font-inter font-semibold text-neutral-800 mb-2">
              Start Date
            </span>
            <Popover {...register("startDate", { required: "Start date is required" })}>
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
            <Popover {...register("dueDate", { required: "Due date is required" })}>
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

        {
          errors.startDate && (
            <div className="text-red-500 text-sm w-1/2">
              {errors.startDate.message as string}
            </div>
          )
        }
        {
          errors.dueDate && (
            <div className="text-red-500 text-sm w-1/2">
              {errors.dueDate.message as string}
            </div>
          )
        }
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
                    message: "Estimated duration must be at least 1 min."}
                })}
              />
              <Select   {...register("estimatedDurationUnit", { required: "Unit is required" })}>
                <SelectTrigger className="w-full col-span-3 text-neutral-600">
                  <SelectValue  placeholder="Unit" />
                </SelectTrigger>
                <SelectContent >
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
                <SelectValue  placeholder="Select a status" />
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
          {
            errors.estimatedDurationUnit && (
              <p className="text-red-500 text-sm mt-1">
                {errors.estimatedDurationUnit.message as string}
              </p>
            )
          }
          </div>
          <div className="w-1/2">

          {
            errors.status && (
              <p className="text-red-500 text-sm mt-1">
                {errors.status.message as string}
              </p>
            )
          }
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
            {
              errors.project && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.project.message as string}
                </p>
              )
            }
        </div>
        <div className="w-full flex items-center justify-end mt-10 gap-2">
          <Button variant="outline" className="px-2 py-4 m-0 text-neutral-800">
            Cancel
          </Button>
          <Button type="submit" className="mt-10 bg-cyan-400 hover:bg-cyan-500 px-2 py-4 transition-all duration-200 ease-in-out cursor-pointer text-white m-0">
            Create Task
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TaskCreateModal;
