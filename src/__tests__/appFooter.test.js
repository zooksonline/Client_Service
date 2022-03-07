import React from "react";
import AppFooter from "../components/main/AppFooter";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { shallow, mount } from "enzyme";
import "../setupTests";

// TypeError: Cannot read property 'getState' of undefined
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
// const store = createStore(() => [], {}, applyMiddleware());
const store = createStore(() => [], {}, applyMiddleware());

it("isTrue", () => {
//   const calculator = shallow(<Provider store={store}><AppFooter /></Provider>);
const calculator = shallow(<AppFooter />);
  //check ใน tag form
  const form = calculator.find("Row");
  expect(form.length).toBe(1);
});

