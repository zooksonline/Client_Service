import React from "react";
import RegisterModal from "../components/main/RegisterModalV2";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { shallow, mount } from "enzyme";
import "../setupTests";
import renderer from "react-test-renderer";
import shallowRenderer from "react-test-renderer/shallow";

// TypeError: Cannot read property 'getState' of undefined
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
const store1 = createStore(() => [], {}, applyMiddleware());

it("Snapshot", () => {
  const renderer = new shallowRenderer();
  const snapshot = renderer.render(<RegisterModal />);
  expect(snapshot).toMatchSnapshot();
});
it("Check Tag", () => {
  // const calculator = shallow(<RegisterModal store={store1} />);
  //check ใน tag form
  // const form = calculator.find("Form");
  // calculator.children().dive().find('FormGroup')
  // expect(calculator.length).toBe(1);
  const wrapper = shallow(<RegisterModal store={store1} />);
  // expect(wrapper.find('.in-bar')).to.have.lengthOf(0);
  expect(wrapper.find("Form"));
});

// it('Test click event', () => {
//   const mockCallBack = sinon.spy();
//   const button = shallow((<RegisterModal onClick={mockCallBack} />));
//   button.find('.onSubmit').simulate('click');
//     expect(mockCallBack).toHaveProperty('callCount', 1);
// });

// it("should call onChange prop with input value", () => {
//   const testState = { name: "buasri_id", faculty: "science" };
//   const wrapper = shallow(
//     <RegisterModal
//       name={testState.name}
//       faculty={testState.faculty}
//       onChange={(e) => {
//         testState[e.target.name] = e.target.value;
//       }}
//     />
//   );
//   wrapper
//     .find(".eiei")
//     .at(0)
//     .simulate("change", { target: { name: "name", value: 50 } });
//   expect(testState.value).toEqual(50);
// });
// const component = shallow(<RegisterModal  />);
// component.find('.eiei').simulate('change');
// expect(component).toBe("Nuttiwut")
// it("Simulate onClick textbox", () => {
//   const calculator = shallow(<RegisterModal />)
//   // กำหนดค่า 1 และ 2
//   const form = calculator.find('Form')
//   // กดปุ่มบวก
//   form.find('.formSubmit').simulate('click')
//   // ผลการบวกต้องเป็น 3
//   expect(form).toHaveBeenCalled()
// });
//   /* ทำการ mock handleTextbox ตัวจริงซะ เพราะเราไม่ได้อยากให้มันรันจริงๆ
//    * เราแค่อยากรู้ว่ามันรัน 1 ครั้งจริงๆมั้ย ถ้าเรา change Input
//    * ใน jest.fn() จะสามารถถามมันได้ว่า คุณรัน 1 ครั้งมั้ย  โดยที่ไม่ต้องไปรันจริง (jest.fn() จะมาทำหน้่าที่แทนฟังก์ชั่นจริง)
//    */
//   // const onSearchMock = jest.fn();
//   // const wrapper = shallow(<RegisterModal/>)
//   // wrapper.find('Form').simulate('click')

//   // //ถาม jest.fn() ที่เรา set ให้มันเมื่อกี๊ว่า ถูกรัน 1 ครั้งจริงๆมั้ย
//   // //การจะใช้ toHaveBeenCalledTimes() ได้ ตัวใน expect ต้องเป็น jest.fn() เท่านั้นนะครับ อันนี้เป็นข้อควรระวัง
//   // expect(wrapper).toHaveBeenCalledTimes(1)
// });