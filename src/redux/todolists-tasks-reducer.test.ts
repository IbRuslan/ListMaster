import {addTodoListAC, removeTodoListAC, TodoListDomainType, todoListsReducer} from "./todolists-reducer";
import {TaskStateType} from "../app/AppWithRedux";
import {tasksReducer} from "./tasks-reducer";

test('ids should be equals', () => {
    const startTasksState: TaskStateType = {};
    const startTodolistsState: Array<TodoListDomainType> = [];

    let newTodolistTitle = {id: "todolistId3", title: "What to learn", filter: "all", order: 0, addedDate: ''};

    const action = addTodoListAC(newTodolistTitle);

    const endTasksState = tasksReducer(startTasksState, action)
    const endTodolistsState = todoListsReducer(startTodolistsState, action)

    const keys = Object.keys(endTasksState);
    const idFromTasks = keys[0];
    const idFromTodolists = endTodolistsState[0].id;

    expect(idFromTasks).toBe(action.todoListId.id);
    expect(idFromTodolists).toBe(action.todoListId.id);
});

test('property with todolistId should be deleted', () => {
    const startState: TaskStateType = {
        "todolistId1": [
            {
                id: "1",
                title: "CSS",
                status: 0,
                priority: 0,
                description: '',
                todoListId: "todolistId1",
                order: 0,
                startDate: '',
                deadline: '',
                addedDate: ''
            },
            {
                id: "2",
                title: "JS",
                status: 2,
                priority: 0,
                description: '',
                todoListId: "todolistId1",
                order: 0,
                startDate: '',
                deadline: '',
                addedDate: '' },
            {
                id: "3",
                title: "React",
                status: 0,
                priority: 0,
                description: '',
                todoListId: "todolistId1",
                order: 0,
                startDate: '',
                deadline: '',
                addedDate: ''
            }
        ],
        "todolistId2": [
            {
                id: "1",
                title: "bread",
                status: 0,
                priority: 0,
                description: '',
                todoListId: "todolistId2",
                order: 0,
                startDate: '',
                deadline: '',
                addedDate: ''
            },
            {
                id: "2",
                title: "milk",
                status: 2,
                priority: 0,
                description: '',
                todoListId: "todolistId2",
                order: 0,
                startDate: '',
                deadline: '',
                addedDate: ''
            },
            {
                id: "3",
                title: "tea",
                status: 0,
                priority: 0,
                description: '',
                todoListId: "todolistId2",
                order: 0,
                startDate: '',
                deadline: '',
                addedDate: ''
            }
        ]
    };

    const action = removeTodoListAC("todolistId2");

    const endState = tasksReducer(startState, action)


    const keys = Object.keys(endState);

    expect(keys.length).toBe(1);
    expect(endState["todolistId2"]).not.toBeDefined();
});