import { BoardDetail } from '@/components/board-detail';
import { DeleteConfirmationModal } from '@/components/delete-confirmation-modal';
import { CardModal } from '@/components/card-modal';
import { ColumnModal } from '@/components/column-modal';

interface BoardPageProps {
  params: Promise<{ id: string }>;
}

export default async function BoardPage({ params }: BoardPageProps) {
  const { id } = await params;

  return (
    <>
      <BoardDetail boardId={id} />
      <DeleteConfirmationModal />
      <CardModal />
      <ColumnModal />
    </>
  );
}
