import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import ShallowRenderer from 'react-test-renderer/shallow';
import Login from './client/src/components/Login.jsx'

describe('add', () => {
  it('should be true', () => {
    expect(true).toBe(true);
  });
});

test('Verifies Login Component\'s base DOM element is a div', () => {
  const renderer = new ShallowRenderer();
  renderer.render(<Login />);
  const result = renderer.getRenderOutput();

  expect(result.type).toBe('div');
});
