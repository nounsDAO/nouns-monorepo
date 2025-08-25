import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { default as ABIUpload } from './abi-upload';

describe('ABIUpload Component', () => {
  it('should render the correct default label when file name is not etherscan-abi-download.json', () => {
    render(
      <ABIUpload
        abiFileName="test-file.json"
        isValid={false}
        isInvalid={false}
        onChange={vi.fn()}
      />,
    );

    expect(screen.getByText('ABI')).toBeInTheDocument();
  });

  it('should render the correct label when file name is etherscan-abi-download.json', () => {
    render(
      <ABIUpload
        abiFileName="etherscan-abi-download.json"
        isValid={false}
        isInvalid={false}
        onChange={vi.fn()}
      />,
    );

    expect(screen.getByText('etherscan-abi-download.json')).toBeInTheDocument();
  });

  it('should pass the correct props to Form.Control', () => {
    render(
      <ABIUpload
        abiFileName="test-file.json"
        isValid={true}
        isInvalid={false}
        onChange={vi.fn()}
      />,
    );

    const input = screen.getByLabelText(/abi/i) as HTMLInputElement;
    expect(input).toHaveAttribute('type', 'file');
    expect(input).toHaveAttribute('accept', 'application/JSON');
    expect(input).toBeValid();
    expect(input).not.toBeInvalid();
  });

  it('should trigger onChange callback when file input changes', () => {
    const handleChange = vi.fn();
    render(
      <ABIUpload
        abiFileName="test-file.json"
        isValid={false}
        isInvalid={false}
        onChange={handleChange}
      />,
    );

    const input = screen.getByLabelText(/abi/i) as HTMLInputElement;
    fireEvent.change(input, {
      target: { files: [new File(['content'], 'test.json', { type: 'application/json' })] },
    });

    expect(handleChange).toHaveBeenCalledTimes(1);
  });
});
