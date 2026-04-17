import { FormTextField } from '@components/form/FormFields';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useSignUp } from '@data/queries/auth.queries';
import { Link } from 'react-router-dom';

interface RegistrationFormValues {
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

function RegistrationForm() {
    const { control, handleSubmit, watch } = useForm<RegistrationFormValues>({
        defaultValues: {
            firstName: '',
            lastName: '',
            userName: '',
            email: '',
            password: '',
            confirmPassword: ''
        }
    });

    const signUpMutation = useSignUp();
    const password = watch('password');

    const onSubmit = handleSubmit((values) => {
        const { firstName, lastName, userName, email, password } = values;
        signUpMutation.mutate({ firstName, lastName, userName, email, password });
    });

    return (
        <form onSubmit={onSubmit} className="rounded-2xl p-8 shadow-2xl backdrop-blur" style={{ backgroundColor: 'var(--color-card)' }}>
            <div className="mb-6 text-center">
                <h2 className="text-3xl font-extrabold tracking-tight" style={{ color: 'hsl(var(--sidebar-text))' }}>
                    Create Account
                </h2>
                <p className="mt-2 text-sm" style={{ color: 'hsl(var(--table-text-muted))' }}>
                    Sign up to start managing your projects
                </p>
            </div>

            <div className="space-y-5">
                <FormTextField 
                    control={control} 
                    name="firstName" 
                    label="First Name" 
                    rules={{ 
                        required: 'First name is required',
                        minLength: {
                            value: 2,
                            message: 'First name must be at least 2 characters'
                        }
                    }} 
                />
                <FormTextField 
                    control={control} 
                    name="lastName" 
                    label="Last Name" 
                    rules={{ 
                        required: 'Last name is required',
                        minLength: {
                            value: 2,
                            message: 'Last name must be at least 2 characters'
                        }
                    }} 
                />
                <FormTextField 
                    control={control} 
                    name="userName" 
                    label="Username" 
                    rules={{ 
                        required: 'Username is required',
                        minLength: {
                            value: 3,
                            message: 'Username must be at least 3 characters'
                        }
                    }} 
                />
                <FormTextField 
                    control={control} 
                    name="email" 
                    label="Email" 
                    rules={{ 
                        required: 'Email is required',
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email address'
                        }
                    }} 
                />
                <FormTextField
                    control={control}
                    name="password"
                    type="password"
                    label="Password"
                    rules={{ 
                        required: 'Password is required',
                        minLength: {
                            value: 6,
                            message: 'Password must be at least 6 characters'
                        }
                    }}
                />
                <FormTextField
                    control={control}
                    name="confirmPassword"
                    type="password"
                    label="Confirm Password"
                    rules={{ 
                        required: 'Please confirm your password',
                        validate: (value: string) => value === password || 'Passwords do not match'
                    }}
                />
            </div>

            <button
                type="submit"
                disabled={signUpMutation.isPending}
                className="btn-primary mt-8 w-full shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {signUpMutation.isPending ? 'Creating Account...' : 'Sign Up'}
            </button>

            <div className="mt-6 text-center">
                <p className="text-sm" style={{ color: 'hsl(var(--table-text-muted))' }}>
                    Already have an account?{' '}
                    <Link 
                        to="/login" 
                        className="font-semibold hover:underline"
                        style={{ color: 'hsl(var(--sidebar-active))' }}
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </form>
    );
}

export default RegistrationForm;
