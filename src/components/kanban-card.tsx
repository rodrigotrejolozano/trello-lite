"use client";

import { Card as CardType, useKanbanStore } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export function KanbanCard({ card }: { card: CardType }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: "grab",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="outline-none"
    >
      <KanbanCardContent card={card} />
    </div>
  );
}

export function KanbanCardContent({ card }: { card: CardType }) {
  const openCardModal = useKanbanStore((state) => state.openCardModal);
  const labels = useKanbanStore((state) => state.labels);
  const users = useKanbanStore((state) => state.users);
  const cardLabels = labels.filter((l) => card.labels.includes(l.id));
  const cardAssignees = users.filter((u) => card.assignees.includes(u.id));

  return (
    <Card
      className="cursor-pointer active:cursor-grabbing hover:shadow-md hover:border-2 hover:border-neutral-400 transition-shadow bg-card"
      onClick={() => openCardModal(card)}
    >
      <div className="p-3 space-y-3">
        <h4 className="font-medium text-sm line-clamp-2">{card.title}</h4>

        {card.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {card.description}
          </p>
        )}

        {/* Labels */}
        {cardLabels.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {cardLabels.map((label) => (
              <Badge
                key={label.id}
                className="text-xs"
                style={{ backgroundColor: label.color }}
              >
                {label.name}
              </Badge>
            ))}
          </div>
        )}

        {/* Due Date and Assignees */}
        <div className="flex items-center justify-between pt-1">
          {card.dueDate && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {new Date(card.dueDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </div>
          )}

          {cardAssignees.length > 0 && (
            <div className="flex -space-x-2">
              {cardAssignees.slice(0, 3).map((user) => (
                <Avatar
                  key={user.id}
                  className="h-6 w-6 border border-background"
                >
                  <AvatarFallback className="text-xs bg-blue-500 text-white">
                    {user.initials}
                  </AvatarFallback>
                </Avatar>
              ))}
              {cardAssignees.length > 3 && (
                <div className="flex items-center justify-center h-6 w-6 rounded-full bg-muted border border-background text-xs font-medium">
                  +{cardAssignees.length - 3}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
