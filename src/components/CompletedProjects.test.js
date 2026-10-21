import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import CompletedProjects from './CompletedProjects';

jest.mock('./Sidebar', () => () => <nav aria-label="Sidebar" />);

const openNotes = (index = 0) => fireEvent.click(screen.getAllByRole('button', { name: 'Notes' })[index]);

it('opens only the notes dialog and discards unsaved edits on cancel', () => {
  render(<CompletedProjects />);
  openNotes();
  expect(screen.getAllByRole('dialog')).toHaveLength(1);
  expect(screen.getByRole('dialog', { name: 'Project Notes - ITS Sequencing' })).toBeInTheDocument();
  fireEvent.change(screen.getByRole('textbox', { name: 'Project notes' }), { target: { value: 'Unsaved draft' } });
  fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  openNotes();
  expect(screen.getByRole('textbox')).toHaveValue('');
});

it('saves notes per project and preserves saved text after cancelling another draft', () => {
  render(<CompletedProjects />);
  openNotes();
  fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Saved note' } });
  fireEvent.click(screen.getByRole('button', { name: 'Save Notes' }));
  openNotes(1);
  expect(screen.getByRole('textbox')).toHaveValue('');
  fireEvent.click(screen.getByRole('button', { name: 'Close notes' }));
  openNotes();
  expect(screen.getByRole('textbox')).toHaveValue('Saved note');
  fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Saved note changed' } });
  fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
  openNotes();
  expect(screen.getByRole('textbox')).toHaveValue('Saved note');
});

it('opens the selected report and closes it without opening notes', () => {
  render(<CompletedProjects />);
  fireEvent.click(screen.getAllByRole('button', { name: 'Report' })[1]);
  expect(screen.getAllByRole('dialog')).toHaveLength(1);
  const report = screen.getByRole('dialog', { name: 'Project Report - 16S rRNA Analysis' });
  expect(within(report).getByText('Bacterial community analysis in water samples')).toBeInTheDocument();
  fireEvent.click(within(report).getByRole('button', { name: 'Close report' }));
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});
