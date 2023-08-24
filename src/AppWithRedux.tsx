import React, {useCallback, useEffect, useState} from 'react';
import './App.css';
import {TodoList} from "./components/TodoList";
import {AddItemForm} from "./components/AddItemForm";
import {
    AppBar,
    Paper,
    Button,
    Container,
    Grid,
    IconButton,
    Toolbar,
    Typography,
    createTheme,
    ThemeProvider, PaletteMode } from "@material-ui/core";
import {Brightness4, Menu} from "@material-ui/icons";
import {amber, teal} from '@material-ui/core/colors';
import {addTodoListsAC, getTodosTC, TodoListDomainType} from "./redux/todolists-reducer";
import {useAppDispatch, useAppSelector} from "./redux/store";
import {TaskType} from "./api/api";

export type TaskStateType = {
    [id: string]: Array<TaskType>
}

export const AppWithRedux = () => {

    const todoLists = useAppSelector<Array<TodoListDomainType>>(state => state.todoLists)
    const dispatch = useAppDispatch()

    const maxTodoListTitle = 15

    const addTodoList = useCallback((newTitle: string) => {
        const action = addTodoListsAC(newTitle)
        dispatch(action)
    }, [dispatch])

    useEffect(()=>{
        dispatch(getTodosTC())
    }, [])

    const todoListsComponents = todoLists.map(tl => {
        return (
            <Grid item key={tl.id}>
                <Paper elevation={4}>
                    <TodoList
                        todoList={tl}
                    />
                </Paper>
            </Grid>
        )
    })

    let [mode, setMode] = useState<PaletteMode | undefined>('light');

    const customTheme = createTheme({
        palette: {
            primary: teal,
            secondary: amber,
            mode: mode
        }
    })

    const changeTheme = ()=> mode === 'light' ? setMode('dark') : setMode('light')

    return (
        <ThemeProvider theme={customTheme}>
            <div className="App">
                <AppBar position={"static"}>
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{mr: 2}}
                        >
                            <Menu/>
                        </IconButton>
                        <Typography variant={"h6"} component={'div'} sx={{flexGrow: 1}}>
                            TodoList
                        </Typography>
                        <Button color={'inherit'} variant={'outlined'}>Log out</Button>
                        <IconButton onClick={changeTheme}>
                            <Brightness4/>
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <Container>
                    <Grid container sx={{p: "15px 0"}}>
                        <Paper elevation={2}>
                            <AddItemForm maxTitle={maxTodoListTitle} addItem={addTodoList}/>
                        </Paper>
                    </Grid>
                    <Grid container spacing={3}>
                        {todoListsComponents}
                    </Grid>
                </Container>
            </div>
        </ThemeProvider>
    );
}
