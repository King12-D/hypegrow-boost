
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { HelpCircle, MessageSquare, Clock, CheckCircle } from 'lucide-react';
import SupportTicketForm from '@/components/SupportTicketForm';
import { useSupportTickets } from '@/hooks/useSupportTickets';
import LoadingSpinner from '@/components/LoadingSpinner';

const Support = () => {
  const { tickets, isLoading } = useSupportTickets();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in_progress':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <MessageSquare className="w-4 h-4 text-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'default';
      case 'in_progress':
        return 'secondary';
      case 'closed':
        return 'outline';
      default:
        return 'destructive';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'destructive';
      case 'high':
        return 'secondary';
      case 'medium':
        return 'outline';
      default:
        return 'default';
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <HelpCircle className="w-12 h-12 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Support Center</h1>
          <p className="text-lg text-gray-600">
            Need help? Create a support ticket or browse your existing tickets.
          </p>
        </div>

        <Tabs defaultValue="create" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create">Create Ticket</TabsTrigger>
            <TabsTrigger value="tickets">My Tickets</TabsTrigger>
          </TabsList>

          <TabsContent value="create">
            <SupportTicketForm />
          </TabsContent>

          <TabsContent value="tickets">
            <Card>
              <CardHeader>
                <CardTitle>Your Support Tickets</CardTitle>
                <CardDescription>
                  Track the status of your support requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">
                    <LoadingSpinner size="lg" text="Loading tickets..." />
                  </div>
                ) : tickets && tickets.length > 0 ? (
                  <div className="space-y-4">
                    {tickets.map((ticket) => (
                      <div
                        key={ticket.id}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-lg">{ticket.subject}</h3>
                          <div className="flex items-center space-x-2">
                            <Badge variant={getPriorityColor(ticket.priority)}>
                              {ticket.priority}
                            </Badge>
                            <Badge variant={getStatusColor(ticket.status)}>
                              <div className="flex items-center space-x-1">
                                {getStatusIcon(ticket.status)}
                                <span>{ticket.status.replace('_', ' ')}</span>
                              </div>
                            </Badge>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 mb-3 line-clamp-2">
                          {ticket.message}
                        </p>
                        
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>Created: {new Date(ticket.created_at).toLocaleDateString()}</span>
                          <span>Updated: {new Date(ticket.updated_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets yet</h3>
                    <p className="text-gray-500">
                      When you create support tickets, they'll appear here.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* FAQ Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">How long does order delivery take?</h3>
                <p className="text-gray-600">
                  Most orders are completed within 24-48 hours. Premium services may take up to 72 hours for quality assurance.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
                <p className="text-gray-600">
                  We accept bank transfers, Paystack payments, and wallet balance. All payments are processed securely.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Can I cancel my order?</h3>
                <p className="text-gray-600">
                  Orders can be cancelled within 1 hour of placement if processing hasn't started. Contact support for assistance.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Do you offer refunds?</h3>
                <p className="text-gray-600">
                  We offer refunds for orders that cannot be completed due to technical issues. Quality guarantees are provided for all services.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Support;
