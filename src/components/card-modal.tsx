"use client";

import { useState } from "react";
import { Card as CardType, useKanbanStore } from "@/lib/store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trash2, X } from "lucide-react";

export function CardModal() {
  const { modal, closeModal } = useKanbanStore();
  const isOpen = modal.isOpen && modal.type === "card";
  const card = modal.data as CardType | null;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) closeModal();
      }}
    >
      <DialogContent
        className="max-w-3xl max-h-[90vh] overflow-y-auto"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        {card && <CardForm card={card} key={card.id} />}
      </DialogContent>
    </Dialog>
  );
}

function CardForm({ card }: { card: CardType }) {
  const { closeModal, updateCard, openDeleteModal, users, labels, columns } =
    useKanbanStore();

  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description);
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>(
    card.assignees || [],
  );
  const [selectedLabels, setSelectedLabels] = useState<string[]>(
    card.labels || [],
  );
  const [dueDate, setDueDate] = useState(card.dueDate || "");

  const handleSave = () => {
    updateCard(card.id, {
      title: title || "Untitled",
      description,
      assignees: selectedAssignees,
      labels: selectedLabels,
      dueDate: dueDate || undefined,
    });
    closeModal();
  };

  const handleDelete = () => {
    openDeleteModal("card", card);
  };

  const handleToggleAssignee = (userId: string) => {
    setSelectedAssignees((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const handleToggleLabel = (labelId: string) => {
    setSelectedLabels((prev) =>
      prev.includes(labelId)
        ? prev.filter((id) => id !== labelId)
        : [...prev, labelId],
    );
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Editar Tarjeta</DialogTitle>
        <DialogDescription>Modifica los datos de la tarjeta.</DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        {/* Título */}
        <div className="space-y-2">
          <Label>Título</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        {/* Descripción */}
        <div className="space-y-2  ">
          <Label>Descripción</Label>

          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Añade una descripción..."
            rows={4}
            className="
              overflow-y-auto
              resize-none
            wrap-break-word
              whitespace-pre-wrap "
          />
        </div>

        {/* Fecha de vencimiento */}
        <div className="space-y-2">
          <Label>Fecha de Vencimiento</Label>
          <div className="flex gap-2">
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="flex-1"
            />
            {dueDate && (
              <Button variant="ghost" size="sm" onClick={() => setDueDate("")}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Asignados */}
        <div className="space-y-2">
          <Label>Asignar a</Label>
          <div className="flex flex-wrap gap-2">
            {users.map((user) => (
              <Button
                key={user.id}
                variant={
                  selectedAssignees.includes(user.id) ? "default" : "outline"
                }
                size="sm"
                onClick={() => handleToggleAssignee(user.id)}
                className="gap-2 h-10"
              >
                <Avatar className="h-7 w-7">
                  <AvatarFallback
                    className="text-[10px]"
                    style={{ backgroundColor: user.color }}
                  >
                    {user.initials}
                  </AvatarFallback>
                </Avatar>
                {user.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Etiquetas */}
        <div className="space-y-2">
          <Label>Etiquetas</Label>
          <div className="flex flex-wrap gap-2">
            {labels.map((label) => (
              <Badge
                key={label.id}
                className="cursor-pointer"
                style={{
                  backgroundColor: selectedLabels.includes(label.id)
                    ? label.color
                    : "#e5e7eb",
                  color: selectedLabels.includes(label.id)
                    ? "white"
                    : "#374151",
                }}
                onClick={() => handleToggleLabel(label.id)}
              >
                {label.name}
              </Badge>
            ))}
          </div>
        </div>

        {/* Información de la columna */}
        <div className="space-y-2">
          <Label>Columna</Label>
          <div className="text-sm text-muted-foreground">
            {columns.find((c) => c.id === card.columnId)?.title}
          </div>
        </div>

        {/* Acciones */}
        <div className="flex gap-2 justify-between pt-4">
          <Button
            variant="destructive"
            onClick={handleDelete}
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Eliminar Tarjeta
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={closeModal}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>Guardar Cambios</Button>
          </div>
        </div>
      </div>
    </>
  );
}
