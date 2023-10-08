import React, { FC, memo, useCallback } from "react";
import { AddItemForm } from "common/components";
import { EditableSpan } from "common/components";
import { Button, IconButton } from "@material-ui/core";
import { HighlightOff } from "@material-ui/icons";
import { useAppDispatch, useAppSelector } from "app/store";
import { TasksDomainType, tasksThunks } from "features/TodoListsList/model/tasks-reducer";
import {
  FilterValuesType,
  TodoListDomainType,
  todoListsActions, todoListsThunks
} from "features/TodoListsList/model/todolists-reducer";
import { Task } from "features/TodoListsList/ui/TodoList/Task/Task";
import { TaskStatuses } from "common/api/api";

type TodoListPropsType = {
  todoList: TodoListDomainType
}

export const TodoList: FC<TodoListPropsType> = memo(({ todoList }) => {

  const { id, title, filter, entityStatus } = todoList;

  const tasks = useAppSelector<TasksDomainType[]>(state => state.tasks[id]);

  const dispatch = useAppDispatch();

  const maxTaskTitleLength = 20;

  const getFilteredTasks = (allTasks: Array<TasksDomainType>, currentFilterValue: FilterValuesType): Array<TasksDomainType> => {
    switch (currentFilterValue) {
      case "completed":
        return allTasks.filter(t => t.status === TaskStatuses.Completed);
      case "active":
        return allTasks.filter(t => t.status === TaskStatuses.New);
      default:
        return allTasks;
    }
  };

  const filteredTasks = getFilteredTasks(tasks, filter);

  const tasksList = (tasks.length === 0)
    ? <p>TodoList is empty</p>
    : <ul className={"tasks-list"}>
      {
        filteredTasks.map((task) => {
          return (
            <Task key={task.id} todoListId={id} task={task} />
          );
        })
      }
    </ul>;

  const addTask = useCallback((title: string) => dispatch(tasksThunks.createTaskTC({ todoId: id, title })), [dispatch, id]);
  const changeTodoListTitle = useCallback((newTitle: string) => dispatch(todoListsThunks.updateTodoTC({ todoId: id, newTitle: newTitle })), [dispatch, id]);

  const onAllClickHandler = useCallback(() => dispatch(todoListsActions.changeTodoListFilter({
    todoListId: id,
    newFilterValue: "all"
  })), [dispatch, id]);
  const onActiveClickHandler = useCallback(() => dispatch(todoListsActions.changeTodoListFilter({
    todoListId: id,
    newFilterValue: "active"
  })), [dispatch, id]);
  const onCompletedClickHandler = useCallback(() => dispatch(todoListsActions.changeTodoListFilter({
    todoListId: id,
    newFilterValue: "completed"
  })), [dispatch, id]);

  return (
    <div className="todoList">
      <h3 className={"todolist-header"}>
        <EditableSpan classes={""} title={title} changeTitle={changeTodoListTitle}
                      disabled={entityStatus === "loading"} />
        <IconButton onClick={() => dispatch(todoListsThunks.removeTodoTC({ todoId: id }))} disabled={entityStatus === "loading"}>
          <HighlightOff />
        </IconButton>
      </h3>
      <AddItemForm maxTitle={maxTaskTitleLength} addItem={addTask} disabled={entityStatus === "loading"} />
      {tasksList}
      <div className={"buttons-block"}>
        <Button
          size={"small"}
          variant={"contained"}
          color={filter === "all" ? "secondary" : "primary"}
          onClick={onAllClickHandler}>All
        </Button>
        <Button
          size={"small"}
          variant={"contained"}
          color={filter === "active" ? "secondary" : "primary"}
          onClick={onActiveClickHandler}>Active
        </Button>
        <Button
          size={"small"}
          variant={"contained"}
          color={filter === "completed" ? "secondary" : "primary"}
          onClick={onCompletedClickHandler}>Completed
        </Button>
      </div>
    </div>
  );
});