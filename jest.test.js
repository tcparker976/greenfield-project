import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import ShallowRenderer from 'react-test-renderer/shallow';
import TestRenderer from 'react-test-renderer';
import Login from './client/src/components/Login.jsx';
import Chat from './client/src/components/Chat.jsx'
import Game from './client/src/components/Game.jsx'

// describe('true', () => {
//   it('should be true', () => {
//     expect(true).toBe(true);
//   });
// });

test('Verifies Login Component\'s base DOM element is a div', () => {
  const renderer = new ShallowRenderer();
  renderer.render(<Login />);
  const result = renderer.getRenderOutput();
  console.log(result.props.children);

  expect(result.type).toBe('div');
  // expect(result.state().data).toBe('something');
  // console.log(result.state().data);
});

// test('Verifies Chat Component has necessary methods', () => {
//   const renderer = new ShallowRenderer();
//   renderer.render(<Chat messageArray={[]}/>);
//   const result = renderer.getRenderOutput();
//   console.log(result.props.children);
//   expect(result.type).toBe('div');
// });

// test('Verifies Game\'s base DOM element is a div', () => {
//   const testRenderer = TestRenderer.create(<Game />);
//   const result = renderer.getRenderOutput();
//
//   expect(result.type).toBe('div');
// })
