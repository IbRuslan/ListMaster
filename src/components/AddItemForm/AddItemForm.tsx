import React, {ChangeEvent, memo, useState} from 'react';
import '../../app/App.css';
import {Backspace, Delete, HighlightOff} from "@material-ui/icons";
import {IconButton, TextField} from "@material-ui/core";

export type AddItemFormType = {
    maxTitle: number
    addItem: (title: string) => void
    disabled?: boolean
}

export const AddItemForm: React.FC<AddItemFormType> = memo(({maxTitle, disabled, addItem}) => {

    const [title, setTitle] = useState("")
    const [error, setError] = useState<boolean>(false)

    const addItemTitle = () => {
        const trimmedTitle = title.trim()
        if (trimmedTitle) {
            addItem(trimmedTitle)
        } else {
            setError(true)
        }
        setTitle("")
    }

    const isTaskTitleLengthTooLong = title.length >= maxTitle

    const changeItemTitle = (e: ChangeEvent<HTMLInputElement>) => {
        if (error) {
            setError(false)
        }
        setTitle(e.currentTarget.value)
    }

    return (
        <div className={'wrapper'}>
            <TextField
                size={'small'}
                label="Title"
                variant="outlined"
                value={title}
                onChange={changeItemTitle}
                className={error ? "user-error" : undefined}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        addItemTitle()
                    }
                }}
            />
            <IconButton
                size={'small'}
                disabled={disabled || isTaskTitleLengthTooLong}
                onClick={addItemTitle}>
                <HighlightOff fontSize="small"/>
            </IconButton>
            <IconButton
                size={'small'}
                onClick={() => setTitle(title.slice(0, -1))}>
                <Backspace fontSize="small"/>
            </IconButton>
            <IconButton
                size={'small'}
                onClick={() => setTitle("")}>
                <Delete fontSize="small"/>
            </IconButton>
          <div className={'spans'}>
            {isTaskTitleLengthTooLong && <span style={{"color": "red"}}>You title is too long</span>}
            {error && <span style={{"color": "red", "fontWeight": "bold"}}>Please, enter correct title</span>}
          </div>
        </div>
    );
});

