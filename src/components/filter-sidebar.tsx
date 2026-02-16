"use client";

import { useKanbanStore } from "@/lib/store";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Filter, Search, X, Check } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function FilterSidebar() {
  const {
    filters,
    setSearchQuery,
    setSelectedLabels,
    setSelectedAssignees,
    clearFilters,
    users,
    labels,
  } = useKanbanStore();

  const hasActiveFilters =
    filters.searchQuery ||
    filters.selectedLabels.length > 0 ||
    filters.selectedAssignees.length > 0;

  const toggleLabel = (labelId: string) => {
    setSelectedLabels(
      filters.selectedLabels.includes(labelId)
        ? filters.selectedLabels.filter((l) => l !== labelId)
        : [...filters.selectedLabels, labelId],
    );
  };

  const toggleAssignee = (userId: string) => {
    setSelectedAssignees(
      filters.selectedAssignees.includes(userId)
        ? filters.selectedAssignees.filter((u) => u !== userId)
        : [...filters.selectedAssignees, userId],
    );
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer gap-2 bg-transparent"
        >
          <Filter className="h-4 w-4" />
          Filtros
          {hasActiveFilters && (
            <Badge className="ml-2">
              {filters.selectedLabels.length +
                filters.selectedAssignees.length +
                (filters.searchQuery ? 1 : 0)}
            </Badge>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="w-100 flex flex-col p-3">
        {/* HEADER */}
        <SheetHeader className="sticky top-0 bg-background border-b">
          <SheetTitle className="flex gap-4 items-center">
            Filtros
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-xs text-red-500 cursor-pointer hover:text-red-600 border-red-500 hover:border-red-600 border"
              disabled={!hasActiveFilters}
            >
              Limpiar
            </Button>
          </SheetTitle>
        </SheetHeader>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto space-y-6 mt-2 pr-1">
          {/* SEARCH */}
          <div className="space-y-2 ">
            <Label>Buscar tarjetas</Label>

            <div className="relative ml-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />

              <Input
                className="pl-10 pr-8"
                placeholder="Título o descripción..."
                value={filters.searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              {filters.searchQuery && (
                <X
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-2.5 h-4 w-4 cursor-pointer opacity-60 hover:opacity-100"
                />
              )}
            </div>
          </div>

          {/* LABELS */}
          <div className="space-y-2">
            <Label>Etiquetas</Label>

            <div className="flex flex-wrap gap-2">
              {labels.map((label) => {
                const active = filters.selectedLabels.includes(label.id);

                return (
                  <Badge
                    key={label.id}
                    onClick={() => toggleLabel(label.id)}
                    className={`
                      cursor-pointer transition-all
                      border hover:scale-105
                      ${active ? "text-white" : ""}
                    `}
                    style={{
                      backgroundColor: active ? label.color : "transparent",
                      borderColor: label.color,
                      color: active ? "white" : label.color,
                    }}
                  >
                    {active && <Check className="mr-1 h-3 w-3" />}
                    {label.name}
                  </Badge>
                );
              })}
            </div>
          </div>

          {/* ASSIGNEES */}
          <div className="space-y-2">
            <Label>Asignado a</Label>

            <div className="space-y-1">
              {users.map((user) => {
                const active = filters.selectedAssignees.includes(user.id);

                return (
                  <div
                    key={user.id}
                    onClick={() => toggleAssignee(user.id)}
                    className={`
                      flex items-center gap-3 p-2 rounded-md
                      cursor-pointer transition-all border
                      ${
                        active
                          ? "bg-primary/10 border-primary"
                          : "border-transparent hover:bg-muted"
                      }
                    `}
                  >
                    <Avatar className="h-7 w-7">
                      <AvatarFallback
                        style={{ backgroundColor: user.color }}
                        className="text-xs"
                      >
                        {user.initials}
                      </AvatarFallback>
                    </Avatar>

                    <span className="flex-1 text-sm">{user.name}</span>

                    {active && <Check className="h-4 w-4 text-primary" />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
