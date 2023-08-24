import React, {ChangeEvent, memo, useState} from 'react';
import {TextField} from "@material-ui/core";

type EditableSpanType = {
    title: string
    classes: string
    changeTitle: (newTitle: string) => void
}

export const EditableSpan: React.FC<EditableSpanType> = memo(({title, classes, changeTitle}) => {
    const [isEditMode, setIsEditMode] = useState<boolean>(false)
    const [value, setValue] = useState('')
    const onEditMode = () => {
        setIsEditMode(true)
        setValue(title)
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
