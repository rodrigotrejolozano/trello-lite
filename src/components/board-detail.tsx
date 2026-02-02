"use client";

import { useEffect, useState, useMemo, useSyncExternalStore } from "react";
import { useKanbanStore } from "@/lib/store";
import { BoardHeader } from "./board-header";
import { KanbanColumn } from "./kanban-column";
import { FilterSidebar } from "./filter-sidebar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  closestCorners,
} from "@dnd-kit/core";

interface BoardDetailProps {
  boardId: string;
}

export function BoardDetail({ boardId }: BoardDetailProps) {
  const {
    boards,
    columns,
    cards,
    addColumn,
    moveCard,
    setCurrentBoard,
    openColumnModal,
    filters,
    users,
  } = useKanbanStore();

  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const mounted = useMounted();

  useEffect(() => {
    setCurrentBoard(boardId);
  }, [boardId, setCurrentBoard]);

  const board = boards.find((b) => b.id === boardId);
  const boardColumns = columns
    .filter((c) => c.boardId === boardId)
    .sort((a, b) => a.order - b.order);
  const boardCards = cards.filter((c) => c.boardId === boardId);

  // Filter cards based on search and selected filters
  const filteredCards = useMemo(() => {
    return boardCards.filter((card) => {
      // Search filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchesTitle = card.title.toLowerCase().includes(query);
        const matchesDescription = card.description
          .toLowerCase()
          .includes(query);
        if (!matchesTitle && !matchesDescription) return false;
      }

      // Label filter
      if (filters.selectedLabels.length > 0) {
        const hasLabel = card.labels.some((label) =>
          filters.selectedLabels.includes(label),
        );
        if (!hasLabel) return false;
      }

      // Assignee filter
      if (filters.selectedAssignees.length > 0) {
        const hasAssignee = card.assignees.some((assignee) =>
          filters.selectedAssignees.includes(assignee),
        );
        if (!hasAssignee) return false;
      }

      return true;
    });
  }, [boardCards, filters]);

  const handleAddColumn = () => {
    const newColumn = {
      id: uuidv4(),
      title: "New Column",
      boardId,
      order: boardColumns.length,
    };
    addColumn(newColumn);
    setTimeout(() => {
      openColumnModal(newColumn);
    }, 0);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeCard = boardCards.find((c) => c.id === active.id);
    if (!activeCard) return;

    const overColumn = boardColumns.find((c) => c.id === over.id);
    const overCard = boardCards.find((c) => c.id === over.id);

    const targetColumnId = overColumn?.id || overCard?.columnId;
    if (!targetColumnId) return;

    const targetColumnCards = boardCards
      .filter((c) => c.columnId === targetColumnId)
      .sort((a, b) => a.order - b.order);

    let targetOrder = targetColumnCards.length;
    if (overCard) {
      targetOrder = overCard.order;
    }

    moveCard(active.id as string, targetColumnId, targetOrder);
  };

  const handleDragEnd = () => {
    setActiveDragId(null);
  };
  if (!mounted) {
    return (
      <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
    );
  }

  if (!board) {
    return <div className="text-center py-12">Board not found</div>;
  }

  return (
    <DndContext
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="min-h-screen bg-background">
        {board && <BoardHeader board={board} />}

        {/* Filter Bar */}
        <div className="border-b border-border bg-background sticky top-16 z-30">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {filters.searchQuery ||
              filters.selectedLabels.length > 0 ||
              filters.selectedAssignees.length > 0
                ? `Showing ${filteredCards.length} card${filteredCards.length !== 1 ? "s" : ""}`
                : `${boardCards.length} card${boardCards.length !== 1 ? "s" : ""}`}
            </div>
            <FilterSidebar />
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="flex gap-4 p-4 min-w-min">
            {boardColumns.map((column) => (
              <KanbanColumn
                key={column.id}
                column={column}
                cards={filteredCards
                  .filter((c) => c.columnId === column.id)
                  .sort((a, b) => a.order - b.order)}
              />
            ))}
            <div className="w-[340px] shrink-0">
              <Button
                onClick={handleAddColumn}
                variant="outline"
                className="w-full h-[600px] text-muted-foreground hover:text-foreground hover:bg-muted bg-transparent"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Column
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DndContext>
  );
}
const useMounted = () => {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
};
