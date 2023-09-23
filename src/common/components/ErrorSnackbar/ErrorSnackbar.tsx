import React from 'react'
import {Alert, Snackbar} from "@material-ui/core";
import {useAppDispatch, useAppSelector} from "app/store";
import { appActions } from "app/app-reducer";
import { selectAppError } from "app/app-selectors";

export function ErrorSnackbar() {

    const error = useAppSelector(selectAppError)

    const dispatch = useAppDispatch()

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return
        }
        dispatch(appActions.setAppError({error: null}))
    }

    return (
        <Snackbar open={!!error} autoHideDuration={3000} onClose={handleClose}>
            <Alert onClose={handleClose} severity='error' sx={{width: '100%'}}>
                {error}
            </Alert>
        </Snackbar>
    )
}