import React, {ChangeEvent, useCallback} from 'react';
import {Checkbox, IconButton} from "@material-ui/core";
import {EditableSpan} from "./EditableSpan";
import {HighlightOff} from "@material-ui/icons";
import {changeTaskTitleAC, deleteTaskTC, updateTaskStatusTC, updateTaskTitleTC} from "../redux/tasks-reducer";
import {TaskStatuses, TaskType} from "../api/api";
import {useAppDispatch} from "../redux/store";

export type TaskPropsType = {
    task: TaskType
    todoListId: string
}

export const Task = ({task, todoListId}: TaskPropsType) => {

    const {id, title, status} = task

    const dispatch = useAppDispatch()

    const removeTaskHandler = () => {
        dispatch(deleteTaskTC(todoListId, id))
    }
    const changeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
        if(e.currentTarget.checked) {
            dispatch(updateTaskStatusTC(todoListId, id, TaskStatuses.Completed))
        } else {
            dispatch(updateTaskStatusTC(todoListId, id, TaskStatuses.New))
        }
    }

    const changeTaskTitleHandler = useCallback((newTitle: string) => dispatch(updateTaskTitleTC(todoListId, id, newTitle)), [dispatch, todoListId, id])

    return (
        <li className={"tasks-list-item"}>
            <div>
                <Checkbox
                    size='small'
                    checked={status === TaskStatuses.Completed}
                    onChange={changeTaskStatusHandler}
                />
                {/*<span className={task.isDone ? "task-done" : "task"}>{task.title}</span>*/}
                <EditableSpan
                    classes={status === TaskStatuses.Completed ? "task-done" : "task"}
                    title={title}
                    changeTitle={changeTaskTitleHandler}
                />
            </div>
            {/*<button onClick={removeTask}>x</button>*/}
            <IconButton onClick={removeTaskHandler}>
                <HighlightOff/>
            </IconButton>
        </li>
    );
};