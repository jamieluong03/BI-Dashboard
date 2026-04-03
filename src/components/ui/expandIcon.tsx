import { IconProps } from '@/types/dataTypes';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"

export function ExpandIcon({ icon: Icon, iconColor }: IconProps) {

    if (!Icon) return null;

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <div className="">
                    <Icon className={`aspect-square w-3 ${iconColor ?? ''}"}`} />
                </div>
            </TooltipTrigger>
            <TooltipContent>
                <p>Coming Soon: Enhanced analytics for this section.</p>
            </TooltipContent>
        </Tooltip>
    )
}