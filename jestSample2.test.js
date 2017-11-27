import React from 'react';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });
import css from './client/src/styles.css';
import { shallow, mount, render } from 'enzyme';

import Login from './client/src/components/Login.jsx';
import Chat from './client/src/components/Chat.jsx'
import Game from './client/src/components/Game.jsx'

// test('Verifies Login Component\'s base DOM element is a div', () => {
//   const renderer = new ShallowRenderer();
//   renderer.render(<Login />);
//   const result = renderer.getRenderOutput();
//
//   expect(result.type).toBe('div');
//   expect(result.state().data).toBe('something');
//   console.log(result.state().data);
// });

describe('Login', function() {
  it('should render without throwing an error', function() {
    // console.log('Swag', css.contentSuperWrapper);
    const wrapper = shallow(<Login />);
    // expect(wrapper.find(`.${css.contentSuperWrapper}`).length).toBe(1);
    // expect(wrapper.find(`.contentSuperWrapper`).length).toBe(1);
    expect(wrapper.find('.fargo').exists()).to.equal(true);
  });
});
//
// describe('A suite', function() {
//   it('should render without throwing an error', function() {
//     expect(shallow(<SimpleFoo />).contains(<div className="foo">Bar</div>)).toBe(true);
//   });
//
//   it('should be selectable by class "foo"', function() {
//     expect(shallow(<SimpleFoo />).is('.foo')).toBe(true);
//   });
//
//   it('should mount in a full DOM', function() {
//     expect(mount(<SimpleFoo />).find('.foo').length).toBe(1);
//   });
//
//   it('should render to static HTML', function() {
//     expect(render(<SimpleFoo />).text()).toEqual('Bar');
//   });
// });
