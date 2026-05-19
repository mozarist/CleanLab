import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

interface CustomerFormData {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    phone: string;
    address: string;
}

interface CustomerSheetProps {
    form: {
        data: CustomerFormData;
        setData: (key: keyof CustomerFormData, value: string) => void;
        processing: boolean;
        errors: Partial<Record<keyof CustomerFormData, string>>;
    };
    onSubmit: (e: React.FormEvent) => void;
    title?: string;
    submitLabel?: string;
    idPrefix?: string;
    isEdit?: boolean;
}

export function CustomerSheet({
    form,
    onSubmit,
    title = 'Customer',
    submitLabel = 'Save',
    idPrefix = '',
    isEdit = false,
}: CustomerSheetProps) {
    const prefix = idPrefix ? `${idPrefix}_` : '';

    return (
        <SheetContent side="right" className="max-w-md">
            <SheetHeader>
                <SheetTitle>{title}</SheetTitle>
            </SheetHeader>

            <form
                onSubmit={onSubmit}
                className="flex h-full w-full flex-col justify-between gap-6 p-6"
            >
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor={`${prefix}name`}>Full Name</Label>
                        <Input
                            id={`${prefix}name`}
                            value={form.data.name}
                            onChange={(e) => form.setData('name', e.target.value)}
                            disabled={form.processing}
                        />
                        {form.errors.name && (
                            <p className="mt-1 text-sm text-red-600">
                                {form.errors.name}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor={`${prefix}email`}>Email</Label>
                        <Input
                            id={`${prefix}email`}
                            type="email"
                            value={form.data.email}
                            onChange={(e) => form.setData('email', e.target.value)}
                            disabled={form.processing}
                        />
                        {form.errors.email && (
                            <p className="mt-1 text-sm text-red-600">
                                {form.errors.email}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                            <Label htmlFor={`${prefix}password`}>
                                {isEdit ? 'New Password' : 'Password'}
                            </Label>
                            <Input
                                id={`${prefix}password`}
                                type="password"
                                value={form.data.password}
                                onChange={(e) =>
                                    form.setData('password', e.target.value)
                                }
                                disabled={form.processing}
                                placeholder={
                                    isEdit ? 'Leave blank to keep current' : ''
                                }
                            />
                            {form.errors.password && (
                                <p className="mt-1 text-sm text-red-600">
                                    {form.errors.password}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor={`${prefix}password_confirmation`}>
                                Confirm Password
                            </Label>
                            <Input
                                id={`${prefix}password_confirmation`}
                                type="password"
                                value={form.data.password_confirmation}
                                onChange={(e) =>
                                    form.setData(
                                        'password_confirmation',
                                        e.target.value,
                                    )
                                }
                                disabled={form.processing}
                            />
                            {form.errors.password_confirmation && (
                                <p className="mt-1 text-sm text-red-600">
                                    {form.errors.password_confirmation}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor={`${prefix}phone`}>Phone</Label>
                        <Input
                            id={`${prefix}phone`}
                            value={form.data.phone}
                            onChange={(e) => form.setData('phone', e.target.value)}
                            disabled={form.processing}
                        />
                        {form.errors.phone && (
                            <p className="mt-1 text-sm text-red-600">
                                {form.errors.phone}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor={`${prefix}address`}>Address</Label>
                        <Input
                            id={`${prefix}address`}
                            value={form.data.address}
                            onChange={(e) => form.setData('address', e.target.value)}
                            disabled={form.processing}
                        />
                        {form.errors.address && (
                            <p className="mt-1 text-sm text-red-600">
                                {form.errors.address}
                            </p>
                        )}
                    </div>
                </div>

                <Button type="submit" className="w-full" disabled={form.processing}>
                    {form.processing ? `${submitLabel}...` : submitLabel}
                </Button>
            </form>
        </SheetContent>
    );
}

export default CustomerSheet;