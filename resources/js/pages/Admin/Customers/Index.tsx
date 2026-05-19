import { Head, router, useForm } from '@inertiajs/react';
import { UserRoundPlus, PenSquare, Trash2, Ellipsis } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
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
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetTrigger } from '@/components/ui/sheet';
import CustomerSheet from '@/components/ui/sheets/CustomerSheet';
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableCell,
    TableHead,
} from '@/components/ui/table';
import { index, store, update, destroy } from '@/routes/customers';

type Customer = {
    id: number;
    phone: string;
    address: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
};

type PaginatedCustomers = {
    data: Customer[];
    from: number | null;
};

type CustomerFormData = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    phone: string;
    address: string;
};

const initialFormData: CustomerFormData = {
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone: '',
    address: '',
};

export default function Index({
    customers,
}: {
    customers: PaginatedCustomers;
}) {
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState<'edit' | 'delete' | null>(
        null,
    );
    const [pendingCustomer, setPendingCustomer] = useState<Customer | null>(null);

    const createForm = useForm<CustomerFormData>(initialFormData);
    const editForm = useForm<CustomerFormData>(initialFormData);

    function handleCreateSubmit(e: React.FormEvent) {
        e.preventDefault();

        createForm.post(store.url(), {
            onSuccess: () => {
                toast.success('Customer successfully created.');
                createForm.reset();
                setOpen(false);
            },
            onError: () => {
                toast.error('Failed to create customer. Please check the form and try again.');
            },
        });
    }

    function openEdit(customer: Customer) {
        setEditingCustomer(customer);
        editForm.setData('name', customer.user.name);
        editForm.setData('email', customer.user.email);
        editForm.setData('password', '');
        editForm.setData('password_confirmation', '');
        editForm.setData('phone', customer.phone);
        editForm.setData('address', customer.address);
        setEditOpen(true);
    }

    function handleEditSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!editingCustomer) {
            return;
        }

        setPendingCustomer(editingCustomer);
        setConfirmAction('edit');
        setConfirmOpen(true);
    }

    function handleDeleteCustomer(customer: Customer) {
        router.delete(destroy.url(customer.id), {
            onSuccess: () => {
                toast.success('Customer successfully deleted.');
                setConfirmOpen(false);
                setPendingCustomer(null);
                setConfirmAction(null);
            },
            onError: () => {
                toast.error('Failed to delete customer. Please try again.');
            },
        });
    }

    function handleUpdateCustomer(customer: Customer) {
        editForm.put(update.url(customer.id), {
            onSuccess: () => {
                toast.success('Customer successfully edited.');
                setConfirmOpen(false);
                setPendingCustomer(null);
                setEditOpen(false);
                setEditingCustomer(null);
                setConfirmAction(null);
                editForm.reset('password', 'password_confirmation');
            },
            onError: () => {
                toast.error('Failed to edit customer. Please review the form and try again.');
            },
        });
    }

    return (
        <>
            <Head title="Customers" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full items-center justify-between gap-4">
                    <h2 className="text-2xl font-semibold">
                        <span className="text-primary">CleanLab</span> Customers
                    </h2>

                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger asChild>
                            <Button>
                                <UserRoundPlus className="h-4 w-4" />
                                Register Customer
                            </Button>
                        </SheetTrigger>

                        <CustomerSheet
                            form={createForm}
                            onSubmit={handleCreateSubmit}
                            title="Register Customer"
                            submitLabel="Register"
                            idPrefix="create"
                        />
                    </Sheet>
                </div>

                <div className="w-full">
                    {customers?.data?.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>No.</TableHead>
                                    <TableHead>Customer Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead>Address</TableHead>
                                    <TableHead className="text-right" />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {customers.data.map((customer, index) => (
                                    <TableRow key={customer.id}>
                                        <TableCell>
                                            {(customers.from ?? 1) + index}
                                        </TableCell>
                                        <TableCell>
                                            {customer.user?.name ?? '-'}
                                        </TableCell>
                                        <TableCell>
                                            {customer.user?.email ?? '-'}
                                        </TableCell>
                                        <TableCell>{customer.phone}</TableCell>
                                        <TableCell>{customer.address}</TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                    >
                                                        <Ellipsis className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            openEdit(customer)
                                                        }
                                                    >
                                                        <PenSquare className="h-4 w-4" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        variant="destructive"
                                                        onClick={() => {
                                                            setPendingCustomer(
                                                                customer,
                                                            );
                                                            setConfirmAction(
                                                                'delete',
                                                            );
                                                            setConfirmOpen(true);
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
                        <Card className="items-center justify-center gap-2 bg-muted/40 py-12">
                            <UserRoundPlus className="h-12 w-12 text-muted-foreground/75" />
                            <div>
                                <p className="text-center text-lg font-medium">
                                    There are no customers registered yet.
                                </p>
                                <p className="text-center text-sm text-muted-foreground">
                                    Register your first customer using the Register
                                    Customer button.
                                </p>
                            </div>
                        </Card>
                    )}
                </div>

                <Sheet open={editOpen} onOpenChange={setEditOpen}>
                    <CustomerSheet
                        form={editForm}
                        onSubmit={handleEditSubmit}
                        title="Edit Customer"
                        submitLabel="Save"
                        idPrefix="edit"
                        isEdit
                    />
                </Sheet>

                <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                {confirmAction === 'delete'
                                    ? 'Delete customer'
                                    : 'Confirm changes'}
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                {confirmAction === 'delete'
                                    ? 'Are you sure you want to delete this customer account? This action cannot be undone.'
                                    : 'Are you sure you want to save changes to this customer?'}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => {
                                    if (
                                        confirmAction === 'delete' &&
                                        pendingCustomer
                                    ) {
                                        handleDeleteCustomer(pendingCustomer);
                                    }

                                    if (confirmAction === 'edit' && pendingCustomer) {
                                        handleUpdateCustomer(pendingCustomer);
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
            title: 'Customers',
            href: index(),
        },
    ],
};
