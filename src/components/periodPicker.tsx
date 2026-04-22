import { useMemo } from "react";
import { ViewType } from "@/types/dataTypes";
import { format, subQuarters, startOfQuarter, subMonths, startOfYear, subYears, startOfMonth } from "date-fns";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { lastOrderDate } from "@/lib/utils";

export function PeriodPicker({ view, value, onChange }: { view: ViewType, value: Date, onChange: (d: Date) => void }) {
    const options = useMemo(() => {
        const pickerMap = {
            month: () => Array.from({ length: 12 }).map((_, i) => ({ label: format(subMonths(lastOrderDate, i), "MMM yyyy"), val: subMonths(startOfMonth(lastOrderDate), i).toISOString() })),
            quarter: () => Array.from({ length: 8 }).map((_, i) => { const d = subQuarters(startOfQuarter(lastOrderDate), i); return { label: `Q${Math.floor(d.getMonth() / 3) + 1} ${d.getFullYear()}`, val: d.toISOString() }; }),
            year: () => Array.from({ length: 4 }).map((_, i) => { const d = subYears(startOfYear(lastOrderDate), i); return { label: d.getFullYear().toString(), val: d.toISOString() }; })
        };
        return pickerMap[view]();
    }, [view]);

    return (
        <Select value={value.toISOString()} onValueChange={(v) => onChange(new Date(v))}>
            <SelectTrigger className="h-9 w-[150px] text-xs font-bold bg-white border-slate-200">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {options.map((opt) => (
                    <SelectItem key={opt.val} value={opt.val} className="text-xs">{opt.label}</SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

export function MonthSelect({ value, onChange }: { value: Date, onChange: (d: Date) => void }) {
    const months = Array.from({ length: 12 }).map((_, i) => subMonths(startOfMonth(lastOrderDate), i));
    return (
        <Select value={value.toISOString()} onValueChange={(v) => onChange(new Date(v))}>
            <SelectTrigger className="h-8 w-[130px] text-xs font-semibold bg-white">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {months.map((m) => (
                    <SelectItem key={m.toISOString()} value={m.toISOString()}>{format(m, "MMM yyyy")}</SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

export function QuarterSelect({ value, onChange }: { value: Date, onChange: (d: Date) => void }) {
    return (
        <Select value={value.toISOString()} onValueChange={(v) => onChange(new Date(v))}>
            <SelectTrigger className="h-8 w-[110px] text-xs font-semibold bg-white">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value={startOfQuarter(new Date(2026, 0, 1)).toISOString()}>Q1 2026</SelectItem>
                <SelectItem value={startOfQuarter(new Date(2025, 9, 1)).toISOString()}>Q4 2025</SelectItem>
                <SelectItem value={startOfQuarter(new Date(2025, 6, 1)).toISOString()}>Q3 2025</SelectItem>
            </SelectContent>
        </Select>
    );
};

export function MonthIndexSelect({ value, onChange }: { value: number, onChange: (v: number) => void }) {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return (
        <Select value={value.toString()} onValueChange={(v) => onChange(parseInt(v))}>
            <SelectTrigger className="h-8 w-[80px] text-xs font-semibold bg-white">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {monthNames.map((name, i) => (
                    <SelectItem key={name} value={i.toString()}>{name}</SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

export function YearSelect({ value, onChange }: { value: number, onChange: (v: number) => void }) {
    return (
        <Select value={value.toString()} onValueChange={(v) => onChange(parseInt(v))}>
            <SelectTrigger className="h-8 w-[80px] text-xs font-semibold bg-white">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="2026">2026</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
            </SelectContent>
        </Select>
    );
};