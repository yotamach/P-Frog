import { FormTextField } from '@components/form/FormFields'
import { Card, CardContent, CardActions, CardHeader, Typography } from '@mui/material'
import React from 'react'
import { useForm } from 'react-hook-form';
import Button from '@mui/material/Button';

function LoginForm() {
    const { control } = useForm();

    return (<Card>
            <form>
                <CardHeader color='secondary' title={<Typography variant="h4" component="h4" bgcolor={"primary"} color={"text.primary"}>Login</Typography>} />
                <CardContent>
                    <FormTextField control={control} name='userName' label={'Username'}/>
                    <br />
                    <br />
                    <FormTextField control={control} name='password' type='password' label={'Password'} />
                </CardContent>
                <CardActions sx={{ padding: '16px' }}>
                    <Button variant="contained">Login</Button>
                </CardActions>
            </form> 
        </Card>);
}

export default LoginForm;