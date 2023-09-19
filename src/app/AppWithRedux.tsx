import React, { useEffect, useState } from "react";
import "./App.css";
import {
  AppBar, Button, Container,
  IconButton, Toolbar, Typography, createTheme,
  ThemeProvider, PaletteMode, LinearProgress, CircularProgress
} from "@material-ui/core";
import { Brightness4, Menu } from "@material-ui/icons";
import { amber, teal } from "@material-ui/core/colors";
import { useAppDispatch, useAppSelector } from "redux/store";
import { TodoListsList } from "features/TodoListsList/TodoListsList";
import { ErrorSnackbar } from "components/ErrorSnackbar/ErrorSnackbar";
import { Login } from "features/Login/Login";
import { Navigate, NavLink, Route, Routes } from "react-router-dom";
import { initializeAppTC } from "app/app-reducer";
import { logoutTC } from "redux/auth-reducer";
import { isLoadingSelector } from "app/app.selectors";


export const AppWithRedux = () => {

  const status = useAppSelector(state => state.app.status);
  const isInitialized = useAppSelector(state => state.app.isInitialized);
  const isLoggedIn = useAppSelector(isLoadingSelector);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(initializeAppTC());
  }, []);

  let [mode, setMode] = useState<PaletteMode | undefined>("light");

  const customTheme = createTheme({
    palette: {
      primary: teal,
      secondary: amber,
      mode: mode
    }
  });

  const changeTheme = () => mode === "light" ? setMode("dark") : setMode("light");

  if (!isInitialized) {
    return <div
      style={{ position: "fixed", top: "30%", textAlign: "center", width: "100%" }}>
      <CircularProgress />
    </div>;
  }

  return (
    <ThemeProvider theme={customTheme}>
      <div className="App">
        <ErrorSnackbar />
        <AppBar position={"static"}>
          <Toolbar>
            {/*<IconButton*/}
            {/*    size="large"*/}
            {/*    edge="start"*/}
            {/*    color="inherit"*/}
            {/*    aria-label="menu"*/}
            {/*    sx={{mr: 2}}*/}
            {/*>*/}
            {/*    <Menu/>*/}
            {/*</IconButton>*/}
            <Typography variant={"h6"} component={"div"} sx={{ flexGrow: 1 }}>
              TodoList
            </Typography>
            {isLoggedIn ?
              <Button color={"inherit"} variant={"outlined"} onClick={() => dispatch(logoutTC())}>Log
                out</Button>
              : <Button color={"inherit"} variant={"outlined"}><NavLink to={"/login"}>Sign
                in</NavLink></Button>
            }
            <IconButton onClick={changeTheme}>
              <Brightness4 />
            </IconButton>
          </Toolbar>
          {status === "loading" && <LinearProgress color={"inherit"} />}
        </AppBar>
        <Container>
          <Routes>
            <Route path={"/"} element={<TodoListsList />} />
            <Route path={"/login"} element={<Login />} />
            <Route path={"/404"} element={<h1>404: PAGE NOT FOUND</h1>} />
            <Route path={"*"} element={<Navigate to={"/404"} />} />
          </Routes>
        </Container>
      </div>
    </ThemeProvider>
  );
};
