"use client";

import { useSyncExternalStore } from "react";
import { useKanbanStore } from "@/lib/store";
import { BoardCard } from "./board-card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function BoardsList() {
  const { boards, openBoardModal, openDeleteModal } = useKanbanStore();
  const mounted = useMounted();
  if (!mounted) {
    return (
      <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
    );
  }
  const handleCreateBoard = () => {
    openBoardModal();
  };

  const handleDeleteBoard = (id: string) => {
    const board = boards.find((b) => b.id === id);
    if (board) {
      openDeleteModal("board", board);
    }
  };

  if (!mounted) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">Mis Tableros</h1>
        <Button onClick={handleCreateBoard} className="gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Tablero
        </Button>
      </div>

      {boards.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            Aún no hay tableros. ¡Crea tu primer tablero!
          </p>
          <Button onClick={handleCreateBoard} className="gap-2">
            <Plus className="h-4 w-4" />
            Crear Tablero
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {boards.map((board) => (
            <BoardCard
              key={board.id}
              board={board}
              onDelete={() => handleDeleteBoard(board.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const useMounted = () => {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
};
