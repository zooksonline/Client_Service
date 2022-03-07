import React from 'react'
import Calculator from '../calculate'
import { render,screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { shallow, mount } from 'enzyme'
import "../setupTests"

it('Should display calculator page correctly', () => {
  const calculator = shallow(<Calculator />)
    //check ใน tag form
  const form = calculator.find('form')
  expect(form.length).toBe(1)
//   type input มี 2 ช่อง
  expect(form.find('input').length).toBe(2)
  expect(form.find('button').length).toBe(4)
  expect(form.find('p.result').length).toBe(1)
});

it('Should display result for plus correctly', () => {
  const calculator = mount(<Calculator />)
  // กำหนดค่า 1 และ 2
  const form = calculator.find('form')
  form.childAt(0).instance().value = 1
  form.childAt(1).instance().value = 2
  // กดปุ่มบวก
  form.find('button.plus').simulate('click')
  // ผลการบวกต้องเป็น 3
  expect(form.find('p.result').text()).toEqual('3')
});

it('Should return the correct from plus', () => {
  const calculator = new Calculator()

  const result = calculator.plus(1, 2)
  expect(result).toEqual(3)
});