"use client";

import { useState } from "react";
import Link from "next/link";
import { Board, useKanbanStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Download } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { exportBoardJSON, exportBoardCSV, downloadFile } from "@/lib/export";
import { ThemeChanger } from "./theme-changer";

interface BoardHeaderProps {
  board: Board;
  onExport?: () => void;
}

export function BoardHeader({ board, onExport }: BoardHeaderProps) {
  const { columns, cards } = useKanbanStore();
  const [isExporting, setIsExporting] = useState(false);

  const boardColumns = columns.filter((c) => c.boardId === board.id);
  const boardCards = cards.filter((c) => c.boardId === board.id);

  const handleExportJSON = () => {
    setIsExporting(true);
    const content = exportBoardJSON(board, boardColumns, boardCards);
    downloadFile(
      content,
      `${board.title.replace(/\s+/g, "-")}-board.json`,
      "application/json",
    );
    setIsExporting(false);
  };

  const handleExportCSV = () => {
    setIsExporting(true);
    const content = exportBoardCSV(boardCards, boardColumns);
    downloadFile(
      content,
      `${board.title.replace(/\s+/g, "-")}-cards.csv`,
      "text/csv",
    );
    setIsExporting(false);
  };

  return (
    <div className="border-b border-border bg-background sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{board.title}</h1>
            <p className="text-sm text-muted-foreground">{board.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeChanger />
          {onExport ? (
            <Button
              onClick={onExport}
              variant="outline"
              className="gap-2 bg-transparent"
              disabled={isExporting}
            >
              <Download className="h-4 w-4" />
              {isExporting ? "Exporting..." : "Export"}
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="gap-2 bg-transparent"
                  disabled={isExporting}
                >
                  <Download className="h-4 w-4" />
                  {isExporting ? "Exporting..." : "Export"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleExportJSON}>
                  Export as JSON
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportCSV}>
                  Export as CSV
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </div>
  );
}
