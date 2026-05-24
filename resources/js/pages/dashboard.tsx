import { Head } from '@inertiajs/react';
import { dashboard } from '@/routes';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

type Transaction = {
    id: number;
    invoice_code: string;
    quantity: number;
    total_price: number;
    payment_method: string | null;
    payment_status: string;
    status: string;
    created_at: string | null;
    customer: {
        id: number | null;
        user: {
            id: number | null;
            name: string | null;
        };
    };
    service: {
        id: number | null;
        service_name: string | null;
        unit: string | null;
    };
};

type DashboardProps = {
    summary: {
        totalTransactions: number;
        totalRevenue: number;
        pendingPayments: number;
        readyToSendLaundry: number;
    };
    recentTransactions: Transaction[];
    readyToSendLaundryTransactions: Transaction[];
};

const statusColors: { [key: string]: string } = {
    antrian: 'bg-yellow-100 text-yellow-800',
    dicuci: 'bg-blue-100 text-blue-800',
    disetrika: 'bg-purple-100 text-purple-800',
    siap_diambil: 'bg-green-100 text-green-800',
    diambil: 'bg-gray-100 text-gray-800',
};

const paymentStatusColors: { [key: string]: string } = {
    pending: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-green-100 text-green-800',
};

const currencyFormatter = new Intl.NumberFormat(undefined, {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
});

function formatCurrency(amount: number): string {
    return `Rp ${currencyFormatter.format(amount)}`;
}

function formatDateTime(value: string | null): string {
    if (!value) {
        return '-';
    }

    return new Intl.DateTimeFormat(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(value));
}

function formatStatus(value: string | null): string {
    if (!value) {
        return '-';
    }

    return value.replace(/_/g, ' ').replace(/\b\w/g, (character) => character.toUpperCase());
}

function SummaryCard({
    label,
    value,
    description,
}: {
    label: string;
    value: string;
    description: string;
}) {
    return (
        <Card>
            <CardHeader>
                <CardDescription>{label}</CardDescription>
                <CardTitle className="text-3xl font-semibold tabular-nums">
                    {value}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-xs text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    );
}

function TransactionTable({
    title,
    description,
    emptyState,
    transactions,
}: {
    title: string;
    description: string;
    emptyState: string;
    transactions: Transaction[];
}) {
    return (
        <Card className="overflow-hidden pb-0 h-fit">
            <CardHeader className="gap-0">
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                {transactions.length > 0 ? (
                    <Table className="rounded-none">
                        <TableHeader>
                            <TableRow>
                                <TableHead>Invoice</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Service</TableHead>
                                <TableHead>Qty</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Payment</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactions.map((transaction) => (
                                <TableRow key={transaction.id}>
                                    <TableCell className="font-medium">
                                        {transaction.invoice_code}
                                    </TableCell>
                                    <TableCell>
                                        {transaction.customer.user.name ?? '-'}
                                    </TableCell>
                                    <TableCell>
                                        {transaction.service.service_name ?? '-'}
                                    </TableCell>
                                    <TableCell>
                                        {transaction.quantity} {transaction.service.unit ?? ''}
                                    </TableCell>
                                    <TableCell>{formatCurrency(transaction.total_price)}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="secondary"
                                            className={paymentStatusColors[transaction.payment_status] || ''}
                                        >
                                            {formatStatus(transaction.payment_status)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={statusColors[transaction.status] || ''}>
                                            {formatStatus(transaction.status)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{formatDateTime(transaction.created_at)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center px-6 py-10 text-sm text-muted-foreground">
                        {emptyState}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default function Dashboard({
    summary,
    recentTransactions,
    readyToSendLaundryTransactions,
}: DashboardProps) {
    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h4 className="text-xl font-medium">Welcome back!</h4>
                    <p className="text-sm text-muted-foreground">
                        Here's an overview of your laundry business performance.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <SummaryCard
                        label="Total Transactions"
                        value={summary.totalTransactions.toLocaleString()}
                        description="All recorded laundry transactions"
                    />
                    <SummaryCard
                        label="Total Revenue"
                        value={formatCurrency(summary.totalRevenue)}
                        description="Revenue from paid transactions only"
                    />
                    <SummaryCard
                        label="Pending Payments"
                        value={summary.pendingPayments.toLocaleString()}
                        description="Laundries waiting for payment"
                    />
                    <SummaryCard
                        label="Ready to Send Laundry"
                        value={summary.readyToSendLaundry.toLocaleString()}
                        description="Done laundries to send"
                    />
                </div>

                <div className="grid gap-4 xl:grid-cols-2">
                    <TransactionTable
                        title="Recent Transactions"
                        description="The 5 latest transactions in the system."
                        emptyState="There are no recent transactions yet."
                        transactions={recentTransactions}
                    />
                    <TransactionTable
                        title="Ready to Send Laundry"
                        description="Laundries that are ready to send to customer"
                        emptyState="There is no laundry ready to send yet."
                        transactions={readyToSendLaundryTransactions}
                    />
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
