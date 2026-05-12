import { createInertiaApp } from '@inertiajs/react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme, toggleAppearance } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import SettingsLayout from '@/layouts/settings/layout';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    layout: (name) => {
        switch (true) {
            case name === 'welcome':
                return null;
            case name.startsWith('auth/'):
                return AuthLayout;
            case name.startsWith('settings/'):
                return [AppLayout, SettingsLayout];
            default:
                return AppLayout;
        }
    },
    strictMode: true,
    withApp(app) {
        return (
            <TooltipProvider delayDuration={0}>
                {app}
                <Toaster />
            </TooltipProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();

if (typeof window !== 'undefined') {
    const onKeydown = (e: KeyboardEvent) => {
        if (e.key.toLowerCase() !== 'd') return;
        if (e.altKey || e.ctrlKey || e.metaKey) return;

        const target = e.target as HTMLElement | null;
        if (target) {
            const tag = target.tagName;
            const isEditable = (target as HTMLElement).isContentEditable;
            if (isEditable || tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
        }

        toggleAppearance();
    };

    window.addEventListener('keydown', onKeydown);
}
