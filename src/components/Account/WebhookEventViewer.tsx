
import { useState, useEffect } from "react";
import { IconCalendar, IconClock, IconSearch, IconX } from "@tabler/icons-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { fetchWebhookEvents, WebhookEvent } from "@/services/webhookService";
import { format } from "date-fns";

const WebhookEventViewer = () => {
  const [events, setEvents] = useState<WebhookEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<WebhookEvent | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [totalEvents, setTotalEvents] = useState(0);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const eventsPerPage = 10;

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Load events
  useEffect(() => {
    const loadEvents = async () => {
      setIsLoading(true);
      try {
        const { events: fetchedEvents, total } = await fetchWebhookEvents(
          eventsPerPage, 
          page, 
          debouncedSearchTerm
        );
        setEvents(fetchedEvents);
        setTotalEvents(total);
      } catch (error) {
        console.error("Error loading webhook events:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadEvents();
  }, [page, debouncedSearchTerm]);

  const handleViewDetails = (event: WebhookEvent) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      return format(new Date(timestamp), "MMM d, yyyy h:mm a");
    } catch (error) {
      return "Invalid date";
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page * eventsPerPage < totalEvents) {
      setPage(page + 1);
    }
  };

  const totalPages = Math.ceil(totalEvents / eventsPerPage);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Recent Webhook Events</h3>
        <div className="relative w-64">
          <Input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
          <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm("")}
              className="absolute right-2.5 top-2.5"
            >
              <IconX className="h-4 w-4 text-gray-500" />
            </button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="p-8 text-center">Loading events...</div>
      ) : events.length === 0 ? (
        <div className="p-8 text-center border rounded-md bg-gray-50">
          <p className="text-gray-500">No webhook events found.</p>
          {debouncedSearchTerm && (
            <p className="text-gray-500 mt-2">
              Try adjusting your search term or view all events.
            </p>
          )}
        </div>
      ) : (
        <>
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Event Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <IconCalendar className="h-4 w-4 mr-2 text-gray-500" />
                        {formatTimestamp(event.created_at)}
                      </div>
                    </TableCell>
                    <TableCell>{event.event_type}</TableCell>
                    <TableCell>
                      {event.processed ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Processed
                        </Badge>
                      ) : event.error ? (
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                          Error
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                          Pending
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(event)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between py-4">
              <div className="text-sm text-gray-500">
                Showing {((page - 1) * eventsPerPage) + 1}-
                {Math.min(page * eventsPerPage, totalEvents)} of {totalEvents} events
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousPage}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={page >= totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Event Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Webhook Event Details</DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-1">Event ID</h4>
                  <p className="text-sm text-gray-500">{selectedEvent.id}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Event Type</h4>
                  <p className="text-sm text-gray-500">{selectedEvent.event_type}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Status</h4>
                  <p className="text-sm">
                    {selectedEvent.processed ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Processed
                      </Badge>
                    ) : selectedEvent.error ? (
                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                        Error
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                        Pending
                      </Badge>
                    )}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Created</h4>
                  <p className="text-sm text-gray-500 flex items-center">
                    <IconClock className="h-4 w-4 mr-1" />
                    {formatTimestamp(selectedEvent.created_at)}
                  </p>
                </div>
              </div>

              {selectedEvent.processed_at && (
                <div>
                  <h4 className="font-medium mb-1">Processed At</h4>
                  <p className="text-sm text-gray-500 flex items-center">
                    <IconClock className="h-4 w-4 mr-1" />
                    {formatTimestamp(selectedEvent.processed_at)}
                  </p>
                </div>
              )}

              {selectedEvent.error && (
                <div>
                  <h4 className="font-medium mb-1">Error</h4>
                  <div className="bg-red-50 p-3 rounded border border-red-200 text-red-800 text-sm whitespace-pre-wrap">
                    {selectedEvent.error}
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-medium mb-1">Payload</h4>
                <div className="bg-gray-50 p-3 rounded border overflow-x-auto">
                  <pre className="text-xs text-gray-800 whitespace-pre-wrap">
                    {JSON.stringify(selectedEvent.payload, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WebhookEventViewer;
