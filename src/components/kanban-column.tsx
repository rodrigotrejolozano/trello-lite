"use client";

import { Column, Card as CardType, useKanbanStore } from "@/lib/store";
import { KanbanCard } from "./kanban-card";
import { Button } from "@/components/ui/button";
import { Plus, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { v4 as uuidv4 } from "uuid";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

interface KanbanColumnProps {
  column: Column;
  cards: CardType[];
}

export function KanbanColumn({ column, cards }: KanbanColumnProps) {
  const { addCard, openColumnModal, openDeleteModal } = useKanbanStore();
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  const handleAddCard = () => {
    const newCard: CardType = {
      id: uuidv4(),
      title: "Nueva Tarjeta",
      description: "",
      columnId: column.id,
      boardId: column.boardId,
      assignees: [],
      labels: [],
      order: cards.length,
    };
    addCard(newCard);
  };

  return (
    <div
      ref={setNodeRef}
      className="bg-muted rounded-lg flex flex-col h-full min-h-[600px] w-[340px] shrink-0"
    >
      {/* Column Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">{column.title}</h3>
          <span className="text-xs bg-background px-2 py-1 rounded text-muted-foreground">
            {cards.length}
          </span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="cursor-pointer " variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => openColumnModal(column)}
            >
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer text-destructive"
              onClick={() => openDeleteModal("column", column)}
            >
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Cards */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        <SortableContext
          items={cards.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          {cards.map((card) => (
            <KanbanCard key={card.id} card={card} />
          ))}
        </SortableContext>
      </div>

      {/* Add Card Button */}
      <div className="p-3 border-t border-border">
        <Button
          onClick={handleAddCard}
          variant="outline"
          className="w-full cursor-pointer justify-start gap-2 text-muted-foreground bg-transparent"
        >
          <Plus className="h-4 w-4" />
          Añadir Tarjeta
        </Button>
      </div>
    </div>
  );
}
