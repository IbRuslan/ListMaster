import React, {ChangeEvent, memo, useState} from 'react';
import {TextField} from "@material-ui/core";

type EditableSpanType = {
    title: string
    classes: string
    changeTitle: (newTitle: string) => void
    disabled: boolean
}

export const EditableSpan: React.FC<EditableSpanType> = memo(({disabled, title, classes, changeTitle}) => {
    const [isEditMode, setIsEditMode] = useState<boolean>(false)
    const [value, setValue] = useState('')


    console.log(disabled)

    const onEditMode = () => {
        if (disabled) {
            return
        } else {
            setIsEditMode(true)
            setValue(title)
        }
    }
    const offEditMode = () => {
        setIsEditMode(false)
        changeTitle(value)
    }
    const changeItemTitle = (e: ChangeEvent<HTMLInputElement>) => setValue(e.currentTarget.value)

    return (
        isEditMode
            ? <TextField
                variant="standard"
                autoFocus
                value={value}
                onChange={changeItemTitle}
                onBlur={offEditMode}
            />
            : <span className={classes} onDoubleClick={onEditMode}>{title}</span>
    );
});
