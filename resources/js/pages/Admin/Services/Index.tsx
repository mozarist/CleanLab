import { Head } from '@inertiajs/react';
import { index } from '@/routes/customers';
import { Button } from '@/components/ui/button';
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
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        // TODO: replace with Inertia post to create service
        console.log('create service', { name, description });
    }

    return (
        <>
            <Head title="Services" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full items-center justify-between gap-4">
                    <h2 className="text-2xl font-semibold">Services</h2>

                    <Sheet>
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
                                        <label className="block text-sm font-medium text-neutral-700">
                                            Service Name
                                        </label>
                                        <input
                                            value={name}
                                            onChange={(e) =>
                                                setName(e.target.value)
                                            }
                                            className="mt-1 block w-full rounded-md border px-3 py-2"
                                        />
                                    </div>
                                    <div className="grid w-full grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-neutral-700">
                                                Price
                                            </label>
                                            <input
                                                value={name}
                                                onChange={(e) =>
                                                    setName(e.target.value)
                                                }
                                                className="mt-1 block w-full rounded-md border px-3 py-2"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-neutral-700">
                                                Unit
                                            </label>
                                            <input
                                                value={name}
                                                onChange={(e) =>
                                                    setName(e.target.value)
                                                }
                                                className="mt-1 block w-full rounded-md border px-3 py-2"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full">
                                    <Button type="submit" className="w-full">
                                        Create
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
