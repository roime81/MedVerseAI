
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Patient } from '@/lib/types';
import { useUser } from '@/firebase';

interface EncounterNoteDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  patient: Patient;
  onSave: (note: string, nextAppointment?: Date) => void;
}

export function EncounterNoteDialog({ isOpen, onOpenChange, patient, onSave }: EncounterNoteDialogProps) {
  const { user } = useUser();
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [note, setNote] = useState('');
  const [nextAppointment, setNextAppointment] = useState<Date>();

  useEffect(() => {
    if (isOpen) {
      const now = new Date();
      setCurrentDateTime(format(now, "MMMM dd, yyyy 'at' h:mm a"));
    }
  }, [isOpen]);

  const handleSave = () => {
    onSave(note, nextAppointment);
    // Reset state after saving
    setNote('');
    setNextAppointment(undefined);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Encounter Note for {patient.fullName}</DialogTitle>
          <DialogDescription>
            {currentDateTime} • Authored by {user?.displayName || 'clinician'}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="doctor-notes" className="font-semibold">
              Doctor's Notes
            </Label>
            <Textarea
              id="doctor-notes"
              placeholder="Start typing your note..."
              className="min-h-[200px]"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="next-appointment" className="font-semibold">
              Schedule Next Appointment (Optional)
            </Label>
             <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[280px] justify-start text-left font-normal",
                      !nextAppointment && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {nextAppointment ? format(nextAppointment, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={nextAppointment}
                    onSelect={setNextAppointment}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save and Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
