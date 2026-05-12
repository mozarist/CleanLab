import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useAppearance } from '@/hooks/use-appearance';

export function ThemeToggle() {
    const { resolvedAppearance, updateAppearance } = useAppearance();

    const toggle = () => {
        updateAppearance(resolvedAppearance === 'dark' ? 'light' : 'dark');
    };

    const label = resolvedAppearance === 'dark' ? 'Switch to light' : 'Switch to dark';

    return (
        <Tooltip>
            <TooltipTrigger>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggle}
                    aria-label={label}
                    className="h-9 w-9"
                >
                    {resolvedAppearance === 'dark' ? (
                        <Sun className="!size-5 opacity-80" />
                    ) : (
                        <Moon className="!size-5 opacity-80" />
                    )}
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>{label}</p>
            </TooltipContent>
        </Tooltip>
    );
}

export default ThemeToggle;
