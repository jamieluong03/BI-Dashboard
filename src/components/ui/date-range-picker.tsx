"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateRangePickerProps {
  className?: string;
  value?: DateRange;
  onValueChange?: (range: DateRange | undefined, selectedDay: Date) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function DateRangePicker({
  className,
  value,
  onValueChange,
  open,
  onOpenChange
}: DateRangePickerProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={open} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !value && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value?.from ? (
              value.to ? (
                <>
                  {format(value.from, "LLL dd, y")} -{" "}
                  {format(value.to, "LLL dd, y")}
                </>
              ) : (
                format(value.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start"
          onPointerDownOutside={(e) => {
            const target = e.target as HTMLElement;
            if (target?.closest('[role="combobox"]')) {
              e.preventDefault();
            }
          }}
        >
          <Calendar
            mode="range"
            selected={value}
            onSelect={(range, selectedDay) => onValueChange?.(range, selectedDay)}
            numberOfMonths={2}
            defaultMonth={value?.from}
            autoFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}