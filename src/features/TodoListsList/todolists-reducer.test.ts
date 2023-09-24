import { v1 } from "uuid";
import {
  FilterValuesType,
  TodoListDomainType,
  todoListsActions,
  todoListsReducer,
  todoListsThunks
} from "features/TodoListsList/todolists-reducer";


let todolistId1: string;
let todolistId2: string;

let startState: Array<TodoListDomainType>;

beforeEach(() => {
  todolistId1 = v1();
  todolistId2 = v1();

  startState = [
    { id: todolistId1, title: "What to learn", filter: "all", order: 0, addedDate: "", entityStatus: "idle" },
    { id: todolistId2, title: "What to buy", filter: "all", order: 0, addedDate: "", entityStatus: "idle" }
  ];
});

test("correct todolist should be removed", () => {

  const endState =
    todoListsReducer(startState, todoListsThunks.removeTodoTC.fulfilled({ todoListId: todolistId1 }, "requestId", {todoId: todolistId1} ));
  //
  expect(endState.length).toBe(1);
  expect(endState[0].id).toBe(todolistId2);
});

test("correct todolist should be added", () => {

  let newTodolistTitle = {
    id: "todolistId3",
    title: "What to learn",
    filter: "all",
    order: 0,
    addedDate: "",
    entityStatus: "idle"
  };

  const endState =
    todoListsReducer(startState, todoListsThunks.createTodoTC.fulfilled({ todoList: newTodolistTitle }, "requestId", { title: "What to learn" }));
  //
  expect(endState.length).toBe(3);
  expect(endState[0].title).toBe(newTodolistTitle.title);
});

test("correct todolist should change its name", () => {

  let newTodolistTitle = "New Todolist";

  const endState = todoListsReducer(startState, todoListsThunks.updateTodoTC.fulfilled({
    todoListId: todolistId2,
    newTitle: newTodolistTitle
  }, "requestId", { todoId: todolistId2, newTitle: newTodolistTitle }));

  expect(endState[0].title).toBe("What to learn");
  expect(endState[1].title).toBe(newTodolistTitle);
});

test("correct todolist should change its filter", () => {

  let newTodolistFilter: FilterValuesType = "completed";

  const action = {
    type: "CHANGE-TODOLIST-FILTER",
    nextFilterValue: newTodolistFilter,
    todoListId: todolistId2
  };
  const endState = todoListsReducer(startState, todoListsActions.changeTodoListFilter({
    todoListId: todolistId2,
    newFilterValue: newTodolistFilter
  }));

  expect(endState[0].filter).toBe("all");
  expect(endState[1].filter).toBe("completed");
});

