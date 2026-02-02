'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useKanbanStore, Board, Card, Column } from '@/lib/store';

export function DeleteConfirmationModal() {
  const { modal, closeModal, deleteBoard, deleteCard, deleteColumn } = useKanbanStore();

  const isOpen = modal.isOpen && modal.type?.startsWith('delete-');
  const type = modal.type?.replace('delete-', '') as 'board' | 'card' | 'column' | undefined;
  const data = modal.data as Board | Card | Column | undefined;

  if (!isOpen || !type || !data) {
    return null;
  }

  const getTitle = () => {
    switch (type) {
      case 'board':
        return 'Delete Board';
      case 'card':
        return 'Delete Card';
      case 'column':
        return 'Delete Column';
    }
  };

  const getDescription = () => {
    switch (type) {
      case 'board':
        return `Are you sure you want to delete "${(data as Board).title}"? This action cannot be undone.`;
      case 'card':
        return `Are you sure you want to delete "${(data as Card).title}"? This action cannot be undone.`;
      case 'column':
        return `Are you sure you want to delete "${(data as Column).title}"? All cards in this column will also be deleted.`;
    }
  };

  const handleDelete = () => {
    switch (type) {
      case 'board':
        deleteBoard((data as Board).id);
        break;
      case 'card':
        deleteCard((data as Card).id);
        break;
      case 'column':
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
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
            Delete
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
