import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RequestForm } from './lead-request-form.component';

describe('RequestForm - Lead Capture Business Logic', () => {
  const mockInterestList = ['ai-course', 'data-science', 'neural-networks'];
  
  beforeEach(() => {
    mockSubmitCb.mockClear();
  });
  const mockSubmitCb = jest.fn();



});
