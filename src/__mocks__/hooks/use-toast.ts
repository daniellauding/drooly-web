import { jest } from '@jest/globals';

export const mockToast = jest.fn();

export const useToast = () => ({
  toast: mockToast,
  dismiss: jest.fn(),
}); 