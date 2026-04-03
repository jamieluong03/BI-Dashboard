import { ToolTipProps } from '@/types/dataTypes';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { ArrowUpRightIcon } from "lucide-react";

export function ExpandButton({ display, comment }: ToolTipProps) {

    return (
        <>
        {display ?
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button size="icon-xs" aria-label="Submit" variant="outline">
                        <ArrowUpRightIcon />
                    </Button>   
                </TooltipTrigger>
                <TooltipContent>
                    {comment ? comment : <p>Coming Soon: Enhanced analytics for this section.</p>}
                </TooltipContent>
            </Tooltip>
            :
            <Button size="icon-xs" aria-label="Submit" variant="outline">
                <ArrowUpRightIcon />
            </Button>   
         }
        </>
    )
}