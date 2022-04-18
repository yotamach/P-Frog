import { render } from '@testing-library/react';

import Popup from './popup';

describe('Popup', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Popup open={true} />);
    expect(baseElement).toBeTruthy();
  });
});
