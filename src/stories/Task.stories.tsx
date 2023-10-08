import type {Meta, StoryObj} from '@storybook/react';
import React, {} from "react";
import {Task} from "../features/TodoListsList/ui/TodoList/Task/Task";
import {ReduxStoreProviderDecorator} from "./decoraties/ReduxStoreProviderDecorator";
import {AppRootStateType} from "app/store";
import {useSelector} from "react-redux";
import {TaskPriorities, TaskStatuses} from "../common/api/api";
import {TasksDomainType} from "features/TodoListsList/model/tasks-reducer";

const meta: Meta<typeof Task> = {
    title: 'TODOLISTS/Task',
    component: Task,

    tags: ['autodocs'],
    decorators: [ReduxStoreProviderDecorator]

} satisfies Meta<typeof Task>;

export default meta;
type Story = StoryObj<typeof Task>;


const TaskWithRedux = () => {
    let task = useSelector<AppRootStateType, TasksDomainType>(state => state.tasks["todoListId1"][0])

    if (!task) task = {
        id: '1',
        title: 'The end',
        status: TaskStatuses.New,
        priority: TaskPriorities.Low,
        description: '',
        todoListId: "todolistId1",
        order: 0,
        startDate: '',
        deadline: '',
        addedDate: '',
        entityStatus: 'idle'
    }

    return <Task task={task} todoListId={'todoListId1'}/>

}

export const TaskIsDoneStory: Story = {
    render: () => <TaskWithRedux/>
};