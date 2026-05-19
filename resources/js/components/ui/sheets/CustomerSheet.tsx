import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Textarea } from '../textarea';

interface CustomerFormData {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    phone: string;
    address: string;
}

interface CustomerSheetProps {
    form: any;
    onSubmit: (e: React.FormEvent) => void;
    title?: string;
    submitLabel?: string;
    cancelLabel?: string;
    idPrefix?: string;
    isEdit?: boolean;
}

export function CustomerSheet({
    form,
    onSubmit,
    title = 'Customer',
    submitLabel = 'Save',
    cancelLabel = 'Cancel',
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
                className="flex h-full w-full flex-col overflow-hidden"
            >
                <div className="flex-1 overflow-y-auto space-y-4 px-6 scrollbar-none">
                    <div className="space-y-2">
                        <Label htmlFor={`${prefix}name`}>Full Name</Label>
                        <Input
                            id={`${prefix}name`}
                            placeholder='Customer name'
                            value={form.data.name}
                            onChange={(e) => form.setData('name', e.target.value)}
                            disabled={form.processing}
                            aria-invalid={!!form.errors.name}
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
                            placeholder='Customer email'
                            value={form.data.email}
                            onChange={(e) => form.setData('email', e.target.value)}
                            disabled={form.processing}
                            aria-invalid={!!form.errors.email}
                        />
                        {form.errors.email && (
                            <p className="mt-1 text-sm text-red-600">
                                {form.errors.email}
                            </p>
                        )}
                    </div>

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
                                    isEdit ? 'Leave blank to keep the current password' : '••••••••'
                                }
                                aria-invalid={!!form.errors.password}
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
                                placeholder='••••••••'
                                value={form.data.password_confirmation}
                                onChange={(e) =>
                                    form.setData(
                                        'password_confirmation',
                                        e.target.value,
                                    )
                                }
                                disabled={form.processing}
                                aria-invalid={!!form.errors.password_confirmation}
                            />
                            {form.errors.password_confirmation && (
                                <p className="mt-1 text-sm text-red-600">
                                    {form.errors.password_confirmation}
                                </p>
                            )}
                        </div>

                    <div className="space-y-2">
                        <Label htmlFor={`${prefix}phone`}>Phone Number  </Label>
                        <Input
                            id={`${prefix}phone`}
                            placeholder='+62 8XX XXXX XXXX'
                            value={form.data.phone}
                            onChange={(e) => form.setData('phone', e.target.value)}
                            disabled={form.processing}
                            aria-invalid={!!form.errors.phone}
                        />
                        {form.errors.phone && (
                            <p className="mt-1 text-sm text-red-600">
                                {form.errors.phone}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor={`${prefix}address`}>Address</Label>
                        <Textarea
                            id={`${prefix}address`}
                            placeholder='Type customer address here..'
                            value={form.data.address}
                            onChange={(e) => form.setData('address', e.target.value)}
                            disabled={form.processing}
                            aria-invalid={!!form.errors.address}
                        />
                        {form.errors.address && (
                            <p className="mt-1 text-sm text-red-600">
                                {form.errors.address}
                            </p>
                        )}
                    </div>
                </div>

                <SheetFooter>
                    <Button type="submit" className="w-full" disabled={form.processing}>
                        {form.processing ? `${submitLabel}...` : submitLabel}
                    </Button>

                    <SheetClose asChild>
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                            onClick={() => form.reset()}
                            disabled={form.processing}
                        >
                            {form.processing ? `${cancelLabel}...` : cancelLabel}
                        </Button>
                    </SheetClose>
                </SheetFooter>
            </form>
        </SheetContent>
    );
}

export default CustomerSheet;