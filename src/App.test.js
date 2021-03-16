import React from 'react';
import {
  render, screen, fireEvent
} from '@testing-library/react';
import App from './App';

test('Logs in', () => {
  const result = render(<App />);
  const loginElement = screen.getByText("Log in");
  expect(loginElement).toBeInTheDocument();
  fireEvent.click(loginElement);
  expect(loginElement).not.toBeInTheDocument();
});
test('Shows Leaderboard',()=>{
  const result = render(<App />);
  const loginElement = screen.getByText("Log in");
  fireEvent.click(loginElement);
  const leaderboardElement = screen.getByText("Leaderboard");
  expect(leaderboardElement).toBeInTheDocument();
  fireEvent.click(leaderboardElement);
  expect(leaderboardElement).not.toBeInTheDocument();
});
test('No Specators',()=>{
  const result = render(<App />);
  const loginElement = screen.getByText("Log in");
  expect(loginElement).toBeInTheDocument();
  fireEvent.click(loginElement);
  expect(loginElement).not.toBeInTheDocument();
  const spectatorElement = screen.getByText("Spectators:");
  expect(spectatorElement).toBeInTheDocument();
});