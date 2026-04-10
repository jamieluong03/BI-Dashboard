import { Info } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { ToolTipProps } from "@/types/dataTypes";

export function InfoTooltip({ display, comment }: ToolTipProps) {
    return (
        <>
            {display ?
                <TooltipProvider delayDuration={200}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Info className="h-3.5 w-3.5 text-slate-400 cursor-help hover:text-slate-600 transition-colors" />
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-[250px] text-[11px] leading-relaxed">
                            <p>{comment}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                : ""
            }
        </>
    );
}