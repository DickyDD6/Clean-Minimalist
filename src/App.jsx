import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import KanbanBoard from './components/KanbanBoard';
import Home from './components/Home';
import CreateBoardModal from './components/CreateBoardModal';
import EditBoardModal from './components/EditBoardModal';
import { ToastProvider, useToast } from './context/ToastContext';
import './index.css';

function AppContent() {
  const { showToast } = useToast();
  const [boards, setBoards] = useState(() => {
    const saved = localStorage.getItem('kanban-boards');
    if (saved) {
      const parsed = JSON.parse(saved);
      parsed.boards = parsed.boards.map(board => ({
        ...board,
        type: board.type || 'advanced',
        category: board.category || 'Work',
        archived: board.archived || false,
        columns: board.columns || [
          { id: 'todo', title: 'To Do', color: 'border-indigo-500' },
          { id: 'doing', title: 'Doing', color: 'border-amber-500' },
          { id: 'done', title: 'Done', color: 'border-emerald-500' }
        ]
      }));
      return parsed;
    }

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

    return {
      boards: [{
        id: 'board-1',
        title: 'Personal Board',
        columns: [
          { id: 'todo', title: 'To Do', color: 'border-indigo-500' },
          { id: 'doing', title: 'Doing', color: 'border-amber-500' },
          { id: 'done', title: 'Done', color: 'border-emerald-500' }
        ],
        tasks: {
          todo: [],
          doing: [],
          done: []
        }
      }],
      activeBoard: 'board-1'
    };
  });

  useEffect(() => {
    setBoards(prev => ({
      ...prev,
      boards: prev.boards.map(board => {
        if (!board.columns) {
          return {
            ...board,
            columns: [
              { id: 'todo', title: 'To Do', color: 'border-indigo-500' },
              { id: 'doing', title: 'Doing', color: 'border-amber-500' },
              { id: 'done', title: 'Done', color: 'border-emerald-500' }
            ]
          };
        }
        return board;
      })
    }));
  }, []);

  const [currentView, setCurrentView] = useState('home');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editBoardId, setEditBoardId] = useState(null);

  useEffect(() => {
    localStorage.setItem('kanban-boards', JSON.stringify(boards));
  }, [boards]);

  const activeBoard = boards.boards.find(b => b.id === boards.activeBoard);

  const handleGoHome = () => {
    setCurrentView('home');
  };

  const handleSelectBoard = (boardId) => {
    setBoards(prev => ({
      ...prev,
      activeBoard: boardId
    }));
    setCurrentView('board');
  };

  const handleAddBoardClick = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateBoard = (title, description, type = 'standard', category = 'Work') => {
    const newBoard = {
      id: `board-${Date.now()}`,
      title: title,
      description: description,
      type: type,
      category: category,
      columns: [
        { id: 'todo', title: 'To Do', color: 'border-indigo-500' },
        { id: 'doing', title: 'Doing', color: 'border-amber-500' },
        { id: 'done', title: 'Done', color: 'border-emerald-500' }
      ],
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
    setCurrentView('board');
    setIsCreateModalOpen(false);
  };

  const handleDeleteBoard = (boardId) => {
    const activeBoards = boards.boards.filter(b => !b.archived);
    if (activeBoards.length === 1 && !boards.boards.find(b => b.id === boardId)?.archived) {
      showToast('Tidak bisa menghapus board aktif terakhir!', 'error');
      return;
    }

    const newBoards = boards.boards.filter(b => b.id !== boardId);
    const newActiveBoard = boards.activeBoard === boardId
      ? newBoards.find(b => !b.archived)?.id || newBoards[0]?.id
      : boards.activeBoard;

    setBoards({
      boards: newBoards,
      activeBoard: newActiveBoard
    });
    
    showToast('Board berhasil dihapus', 'success');
  };

  const handleArchiveBoard = (boardId) => {
    const activeBoards = boards.boards.filter(b => !b.archived);
    if (activeBoards.length === 1) {
      showToast('Tidak bisa mengarsip board aktif terakhir!', 'warning');
      return;
    }

    setBoards(prev => {
      const updatedBoards = prev.boards.map(board =>
        board.id === boardId ? { ...board, archived: true } : board
      );
      
      const newActiveBoard = prev.activeBoard === boardId
        ? updatedBoards.find(b => !b.archived)?.id
        : prev.activeBoard;

      return {
        boards: updatedBoards,
        activeBoard: newActiveBoard
      };
    });
    
    showToast('Board berhasil diarsipkan', 'success');
  };

  const handleUnarchiveBoard = (boardId) => {
    setBoards(prev => ({
      ...prev,
      boards: prev.boards.map(board =>
        board.id === boardId ? { ...board, archived: false } : board
      )
    }));
    
    showToast('Board berhasil dikembalikan', 'success');
  };

  const handleEditBoard = (boardId, updates) => {
    setBoards(prev => ({
      ...prev,
      boards: prev.boards.map(board =>
        board.id === boardId ? { ...board, ...updates } : board
      )
    }));
    setEditBoardId(null);
  };

  const handleOpenEditBoard = (boardId) => {
    setEditBoardId(boardId);
  };

  const handleAddColumn = (boardId, title, color) => {
    const newColumnId = `col-${Date.now()}`;
    const newColumn = { id: newColumnId, title, color };

    setBoards(prev => ({
      ...prev,
      boards: prev.boards.map(board => {
        if (board.id !== boardId) return board;
        return {
          ...board,
          columns: [...(board.columns || []), newColumn],
          tasks: { ...board.tasks, [newColumnId]: [] }
        };
      })
    }));
  };

  const handleEditColumn = (boardId, columnId, newTitle, newColor) => {
    setBoards(prev => ({
      ...prev,
      boards: prev.boards.map(board => {
        if (board.id !== boardId) return board;
        return {
          ...board,
          columns: board.columns.map(col =>
            col.id === columnId
              ? { ...col, title: newTitle, color: newColor || col.color }
              : col
          )
        };
      })
    }));
  };

  const handleDeleteColumn = (boardId, columnId) => {
    setBoards(prev => ({
      ...prev,
      boards: prev.boards.map(board => {
        if (board.id !== boardId) return board;

        const newColumns = board.columns.filter(col => col.id !== columnId);
        const { [columnId]: deletedTasks, ...newTasks } = board.tasks;

        return {
          ...board,
          columns: newColumns,
          tasks: newTasks
        };
      })
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
        currentView={currentView}
        onGoHome={handleGoHome}
        onSelectBoard={handleSelectBoard}
        onAddBoard={handleAddBoardClick}
        onDeleteBoard={handleDeleteBoard}
        onArchiveBoard={handleArchiveBoard}
        onEditBoard={handleOpenEditBoard}
      />

      <div className="flex-1 overflow-auto">
        {currentView === 'home' ? (
          <Home
            boards={boards.boards}
            onSelectBoard={handleSelectBoard}
            onCreateBoard={handleAddBoardClick}
            onUnarchiveBoard={handleUnarchiveBoard}
            onDeleteBoard={handleDeleteBoard}
          />
        ) : (
          activeBoard ? (
            <KanbanBoard
              key={activeBoard.id}
              boardId={activeBoard.id}
              boardTitle={activeBoard.title}
              boardDescription={activeBoard.description}
              boardType={activeBoard.type || 'advanced'}
              initialTasks={activeBoard.tasks}
              columns={activeBoard.columns}
              onTasksUpdate={handleTasksUpdate}
              onEditBoard={() => handleOpenEditBoard(activeBoard.id)}
              onAddColumn={handleAddColumn}
              onEditColumn={handleEditColumn}
              onDeleteColumn={handleDeleteColumn}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <h2 className="text-2xl font-bold mb-4">Board Tidak Ditemukan</h2>
              <p className="mb-6">Board yang Anda cari mungkin telah dihapus.</p>
              <button
                onClick={handleGoHome}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Kembali ke Home
              </button>
            </div>
          )
        )}
      </div>

      <CreateBoardModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateBoard}
      />

      <EditBoardModal
        isOpen={!!editBoardId}
        onClose={() => setEditBoardId(null)}
        board={boards.boards.find(b => b.id === editBoardId)}
        onSave={handleEditBoard}
      />
    </div>
  );
}

function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}

export default App;
