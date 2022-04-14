import React from "react";
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import { FormControl, FormControlLabel, Radio, RadioGroup, TextField } from "@mui/material";
import { Control, Controller } from "react-hook-form";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from '@mui/lab/AdapterDateFns';

export const FormTextField: React.FC<FormTextFieldProps> = ({name, control, rules = {}, label, type = 'text'}) => {
	return (<Controller
		name={name}
		control={control}
		render={({ field: { onChange, value = '' }, fieldState: { error } }) => (
			<TextField
				label={label}
				variant="outlined"
				value={value}
				onChange={onChange}
				error={!!error}
				helperText={error ? error.message : null}
				type={type}
				fullWidth
			/>
		)}
		rules={rules}
	/>
	);
}

interface FormTextFieldProps {
	control: Control,
	rules?: any;
	label: string;
	name: string;
	type?: string;
}

export const FormDateField: React.FC<FormTextFieldProps> = ({name, control, rules = {}, label}) => {
	return (<Controller
		name={name}
		control={control}
		render={({ field: { onChange, value = new Date() }, fieldState: { error } }) => (
			<LocalizationProvider dateAdapter={AdapterDateFns}>
				<MobileDatePicker 
					label={label}
					inputFormat="MM/dd/yyyy"
					value={value}
					onChange={onChange}
					renderInput={(params) => <TextField {...params} />}
				/>
			</LocalizationProvider>
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
			<TextField
				label={label}
				variant="outlined"
				value={value}
				multiline
				rows={rows}
				onChange={onChange}
				error={!!error}
				helperText={error ? error.message : null}
				type={type}
				fullWidth
			/>
		)}
		rules={rules}
	/>
	);
}

interface FormDateFieldProps {
	control: Control,
	rules: any;
	label: string;
	name: string;
	type?: string;
	multiline: boolean;
	rows: number;
}

export const RadioGroupField: React.FC<RadioGroupFieldProps> = ({row = true, options = [], name, control, rules = {}}) => {
	return (<Controller
		name={name}
		control={control}
		render={({ field: { onChange, value = '' }, fieldState: { error } }) => (
			<FormControl component="fieldset">
				<RadioGroup row={row} value={value} onChange={onChange}>
					{options.map(({label, value}, index) => <FormControlLabel
						key={name + index}
						value={value} 
						control={<Radio color="primary" />}
						label={label}
						labelPlacement="top"
					/>)}
				</RadioGroup>
			</FormControl>
		)}
		rules={rules}
	/>
	);
}


interface RadioGroupFieldProps {
	control: Control,
	rules: any;
	label: string;
	name: string;
	options: any[];
	row: boolean;
}

