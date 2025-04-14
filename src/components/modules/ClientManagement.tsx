'use client';

import React, {useState} from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {Edit, Trash, Block, CheckCircle} from "lucide-react";
import {ScrollArea} from "@/components/ui/scroll-area";
import {toast} from "@/hooks/use-toast";

// Dummy data for clients
const initialClients = [
  {
    id: '1',
    name: 'Acme Corp',
    email: 'info@acmecorp.com',
    contactNumber: '123-456-7890',
    status: 'active',
    package: 'Premium',
  },
  {
    id: '2',
    name: 'Beta Industries',
    email: 'contact@betaindustries.com',
    contactNumber: '987-654-3210',
    status: 'blocked',
    package: 'Basic',
  },
  {
    id: '3',
    name: 'Gamma Solutions',
    email: 'support@gammasolutions.com',
    contactNumber: '555-123-4567',
    status: 'active',
    package: 'Standard',
  },
];

const ClientManagement: React.FC = () => {
  const [clients, setClients] = useState(initialClients);
  const [searchQuery, setSearchQuery] = useState('');
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);
  const [clientToEdit, setClientToEdit] = useState<string | null>(null);

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.contactNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUpdateClient = (updatedClient: any) => {
    setClients(clients.map(client =>
      client.id === updatedClient.id ? updatedClient : client
    ));
    setClientToEdit(null);
    toast({
      title: "Client Updated",
      description: `Client ${updatedClient.name} was updated successfully.`,
    });
  };

  const handleDeleteConfirmation = (clientId: string) => {
    setClientToDelete(clientId);
  };

  const handleDelete = () => {
    if (clientToDelete) {
      const deletedClient = clients.find(client => client.id === clientToDelete);
      setClients(clients.filter(client => client.id !== clientToDelete));
      setClientToDelete(null);
      toast({
        title: "Client Deleted",
        description: `Client ${deletedClient?.name} was deleted successfully.`,
      });
    }
  };

  const handleEdit = (clientId: string) => {
    setClientToEdit(clientId);
  };

  const handleBlockUnblock = (clientId: string) => {
    setClients(clients.map(client => {
      if (client.id === clientId) {
        const newStatus = client.status === 'active' ? 'blocked' : 'active';
        toast({
          title: `Client ${newStatus === 'active' ? 'Unblocked' : 'Blocked'}`,
          description: `Client ${client.name} was ${newStatus === 'active' ? 'unblocked' : 'blocked'} successfully.`,
        });
        return {...client, status: newStatus};
      }
      return client;
    }));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Input
          type="text"
          placeholder="Search clients..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>

      <ScrollArea>
        <Table>
          <TableCaption>List of clients and their details.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Contact Number</TableHead>
              <TableHead>Package</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.map(client => (
              <TableRow key={client.id}>
                <TableCell>{client.name}</TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>{client.contactNumber}</TableCell>
                <TableCell>{client.package}</TableCell>
                <TableCell>
                  {client.status === 'active' ? (
                    <span className="inline-flex items-center rounded-md bg-green-500/15 px-2 py-1 text-xs font-medium text-green-500">
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-md bg-red-500/15 px-2 py-1 text-xs font-medium text-red-500">
                      Blocked
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right font-medium">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(client.id)}
                  >
                    <Edit className="h-4 w-4 mr-2"/>
                    Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Trash className="h-4 w-4 mr-2"/>
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the
                          client from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleBlockUnblock(client.id)}
                  >
                    {client.status === 'active' ? (
                      <>
                        <Block className="h-4 w-4 mr-2"/>
                        Block
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2"/>
                        Unblock
                      </>
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>

      {/* Edit Client Form Modal */}
      {clientToEdit && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Edit Client</h3>
            <EditClientForm
              client={clients.find(client => client.id === clientToEdit)}
              onUpdateClient={handleUpdateClient}
              onCancel={() => setClientToEdit(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// EditClientForm component
const EditClientForm: React.FC<{
  client: any;
  onUpdateClient: (updatedClient: any) => void;
  onCancel: () => void;
}> = ({client, onUpdateClient, onCancel}) => {
  const [name, setName] = useState(client?.name || '');
  const [email, setEmail] = useState(client?.email || '');
  const [contactNumber, setContactNumber] = useState(client?.contactNumber || '');
  const [packageType, setPackageType] = useState(client?.package || '');

  const handleSubmit = () => {
    onUpdateClient({id: client.id, name, email, contactNumber, package: packageType, status: client.status});
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Client Name</label>
        <input
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Contact Number</label>
        <input
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={contactNumber}
          onChange={e => setContactNumber(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Package</label>
        <select
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={packageType}
          onChange={e => setPackageType(e.target.value)}
        >
          <option value="Basic">Basic</option>
          <option value="Standard">Standard</option>
          <option value="Premium">Premium</option>
        </select>
      </div>
      <div className="flex justify-end gap-4">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>Update Client</Button>
      </div>
    </div>
  );
};

export default ClientManagement;
