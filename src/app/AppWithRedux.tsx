import React, { useEffect, useState } from "react";
import "./App.css";
import {
  AppBar, Button, Container,
  IconButton, Toolbar, Typography, createTheme,
  ThemeProvider, PaletteMode, LinearProgress, CircularProgress
} from "@material-ui/core";
import { Brightness4, Menu } from "@material-ui/icons";
import { amber, teal } from "@material-ui/core/colors";
import { useAppDispatch, useAppSelector } from "app/store";
import { TodoListsList } from "features/TodoListsList/ui/TodoListsList";
import { Login } from "features/Login/ui/Login";
import { Navigate, NavLink, Route, Routes, useNavigate } from "react-router-dom";
import { authThunks } from "features/Login/model/auth-reducer";
import { selectAppStatus, selectIsInitialized } from "app/app-selectors";
import { isLoadingSelector } from "features/Login/model/auth.selectors";
import { ErrorSnackbar } from "common/components";


export const AppWithRedux = () => {

  const navigate = useNavigate()
  const status = useAppSelector(selectAppStatus);
  const isInitialized = useAppSelector(selectIsInitialized);
  const isLoggedIn = useAppSelector(isLoadingSelector);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(authThunks.initializeApp());
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
              <Button color={"inherit"} variant={"outlined"} onClick={() => dispatch(authThunks.logout())}>Log
                out</Button>
              : <Button color={"inherit"} variant={"outlined"}><NavLink to={"/ListMaster/login"}>Sign
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
            <Route path={"/ListMaster/content"} element={<TodoListsList />} />
            <Route path={"/ListMaster/login"} element={<Login />} />
            <Route path={"/ListMaster"} element={<Navigate to={"/ListMaster/content"} />} />
            <Route path={"/ListMaster/404"} element={<h1>404: PAGE NOT FOUND</h1>} />
            <Route path={"/ListMaster/*"} element={<Navigate to={"/ListMaster/404"} />} />
          </Routes>
        </Container>
      </div>
    </ThemeProvider>
  );
};
