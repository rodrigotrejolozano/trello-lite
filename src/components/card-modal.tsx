"use client";

import { useState } from "react";
import { Card as CardType, useKanbanStore } from "@/lib/store";
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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trash2, X } from "lucide-react";

export function CardModal() {
  const { modal, closeModal } = useKanbanStore();
  const isOpen = modal.isOpen && modal.type === "card";
  const card = modal.data as CardType | null;

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {card && <CardForm card={card} key={card.id} />}
      </DialogContent>
    </Dialog>
  );
}

function CardForm({ card }: { card: CardType }) {
  const {
    closeModal,
    updateCard,
    deleteCard,
    openDeleteModal,
    users,
    labels,
    columns,
  } = useKanbanStore();

  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description);
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>(
    card.assignees || [],
  );
  const [selectedLabels, setSelectedLabels] = useState<string[]>(
    card.labels || [],
  );
  const [dueDate, setDueDate] = useState(card.dueDate || "");

  const handleSave = () => {
    updateCard(card.id, {
      title: title || "Untitled",
      description,
      assignees: selectedAssignees,
      labels: selectedLabels,
      dueDate: dueDate || undefined,
    });
    closeModal();
  };

  const handleDelete = () => {
    openDeleteModal("card", card);
  };

  const handleToggleAssignee = (userId: string) => {
    setSelectedAssignees((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const handleToggleLabel = (labelId: string) => {
    setSelectedLabels((prev) =>
      prev.includes(labelId)
        ? prev.filter((id) => id !== labelId)
        : [...prev, labelId],
    );
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Edit Card</DialogTitle>
      </DialogHeader>

      <div className="space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <Label>Title</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a description..."
            rows={4}
          />
        </div>

        {/* Due Date */}
        <div className="space-y-2">
          <Label>Due Date</Label>
          <div className="flex gap-2">
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="flex-1"
            />
            {dueDate && (
              <Button variant="ghost" size="sm" onClick={() => setDueDate("")}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Assignees */}
        <div className="space-y-2">
          <Label>Assign To</Label>
          <div className="flex flex-wrap gap-2">
            {users.map((user) => (
              <Button
                key={user.id}
                variant={
                  selectedAssignees.includes(user.id) ? "default" : "outline"
                }
                size="sm"
                onClick={() => handleToggleAssignee(user.id)}
                className="gap-2"
              >
                <Avatar className="h-4 w-4">
                  <AvatarFallback
                    className="text-xs"
                    style={{ backgroundColor: user.color }}
                  >
                    {user.initials}
                  </AvatarFallback>
                </Avatar>
                {user.name}
              </Button>
            ))}
          </div>
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
                  backgroundColor: selectedLabels.includes(label.id)
                    ? label.color
                    : "#e5e7eb",
                  color: selectedLabels.includes(label.id)
                    ? "white"
                    : "#374151",
                }}
                onClick={() => handleToggleLabel(label.id)}
              >
                {label.name}
              </Badge>
            ))}
          </div>
        </div>

        {/* Column Info */}
        <div className="space-y-2">
          <Label>Column</Label>
          <div className="text-sm text-muted-foreground">
            {columns.find((c) => c.id === card.columnId)?.title}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 justify-between pt-4">
          <Button
            variant="destructive"
            onClick={handleDelete}
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete Card
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </div>
      </div>
    </>
  );
}
// "use client";

// import { useEffect, useState } from "react";
// import { Card as CardType, useKanbanStore } from "@/lib/store";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Badge } from "@/components/ui/badge";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { Calendar, Trash2, X } from "lucide-react";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// export function CardModal() {
//   const {
//     modal,
//     closeModal,
//     updateCard,
//     deleteCard,
//     openDeleteModal,
//     users,
//     labels,
//     columns,
//   } = useKanbanStore();
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
//   const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
//   const [dueDate, setDueDate] = useState("");

//   const isOpen = modal.isOpen && modal.type === "card";
//   const card = modal.data as CardType | null;

//   useEffect(() => {
//     if (card) {
//       setTitle(card.title);
//       setDescription(card.description);
//       setSelectedAssignees(card.assignees || []);
//       setSelectedLabels(card.labels || []);
//       setDueDate(card.dueDate || "");
//     }
//   }, [card, isOpen]);

//   const handleSave = () => {
//     if (!card) return;
//     updateCard(card.id, {
//       title: title || "Untitled",
//       description,
//       assignees: selectedAssignees,
//       labels: selectedLabels,
//       dueDate: dueDate || undefined,
//     });
//     closeModal();
//   };

//   const handleDelete = () => {
//     if (card) {
//       openDeleteModal("card", card);
//     }
//   };

//   const handleToggleAssignee = (userId: string) => {
//     setSelectedAssignees((prev) =>
//       prev.includes(userId)
//         ? prev.filter((id) => id !== userId)
//         : [...prev, userId],
//     );
//   };

//   const handleToggleLabel = (labelId: string) => {
//     setSelectedLabels((prev) =>
//       prev.includes(labelId)
//         ? prev.filter((id) => id !== labelId)
//         : [...prev, labelId],
//     );
//   };

//   // const assignedUsers = users.filter((u) => selectedAssignees.includes(u.id));

//   return (
//     <Dialog open={isOpen} onOpenChange={closeModal}>
//       <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle>Edit Card</DialogTitle>
//         </DialogHeader>

//         {card && (
//           <div className="space-y-6">
//             {/* Title */}
//             <div className="space-y-2">
//               <Label>Title</Label>
//               <Input value={title} onChange={(e) => setTitle(e.target.value)} />
//             </div>

//             {/* Description */}
//             <div className="space-y-2">
//               <Label>Description</Label>
//               <Textarea
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//                 placeholder="Add a description..."
//                 rows={4}
//               />
//             </div>

//             {/* Due Date */}
//             <div className="space-y-2">
//               <Label>Due Date</Label>
//               <div className="flex gap-2">
//                 <Input
//                   type="date"
//                   value={dueDate}
//                   onChange={(e) => setDueDate(e.target.value)}
//                   className="flex-1"
//                 />
//                 {dueDate && (
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={() => setDueDate("")}
//                   >
//                     <X className="h-4 w-4" />
//                   </Button>
//                 )}
//               </div>
//             </div>

//             {/* Assignees */}
//             <div className="space-y-2">
//               <Label>Assign To</Label>
//               <div className="flex flex-wrap gap-2">
//                 {users.map((user) => (
//                   <Button
//                     key={user.id}
//                     variant={
//                       selectedAssignees.includes(user.id)
//                         ? "default"
//                         : "outline"
//                     }
//                     size="sm"
//                     onClick={() => handleToggleAssignee(user.id)}
//                     className="gap-2"
//                   >
//                     <Avatar className="h-4 w-4">
//                       <AvatarFallback
//                         className="text-xs"
//                         style={{ backgroundColor: user.color }}
//                       >
//                         {user.initials}
//                       </AvatarFallback>
//                     </Avatar>
//                     {user.name}
//                   </Button>
//                 ))}
//               </div>
//             </div>

//             {/* Labels */}
//             <div className="space-y-2">
//               <Label>Labels</Label>
//               <div className="flex flex-wrap gap-2">
//                 {labels.map((label) => (
//                   <Badge
//                     key={label.id}
//                     className="cursor-pointer"
//                     style={{
//                       backgroundColor: selectedLabels.includes(label.id)
//                         ? label.color
//                         : "#e5e7eb",
//                       color: selectedLabels.includes(label.id)
//                         ? "white"
//                         : "#374151",
//                     }}
//                     onClick={() => handleToggleLabel(label.id)}
//                   >
//                     {label.name}
//                   </Badge>
//                 ))}
//               </div>
//             </div>

//             {/* Column Info */}
//             <div className="space-y-2">
//               <Label>Column</Label>
//               <div className="text-sm text-muted-foreground">
//                 {columns.find((c) => c.id === card.columnId)?.title}
//               </div>
//             </div>

//             {/* Actions */}
//             <div className="flex gap-2 justify-between pt-4">
//               <Button
//                 variant="destructive"
//                 onClick={handleDelete}
//                 className="gap-2"
//               >
//                 <Trash2 className="h-4 w-4" />
//                 Delete Card
//               </Button>
//               <div className="flex gap-2">
//                 <Button variant="outline" onClick={closeModal}>
//                   Cancel
//                 </Button>
//                 <Button onClick={handleSave}>Save Changes</Button>
//               </div>
//             </div>
//           </div>
//         )}
//       </DialogContent>
//     </Dialog>
//   );
// }
