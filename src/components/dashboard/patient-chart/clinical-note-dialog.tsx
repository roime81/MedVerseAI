
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  defaultDate: string | null;
}

export function ClinicalNoteDialog({ isOpen, onOpenChange, notes, defaultDate }: ClinicalNoteDialogProps) {
  if (!notes || notes.length === 0) return null;

  // Sort notes with the most recent first for tab order
  const sortedNotes = [...notes].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const defaultValue = defaultDate ? format(new Date(defaultDate), 'yyyy-MM-dd') : format(new Date(sortedNotes[0].date), 'yyyy-MM-dd');


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Clinical Notes</DialogTitle>
          <DialogDescription>
            A chronological record of the patient's journey. Select a date to view the note.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue={defaultValue} className="mt-4">
            <TabsList>
                {sortedNotes.map((note, index) => (
                    <TabsTrigger key={index} value={format(new Date(note.date), 'yyyy-MM-dd')}>
                        {format(new Date(note.date), "MMM dd, yyyy")}
                    </TabsTrigger>
                ))}
            </TabsList>

            {sortedNotes.map((note, index) => (
                <TabsContent key={index} value={format(new Date(note.date), 'yyyy-MM-dd')}>
                    <ScrollArea className="max-h-[50vh] mt-4 pr-6">
                        <div className="flex flex-col gap-1">
                             <h4 className="font-semibold">{note.type}</h4>
                             <p className="text-sm text-muted-foreground">
                                {format(new Date(note.date), "MMMM dd, yyyy 'at' h:mm a")} • {note.author}
                             </p>
                            <p className="text-sm whitespace-pre-wrap pt-2">
                                {note.text}
                            </p>
                        </div>
                    </ScrollArea>
                </TabsContent>
            ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
