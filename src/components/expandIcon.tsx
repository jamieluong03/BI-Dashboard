import React from "react";
import { ToolTipProps } from '@/types/dataTypes';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { ArrowUpRightIcon } from "lucide-react";

export const ExpandButton = React.forwardRef<HTMLButtonElement, ToolTipProps>(({ display, comment, ...props }, ref) => {
    return (
        <>
            {display ?
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button 
                            ref={ref} 
                            {...props} 
                            size="icon-xs" 
                            aria-label="Submit" 
                            variant="outline"
                        >
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
});

ExpandButton.displayName = "ExpandButton";