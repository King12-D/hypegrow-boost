
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSupportTickets } from '@/hooks/useSupportTickets';

const SupportTicketForm = () => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState('medium');
  
  const { createTicket } = useSupportTickets();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subject.trim() || !message.trim()) return;

    try {
      await createTicket.mutateAsync({
        subject: subject.trim(),
        message: message.trim(),
        priority,
      });
      
      setSubject('');
      setMessage('');
      setPriority('medium');
    } catch (error) {
      console.error('Error creating ticket:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Support Ticket</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Brief description of your issue"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="priority">Priority</Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Please describe your issue in detail..."
              rows={5}
              required
            />
          </div>
          
          <Button
            type="submit"
            disabled={createTicket.isPending || !subject.trim() || !message.trim()}
          >
            {createTicket.isPending ? 'Creating...' : 'Create Ticket'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SupportTicketForm;
