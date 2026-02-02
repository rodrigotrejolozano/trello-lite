import { Board, Column, Card } from '@/lib/store';

export function exportBoardJSON(board: Board, columns: Column[], cards: Card[]): string {
  const data = {
    board: {
      id: board.id,
      title: board.title,
      description: board.description,
      createdAt: board.createdAt,
    },
    columns: columns.map((col) => ({
      id: col.id,
      title: col.title,
      order: col.order,
    })),
    cards: cards.map((card) => ({
      id: card.id,
      title: card.title,
      description: card.description,
      columnId: card.columnId,
      assignees: card.assignees,
      labels: card.labels,
      dueDate: card.dueDate,
      order: card.order,
    })),
  };
  return JSON.stringify(data, null, 2);
}

export function exportBoardCSV(cards: Card[], columns: Column[]): string {
  const columnMap = Object.fromEntries(columns.map((col) => [col.id, col.title]));

  const headers = ['Title', 'Description', 'Column', 'Assignees', 'Labels', 'Due Date'];
  const rows = cards.map((card) => [
    `"${card.title.replace(/"/g, '""')}"`,
    `"${card.description.replace(/"/g, '""')}"`,
    `"${columnMap[card.columnId] || ''}"`,
    `"${card.assignees.join(', ')}"`,
    `"${card.labels.join(', ')}"`,
    card.dueDate ? `"${card.dueDate}"` : '""',
  ]);

  return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
}

export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
