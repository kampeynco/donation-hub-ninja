
import React from "react";
import { useContactManagement } from "@/hooks/useContactManagement";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  IconMail, 
  IconPhone, 
  IconMap, 
  IconPlus,
  IconSearch,
  IconFilter
} from "@tabler/icons-react";
import { formatDate } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import ContactTableActions from "./ContactTableActions";
import ContactsTablePagination from "./ContactsTablePagination";
import ContactsEmptyState from "./ContactsEmptyState";
import ContactsTableHeader from "./ContactsTableHeader";
import type { Contact } from "@/types/contact";

export default function ContactsTabContent() {
  const {
    contacts,
    totalContacts,
    page,
    setPage,
    limit,
    totalPages,
    isLoading,
    filters,
    setFilters,
  } = useContactManagement();

  const [searchTerm, setSearchTerm] = React.useState("");

  // Apply search filter when user submits search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newFilters = { ...filters };
    if (searchTerm) {
      newFilters.search = searchTerm;
    } else {
      delete newFilters.search;
    }
    
    setFilters(newFilters);
  };

  // Filter contacts by status
  const filterByStatus = (status: 'prospect' | 'active' | 'donor' | undefined) => {
    const newFilters = { ...filters };
    if (status) {
      newFilters.status = status;
    } else {
      delete newFilters.status;
    }
    
    setFilters(newFilters);
  };
  
  // Get status badge for a contact
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'prospect':
        return <Badge variant="outline">Prospect</Badge>;
      case 'active':
        return <Badge variant="secondary">Active</Badge>;
      case 'donor':
        return <Badge variant="default" className="bg-donor-green">Donor</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <ContactsTableHeader 
        totalContacts={totalContacts}
        onCreateClick={() => {/* Open create contact modal */}}
      />

      {/* Search and filter bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1">
          <div className="relative flex-1">
            <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Button type="submit" variant="default">Search</Button>
        </form>
        <div className="flex gap-2">
          <Button
            variant={!filters.status ? "default" : "outline"}
            size="sm"
            onClick={() => filterByStatus(undefined)}
          >
            All
          </Button>
          <Button
            variant={filters.status === 'prospect' ? "default" : "outline"}
            size="sm"
            onClick={() => filterByStatus('prospect')}
          >
            Prospects
          </Button>
          <Button
            variant={filters.status === 'active' ? "default" : "outline"}
            size="sm"
            onClick={() => filterByStatus('active')}
          >
            Active
          </Button>
          <Button
            variant={filters.status === 'donor' ? "default" : "outline"}
            size="sm"
            onClick={() => filterByStatus('donor')}
          >
            Donors
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <IconFilter className="h-4 w-4" /> More
          </Button>
        </div>
      </div>

      {/* Contacts table */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Added</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Loading skeleton
              Array(5).fill(0).map((_, i) => (
                <TableRow key={`loading-${i}`}>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : contacts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <ContactsEmptyState onCreateClick={() => {/* Open create contact modal */}} />
                </TableCell>
              </TableRow>
            ) : (
              contacts.map((contact) => {
                // Ensure contact conforms to Contact type
                const typedContact: Contact = {
                  ...contact,
                  // Ensure status is one of the valid options
                  status: contact.status === 'inactive' ? 'active' : contact.status as 'prospect' | 'active' | 'donor'
                };
                
                return (
                  <TableRow key={typedContact.id}>
                    <TableCell className="font-medium">
                      {typedContact.first_name || typedContact.last_name ? (
                        `${typedContact.first_name || ''} ${typedContact.last_name || ''}`.trim()
                      ) : (
                        <span className="text-gray-500">No name</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {typedContact.emails?.[0] && (
                          <div className="flex items-center text-sm">
                            <IconMail className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                            <span className="truncate max-w-[200px]">{typedContact.emails[0].email}</span>
                          </div>
                        )}
                        {typedContact.phones?.[0] && (
                          <div className="flex items-center text-sm">
                            <IconPhone className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                            <span>{typedContact.phones[0].phone}</span>
                          </div>
                        )}
                        {typedContact.locations?.[0]?.city && (
                          <div className="flex items-center text-sm">
                            <IconMap className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                            <span>
                              {[
                                typedContact.locations[0].city,
                                typedContact.locations[0].state
                              ].filter(Boolean).join(', ')}
                            </span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(typedContact.status)}
                    </TableCell>
                    <TableCell>
                      {formatDate(typedContact.created_at)}
                    </TableCell>
                    <TableCell className="text-right">
                      <ContactTableActions contact={typedContact} />
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {contacts.length > 0 && (
        <ContactsTablePagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          totalItems={totalContacts}
          itemsPerPage={limit}
        />
      )}
    </div>
  );
}
