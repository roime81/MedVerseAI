
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';

type Note = {
    author: string;
    date: string;
    type: string;
    text: string;
};

interface ClinicalNoteDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  notes: Note[];
}

export function ClinicalNoteDialog({ isOpen, onOpenChange, notes }: ClinicalNoteDialogProps) {
  if (!notes || notes.length === 0) return null;

  // Sort notes with the most recent first
  const sortedNotes = [...notes].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Clinical Notes</DialogTitle>
          <DialogDescription>
            A chronological record of the patient's journey.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] my-4 pr-6">
            <div className="space-y-6">
                {sortedNotes.map((note, index) => (
                    <div key={index} className="flex flex-col gap-1 border-b pb-4 last:border-b-0">
                         <h4 className="font-semibold">{note.type}</h4>
                         <p className="text-sm text-muted-foreground">
                            {format(new Date(note.date), "MMMM dd, yyyy 'at' h:mm a")} • {note.author}
                         </p>
                        <p className="text-sm whitespace-pre-wrap pt-2">
                            {note.text}
                        </p>
                    </div>
                ))}
            </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
