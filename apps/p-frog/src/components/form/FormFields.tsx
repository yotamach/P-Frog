import React from "react";
import { Control, Controller } from "react-hook-form";

export const FormTextField: React.FC<FormTextFieldProps> = ({name, control, rules = {}, label, type = 'text'}) => {
	return (<Controller
		name={name}
		control={control}
		render={({ field: { onChange, value = '' }, fieldState: { error } }) => (
			<div className="w-full">
				<label className="block text-sm font-medium mb-1.5" style={{ color: 'hsl(var(--foreground))' }}>
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
						borderColor: error ? '#ef4444' : 'hsl(var(--input))',
						backgroundColor: 'hsl(var(--background))',
						color: 'hsl(var(--foreground))'
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

interface FormTextFieldProps {
	control: Control<any>,
	rules?: any;
	label: string;
	name: string;
	type?: string;
}

export const FormDateField: React.FC<FormTextFieldProps> = ({name, control, rules = {}, label}) => {
	return (<Controller
		name={name}
		control={control}
		render={({ field: { onChange, value = new Date().toISOString().split('T')[0] }, fieldState: { error } }) => (
			<div className="w-full">
				<label className="block text-sm font-medium mb-1.5" style={{ color: 'hsl(var(--foreground))' }}>
					{label}
				</label>
				<input
					type="date"
					value={typeof value === 'string' ? value : value?.toISOString?.()?.split('T')[0] || ''}
					onChange={(e) => onChange(e.target.value)}
					className={`w-full px-3 py-2 rounded-lg border transition-colors text-sm focus:outline-none focus:ring-2 ${
						error 
							? 'border-red-500 focus:ring-red-200' 
							: 'focus:ring-2'
					}`}
					style={{
						borderColor: error ? '#ef4444' : 'hsl(var(--input))',
						backgroundColor: 'hsl(var(--background))',
						color: 'hsl(var(--foreground))'
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

export const FormTextAreaField: React.FC<FormDateFieldProps> = ({name, control, rules = {}, label, type = 'text', rows = 3}) => {
	return (<Controller
		name={name}
		control={control}
		render={({ field: { onChange, value = '' }, fieldState: { error } }) => (
			<div className="w-full">
				<label className="block text-sm font-medium mb-1.5" style={{ color: 'hsl(var(--foreground))' }}>
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
						borderColor: error ? '#ef4444' : 'hsl(var(--input))',
						backgroundColor: 'hsl(var(--background))',
						color: 'hsl(var(--foreground))'
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

interface FormDateFieldProps {
	control: Control<any>,
	rules: any;
	label: string;
	name: string;
	type?: string;
	multiline?: boolean;
	rows?: number;
}

export const RadioGroupField: React.FC<RadioGroupFieldProps> = ({row = true, options = [], name, control, rules = {}}) => {
	return (<Controller
		name={name}
		control={control}
		render={({ field: { onChange, value = '' }, fieldState: { error } }) => (
			<div className="w-full">
				<div className={`flex ${row ? 'flex-row gap-6' : 'flex-col gap-3'}`}>
					{options.map(({label, value: optionValue}, index) => (
						<label
							key={name + index}
							className="flex flex-col-reverse items-center gap-2 cursor-pointer"
						>
							<span className="text-sm font-medium" style={{ color: 'hsl(var(--foreground))' }}>
								{label}
							</span>
							<input
								type="radio"
								value={optionValue}
								checked={value === optionValue}
								onChange={() => onChange(optionValue)}
								className="w-4 h-4 cursor-pointer"
								style={{ accentColor: 'hsl(var(--primary))' }}
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

interface RadioGroupFieldProps {
	control: Control<any>,
	rules: any;
	label: string;
	name: string;
	options: any[];
	row: boolean;
}
