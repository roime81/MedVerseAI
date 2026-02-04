'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles, Send, Plus, Wand2, Mic } from 'lucide-react';
import { useUser } from '@/firebase';
import { Textarea } from '@/components/ui/textarea';

interface AiChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const suggestionChips = [
    "Summarize Leila Richardson's chart",
    "Any critical lab results for patients in ICU?",
    "Check for interactions: Warfarin + Aspirin",
    "List all pending discharge summaries"
];

export function AiChatDialog({ open, onOpenChange }: AiChatDialogProps) {
    const { user } = useUser();
    const [input, setInput] = React.useState('');
    
    const handleSend = () => {
        if (!input.trim()) return;
        // In a real implementation, you'd send the `input` to your AI flow.
        console.log("Sending:", input);
        setInput('');
        // For this UI, we are not displaying chat history to keep it clean.
    };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl flex flex-col h-auto bg-slate-50 border-0 shadow-2xl p-8 rounded-2xl">
        <div className="flex items-center gap-2">
            <Sparkles className="h-7 w-7 text-primary"/>
            <span className="text-xl font-semibold text-gray-700">Hi, {user?.displayName?.split(' ')[0] || 'there'}</span>
        </div>
        <h1 className="text-4xl font-bold text-foreground mt-1">
            Where should we start?
        </h1>
        
        <div className="mt-8 bg-white rounded-2xl p-3 shadow-sm border">
            <Textarea
                placeholder="Ask me anything about the dashboard, patients, or data..."
                className="border-0 focus-visible:ring-0 text-base resize-none shadow-none p-2 min-h-[80px]"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                    }
                }}
            />
            <div className="flex items-center justify-between mt-2 p-1">
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="text-muted-foreground"><Plus className="h-5 w-5"/></Button>
                    <Button variant="ghost" size="icon" className="text-muted-foreground"><Wand2 className="h-5 w-5"/></Button>
                </div>
                 <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="text-muted-foreground"><Mic className="h-5 w-5"/></Button>
                    <Button onClick={handleSend} disabled={!input.trim()} size="icon">
                        <Send className="h-4 w-4" />
                        <span className="sr-only">Send</span>
                    </Button>
                 </div>
            </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
            {suggestionChips.map((suggestion, index) => (
                <Button key={index} variant="outline" size="sm" className="bg-white rounded-full" onClick={() => setInput(suggestion)}>
                    {suggestion}
                </Button>
            ))}
        </div>

      </DialogContent>
    </Dialog>
  );
}
