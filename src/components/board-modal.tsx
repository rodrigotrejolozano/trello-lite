"use client";

import { useState } from "react";
import { Board, useKanbanStore } from "@/lib/store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { v4 as uuidv4 } from "uuid";

export function BoardModal() {
  const { modal, closeModal } = useKanbanStore();

  const isOpen = modal.isOpen && modal.type === "board";
  const board = modal.data as Board | null;

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{board ? "Edit Board" : "Create New Board"}</DialogTitle>
        </DialogHeader>

        <BoardForm key={board?.id || "new-board"} board={board} />
      </DialogContent>
    </Dialog>
  );
}

function BoardForm({ board }: { board: Board | null }) {
  const { closeModal, addBoard, updateBoard, openDeleteModal } =
    useKanbanStore();
  const [title, setTitle] = useState(board?.title || "");
  const [description, setDescription] = useState(board?.description || "");

  const handleSave = () => {
    if (board) {
      updateBoard(board.id, {
        title: title || "Untitled Board",
        description,
      });
    } else {
      addBoard({
        id: uuidv4(),
        title: title || "Untitled Board",
        description: description || "New project",
        createdAt: new Date().toISOString(),
      });
    }
    closeModal();
  };

  const handleDelete = () => {
    if (board) {
      openDeleteModal("board", board);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="board-title">Title</Label>
        <Input
          id="board-title"
          placeholder="e.g. Project Alpha"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus={!board}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="board-description">Description</Label>
        <Textarea
          id="board-description"
          placeholder="What is this board about?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="resize-none"
        />
      </div>

      <div className="flex gap-2 justify-between pt-4">
        {board && (
          <Button variant="destructive" onClick={handleDelete} type="button">
            Delete Board
          </Button>
        )}
        <div className={`flex gap-2 ${board ? "" : "w-full justify-end"}`}>
          <Button variant="outline" onClick={closeModal} type="button">
            Cancel
          </Button>
          <Button onClick={handleSave} type="button">
            {board ? "Save Changes" : "Create Board"}
          </Button>
        </div>
      </div>
    </div>
  );
}
