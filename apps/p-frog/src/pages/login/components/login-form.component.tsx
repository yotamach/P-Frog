import { FormTextField } from '@components/form/FormFields';
import { Button } from '@components/ui/button';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useLogin } from '@data/queries/auth.queries';
import { Link } from 'react-router-dom';

interface LoginFormValues {
    userName: string;
    password: string;
}

function LoginForm() {
    const { control, handleSubmit } = useForm<LoginFormValues>({
        defaultValues: {
            userName: '',
            password: ''
        }
    });

    const { mutate: login, isPending } = useLogin();

    const onSubmit = handleSubmit((values) => {
        login(values);
    });

    return (
        <form onSubmit={onSubmit} className="rounded-2xl bg-white/95 p-8 shadow-2xl backdrop-blur">
            <div className="mb-6 text-center">
                <h2 className="text-3xl font-extrabold tracking-tight" style={{ color: 'hsl(var(--sidebar-text))' }}>
                    Sign in
                </h2>
                <p className="mt-2 text-sm" style={{ color: 'hsl(var(--table-text-muted))' }}>
                    Enter your credentials to access your workspace
                </p>
            </div>

            <div className="space-y-5">
                <FormTextField 
                    control={control} 
                    name="userName" 
                    label="Username" 
                    rules={{ 
                        required: 'Username is required'
                    }} 
                />
                <FormTextField
                    control={control}
                    name="password"
                    type="password"
                    label="Password"
                    rules={{ required: 'Password is required' }}
                />
            </div>

            <Button
                type="submit"
                className="mt-8 w-full shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
                size="lg"
                disabled={isPending}
            >
                {isPending ? 'Logging in...' : 'Log In'}
            </Button>

            <div className="mt-6 text-center">
                <p className="text-sm" style={{ color: 'hsl(var(--table-text-muted))' }}>
                    Don't have an account?{' '}
                    <Link 
                        to="/registration" 
                        className="font-semibold hover:underline"
                        style={{ color: 'hsl(var(--sidebar-active))' }}
                    >
                        Sign up
                    </Link>
                </p>
            </div>
        </form>
    );
}

export default LoginForm;