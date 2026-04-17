import * as React from "react"
import { DayPicker } from "react-day-picker"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  style,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={`p-3 ${className || ''}`}
      style={{
        color: 'var(--color-foreground)',
        ...style,
      }}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button:
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "rounded-md w-8 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
        day: "h-8 w-8 p-0 font-normal aria-selected:opacity-100 rounded-md inline-flex items-center justify-center text-sm transition-colors",
        day_range_end: "day-range-end",
        day_selected: "",
        day_today: "",
        day_outside: "day-outside opacity-50 aria-selected:opacity-30",
        day_disabled: "opacity-50",
        day_range_middle: "",
        day_hidden: "invisible",
        ...classNames,
      }}
      modifiersStyles={{
        selected: {
          backgroundColor: 'var(--color-primary)',
          color: 'var(--color-primary-foreground)',
        },
        today: {
          backgroundColor: 'var(--color-accent)',
          color: 'var(--color-accent-foreground)',
        },
        outside: {
          color: 'var(--color-muted-foreground)',
        },
        disabled: {
          color: 'var(--color-muted-foreground)',
        },
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
