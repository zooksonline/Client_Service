import React from "react";
import depReducer from "../reducers/main/depReducerV2";
import "@testing-library/jest-dom";
import { shallow, mount } from "enzyme";
import "../setupTests";
import { SET_DEPARTMENT, CLOSE_DEPARTMENT } from "../type/main/type";

describe("department reducer test", () => {
  it("returns the initial state", () => {
    // ุถ้าประกาศ const initialState ต้องใส่ตัวแปร initialState แทน undefined
    expect(depReducer(undefined, { type: "unexpected" })).toEqual({
      list: null,
      loginError: null,
    });
  });

  it("returns the SET_DEPARTMENT state", () => {
    expect(
      depReducer(undefined, {
        // type: {SET_DEPARTMENT},
        type: SET_DEPARTMENT,
        // payload [] ไว้เป็นตัว return ค่าใส่
        /*
        payload: {  list: true, loginError:
           'Sorry, it looks like the Username and/or Password you provided does not match our records'}
        */
      })
    ).toEqual({
      list: "compare",
      loginError:
        "Sorry, it looks like the Username and/or Password you provided does not match our records",
    });
  });
  it("returns the CLOSE_DEPARTMENT state", () => {
    expect(
      depReducer(undefined, {
        type: CLOSE_DEPARTMENT,
      })
    ).toEqual({
      list: null,
    });
  });
});
