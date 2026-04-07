"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { DateRange } from "react-day-picker";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { getRangePresets, lastOrderDate } from "@/lib/utils";

interface SelectDateProps {
  range: DateRange | undefined;
  onRangeChange: (range: DateRange | undefined) => void;
};

export function SelectDate({ range, onRangeChange }: SelectDateProps) {
  const [dateValue, setDateValue] = useState<string>("last_30");
  const [localRange, setLocalRange] = useState<DateRange | undefined>(range);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const currentMonth = new Date().getMonth();

  useEffect(() => {
    setLocalRange(range);
  }, [range]);

  const handleSelectChange = (value: string) => {
    setDateValue(value);
    if (value === "custom") {
        setTimeout(() => {
        setIsCalendarOpen(true);
        }, 100);
    } else {
      const preset = getRangePresets(value, lastOrderDate);
      const newRange = { from: new Date(preset.from), to: new Date(preset.to) };
      setLocalRange(newRange);
      onRangeChange(newRange);
      setIsCalendarOpen(false);
    }
  };

  const handleRangeChange = (newRange: DateRange | undefined, selectedDay: Date) => {
    if (range?.from && range?.to) {
        onRangeChange({ from: selectedDay, to: undefined });
        return;
    }

    onRangeChange(newRange);
    if (dateValue !== "custom") setDateValue("custom");

    if (newRange?.from && newRange?.to) {
        setTimeout(() => setIsCalendarOpen(false), 200);    }
};

  return (
    <div className="flex flex-col md:flex-row gap-3">
      <Select value={dateValue} onValueChange={handleSelectChange}>
        <SelectTrigger className="w-full md:w-[180px] bg-white">
          <SelectValue placeholder="Select a date" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Date</SelectLabel>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="last_7">Last Week</SelectItem>
            <SelectItem value="last_30">Last 30 Days</SelectItem>
            <SelectItem value="last_90">Last 90 Days</SelectItem>
            <SelectItem value="last_month">Last Month</SelectItem>
            <SelectItem value="last_year">Last Year</SelectItem>
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>Quarter</SelectLabel>
            <SelectItem value="q1">Q1 (Jan - Mar)</SelectItem>
            <SelectItem value="q2" disabled={currentMonth < 3}>Q2 (Apr - Jun)</SelectItem>
            <SelectItem value="q3" disabled={currentMonth < 6}>Q3 (Jul - Sep)</SelectItem>
            <SelectItem value="q4" disabled={currentMonth < 9}>Q4 (Oct - Dec)</SelectItem>
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>Custom</SelectLabel>
            <SelectItem value="custom">Custom Range</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <DateRangePicker 
        value={localRange}
        onValueChange={handleRangeChange}
        open={isCalendarOpen}
        onOpenChange={setIsCalendarOpen}
      />
    </div>
  );
}