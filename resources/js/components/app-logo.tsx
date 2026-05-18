import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    return (
        <div className="flex items-center gap-1">
            <div className="flex aspect-square size-8 items-center justify-center text-sidebar-primary">
                <AppLogoIcon />
            </div>
            <div className="grid flex-1 text-left text-base">
                <span className="truncate leading-tight font-semibold">
                    CleanLab
                </span>
            </div>
        </div>
    );
}
