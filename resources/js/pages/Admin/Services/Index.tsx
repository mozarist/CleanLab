import { Head, useForm } from '@inertiajs/react';
import { index } from '@/routes/customers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { CirclePlus } from 'lucide-react';
import { useState } from 'react';
import {
    Sheet,
    SheetTrigger,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';

export default function Index() {
    const [open, setOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        service_name: '',
        price: '',
        unit: '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post('/services', {
            onSuccess: () => {
                reset();
                setOpen(false);
            },
        });
    }

    return (
        <>
            <Head title="Services" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full items-center justify-between gap-4">
                    <h2 className="text-2xl font-semibold">Services</h2>

                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger asChild>
                            <Button>
                                <CirclePlus className="h-4 w-4" />
                                Add New Service
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="max-w-md">
                            <SheetHeader>
                                <SheetTitle>Add New Service</SheetTitle>
                            </SheetHeader>

                            <form
                                onSubmit={handleSubmit}
                                className="flex h-full w-full flex-col justify-between gap-4 p-4"
                            >
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="service_name">
                                            Service Name
                                        </Label>
                                        <Input
                                            id="service_name"
                                            value={data.service_name}
                                            onChange={(e) =>
                                                setData(
                                                    'service_name',
                                                    e.target.value,
                                                )
                                            }
                                            disabled={processing}
                                        />
                                        {errors.service_name && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.service_name}
                                            </p>
                                        )}
                                    </div>

                                    <div className="grid w-full grid-cols-2 gap-2">
                                        <div>
                                            <Label htmlFor="price">Price</Label>
                                            <Input
                                                id="price"
                                                type="number"
                                                step="500"
                                                min="0"
                                                value={data.price}
                                                onChange={(e) =>
                                                    setData(
                                                        'price',
                                                        e.target.value,
                                                    )
                                                }
                                                disabled={processing}
                                            />
                                            {errors.price && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errors.price}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <Label htmlFor="unit">Unit</Label>
                                            <Select
                                                value={data.unit}
                                                onValueChange={(val) =>
                                                    setData('unit', val)
                                                }
                                                disabled={processing}
                                            >
                                                <SelectTrigger id="unit" className='w-full'>
                                                    <SelectValue placeholder="Select unit" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="kg">
                                                        kg
                                                    </SelectItem>
                                                    <SelectItem value="pcs">
                                                        pcs
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {errors.unit && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errors.unit}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full">
                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={processing}
                                    >
                                        {processing ? 'Creating...' : 'Create'}
                                    </Button>
                                </div>
                            </form>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </>
    );
}

Index.layout = {
    breadcrumbs: [
        {
            title: 'Services',
            href: index(),
        },
    ],
};
