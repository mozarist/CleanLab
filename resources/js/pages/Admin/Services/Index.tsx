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
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableCell,
    TableHead,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { CirclePlus, PenSquare, Trash2 } from 'lucide-react';
import { Ellipsis } from 'lucide-react';
import { useState } from 'react';
import {
    Sheet,
    SheetTrigger,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';

export default function Index({ services }: { services: any }) {
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
                                                step="50"
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

                {/* Services table */}
                <div className="w-full">
                    {services && services.data && services.data.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Service Name</TableHead>
                                    <TableHead>Unit</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead className='text-right'></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {services.data.map((service: any) => (
                                    <TableRow key={service.id}>
                                        <TableCell>{service.service_name}</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className='uppercase'>
                                                {service.unit}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            Rp {''}
                                            {new Intl.NumberFormat(undefined, {
                                                style: 'decimal',
                                                minimumFractionDigits: 0,
                                                maximumFractionDigits: 2,
                                            }).format(service.price)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="p-0">
                                                        <Ellipsis className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align='end'>
                                                    <DropdownMenuItem>
                                                        <PenSquare className="h-4 w-4" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem variant='destructive'>
                                                        <Trash2 className="h-4 w-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12">
                            <p className="text-sm text-muted-foreground">There are no services yet.</p>
                            <p className="mt-2 text-sm text-muted-foreground">Add your first service using the Add New Service button.</p>
                        </div>
                    )}
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
