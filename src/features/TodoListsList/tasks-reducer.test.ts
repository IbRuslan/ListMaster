import {
  tasksActions,
  tasksReducer,
  TaskStateType, tasksThunks
} from "features/TodoListsList/tasks-reducer";
import { TaskPriorities, TaskStatuses } from "common/api/api";
import { TaskType } from "features/TodoListsList/todoListApi";

let startState: TaskStateType;


beforeEach(() => {
  startState = {
    "todolistId1": [
      {
        id: "1",
        title: "CSS",
        status: TaskStatuses.New,
        priority: TaskPriorities.Low,
        description: "",
        todoListId: "todolistId1",
        order: 0,
        startDate: "",
        deadline: "",
        addedDate: "",
        entityStatus: "idle"
      },
      {
        id: "2",
        title: "JS",
        status: TaskStatuses.Completed,
        priority: TaskPriorities.Low,
        description: "",
        todoListId: "todolistId1",
        order: 0,
        startDate: "",
        deadline: "",
        addedDate: "",
        entityStatus: "idle"
      },
      {
        id: "3",
        title: "React",
        status: TaskStatuses.New,
        priority: TaskPriorities.Low,
        description: "",
        todoListId: "todolistId1",
        order: 0,
        startDate: "",
        deadline: "",
        addedDate: "",
        entityStatus: "idle"
      }
    ],
    "todolistId2": [
      {
        id: "1",
        title: "bread",
        status: TaskStatuses.New,
        priority: TaskPriorities.Low,
        description: "",
        todoListId: "todolistId2",
        order: 0,
        startDate: "",
        deadline: "",
        addedDate: "",
        entityStatus: "idle"
      },
      {
        id: "2",
        title: "milk",
        status: TaskStatuses.Completed,
        priority: TaskPriorities.Low,
        description: "",
        todoListId: "todolistId2",
        order: 0,
        startDate: "",
        deadline: "",
        addedDate: "",
        entityStatus: "idle"
      },
      {
        id: "3",
        title: "tea",
        status: TaskStatuses.New,
        priority: TaskPriorities.Low,
        description: "",
        todoListId: "todolistId2",
        order: 0,
        startDate: "",
        deadline: "",
        addedDate: "",
        entityStatus: "idle"
      }
    ]
  };
});


test("tasks should be added for todoList", () => {

  type FetchTasksAction = {
    type: string;
    payload: { tasks: TaskType[]; todolistId: string };
  };

  const action: FetchTasksAction = {
    type: tasksThunks.getTasksTC.fulfilled.type,
    payload: { tasks: startState["todolistId1"], todolistId: "todolistId1" }
  };

  const endState = tasksReducer(
    {
      todolistId2: [],
      todolistId1: []
    },
    action
  );

  expect(endState["todolistId1"].length).toBe(3);
  expect(endState["todolistId2"].length).toBe(0);
});

test("correct task should be deleted from correct array", () => {

  const action = tasksThunks.deleteTaskTC.fulfilled({ todoListId: "todolistId2", taskId: "2" }, "requestId", { todoListId: "todolistId2", taskId: "2" } );

  const endState = tasksReducer(startState, action);

  expect(endState).toEqual({
    "todolistId1": [
      {
        id: "1",
        title: "CSS",
        status: TaskStatuses.New,
        priority: TaskPriorities.Low,
        description: "",
        todoListId: "todolistId1",
        order: 0,
        startDate: "",
        deadline: "",
        addedDate: "",
        entityStatus: "idle"
      },
      {
        id: "2",
        title: "JS",
        status: TaskStatuses.Completed,
        priority: TaskPriorities.Low,
        description: "",
        todoListId: "todolistId1",
        order: 0,
        startDate: "",
        deadline: "",
        addedDate: "",
        entityStatus: "idle"
      },
      {
        id: "3",
        title: "React",
        status: TaskStatuses.New,
        priority: TaskPriorities.Low,
        description: "",
        todoListId: "todolistId1",
        order: 0,
        startDate: "",
        deadline: "",
        addedDate: "",
        entityStatus: "idle"
      }
    ],
    "todolistId2": [
      {
        id: "1",
        title: "bread",
        status: TaskStatuses.New,
        priority: TaskPriorities.Low,
        description: "",
        todoListId: "todolistId2",
        order: 0,
        startDate: "",
        deadline: "",
        addedDate: "",
        entityStatus: "idle"
      },
      {
        id: "3",
        title: "tea",
        status: TaskStatuses.New,
        priority: TaskPriorities.Low,
        description: "",
        todoListId: "todolistId2",
        order: 0,
        startDate: "",
        deadline: "",
        addedDate: "",
        entityStatus: "idle"
      }
    ]
  });

});

test("correct task should be added to correct array", () => {

  const newTask = {
    id: "4",
    title: "juce",
    status: TaskStatuses.New,
    priority: TaskPriorities.Low,
    description: "",
    todoListId: "todolistId2",
    order: 0,
    startDate: "",
    deadline: "",
    addedDate: ""
  };

  const action = tasksThunks.createTaskTC.fulfilled(
    { task: newTask }, "requestId", { title: "juce", todoId: "todolistId2" }
  );

  const endState = tasksReducer(startState, action);

  expect(endState["todolistId1"].length).toBe(3);
  expect(endState["todolistId2"].length).toBe(4);
  expect(endState["todolistId2"][0].id).toBeDefined();
  expect(endState["todolistId2"][0].title).toBe("juce");
  expect(endState["todolistId2"][0].status).toBe(TaskStatuses.New);
});

test("status of specified task should be changed", () => {

  const payload = { todolistId: "todolistId2", taskId: "2", domainModel: { status: TaskStatuses.New } }

  const action = tasksThunks.updateTaskTC.fulfilled(
    payload,
    "requestId",
    payload
  );

  const endState = tasksReducer(startState, action);

  expect(endState["todolistId1"][1].status).toBe(TaskStatuses.Completed);
  expect(endState["todolistId2"][1].status).toBe(TaskStatuses.New);
});

test("title of specified task should be changed", () => {

  const payload = { todolistId: "todolistId2", taskId: "2", domainModel: { title: "cheese" } }

  const action = tasksThunks.updateTaskTC.fulfilled(
    payload,
    "requestId",
    payload
  );

  const endState = tasksReducer(startState, action);

  expect(endState["todolistId1"][1].title).toBe("JS");
  expect(endState["todolistId2"][1].title).toBe("cheese");
});