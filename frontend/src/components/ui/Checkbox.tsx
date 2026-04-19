import { useState, useCallback, forwardRef, useId } from "react";

const CheckIcon = ({ size }:{size: number}) => (
  <svg
    width={size * 0.6}
    height={size * 0.5}
    viewBox="0 0 12 9"
    fill="none"
    aria-hidden="true"
  >
    <polyline
      points="1,4.5 4,7.5 11,1"
      stroke="white"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const DashIcon = ({ size }: { size: number }) => (
  <svg
    width={size * 0.55}
    height={2}
    viewBox="0 0 10 2"
    fill="none"
    aria-hidden="true"
  >
    <line
      x1="1"
      y1="1"
      x2="9"
      y2="1"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const SIZE_MAP = {
  xs: { px: 12, label: "text-[11px]", radius: "rounded-[3px]", gap: "gap-1.5" },
  sm: { px: 16, label: "text-xs", radius: "rounded-[3px]", gap: "gap-2" },
  md: { px: 20, label: "text-[13px]", radius: "rounded", gap: "gap-2" },
  lg: { px: 24, label: "text-sm", radius: "rounded-[5px]", gap: "gap-2.5" },
  xl: { px: 30, label: "text-[15px]", radius: "rounded-[6px]", gap: "gap-3" },
};

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "onChange"> {
  checked?: boolean;
  defaultChecked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  label?: React.ReactNode;
  description?: React.ReactNode;
  onChange?: (checked: boolean, event: React.ChangeEvent<HTMLInputElement>) => void;
  labelClassName?: string;
}

const Checkbox = forwardRef(function Checkbox(
  {
    checked: controlledChecked,
    defaultChecked = false,
    indeterminate = false,
    disabled = false,
    size = "md",
    label,
    description,
    onChange,
    className = "",
    labelClassName = "",
    id: externalId,
    ...rest
  }: CheckboxProps,
  ref: React.Ref<HTMLInputElement>,
) {
  const autoId = useId();
  const id = externalId || autoId;

  const isControlled = controlledChecked !== undefined;
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const checked = isControlled ? controlledChecked : internalChecked;

  const { px, label: labelSize, radius, gap } = SIZE_MAP[size] || SIZE_MAP.md;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;
      const next = e.target.checked;
      if (!isControlled) setInternalChecked(next);
      onChange?.(next, e);
    },
    [disabled, isControlled, onChange],
  );

  const boxActive = indeterminate || checked;

  return (
    <label
      htmlFor={id}
      className={[
        "inline-flex items-start cursor-pointer select-none",
        gap,
        disabled
          ? "opacity-40 cursor-not-allowed pointer-events-none"
          : "group",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <input
        ref={ref}
        id={id}
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        className="sr-only"
        aria-checked={indeterminate ? "mixed" : checked}
        {...rest}
      />

      <span
        className={[
          "shrink-0 flex items-center justify-center mt-[1px]",
          "border transition-all duration-150",
          radius,
          "group-focus-within:ring-2 group-focus-within:ring-slate-300 group-focus-within:ring-offset-1",
          boxActive
            ? "bg-slate-800 border-slate-800"
            : "bg-white border-slate-300 group-hover:border-slate-500",
        ]
          .filter(Boolean)
          .join(" ")}
        style={{ width: px, height: px, minWidth: px }}
        aria-hidden="true"
      >
        <span
          className="flex items-center justify-center transition-all duration-140"
          style={{
            opacity: boxActive ? 1 : 0,
            transform: boxActive ? "scale(1)" : "scale(0.55)",
          }}
        >
          {indeterminate ? <DashIcon size={px} /> : <CheckIcon size={px} />}
        </span>
      </span>

      {(label || description) && (
        <span className="flex flex-col leading-snug">
          {label && (
            <span
              className={[
                "text-slate-800 font-normal leading-tight",
                labelSize,
                labelClassName,
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {label}
            </span>
          )}
          {description && (
            <span className="text-slate-500 text-[11px] mt-0.5 leading-tight">
              {description}
            </span>
          )}
        </span>
      )}
    </label>
  );
});

export default Checkbox;
