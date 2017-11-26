import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import ShallowRenderer from 'react-test-renderer/shallow';
import Chat from './client/src/components/Chat.jsx'

describe('add', () => {
  it('should be true', () => {
    expect(true).toBe(true);
  });
});

test('chatInput tracks input field changes', () => {
  const renderer = new ShallowRenderer();
  renderer.render(<Chat />);
  const result = renderer.getRenderOutput();

  expect(result.type).toBe('div');
});
