import React from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

export const FormTextField = <T extends FieldValues>({name, control, rules = {}, label, type = 'text'}: FormTextFieldProps<T>) => {
	const inputId = `field-${name}`;
	return (<Controller
		name={name}
		control={control}
		render={({ field: { onChange, value = '' }, fieldState: { error } }) => (
			<div className="w-full">
				<label htmlFor={inputId} className="block text-sm font-medium mb-1.5" style={{ color: 'var(--foreground)' }}>
					{label}
				</label>
				<input
					id={inputId}
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
	const inputId = `field-${name}`;
	return (<Controller
		name={name}
		control={control}
		render={({ field: { onChange, value = new Date().toISOString().split('T')[0] }, fieldState: { error } }) => (
			<div className="w-full">
				<label htmlFor={inputId} className="block text-sm font-medium mb-1.5" style={{ color: 'var(--foreground)' }}>
					{label}
				</label>
				<input
					id={inputId}
					type="date"
					value={typeof value === 'string' ? value : (value as any)?.toISOString?.()?.split('T')?.[0] || ''}
					onChange={(e) => onChange(e.target.value)}
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

export const FormTextAreaField = <T extends FieldValues>({name, control, rules = {}, label, type = 'text', rows = 3}: FormDateFieldProps<T>) => {
	const inputId = `field-${name}`;
	return (<Controller
		name={name}
		control={control}
		render={({ field: { onChange, value = '' }, fieldState: { error } }) => (
			<div className="w-full">
				<label htmlFor={inputId} className="block text-sm font-medium mb-1.5" style={{ color: 'var(--foreground)' }}>
					{label}
				</label>
				<textarea
					id={inputId}
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
	const inputId = `field-${name}`;
	return (<Controller
		name={name}
		control={control}
		render={({ field: { onChange, value = '' }, fieldState: { error } }) => (
			<div className="w-full">
				<label htmlFor={inputId} className="block text-sm font-medium mb-1.5" style={{ color: 'var(--foreground)' }}>
					{label}
				</label>
				<select
					id={inputId}
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
