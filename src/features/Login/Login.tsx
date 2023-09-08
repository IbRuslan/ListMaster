import React from 'react'
import {
    Button, Checkbox, FormControl, FormControlLabel,
    FormGroup, FormLabel, Grid, TextField} from "@material-ui/core";
import {useFormik} from 'formik';
import {useAppDispatch, useAppSelector} from "../../redux/store";
import {loginTC} from "../../redux/auth-reducer";
import {Navigate} from "react-router-dom";

export type LoginDataType = {
    email: string,
    password: string,
    rememberMe: boolean
}

type FormikErrorType = {
    email?: string,
    password?: string,
}

export const Login = () => {

    const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn)

    const dispatch = useAppDispatch()

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            rememberMe: false
        },
        validate: (values) => {
            const errors: FormikErrorType = {}
            if (!values.email) {
                errors.email = 'Required'
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
                errors.email = 'Invalid email address'
            }
            if (!values.password) {
                errors.password = 'Required'
            } else if (values.password.length < 5) {
                errors.password = 'Small password'
            }
            return errors
        },
        onSubmit: values => {
            dispatch(loginTC(values))
            formik.resetForm()
        },
    })

    const initialValuesArray = Object.values(formik.errors)

    if (isLoggedIn) {
        return <Navigate to={'/'}/>
    }

    return (
        <Grid container justifyContent={'center'} sx={{
            width: '40%',
            margin: '120px auto',
            padding: '10px',
            border: '1px solid grey',
            borderRadius: '10px'
        }}>
            <Grid item justifyContent={'center'}>
                <FormControl>
                    <FormLabel>
                        <p>To log in get registered
                            <a href={'https://social-network.samuraijs.com/'}
                               target={'_blank'}> here
                            </a>
                        </p>
                        <p>or use common test account credentials:</p>
                        <p>Email: free@samuraijs.com</p>
                        <p>Password: free</p>
                    </FormLabel>
                    <form onSubmit={formik.handleSubmit}>
                        <FormGroup>
                            <TextField label="email" margin="normal" {...formik.getFieldProps('email')}/>
                            {formik.touched.password && formik.errors.email && (
                                <span style={{color: 'red'}}>{formik.errors.email}</span>
                            )}
                            <TextField type="password" label="password"
                                       margin="normal" {...formik.getFieldProps('password')}/>
                            {formik.touched.password && formik.errors.password && (
                                <span style={{color: 'red'}}>{formik.errors.password}</span>
                            )}
                            <FormControlLabel name='rememberMe' label={'Remember me'}
                                              control={<Checkbox onChange={formik.handleChange}
                                                                 value={formik.values.rememberMe}/>}
                            />
                            <Button type={'submit'} variant={'contained'} color={'primary'}
                                    disabled={!!initialValuesArray.length}>
                                Login
                            </Button>
                        </FormGroup>
                    </form>
                </FormControl>
            </Grid>
        </Grid>
    )
}