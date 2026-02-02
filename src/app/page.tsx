"use client";

import { BoardsList } from "@/components/boards-list";
import { DeleteConfirmationModal } from "@/components/delete-confirmation-modal";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <BoardsList />
      </div>
      <DeleteConfirmationModal />
    </main>
  );
}
