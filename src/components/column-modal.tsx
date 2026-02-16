"use client";

import { useState } from "react";
import { Column, useKanbanStore } from "@/lib/store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface IColumnModal {
  title: string;
}

export function ColumnModal({ title }: IColumnModal) {
  const { modal, closeModal } = useKanbanStore();

  const isOpen = modal.isOpen && modal.type === "column";
  const column = modal.data as Column | null;

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        {column && <ColumnForm key={column.id} column={column} />}
      </DialogContent>
    </Dialog>
  );
}

function ColumnForm({ column }: { column: Column }) {
  const { closeModal, updateColumn, openDeleteModal } = useKanbanStore();
  const [columnTitle, setColumnTitle] = useState(column.title);

  const handleSave = () => {
    updateColumn(column.id, columnTitle || "Sin título");
    closeModal();
  };

  const handleDelete = () => {
    openDeleteModal("column", column);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Título</Label>
        <Input
          value={columnTitle}
          onChange={(e) => setColumnTitle(e.target.value)}
        />
      </div>

      <div className="flex gap-2 justify-between pt-4">
        <Button variant="destructive" onClick={handleDelete}>
          Eliminar Columna
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={closeModal}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Guardar Cambios</Button>
        </div>
      </div>
    </div>
  );
}
