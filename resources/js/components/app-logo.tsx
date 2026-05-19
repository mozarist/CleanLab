import AppLogoIcon from '@/components/app-logo-icon';
import { cn } from '@/lib/utils';

type AppLogoProps = {
    className?: string;
};

export default function AppLogo({ className }: AppLogoProps) {
    return (
        <div className={cn('flex items-center gap-2', className)}>
            <div className="flex aspect-square items-center justify-center text-sidebar-primary">
                <AppLogoIcon className="size-6" />
            </div>
            <div className="grid flex-1 text-left text-lg group-data-[collapsible=icon]:hidden">
                <span className="truncate text-primary leading-tight font-semibold group-data-[collapsible=icon]:hidden">
                    CleanLab
                </span>
            </div>
        </div>
    );
}
