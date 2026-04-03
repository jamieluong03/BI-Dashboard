import { IconProps } from '@/types/dataTypes';

export function ExpandIcon({ icon: Icon, iconColor }: IconProps) {

    if (!Icon) return null;

    return (
        <div className="">
              <Icon className={`aspect-square w-3 ${iconColor ?? ''}"}`} />
          </div>
    )
}