import AppLogoIcon from '@/components/app-logo-icon';
import { WashingMachine } from 'lucide-react';

export default function AppLogo() {
    return (
        <div className="flex items-center">
            <div className="flex aspect-square size-10 items-center justify-center text-sidebar-primary">
                <WashingMachine className='size-10' />
            </div>
            <div className="grid flex-1 text-left text-lg">
                <span className="truncate leading-tight font-semibold">
                    <span className="text-primary">Clean</span>Lab
                </span>
            </div>
        </div>
    );
}
