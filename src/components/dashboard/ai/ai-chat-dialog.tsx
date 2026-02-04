'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Sparkles, Send, User } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface AiChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const sampleMessages = [
    { from: 'ai', text: "Hello! I'm your AI assistant. How can I help you with the dashboard today?" },
];

export function AiChatDialog({ open, onOpenChange }: AiChatDialogProps) {
    const [messages, setMessages] = React.useState(sampleMessages);
    const [input, setInput] = React.useState('');

    const handleSend = () => {
        if (!input.trim()) return;
        
        // Add user message
        const newMessages = [...messages, { from: 'user', text: input }];
        
        // Here you would call your AI flow and get a response
        // For now, we'll just add a placeholder AI response
        const aiResponse = { from: 'ai', text: `You said: "${input}". I'm still learning how to interact with the dashboard!`};
        
        setMessages([...newMessages, aiResponse]);
        setInput('');
    };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px] flex flex-col h-[70vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Assistant
          </DialogTitle>
          <DialogDescription>
            Ask me anything about the dashboard, patients, or data.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-1 -mx-6 px-6">
            <div className="space-y-4">
                {messages.map((message, index) => (
                    <div key={index} className={cn("flex items-start gap-3", message.from === 'user' && 'justify-end')}>
                         {message.from === 'ai' && (
                            <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-primary text-primary-foreground">
                                    <Sparkles className="h-4 w-4" />
                                </AvatarFallback>
                            </Avatar>
                         )}
                         <div className={cn(
                            "max-w-[75%] rounded-lg p-3 text-sm",
                            message.from === 'ai' ? 'bg-muted' : 'bg-primary text-primary-foreground'
                         )}>
                            <p>{message.text}</p>
                         </div>
                         {message.from === 'user' && (
                            <Avatar className="h-8 w-8">
                                <AvatarFallback>
                                    <User className="h-4 w-4" />
                                </AvatarFallback>
                            </Avatar>
                         )}
                    </div>
                ))}
            </div>
        </ScrollArea>
        
        <DialogFooter className="border-t pt-4">
            <div className="flex w-full items-center space-x-2">
                <Input
                    placeholder="e.g., 'Summarize Leila Richardson's chart'"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <Button onClick={handleSend}><Send className="h-4 w-4" /> <span className="sr-only">Send</span></Button>
            </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
