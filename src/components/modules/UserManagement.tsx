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
import AddUserForm from "@/components/forms/AddUserForm";
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
} from "@/components/ui/alert-dialog";
import {Edit, Trash} from "lucide-react";
import {ScrollArea} from "@/components/ui/scroll-area";

// Dummy data for users
const initialUsers = [
  {
    id: '1',
    name: 'John Doe',
    middleName: 'M',
    title: 'Manager',
    email: 'john.doe@example.com',
    mobileNumber: '123-456-7890',
  },
  {
    id: '2',
    name: 'Jane Smith',
    middleName: 'A',
    title: 'Developer',
    email: 'jane.smith@example.com',
    mobileNumber: '987-654-3210',
  },
  {
    id: '3',
    name: 'Alice Johnson',
    middleName: 'B',
    title: 'Designer',
    email: 'alice.johnson@example.com',
    mobileNumber: '555-123-4567',
  },
];

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState(initialUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [userToEdit, setUserToEdit] = useState<string | null>(null);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.mobileNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddUser = (newUser: any) => {
    setUsers([...users, {...newUser, id: String(Date.now())}]);
    setIsAddUserOpen(false);
  };

  const handleUpdateUser = (updatedUser: any) => {
    setUsers(users.map(user =>
      user.id === updatedUser.id ? updatedUser : user
    ));
    setUserToEdit(null);
  };

  const handleDeleteConfirmation = (userId: string) => {
    setUserToDelete(userId);
  };

  const handleDelete = () => {
    if (userToDelete) {
      setUsers(users.filter(user => user.id !== userToDelete));
      setUserToDelete(null);
    }
  };

  const handleEdit = (userId: string) => {
    setUserToEdit(userId);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        <Button onClick={() => setIsAddUserOpen(true)}>Add User</Button>
      </div>

      <ScrollArea>
        <Table>
          <TableCaption>List of users and their details.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Mobile Number</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map(user => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.mobileNumber}</TableCell>
                <TableCell className="text-right font-medium">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(user.id)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Trash className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the
                          user from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>

      {/* Add User Form Modal */}
      {isAddUserOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Add User</h3>
            <AddUserForm onAddUser={handleAddUser} />
            <div className="text-right mt-4">
              <Button variant="secondary" onClick={() => setIsAddUserOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Form Modal (similar structure as Add User) */}
      {userToEdit && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Edit User</h3>
            {/* Implement EditUserForm with pre-filled data and update logic */}
            <EditUserForm
              user={users.find(user => user.id === userToEdit)}
              onUpdateUser={handleUpdateUser}
              onCancel={() => setUserToEdit(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// EditUserForm component
const EditUserForm: React.FC<{
  user: any;
  onUpdateUser: (updatedUser: any) => void;
  onCancel: () => void;
}> = ({user, onUpdateUser, onCancel}) => {
  const [name, setName] = useState(user?.name || '');
  const [middleName, setMiddleName] = useState(user?.middleName || '');
  const [title, setTitle] = useState(user?.title || '');
  const [email, setEmail] = useState(user?.email || '');
  const [mobileNumber, setMobileNumber] = useState(user?.mobileNumber || '');

  const handleSubmit = () => {
    onUpdateUser({id: user.id, name, middleName, title, email, mobileNumber});
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Middle Name</label>
        <input
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={middleName}
          onChange={e => setMiddleName(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={title}
          onChange={e => setTitle(e.target.value)}
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
        <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
        <input
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={mobileNumber}
          onChange={e => setMobileNumber(e.target.value)}
        />
      </div>
      <div className="flex justify-end gap-4">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>Update</Button>
      </div>
    </div>
  );
};

export default UserManagement;
