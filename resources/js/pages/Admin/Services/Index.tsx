import { Head, useForm } from '@inertiajs/react';
import { index } from '@/routes/customers';
import { Button } from '@/components/ui/button';
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
import { CirclePlus, PenSquare, Trash2, Ellipsis, PlusCircle } from 'lucide-react';
import ServiceSheet from '@/components/ui/sheets/ServiceSheet';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { Sheet, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

export default function Index({ services }: { services: any }) {
    const [open, setOpen] = useState(false);

    const createForm = useForm({
        service_name: '',
        price: '',
        unit: '',
    });

    const editForm = useForm({
        service_name: '',
        price: '',
        unit: '',
    });

    const [editingService, setEditingService] = useState<any | null>(null);
    const [editOpen, setEditOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState<
        'edit' | 'delete' | null
    >(null);
    const [pendingService, setPendingService] = useState<any | null>(null);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        createForm.post('/services', {
            onSuccess: () => {
                createForm.reset();
                setOpen(false);
            },
        });
    }

    function openEdit(service: any) {
        setEditingService(service);
        editForm.setData('service_name', service.service_name);
        editForm.setData('price', service.price);
        editForm.setData('unit', service.unit);
        setEditOpen(true);
    }

    function handleEditSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!editingService) return;
        setPendingService(editingService);
        setConfirmAction('edit');
        setConfirmOpen(true);
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

                        <ServiceSheet
                            form={createForm}
                            onSubmit={handleSubmit}
                            title="Add New Service"
                            submitLabel="Create"
                            idPrefix="create"
                        />
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
                                    <TableHead className="text-right" />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {services.data.map((service: any) => (
                                    <TableRow key={service.id}>
                                        <TableCell>
                                            {service.service_name}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="secondary"
                                                className="uppercase"
                                            >
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
                                                    <Button
                                                        variant="ghost"
                                                        className="p-0"
                                                    >
                                                        <Ellipsis className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            openEdit(service)
                                                        }
                                                    >
                                                        <PenSquare className="h-4 w-4" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        variant="destructive"
                                                        onClick={() => {
                                                            setPendingService(
                                                                service,
                                                            );
                                                            setConfirmAction(
                                                                'delete',
                                                            );
                                                            setConfirmOpen(
                                                                true,
                                                            );
                                                        }}
                                                    >
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
                        <Card className="gap-2 items-center justify-center bg-muted/50 py-12">
                            <PlusCircle className="h-12 w-12 text-muted-foreground/75" />
                            <div>
                                <p className="text-center text-lg font-medium">
                                    There are no services yet.
                                </p>
                                <p className="text-center text-sm text-muted-foreground">
                                    Add your first service using the Add New
                                    Service button.
                                </p>
                            </div>
                        </Card>
                    )}
                </div>

                <Sheet open={editOpen} onOpenChange={setEditOpen}>
                    <ServiceSheet
                        form={editForm}
                        onSubmit={handleEditSubmit}
                        title="Edit Service"
                        submitLabel="Save"
                        idPrefix="edit"
                    />
                </Sheet>
                {/* Confirmation dialog for edit/delete */}
                <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                {confirmAction === 'delete'
                                    ? 'Delete service'
                                    : 'Confirm changes'}
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                {confirmAction === 'delete'
                                    ? 'Are you sure you want to delete this service? This action cannot be undone.'
                                    : 'Are you sure you want to save changes to this service?'}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => {
                                    // perform action
                                    if (
                                        confirmAction === 'delete' &&
                                        pendingService
                                    ) {
                                        router.delete(
                                            `/services/${pendingService.id}`,
                                            {
                                                onSuccess: () => {
                                                    setConfirmOpen(false);
                                                    setPendingService(null);
                                                },
                                            },
                                        );
                                    }
                                    if (
                                        confirmAction === 'edit' &&
                                        pendingService
                                    ) {
                                        editForm.put(
                                            `/services/${pendingService.id}`,
                                            {
                                                onSuccess: () => {
                                                    setConfirmOpen(false);
                                                    setPendingService(null);
                                                    setEditOpen(false);
                                                    setEditingService(null);
                                                },
                                            },
                                        );
                                    }
                                }}
                            >
                                Confirm
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
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
