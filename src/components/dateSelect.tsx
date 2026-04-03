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
import { getRangePresets } from "@/lib/utils";

interface SelectDateProps {
  range: DateRange | undefined;
  onRangeChange: (range: DateRange | undefined) => void;
};

export function SelectDate({ range, onRangeChange }: SelectDateProps) {
  const [dateValue, setDateValue] = useState<string>("last_30");
  const [localRange, setLocalRange] = useState<DateRange | undefined>(range);
  

  useEffect(() => {
    setLocalRange(range);
  }, [range]);

  const handleSelectChange = (value: string) => {
    setDateValue(value);
    if (value !== "custom") {
      const preset = getRangePresets(value);
      const newRange = { from: new Date(preset.from), to: new Date(preset.to) };
      setLocalRange(newRange);
      onRangeChange(newRange);
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
        onRangeChange(newRange);
    }
};

  return (
    <div className="flex flex-col md:flex-row gap-3">
      <Select value={dateValue} onValueChange={handleSelectChange}>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Select a date" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Presets</SelectLabel>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="last_7">Last Week</SelectItem>
            <SelectItem value="last_30">Last 30 Days</SelectItem>
            <SelectItem value="last_90">Last 90 Days</SelectItem>
            <SelectItem value="last_month">Last Month</SelectItem>
            <SelectItem value="last_year">Last Year</SelectItem>
            <SelectItem value="custom">Custom Range</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <DateRangePicker 
        value={localRange}
        onValueChange={handleRangeChange} 
      />
    </div>
  );
}