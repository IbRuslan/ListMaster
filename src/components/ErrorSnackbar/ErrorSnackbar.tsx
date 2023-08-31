import React from 'react'
import {Alert, Snackbar} from "@material-ui/core";
import {useAppDispatch, useAppSelector} from "../../redux/store";
import {setAppErrorAC} from "../../redux/app-reducer";

export function ErrorSnackbar() {

    const error = useAppSelector(state => state.app.error)

    const dispatch = useAppDispatch()

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return
        }
        dispatch(setAppErrorAC(null))
    }

    return (
        <Snackbar open={!!error} autoHideDuration={3000} onClose={handleClose}>
            <Alert onClose={handleClose} severity='error' sx={{width: '100%'}}>
                {error}
            </Alert>
        </Snackbar>
    )
}