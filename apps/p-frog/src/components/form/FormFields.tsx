import React from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Textarea } from "@components/ui/textarea";
import { Select } from "@components/ui/select";

export const FormTextField = <T extends FieldValues>({name, control, rules = {}, label, type = 'text'}: FormTextFieldProps<T>) => {
	const inputId = `field-${name}`;
	return (<Controller
		name={name}
		control={control}
		render={({ field: { onChange, value = '' }, fieldState: { error } }) => (
			<div className="w-full space-y-1.5">
				<Label htmlFor={inputId}>
					{label}
				</Label>
				<Input
					id={inputId}
					type={type}
					value={value}
					onChange={onChange}
					style={error ? { borderColor: 'hsl(var(--color-destructive))' } : undefined}
				/>
				{error && (
					<p className="text-xs" style={{ color: 'hsl(var(--color-destructive))' }}>{error.message}</p>
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
	const inputId = `field-${name}`;
	return (<Controller
		name={name}
		control={control}
		render={({ field: { onChange, value = new Date().toISOString().split('T')[0] }, fieldState: { error } }) => (
			<div className="w-full space-y-1.5">
				<Label htmlFor={inputId}>
					{label}
				</Label>
				<Input
					id={inputId}
					type="date"
					value={typeof value === 'string' ? value : (value as any)?.toISOString?.()?.split('T')?.[0] || ''}
					onChange={(e) => onChange(e.target.value)}
					style={error ? { borderColor: 'hsl(var(--color-destructive))' } : undefined}
				/>
				{error && (
					<p className="text-xs" style={{ color: 'hsl(var(--color-destructive))' }}>{error.message}</p>
				)}
			</div>
		)}
		rules={rules}
	/>
	);
}

export const FormTextAreaField = <T extends FieldValues>({name, control, rules = {}, label, rows = 3}: FormDateFieldProps<T>) => {
	const inputId = `field-${name}`;
	return (<Controller
		name={name}
		control={control}
		render={({ field: { onChange, value = '' }, fieldState: { error } }) => (
			<div className="w-full space-y-1.5">
				<Label htmlFor={inputId}>
					{label}
				</Label>
				<Textarea
					id={inputId}
					value={value}
					rows={rows}
					onChange={onChange}
					style={error ? { borderColor: 'hsl(var(--color-destructive))' } : undefined}
				/>
				{error && (
					<p className="text-xs" style={{ color: 'hsl(var(--color-destructive))' }}>{error.message}</p>
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
			<div className="w-full space-y-1.5">
				<div className={`flex ${row ? 'flex-row gap-6' : 'flex-col gap-3'}`}>
					{options.map(({label, value: optionValue}, index) => (
						<Label
							key={`${name}-${index}`}
							className="flex flex-col-reverse items-center gap-2 cursor-pointer"
						>
							<span className="text-sm font-medium">
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
						</Label>
					))}
				</div>
				{error && (
					<p className="text-xs" style={{ color: 'hsl(var(--color-destructive))' }}>{error.message}</p>
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
	const inputId = `field-${name}`;
	return (<Controller
		name={name}
		control={control}
		render={({ field: { onChange, value = '' }, fieldState: { error } }) => (
			<div className="w-full space-y-1.5">
				<Label htmlFor={inputId}>
					{label}
				</Label>
				<Select
					id={inputId}
					value={value}
					onChange={onChange}
					style={error ? { borderColor: 'hsl(var(--color-destructive))' } : undefined}
				>
					{options.map((option) => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
				</Select>
				{error && (
					<p className="text-xs" style={{ color: 'hsl(var(--color-destructive))' }}>{error.message}</p>
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
