import React, {useEffect, useState} from 'react'
import axios from "axios";
import {TaskPriorities, TasksApi, TaskStatuses, TodoListApi} from "../api/api";

export default {
    title: 'API'
}

const instance = axios.create({
    url: "https://social-network.samuraijs.com/api/1.1",
    withCredentials: true
})

export const GetTodolists = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        TodoListApi.getTodoLists()
            .then(res => {
                setState(res.data)
            })
    }, [])
    return <div>{JSON.stringify(state)}</div>
}
export const CreateTodolist = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        TodoListApi.createTodoList('React')
            .then(res => {
                setState(res.data)
            })
    }, [])

    return <div>{JSON.stringify(state)}</div>
}
export const DeleteTodolist = () => {
    const [state, setState] = useState<any>(null)
    const todoId = '4cd0316d-12ef-4c95-9bac-25d3463affbf'
    useEffect(() => {
        TodoListApi.deleteTodoList(todoId)
            .then(res => {
                setState(res.data)
            })
    }, [])

    return <div>{JSON.stringify(state)}</div>
}
export const UpdateTodolistTitle = () => {
    const [state, setState] = useState<any>(null)
    const todoId = '50d46bbd-b7d9-4780-985d-ec154ff7a532'
    useEffect(() => {
        TodoListApi.updateTodoList(todoId, 'Redux')
            .then(res => {
                setState(res.data)
            })
    }, [])

    return <div>{JSON.stringify(state)}</div>
}

export const GetTask= () => {
    const [state, setState] = useState<any>(null)
    const todoId = "b83faa19-58e4-4627-b432-862a9c2575de"
    useEffect(() => {
        TasksApi.getTasks(todoId)
            .then(res => {
                setState(res.data)
            })
    }, [])
    return <div>{JSON.stringify(state)}</div>
}
export const CreateTask = () => {
    const [state, setState] = useState<any>(null)
    const todoId = "b83faa19-58e4-4627-b432-862a9c2575de"
    useEffect(() => {
        TasksApi.createTask(todoId, 'first')
            .then(res => {
                setState(res.data)
            })
    }, [])

    return <div>{JSON.stringify(state)}</div>
}
export const DeleteTask = () => {
    const [state, setState] = useState<any>(null)
    const todoId = "b83faa19-58e4-4627-b432-862a9c2575de"
    const taskId = "92b22d94-13c6-4828-846f-31c53b65a51c"
    useEffect(() => {
        TasksApi.deleteTask(todoId, taskId)
            .then(res => {
                setState(res.data)
            })
    }, [])

    return <div>{JSON.stringify(state)}</div>
}
export const UpdateTask = () => {
    const [state, setState] = useState<any>(null)
    const todoId = "b83faa19-58e4-4627-b432-862a9c2575de"
    const taskId = "172038cf-5ea0-49b0-a0e7-fd0ab7f5f620"
    const task = {
        title: "first",
        description: '',
        status: 0,
        priority: 1,
        startDate: '',
        deadline: '',
    }

    useEffect(() => {
        TasksApi.updateTask(todoId, taskId, task)
            .then(res => {
                setState(res.data)
            })
    }, [])

    return <div>{JSON.stringify(state)}</div>
}

