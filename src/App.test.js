import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./data', () => ({
  auth: {
    onAuthStateChanged: (callback) => {
      callback(null);
      return jest.fn();
    },
    signInWithEmailAndPassword: jest.fn(),
    signInWithPopup: jest.fn(),
    signOut: jest.fn(),
  },
  googleProvider: {},
  getData: jest.fn(),
  getReports: jest.fn(),
  writeData: jest.fn(),
  writeReport: jest.fn(),
  buildDoc: jest.fn(),
}));

test('renders the login screen', () => {
  render(<App />);
  expect(screen.getByText(/sign in to continue/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /continue with google/i })).toBeInTheDocument();
});
