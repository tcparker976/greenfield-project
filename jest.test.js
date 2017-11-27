import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import ShallowRenderer from 'react-test-renderer/shallow';
import TestRenderer from 'react-test-renderer';

import Login from './client/src/components/Login.jsx';
import Signup from './client/src/components/Signup.jsx';
import Welcome from './client/src/components/Welcome.jsx';

test('Verifies Login Component\'s base DOM element is a div', () => {
  const renderer = new ShallowRenderer();
  renderer.render(<Login />);
  const result = renderer.getRenderOutput();

  expect(result.type).toBe('div');
});

test('Verifies Signup Component\'s base DOM element is a div', () => {
  const renderer = new ShallowRenderer();
  renderer.render(<Signup />);
  const result = renderer.getRenderOutput();

  expect(result.type).toBe('div');
});

test('Verifies Welome Component\'s base DOM element is a div', () => {
  const renderer = new ShallowRenderer();
  renderer.render(<Welcome />);
  const result = renderer.getRenderOutput();

  expect(result.type).toBe('div');
});
