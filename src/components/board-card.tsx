"use client";

import Link from "next/link";
import { Board } from "@/lib/store";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface BoardCardProps {
  board: Board;
  onDelete: (id: string) => void;
}

export function BoardCard({ board, onDelete }: BoardCardProps) {
  return (
    <Link href={`/board/${board.id}`}>
      <Card className="h-full cursor-pointer transition-all hover:shadow-lg hover:border-blue-400">
        <CardHeader>
          <h3 className="text-lg font-semibold text-balance">{board.title}</h3>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">{board.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {new Date(board.createdAt).toLocaleDateString("es-ES")}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                onDelete(board.id);
              }}
              className="text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
