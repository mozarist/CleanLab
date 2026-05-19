import * as React from 'react'
import { SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'

interface Props {
	form: any
	onSubmit: (e: React.FormEvent) => void
	title?: string
	submitLabel?: string
	cancelLabel?: string
	idPrefix?: string
}

export function ServiceSheet({ form, onSubmit, title = 'Service', submitLabel = 'Save', cancelLabel = 'Cancel', idPrefix = '' }: Props) {
	const prefix = idPrefix ? `${idPrefix}_` : ''

	return (
		<SheetContent side="right" className="max-w-md">
			<SheetHeader>
				<SheetTitle>{title}</SheetTitle>
			</SheetHeader>

			<form onSubmit={onSubmit} className="flex h-full w-full flex-col justify-between">
				<div className="space-y-4 px-6">
					<div className='space-y-2'>
						<Label htmlFor={`${prefix}service_name`}>Service Name</Label>
						<Input
							id={`${prefix}service_name`}
							placeholder='Insert service name'
							value={form.data.service_name}
							onChange={(e) => form.setData('service_name', e.target.value)}
							disabled={form.processing}
						/>
						{form.errors.service_name && <p className="mt-1 text-sm text-red-600">{form.errors.service_name}</p>}
					</div>

					<div className="grid w-full grid-cols-2 gap-2">
						<div className='space-y-2'>
							<Label htmlFor={`${prefix}price`}>Price</Label>
							<Input
								id={`${prefix}price`}
								placeholder='Insert service price'
								type="number"
								step="50"
								min="0"
								value={form.data.price}
								onChange={(e) => form.setData('price', e.target.value)}
								disabled={form.processing}
							/>
							{form.errors.price && <p className="mt-1 text-sm text-red-600">{form.errors.price}</p>}
						</div>

						<div className='space-y-2'>
							<Label htmlFor={`${prefix}unit`}>Unit</Label>
							<Select value={form.data.unit} onValueChange={(val) => form.setData('unit', val)} disabled={form.processing}>
								<SelectTrigger id={`${prefix}unit`} className="w-full">
									<SelectValue placeholder="Select unit" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="kg">kg</SelectItem>
									<SelectItem value="pcs">pcs</SelectItem>
								</SelectContent>
							</Select>
							{form.errors.unit && <p className="mt-1 text-sm text-red-600">{form.errors.unit}</p>}
						</div>
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

export default ServiceSheet
