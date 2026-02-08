import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import KanbanBoard from './components/KanbanBoard';
import './index.css';

function App() {
  const [boards, setBoards] = useState(() => {
    // Try to load from new format
    const saved = localStorage.getItem('kanban-boards');
    if (saved) {
      return JSON.parse(saved);
    }

    // Migration from old format
    const oldData = localStorage.getItem('kanban-tasks');
    if (oldData) {
      const initialBoards = {
        boards: [{
          id: 'board-1',
          title: 'Personal Board',
          tasks: JSON.parse(oldData)
        }],
        activeBoard: 'board-1'
      };
      localStorage.setItem('kanban-boards', JSON.stringify(initialBoards));
      return initialBoards;
    }

    // Default initial state
    return {
      boards: [{
        id: 'board-1',
        title: 'Personal Board',
        tasks: {
          todo: [],
          doing: [],
          done: []
        }
      }],
      activeBoard: 'board-1'
    };
  });

  // Save to localStorage whenever boards change
  useEffect(() => {
    localStorage.setItem('kanban-boards', JSON.stringify(boards));
  }, [boards]);

  const activeBoard = boards.boards.find(b => b.id === boards.activeBoard);

  const handleSelectBoard = (boardId) => {
    setBoards(prev => ({
      ...prev,
      activeBoard: boardId
    }));
  };

  const handleAddBoard = () => {
    const newBoard = {
      id: `board-${Date.now()}`,
      title: `New Board ${boards.boards.length + 1}`,
      tasks: {
        todo: [],
        doing: [],
        done: []
      }
    };

    setBoards(prev => ({
      boards: [...prev.boards, newBoard],
      activeBoard: newBoard.id
    }));
  };

  const handleDeleteBoard = (boardId) => {
    if (boards.boards.length === 1) {
      alert('Cannot delete the last board!');
      return;
    }

    const newBoards = boards.boards.filter(b => b.id !== boardId);
    const newActiveBoard = boards.activeBoard === boardId
      ? newBoards[0].id
      : boards.activeBoard;

    setBoards({
      boards: newBoards,
      activeBoard: newActiveBoard
    });
  };

  const handleEditBoard = (boardId, newTitle) => {
    setBoards(prev => ({
      ...prev,
      boards: prev.boards.map(board =>
        board.id === boardId ? { ...board, title: newTitle } : board
      )
    }));
  };

  const handleTasksUpdate = (updatedTasks) => {
    setBoards(prev => ({
      ...prev,
      boards: prev.boards.map(board =>
        board.id === boards.activeBoard
          ? { ...board, tasks: updatedTasks }
          : board
      )
    }));
  };

  return (
    <div className="flex h-screen bg-slate-900">
      <Sidebar
        boards={boards.boards}
        activeBoard={boards.activeBoard}
        onSelectBoard={handleSelectBoard}
        onAddBoard={handleAddBoard}
        onDeleteBoard={handleDeleteBoard}
        onEditBoard={handleEditBoard}
      />

      <div className="flex-1 overflow-auto">
        {activeBoard && (
          <KanbanBoard
            key={activeBoard.id}
            boardTitle={activeBoard.title}
            initialTasks={activeBoard.tasks}
            onTasksUpdate={handleTasksUpdate}
          />
        )}
      </div>
    </div>
  );
}

export default App;
