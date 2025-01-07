import React from 'react';
import { render } from '@testing-library/react';
import { ToastProvider } from '@/components/ui/toast';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ToastProvider>
      {children}
    </ToastProvider>
  );
};

const customRender = (ui: React.ReactElement, options = {}) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render }; 