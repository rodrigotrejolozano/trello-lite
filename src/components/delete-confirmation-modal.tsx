"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useKanbanStore, Board, Card, Column } from "@/lib/store";

export function DeleteConfirmationModal() {
  const { modal, closeModal, deleteBoard, deleteCard, deleteColumn } =
    useKanbanStore();

  const isOpen = modal.isOpen && modal.type?.startsWith("delete-");
  const type = modal.type?.replace("delete-", "") as
    | "board"
    | "card"
    | "column"
    | undefined;
  const data = modal.data as Board | Card | Column | undefined;

  if (!isOpen || !type || !data) {
    return null;
  }

  const getTitle = () => {
    switch (type) {
      case "board":
        return "Eliminar Tablero";
      case "card":
        return "Eliminar Tarjeta";
      case "column":
        return "Eliminar Columna";
    }
  };

  const getDescription = () => {
    switch (type) {
      case "board":
        return `¿Estás seguro de que quieres eliminar "${(data as Board).title}"? Esta acción no se puede deshacer.`;
      case "card":
        return `¿Estás seguro de que quieres eliminar "${(data as Card).title}"? Esta acción no se puede deshacer.`;
      case "column":
        return `¿Estás seguro de que quieres eliminar "${(data as Column).title}"? Todas las tarjetas de esta columna también se eliminarán.`;
    }
  };

  const handleDelete = () => {
    switch (type) {
      case "board":
        deleteBoard((data as Board).id);
        break;
      case "card":
        deleteCard((data as Card).id);
        break;
      case "column":
        deleteColumn((data as Column).id);
        break;
    }
    closeModal();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={closeModal}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{getTitle()}</AlertDialogTitle>
          <AlertDialogDescription>{getDescription()}</AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex gap-3 justify-end">
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive hover:bg-destructive/90"
          >
            Eliminar
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
