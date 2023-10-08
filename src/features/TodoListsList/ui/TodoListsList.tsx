import React, { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "app/store";
import {
  TodoListDomainType,
  todoListsThunks
} from "features/TodoListsList/model/todolists-reducer";
import { Grid, Paper } from "@material-ui/core";
import { TodoList } from "features/TodoListsList/ui/TodoList/TodoList";
import { AddItemForm } from "common/components";
import { Navigate } from "react-router-dom";


export const TodoListsList = () => {

  const todoLists = useAppSelector<Array<TodoListDomainType>>(state => state.todoLists);
  const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isLoggedIn) return;
    dispatch(todoListsThunks.getTodosTC());
  }, []);

  const maxTodoListTitle = 20;

  const addTodoList = useCallback((newTitle: string) => {
    dispatch(todoListsThunks.createTodoTC({ title: newTitle }));
  }, [dispatch]);

  if (!isLoggedIn) {
    return <Navigate to={"/ListMaster/login"} />;
  }

  return (
    <>
      <Grid container sx={{ p: "15px 0" }}>
        <Paper elevation={2}>
          <AddItemForm maxTitle={maxTodoListTitle} addItem={addTodoList} />
        </Paper>
      </Grid>
      <Grid container spacing={3}>
        {
          todoLists.map(tl => {
            return (
              <Grid item key={tl.id}>
                <Paper elevation={4}>
                  <TodoList todoList={tl} />
                </Paper>
              </Grid>
            );
          })
        }
      </Grid>
    </>
  );
};