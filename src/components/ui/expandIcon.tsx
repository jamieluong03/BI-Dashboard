import { IconProps, ToolTipProps } from '@/types/dataTypes';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

type ExpandIconProps = IconProps & ToolTipProps;

export function ExpandIcon({ icon: Icon, iconColor, display, comment }: ExpandIconProps) {

    if (!Icon) return null;

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <div className="">
                    <Icon className={`aspect-square w-3 ${iconColor ?? ''}"}`} />
                </div>
            </TooltipTrigger>
            <TooltipContent>
                {display ? comment : <p>Coming Soon: Enhanced analytics for this section.</p>}
            </TooltipContent>
        </Tooltip>
    )
}