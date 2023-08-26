import React, {FC, memo, useCallback, useEffect} from 'react';
import {AddItemForm} from "./AddItemForm/AddItemForm";
import {EditableSpan} from "./EditableSpan/EditableSpan";
import {Button, IconButton} from '@material-ui/core';
import {HighlightOff} from "@material-ui/icons";
import {useAppDispatch, useAppSelector} from "../redux/store";
import {createTaskTC, getTasksTC} from "../redux/tasks-reducer";
import {changeTodoListFilterAC, FilterValuesType, removeTodoTC, TodoListDomainType, updateTodoTC} from "../redux/todolists-reducer";
import {Task} from "./Task";
import {TaskStatuses, TaskType} from "../api/api";

type TodoListPropsType = {
    todoList: TodoListDomainType
}

export const TodoList: FC<TodoListPropsType> = memo( ({todoList}) => {

    const {id, title, filter} = todoList

    const tasks = useAppSelector<TaskType[]>(state => state.tasks[id])

    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(getTasksTC(id))
    }, [])

    const maxTaskTitleLength = 15

    const getFilteredTasks = (allTasks: Array<TaskType>, currentFilterValue: FilterValuesType): Array<TaskType> => {
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
                <EditableSpan classes={''} title={title} changeTitle={changeTodoListTitle}/>
                {/*<button onClick={() => props.removeTodoList(props.todoListId)}>x</button>*/}
                <IconButton onClick={() => dispatch(removeTodoTC(id))}>
                    <HighlightOff/>
                </IconButton>
            </h3>
            <AddItemForm maxTitle={maxTaskTitleLength} addItem={addTask}/>
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