import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers";

function saveToLocalStorage(state) {
  const serializedState = JSON.stringify(state);
  // console.log("this save = " + serializedState);
  localStorage.setItem("state", serializedState);
}

function loadFromLocalStorage() {
  const serializedState = localStorage.getItem("state");
  // console.log("this load = " + serializedState);
  if (serializedState === null) return undefined;
  return JSON.parse(serializedState);
}

const middleware = [thunk];

const presistedState = loadFromLocalStorage();

// tool สำหรับดู redux
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// store ใช้เก็บ state ทั้งหมด
const store = createStore(
  rootReducer,
  presistedState,
  composeEnhancers(applyMiddleware(...middleware))
);

// // store ใช้เก็บ state ทั้งหมด
// const store = createStore(
//   rootReducer,
//   presistedState,
//   applyMiddleware(...middleware)
// );

store.subscribe(() => saveToLocalStorage(store.getState()));

export default store;
