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
        <div className="rounded-2xl shadow-2xl overflow-hidden bg-card backdrop-blur">
            <div className="bg-gradient-header h-24 flex items-end px-8 pb-4">
                <h2 className="text-3xl font-extrabold tracking-tight text-white">
                    P-Frog
                </h2>
            </div>

            <form onSubmit={onSubmit} className="p-8">
                <div className="mb-6">
                    <h3 className="text-2xl font-bold tracking-tight text-foreground">
                        Sign in
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
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
                    variant="gradient"
                    size="lg"
                    className="mt-8 w-full transition-all duration-200 hover:-translate-y-0.5"
                    disabled={isPending}
                >
                    {isPending ? 'Logging in...' : 'Log In'}
                </Button>

                <div className="mt-6 text-center">
                    <p className="text-sm text-muted-foreground">
                        Don't have an account?{' '}
                        <Link
                            to="/registration"
                            className="font-semibold text-primary hover:underline"
                        >
                            Sign up
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    );
}

export default LoginForm;
