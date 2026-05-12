import { useState } from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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

const ProjectCreateModal = ({ onCancel }: { onCancel: () => void }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [estEndDate, setEstEndDate] = useState<Date | undefined>(new Date());

  const onSubmit = (data: any) => console.log(data);

  return (
    <div className="fixed inset-0 bg-black/1 backdrop-blur-[1px] z-10">
    <div className="absolute z-10 top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-[420px] h-fit bg-white rounded-2xl border border-gray-200 shadow-lg p-6 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-cyan-100 [&::-webkit-scrollbar-track]:bg-gray-100/40">
      <form onSubmit={handleSubmit(onSubmit)}>

        {/* Project Name */}
        <div className="mt-5">
          <label
            htmlFor="project"
            className="text-lg font-inter font-semibold text-neutral-800"
          >
            Project
          </label>
          <Input
            type="text"
            id="project"
            placeholder="Enter the project name"
            className="text-sm p-2 h-10 text-neutral-600"
            {...register("project", {
              required: "Project name is required",
              maxLength: {
                value: 15,
                message: "Project name cannot exceed 15 characters",
              },
            })}
          />
          {errors.project && (
            <span className="text-red-500 text-sm">
              {errors.project.message as string}
            </span>
          )}
        </div>

        {/* Status */}
        <div className="mt-5">
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
          {errors.status && (
            <p className="text-red-500 text-sm mt-1">
              {errors.status.message as string}
            </p>
          )}
        </div>

        {/* Start Date & Est. End Date */}
        <div className="mt-5 flex items-start gap-4">
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
              Est. End Date
            </span>
            <Popover
              {...register("estEndDate", { required: "Est. end date is required" })}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  data-empty={!estEndDate}
                  className="w-[160px] justify-between text-left font-normal data-[empty=true]:text-muted-foreground text-neutral-600"
                >
                  {estEndDate ? (
                    format(estEndDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                  <ChevronDownIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={estEndDate}
                  onSelect={setEstEndDate}
                  defaultMonth={estEndDate}
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
          {errors.estEndDate && (
            <div className="text-red-500 text-sm w-1/2">
              {errors.estEndDate.message as string}
            </div>
          )}
        </div>

        {/* Footer buttons */}
        <div className="w-full flex items-center justify-end mt-10 gap-2">
          <Button
            variant="outline"
            onClick={onCancel}
            className="px-2 py-4 m-0 text-neutral-800"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="mt-10 bg-cyan-400 hover:bg-cyan-500 px-2 py-4 transition-all duration-200 ease-in-out cursor-pointer text-white m-0"
          >
            Create Project
          </Button>
        </div>
      </form>
    </div>
    </div>
  );
};

export default ProjectCreateModal;