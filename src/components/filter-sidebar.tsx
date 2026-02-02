'use client';

import { useKanbanStore } from '@/lib/store';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Filter, X } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

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
    filters.searchQuery || filters.selectedLabels.length > 0 || filters.selectedAssignees.length > 0;

  const toggleLabel = (labelId: string) => {
    setSelectedLabels(
      filters.selectedLabels.includes(labelId)
        ? filters.selectedLabels.filter((l) => l !== labelId)
        : [...filters.selectedLabels, labelId]
    );
  };

  const toggleAssignee = (userId: string) => {
    setSelectedAssignees(
      filters.selectedAssignees.includes(userId)
        ? filters.selectedAssignees.filter((u) => u !== userId)
        : [...filters.selectedAssignees, userId]
    );
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2 bg-transparent" size="sm">
          <Filter className="h-4 w-4" />
          Filters
          {hasActiveFilters && (
            <Badge variant="default" className="ml-2">
              {(filters.selectedLabels.length || 0) +
                (filters.selectedAssignees.length || 0) +
                (filters.searchQuery ? 1 : 0)}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-80">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span>Filters</span>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-xs"
              >
                Clear All
              </Button>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Search */}
          <div className="space-y-2">
            <Label>Search Cards</Label>
            <Input
              placeholder="Search title or description..."
              value={filters.searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              type="search"
            />
          </div>

          {/* Labels */}
          <div className="space-y-2">
            <Label>Labels</Label>
            <div className="flex flex-wrap gap-2">
              {labels.map((label) => (
                <Badge
                  key={label.id}
                  className="cursor-pointer"
                  style={{
                    backgroundColor: filters.selectedLabels.includes(label.id)
                      ? label.color
                      : '#e5e7eb',
                    color: filters.selectedLabels.includes(label.id) ? 'white' : '#374151',
                  }}
                  onClick={() => toggleLabel(label.id)}
                >
                  {label.name}
                </Badge>
              ))}
            </div>
          </div>

          {/* Assignees */}
          <div className="space-y-2">
            <Label>Assigned To</Label>
            <div className="space-y-2">
              {users.map((user) => (
                <div
                  key={user.id}
                  className={`flex items-center gap-3 p-2 rounded cursor-pointer transition-colors ${
                    filters.selectedAssignees.includes(user.id)
                      ? 'bg-blue-50 border border-blue-200'
                      : 'hover:bg-gray-50 border border-transparent'
                  }`}
                  onClick={() => toggleAssignee(user.id)}
                >
                  <Avatar className="h-6 w-6">
                    <AvatarFallback
                      className="text-xs"
                      style={{ backgroundColor: user.color }}
                    >
                      {user.initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="flex-1 text-sm">{user.name}</span>
                  {filters.selectedAssignees.includes(user.id) && (
                    <X className="h-4 w-4 text-blue-600" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
