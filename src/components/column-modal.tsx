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

export function ColumnModal() {
  const { modal, closeModal } = useKanbanStore();

  const isOpen = modal.isOpen && modal.type === "column";
  const column = modal.data as Column | null;

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Column</DialogTitle>
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
    updateColumn(column.id, columnTitle || "Untitled");
    closeModal();
  };

  const handleDelete = () => {
    openDeleteModal("column", column);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Title</Label>
        <Input
          value={columnTitle}
          onChange={(e) => setColumnTitle(e.target.value)}
        />
      </div>

      <div className="flex gap-2 justify-between pt-4">
        <Button variant="destructive" onClick={handleDelete}>
          Delete Column
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={closeModal}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </div>
    </div>
  );
}
