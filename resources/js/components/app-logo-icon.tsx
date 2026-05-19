import { WashingMachine } from 'lucide-react';
import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/utils';

export default function AppLogoIcon({
    className,
    ...props
}: ComponentPropsWithoutRef<typeof WashingMachine>) {
    return <WashingMachine className={cn('size-10', className)} {...props} />;
}
