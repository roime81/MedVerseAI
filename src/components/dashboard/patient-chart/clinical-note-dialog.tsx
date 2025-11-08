
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ClinicalNoteDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  note: {
    author: string;
    date: string;
    type: string;
    text: string;
  } | null;
}

export function ClinicalNoteDialog({ isOpen, onOpenChange, note }: ClinicalNoteDialogProps) {
  if (!note) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{note.type}</DialogTitle>
          <DialogDescription>
            Authored by {note.author} on {note.date}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] my-4 pr-6">
            <div className="text-sm whitespace-pre-wrap">
                {note.text}
            </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
