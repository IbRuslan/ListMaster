import React, { ChangeEvent, useCallback } from "react";
import { Checkbox, IconButton } from "@material-ui/core";
import { HighlightOff } from "@material-ui/icons";
import { TasksDomainType, tasksThunks } from "features/TodoListsList/tasks-reducer";
import { TaskStatuses } from "common/api/api";
import { useAppDispatch } from "app/store";
import { EditableSpan } from "common/components";

export type TaskPropsType = {
  task: TasksDomainType
  todoListId: string
}


export const Task = ({ task, todoListId }: TaskPropsType) => {

  const { id, title, status, entityStatus } = task;

  const dispatch = useAppDispatch();

  const removeTaskHandler = () => {
    dispatch(tasksThunks.deleteTaskTC({ todoListId: todoListId, taskId: id }));
  };
  const changeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.checked) {
      dispatch(tasksThunks.updateTaskTC({todolistId: todoListId, taskId: id, domainModel: { status: TaskStatuses.Completed } }));
    } else {
      dispatch(tasksThunks.updateTaskTC({todolistId: todoListId, taskId: id, domainModel: { status: TaskStatuses.New } }));
    }
  };

  const changeTaskTitleHandler = useCallback((newTitle: string) => dispatch(tasksThunks.updateTaskTC({todolistId: todoListId, taskId: id, domainModel: { title: newTitle } })), [dispatch, todoListId, id]);

  return (
    <li className={"tasks-list-item"}>
      <div>
        <Checkbox
          size="small"
          checked={status === TaskStatuses.Completed}
          onChange={changeTaskStatusHandler}
        />
        <EditableSpan
          classes={status === TaskStatuses.Completed ? "task-done" : "task"}
          title={title}
          changeTitle={changeTaskTitleHandler}
          disabled={entityStatus === "loading"}
        />
      </div>
      <IconButton disabled={entityStatus === "loading"} onClick={removeTaskHandler}>
        <HighlightOff />
      </IconButton>
    </li>
  );
};