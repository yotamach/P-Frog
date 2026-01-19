import React from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Calendar } from "@components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

export const FormTextField = <T extends FieldValues>({name, control, rules = {}, label, type = 'text'}: FormTextFieldProps<T>) => {
	return (<Controller
		name={name}
		control={control}
		render={({ field: { onChange, value = '' }, fieldState: { error } }) => (
			<div className="w-full">
				<label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--foreground)' }}>
					{label}
				</label>
				<input
					type={type}
					value={value}
					onChange={onChange}
					className={`w-full px-3 py-2 rounded-lg border transition-colors text-sm focus:outline-none focus:ring-2 ${
						error 
							? 'border-red-500 focus:ring-red-200' 
							: 'focus:ring-2'
					}`}
					style={{
						borderColor: error ? '#ef4444' : 'var(--input)',
						backgroundColor: 'var(--background)',
						color: 'var(--foreground)'
					}}
				/>
				{error && (
					<p className="mt-1 text-xs text-red-600">{error.message}</p>
				)}
			</div>
		)}
		rules={rules}
	/>
	);
}

interface FormTextFieldProps<T extends FieldValues = FieldValues> {
	control: Control<T>,
	rules?: any;
	label: string;
	name: Path<T>;
	type?: string;
}

export const FormDateField = <T extends FieldValues>({name, control, rules = {}, label}: FormDateFieldProps<T>) => {
	return (<Controller
		name={name}
		control={control}
		render={({ field: { onChange, value }, fieldState: { error } }) => {
			const dateValue = value ? new Date(value) : undefined;
			
			return (
				<div className="w-full">
					<label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--foreground)' }}>
						{label}
					</label>
					<Popover>
						<PopoverTrigger asChild>
							<button
								type="button"
								className={`w-full px-3 py-2 rounded-lg border transition-colors text-sm focus:outline-none focus:ring-2 flex items-center justify-start gap-2 ${
									error 
										? 'border-red-500 focus:ring-red-200' 
										: 'focus:ring-2'
								}`}
								style={{
									borderColor: error ? '#ef4444' : 'var(--input)',
									backgroundColor: 'var(--background)',
									color: dateValue ? 'var(--foreground)' : 'var(--muted-foreground)'
								}}
							>
								<CalendarIcon className="h-4 w-4" />
								{dateValue ? format(dateValue, "PPP") : "Pick a date"}
							</button>
						</PopoverTrigger>
						<PopoverContent className="w-auto p-0" align="start">
							<Calendar
								mode="single"
								selected={dateValue}
								onSelect={(date) => onChange(date?.toISOString())}
								initialFocus
							/>
						</PopoverContent>
					</Popover>
					{error && (
						<p className="mt-1 text-xs text-red-600">{error.message}</p>
					)}
				</div>
			);
		}}
		rules={rules}
	/>
	);
}

export const FormTextAreaField = <T extends FieldValues>({name, control, rules = {}, label, type = 'text', rows = 3}: FormDateFieldProps<T>) => {
	return (<Controller
		name={name}
		control={control}
		render={({ field: { onChange, value = '' }, fieldState: { error } }) => (
			<div className="w-full">
				<label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--foreground)' }}>
					{label}
				</label>
				<textarea
					value={value}
					rows={rows}
					onChange={onChange}
					className={`w-full px-3 py-2 rounded-lg border transition-colors text-sm focus:outline-none focus:ring-2 ${
						error 
							? 'border-red-500 focus:ring-red-200' 
							: 'focus:ring-2'
					}`}
					style={{
						borderColor: error ? '#ef4444' : 'var(--input)',
						backgroundColor: 'var(--background)',
						color: 'var(--foreground)'
					}}
				/>
				{error && (
					<p className="mt-1 text-xs text-red-600">{error.message}</p>
				)}
			</div>
		)}
		rules={rules}
	/>
	);
}

interface FormDateFieldProps<T extends FieldValues = FieldValues> {
	control: Control<T>,
	rules?: any;
	label: string;
	name: Path<T>;
	type?: string;
	multiline?: boolean;
	rows?: number;
}

export const RadioGroupField = <T extends FieldValues>({row = true, options = [], name, control, rules = {}}: RadioGroupFieldProps<T>) => {
	return (<Controller
		name={name}
		control={control}
		render={({ field: { onChange, value = '' }, fieldState: { error } }) => (
			<div className="w-full">
				<div className={`flex ${row ? 'flex-row gap-6' : 'flex-col gap-3'}`}>
					{options.map(({label, value: optionValue}, index) => (
						<label
						key={`${name}-${index}`}
							className="flex flex-col-reverse items-center gap-2 cursor-pointer"
						>
							<span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
								{label}
							</span>
							<input
								type="radio"
								value={optionValue}
								checked={value === optionValue}
								onChange={() => onChange(optionValue)}
								className="w-4 h-4 cursor-pointer"
								style={{ accentColor: 'var(--primary)' }}
							/>
						</label>
					))}
				</div>
				{error && (
					<p className="mt-1 text-xs text-red-600">{error.message}</p>
				)}
			</div>
		)}
		rules={rules}
	/>
	);
}

interface RadioGroupFieldProps<T extends FieldValues = FieldValues> {
	control: Control<T>,
	rules?: any;
	label: string;
	name: Path<T>;
	options: any[];
	row?: boolean;
}

export const FormSelectField = <T extends FieldValues>({name, control, rules = {}, label, options = []}: FormSelectFieldProps<T>) => {
	return (<Controller
		name={name}
		control={control}
		render={({ field: { onChange, value = '' }, fieldState: { error } }) => (
			<div className="w-full">
				<label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--foreground)' }}>
					{label}
				</label>
				<select
					value={value}
					onChange={onChange}
					className={`w-full px-3 py-2 rounded-lg border transition-colors text-sm focus:outline-none focus:ring-2 ${
						error 
							? 'border-red-500 focus:ring-red-200' 
							: 'focus:ring-2'
					}`}
					style={{
						borderColor: error ? '#ef4444' : 'var(--input)',
						backgroundColor: 'var(--background)',
						color: 'var(--foreground)'
					}}
				>
					{options.map((option) => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
				</select>
				{error && (
					<p className="mt-1 text-xs text-red-600">{error.message}</p>
				)}
			</div>
		)}
		rules={rules}
	/>
	);
}

interface FormSelectFieldProps<T extends FieldValues = FieldValues> {
	control: Control<T>,
	rules?: any;
	label: string;
	name: Path<T>;
	options: { value: string; label: string }[];
}
