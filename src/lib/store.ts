import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  initials: string;
  color: string;
}

export interface Label {
  id: string;
  name: string;
  color: string;
}

export interface Card {
  id: string;
  title: string;
  description: string;
  columnId: string;
  boardId: string;
  assignees: string[];
  labels: string[];
  dueDate?: string;
  order: number;
}

export interface Column {
  id: string;
  title: string;
  boardId: string;
  order: number;
}

export interface Board {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

export interface ModalState {
  isOpen: boolean;
  type?: 'card' | 'column' | 'delete-card' | 'delete-column' | 'delete-board';
  data?: Card | Column | Board | null;
}

export interface FilterState {
  searchQuery: string;
  selectedLabels: string[];
  selectedAssignees: string[];
}

interface KanbanStore {
  // Boards
  boards: Board[];
  currentBoardId: string | null;
  addBoard: (board: Board) => void;
  deleteBoard: (id: string) => void;
  setCurrentBoard: (id: string) => void;

  // Columns
  columns: Column[];
  addColumn: (column: Column) => void;
  deleteColumn: (id: string) => void;
  updateColumn: (id: string, title: string) => void;
  reorderColumns: (columns: Column[]) => void;

  // Cards
  cards: Card[];
  addCard: (card: Card) => void;
  updateCard: (id: string, updates: Partial<Card>) => void;
  deleteCard: (id: string) => void;
  moveCard: (cardId: string, columnId: string, order: number) => void;
  reorderCards: (columnId: string, cards: Card[]) => void;

  // Users (mock)
  users: User[];

  // Labels
  labels: Label[];
  addLabel: (label: Label) => void;

  // Modal
  modal: ModalState;
  openCardModal: (card?: Card) => void;
  openColumnModal: (column?: Column) => void;
  openDeleteModal: (type: 'card' | 'column' | 'board', data: Card | Column | Board) => void;
  closeModal: () => void;

  // Filters
  filters: FilterState;
  setSearchQuery: (query: string) => void;
  setSelectedLabels: (labels: string[]) => void;
  setSelectedAssignees: (assignees: string[]) => void;
  clearFilters: () => void;

  // Persistence
  hydrate: () => void;
}

const MOCK_USERS: User[] = [
  { id: '1', name: 'Alice Johnson', initials: 'AJ', color: '#3B82F6' },
  { id: '2', name: 'Bob Smith', initials: 'BS', color: '#EF4444' },
  { id: '3', name: 'Carol White', initials: 'CW', color: '#10B981' },
  { id: '4', name: 'David Brown', initials: 'DB', color: '#F59E0B' },
];

const INITIAL_STATE = {
  boards: [
    {
      id: '1',
      title: 'Web App Project',
      description: 'Frontend development project',
      createdAt: new Date().toISOString(),
    },
  ],
  columns: [
    { id: 'col-1', title: 'To Do', boardId: '1', order: 0 },
    { id: 'col-2', title: 'In Progress', boardId: '1', order: 1 },
    { id: 'col-3', title: 'Review', boardId: '1', order: 2 },
    { id: 'col-4', title: 'Done', boardId: '1', order: 3 },
  ],
  cards: [
    {
      id: 'card-1',
      title: 'Setup project repository',
      description: 'Initialize Git repo and setup CI/CD',
      columnId: 'col-1',
      boardId: '1',
      assignees: ['1'],
      labels: ['feature'],
      order: 0,
    },
    {
      id: 'card-2',
      title: 'Design database schema',
      description: 'Plan and design database architecture',
      columnId: 'col-1',
      boardId: '1',
      assignees: ['2', '3'],
      labels: ['backend'],
      order: 1,
    },
    {
      id: 'card-3',
      title: 'Create UI mockups',
      description: 'Design UI components and layouts',
      columnId: 'col-2',
      boardId: '1',
      assignees: ['4'],
      labels: ['design'],
      order: 0,
    },
    {
      id: 'card-4',
      title: 'Implement authentication',
      description: 'Setup user authentication system',
      columnId: 'col-3',
      boardId: '1',
      assignees: ['2'],
      labels: ['feature', 'backend'],
      dueDate: '2024-02-15',
      order: 0,
    },
    {
      id: 'card-5',
      title: 'Write API documentation',
      description: 'Document all API endpoints',
      columnId: 'col-4',
      boardId: '1',
      assignees: ['1'],
      labels: ['documentation'],
      order: 0,
    },
  ],
  labels: [
    { id: 'label-1', name: 'Feature', color: '#3B82F6' },
    { id: 'label-2', name: 'Bug', color: '#EF4444' },
    { id: 'label-3', name: 'Backend', color: '#8B5CF6' },
    { id: 'label-4', name: 'Frontend', color: '#EC4899' },
    { id: 'label-5', name: 'Design', color: '#F59E0B' },
    { id: 'label-6', name: 'Documentation', color: '#10B981' },
  ],
  users: MOCK_USERS,
  currentBoardId: '1',
  modal: { isOpen: false },
  filters: { searchQuery: '', selectedLabels: [], selectedAssignees: [] },
};

export const useKanbanStore = create<KanbanStore>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      // Boards
      addBoard: (board) =>
        set((state) => ({
          boards: [...state.boards, board],
          currentBoardId: board.id,
        })),
      deleteBoard: (id) =>
        set((state) => ({
          boards: state.boards.filter((b) => b.id !== id),
          currentBoardId:
            state.currentBoardId === id && state.boards.length > 1
              ? state.boards.find((b) => b.id !== id)?.id || null
              : state.currentBoardId,
        })),
      setCurrentBoard: (id) => set({ currentBoardId: id }),

      // Columns
      addColumn: (column) =>
        set((state) => ({
          columns: [...state.columns, column],
        })),
      deleteColumn: (id) =>
        set((state) => ({
          columns: state.columns.filter((c) => c.id !== id),
          cards: state.cards.filter((card) => card.columnId !== id),
        })),
      updateColumn: (id, title) =>
        set((state) => ({
          columns: state.columns.map((c) => (c.id === id ? { ...c, title } : c)),
        })),
      reorderColumns: (columns) =>
        set(() => ({
          columns,
        })),

      // Cards
      addCard: (card) =>
        set((state) => ({
          cards: [...state.cards, card],
        })),
      updateCard: (id, updates) =>
        set((state) => ({
          cards: state.cards.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        })),
      deleteCard: (id) =>
        set((state) => ({
          cards: state.cards.filter((c) => c.id !== id),
        })),
      moveCard: (cardId, columnId, order) =>
        set((state) => {
          const card = state.cards.find((c) => c.id === cardId);
          if (!card) return state;

          const oldColumnCards = state.cards.filter(
            (c) => c.columnId === card.columnId && c.id !== cardId
          );
          const newColumnCards = state.cards.filter((c) => c.columnId === columnId);

          let updatedCards = state.cards.map((c) => {
            if (c.id === cardId) {
              return { ...c, columnId, order };
            }

            if (c.columnId === card.columnId) {
              const idx = oldColumnCards.findIndex((oc) => oc.id === c.id);
              return { ...c, order: idx };
            }

            if (c.columnId === columnId && c.order >= order) {
              return { ...c, order: c.order + 1 };
            }

            return c;
          });

          return { cards: updatedCards };
        }),
      reorderCards: (columnId, cards) =>
        set((state) => ({
          cards: state.cards.map((c) => {
            const reorderedCard = cards.find((rc) => rc.id === c.id);
            return reorderedCard ? { ...c, order: reorderedCard.order } : c;
          }),
        })),

      // Labels
      addLabel: (label) =>
        set((state) => ({
          labels: [...state.labels, label],
        })),

      // Modal
      openCardModal: (card) =>
        set({
          modal: {
            isOpen: true,
            type: 'card',
            data: card || null,
          },
        }),
      openColumnModal: (column) =>
        set({
          modal: {
            isOpen: true,
            type: 'column',
            data: column || null,
          },
        }),
      openDeleteModal: (type, data) =>
        set({
          modal: {
            isOpen: true,
            type: `delete-${type}` as any,
            data,
          },
        }),
      closeModal: () =>
        set({
          modal: { isOpen: false },
        }),

      // Filters
      setSearchQuery: (query) =>
        set((state) => ({
          filters: { ...state.filters, searchQuery: query },
        })),
      setSelectedLabels: (labels) =>
        set((state) => ({
          filters: { ...state.filters, selectedLabels: labels },
        })),
      setSelectedAssignees: (assignees) =>
        set((state) => ({
          filters: { ...state.filters, selectedAssignees: assignees },
        })),
      clearFilters: () =>
        set((state) => ({
          filters: { searchQuery: '', selectedLabels: [], selectedAssignees: [] },
        })),

      // Hydration
      hydrate: () => get(),
    }),
    {
      name: 'kanban-store',
    }
  )
);
