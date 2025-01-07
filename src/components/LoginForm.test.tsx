import { render, screen, fireEvent, act } from '@/utils/test-utils';
import { LoginForm } from './LoginForm';
import { mockAuthContext, authMocks } from '@/__mocks__/contexts/AuthContext';
import { mockToast } from '@/__mocks__/hooks/use-toast';
import { jest } from '@jest/globals';

// Mock console methods
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

// Mock hooks
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: mockToast
  })
}));

jest.mock('@/hooks/useViewLogger', () => ({
  useViewLogger: jest.fn()
}));

// Mock services
jest.mock('@/services/analyticsService');
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => mockAuthContext
}));

// Mock router
jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn()
}));

// Mock translations
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (str: string) => str,
    i18n: { changeLanguage: jest.fn() }
  })
}));

describe('LoginForm', () => {
  const mockOnOpenChange = jest.fn();
  const mockOnSignUpClick = jest.fn();

  beforeAll(() => {
    // Suppress console logs during tests
    console.log = jest.fn();
    console.error = jest.fn();
  });

  afterAll(() => {
    // Restore console methods after tests
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders login form', () => {
    render(
      <LoginForm 
        onOpenChange={mockOnOpenChange} 
        onSignUpClick={mockOnSignUpClick}
      />
    );
    
    expect(screen.getByPlaceholderText('auth.email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('auth.password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'auth.sign_in' })).toBeInTheDocument();
  });

  it('handles login error', async () => {
    const errorMessage = 'Invalid credentials';
    authMocks.login.mockRejectedValueOnce(new Error(errorMessage));

    render(
      <LoginForm 
        onOpenChange={mockOnOpenChange} 
        onSignUpClick={mockOnSignUpClick}
      />
    );

    const emailInput = screen.getByPlaceholderText('auth.email');
    const passwordInput = screen.getByPlaceholderText('auth.password');
    
    await act(async () => {
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      
      const form = screen.getByRole('form');
      fireEvent.submit(form);
    });

    expect(mockToast).toHaveBeenCalledWith({
      title: 'Login Failed',
      description: errorMessage,
      variant: 'destructive'
    });
  });

  it('shows loading state during submission', async () => {
    authMocks.login.mockImplementationOnce(() => 
      new Promise(resolve => setTimeout(resolve, 100))
    );

    render(
      <LoginForm 
        onOpenChange={mockOnOpenChange} 
        onSignUpClick={mockOnSignUpClick}
      />
    );

    const emailInput = screen.getByPlaceholderText('auth.email');
    const passwordInput = screen.getByPlaceholderText('auth.password');
    
    await act(async () => {
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      
      const form = screen.getByRole('form');
      fireEvent.submit(form);
    });

    expect(screen.getByRole('button', { name: 'common.signing_in' })).toBeInTheDocument();
  });
}); 