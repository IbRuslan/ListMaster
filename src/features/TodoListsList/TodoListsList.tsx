import React from "react";
import {useAppSelector} from "../../redux/store";
import {TodoListDomainType} from "../../redux/todolists-reducer";
import {Grid, Paper} from "@material-ui/core";
import {TodoList} from "../../components/TodoList";

type TodoListsListPropsType = {}

export const TodoListsList: React.FC<TodoListsListPropsType> = ({...props}) => {

    const todoLists = useAppSelector<Array<TodoListDomainType>>(state => state.todoLists)

    return (
        <Grid container spacing={3}>
            {
                todoLists.map(tl => {
                    return (
                        <Grid item key={tl.id}>
                            <Paper elevation={4}>
                                <TodoList todoList={tl}/>
                            </Paper>
                        </Grid>
                    )
                })
            }
        </Grid>
    )
}