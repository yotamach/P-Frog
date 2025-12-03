import { FormTextField } from '@components/form/FormFields';
import React from 'react';
import { useForm } from 'react-hook-form';

function LoginForm() {
    const { control } = useForm();

    return (
        <form className="rounded-2xl bg-white/95 p-8 shadow-2xl backdrop-blur">
            <div className="mb-6 text-center">
                <h2 className="text-3xl font-extrabold tracking-tight" style={{ color: 'hsl(var(--sidebar-text))' }}>
                    Sign in
                </h2>
                <p className="mt-2 text-sm" style={{ color: 'hsl(var(--table-text-muted))' }}>
                    Enter your credentials to access your workspace
                </p>
            </div>

            <div className="space-y-5">
                <FormTextField control={control} name="userName" label="Username" />
                <FormTextField control={control} name="password" type="password" label="Password" />
            </div>

            <button
                type="submit"
                className="mt-8 w-full rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
                style={{
                    backgroundColor: 'hsl(var(--color-button-create))'
                }}
            >
                Continue
            </button>
        </form>
    );
}

export default LoginForm;