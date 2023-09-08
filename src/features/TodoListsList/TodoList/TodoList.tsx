import React, {FC, memo, useCallback, useEffect} from 'react';
import {AddItemForm} from "../../../components/AddItemForm/AddItemForm";
import {EditableSpan} from "../../../components/EditableSpan/EditableSpan";
import {Button, IconButton} from '@material-ui/core';
import {HighlightOff} from "@material-ui/icons";
import {useAppDispatch, useAppSelector} from "../../../redux/store";
import {createTaskTC, getTasksTC, TasksDomainType} from "../../../redux/tasks-reducer";
import {changeTodoListFilterAC, FilterValuesType, removeTodoTC, TodoListDomainType, updateTodoTC} from "../../../redux/todolists-reducer";
import {Task} from "./Task/Task";
import {TaskStatuses} from "../../../api/api";

type TodoListPropsType = {
    todoList: TodoListDomainType
}

export const TodoList: FC<TodoListPropsType> = memo( ({todoList}) => {

    const {id, title, filter, entityStatus} = todoList

    const tasks = useAppSelector<TasksDomainType[]>(state => state.tasks[id])

    const dispatch = useAppDispatch()

    const maxTaskTitleLength = 20

    const getFilteredTasks = (allTasks: Array<TasksDomainType>, currentFilterValue: FilterValuesType): Array<TasksDomainType> => {
        switch (currentFilterValue) {
            case "completed":
                return allTasks.filter(t => t.status === TaskStatuses.Completed)
            case "active":
                return allTasks.filter(t => t.status === TaskStatuses.New)
            default:
                return allTasks
        }
    }

    const filteredTasks = getFilteredTasks(tasks, filter)

    const tasksList = (tasks.length === 0)
        ? <p>TodoList is empty</p>
        : <ul className={"tasks-list"}>
            {
                filteredTasks.map((task) => {
                    return (
                        <Task key={task.id} todoListId={id} task={task} />
                    )
                })
            }
        </ul>

    const addTask = useCallback((title: string) => dispatch(createTaskTC(id, title)), [dispatch, id])
    const changeTodoListTitle = useCallback((newTitle: string) => dispatch(updateTodoTC(id, newTitle)), [dispatch, id])

    const onAllClickHandler = useCallback(() => dispatch(changeTodoListFilterAC("all", id)), [dispatch, id])
    const onActiveClickHandler = useCallback(() => dispatch(changeTodoListFilterAC("active", id)), [dispatch, id])
    const onCompletedClickHandler = useCallback(() =>  dispatch(changeTodoListFilterAC("completed", id)), [dispatch, id])

    return (
        <div className="todoList">
            <h3 className={"todolist-header"}>
                <EditableSpan classes={''} title={title} changeTitle={changeTodoListTitle} disabled={entityStatus === 'loading'}/>
                <IconButton onClick={() => dispatch(removeTodoTC(id))} disabled={entityStatus === 'loading'}>
                    <HighlightOff/>
                </IconButton>
            </h3>
            <AddItemForm maxTitle={maxTaskTitleLength} addItem={addTask} disabled={entityStatus === 'loading'} />
            {tasksList}
            <div className={"buttons-block"}>
                <Button
                    size={'small'}
                    variant={'contained'}
                    color={filter === "all" ? "secondary" : 'primary'}
                    onClick={onAllClickHandler}>All
                </Button>
                <Button
                    size={'small'}
                    variant={'contained'}
                    color={filter === "active" ? "secondary" : 'primary'}
                    onClick={onActiveClickHandler}>Active
                </Button>
                <Button
                    size={'small'}
                    variant={'contained'}
                    color={filter === "completed" ? "secondary" : 'primary'}
                    onClick={onCompletedClickHandler}>Completed
                </Button>
            </div>
        </div>
    );
});