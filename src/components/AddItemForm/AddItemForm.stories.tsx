import type { Meta, StoryObj } from '@storybook/react';
import {action} from '@storybook/addon-actions'

import {AddItemForm, AddItemFormType} from "./AddItemForm";
import React, {ChangeEvent, useState} from "react";
import {IconButton, TextField} from "@material-ui/core";
import {Backspace, Delete, HighlightOff} from "@material-ui/icons";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof AddItemForm> = {
  title: 'TODOLISTS/AddItemForm',
  component: AddItemForm,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    addItem: {
      description: 'Clicked button',
      action:  'Clicked button'
    }
  },
} satisfies Meta<typeof AddItemForm>;

export default meta;
type Story = StoryObj<typeof AddItemForm>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const AddItemFormStory: Story = {

};

const AddItemFormWithError = (args: AddItemFormType) => {

  const [title, setTitle] = useState("")
  const [error, setError] = useState<boolean>(true)

  const addItemTitle = () => {
    const trimmedTitle = title.trim()
    if (trimmedTitle) {
      args.addItem(trimmedTitle)
    } else {
      setError(true)
    }
    setTitle("")
  }

  const isTaskTitleLengthTooLong = title.length >= args.maxTitle
  const isAddTaskBtnDisabled = !title || isTaskTitleLengthTooLong
  const changeItemTitle = (e: ChangeEvent<HTMLInputElement>) => {
    if (error) {
      setError(false)
    }
    if (!isTaskTitleLengthTooLong) {
      setTitle(e.currentTarget.value)
    }
  }
  return   <div className={'wrapper'}>
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
        disabled={isAddTaskBtnDisabled}
        onClick={addItemTitle}>
      <HighlightOff fontSize="small"/>
    </IconButton>

    <IconButton
        size={'small'}
        disabled={!title}
        onClick={() => setTitle(title.slice(0, -1))}>
      <Backspace fontSize="small"/>
    </IconButton>
    <IconButton
        size={'small'}
        disabled={!title}
        onClick={() => setTitle("")}>
      <Delete fontSize="small"/>
    </IconButton>
    {isTaskTitleLengthTooLong && <div>You title is too long</div>}
    {error && <div style={{"color": "red", "fontWeight": "bold"}}>Please, enter correct title</div>}
  </div>
}
export const AddItemFormWithErrorStory: Story = {
  render: args => <AddItemFormWithError addItem={args.addItem} maxTitle={10}/>
}

