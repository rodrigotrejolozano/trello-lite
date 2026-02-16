"use client";

import { useSyncExternalStore } from "react";
import { useKanbanStore } from "@/lib/store";
import { BoardCard } from "./board-card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ThemeChanger } from "./theme-changer";

export function BoardsList() {
  const { boards, openBoardModal, openDeleteModal } = useKanbanStore();
  const mounted = useMounted();

  const handleCreateBoard = () => openBoardModal();

  const handleDeleteBoard = (id: string) => {
    const board = boards.find((b) => b.id === id);
    if (board) openDeleteModal("board", board);
  };

  if (!mounted) {
    return <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />;
  }

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
          Mis Tableros
        </h1>

        <div className="flex items-center gap-3">
          <ThemeChanger />

          <Button
            onClick={handleCreateBoard}
            className="gap-2 shadow-sm cursor-pointer"
            size="default"
          >
            <Plus className="h-4 w-4" />
            Nuevo tablero
          </Button>
        </div>
      </div>

      {/* EMPTY STATE */}
      {boards.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 border rounded-lg bg-muted/30">
          <p className="text-muted-foreground">
            Aún no tienes tableros creados
          </p>

          <Button onClick={handleCreateBoard} className="gap-2">
            <Plus className="h-4 w-4" />
            Crear tu primer tablero
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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

const useMounted = () =>
  useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
