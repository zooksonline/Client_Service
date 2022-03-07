import React from "react";
import triggerReducer from "../reducers/main/triggerReducer";
import "@testing-library/jest-dom";
import { shallow, mount } from "enzyme";
import "../setupTests";
import {
    PAGE_LOADED,
    PAGE_LOADING,
    SEND_ACTIVE_SERVICE,
  } from "../type/main/type";
  const initialState = {
    load: false,
    active: false,
  };
describe("trigger reducer test", () => {
  it("returns the initial state", () => {
    // ุถ้าประกาศ const initialState ต้องใส่ตัวแปร initialState แทน undefined
    expect(triggerReducer(undefined, {})).toEqual(initialState);
  });

  it("returns the PAGE_LOADED state", () => {
    expect(
        triggerReducer(initialState, {
        type: PAGE_LOADED,
      })
    ).toEqual({
        load: false,
        active: false,
    });
  });
  it("returns the PAGE_LOADING state", () => {
    expect(
        triggerReducer(initialState, {
        type: PAGE_LOADING,
      })
    ).toEqual({
        ...initialState,
        load: true,
    });
  });
  it("returns the SEND_ACTIVE_SERVICE state", () => {
    expect(
        triggerReducer(initialState, {
        type: SEND_ACTIVE_SERVICE,
      })
    ).toEqual({
        ...initialState,
        active: true,
    });
  });
});
