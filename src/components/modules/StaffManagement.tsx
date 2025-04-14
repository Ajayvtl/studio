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

// Dummy data for staff members
const initialStaff = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Admin',
    status: 'active',
    permissions: ['users', 'clients', 'settings'],
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'Editor',
    status: 'active',
    permissions: ['users', 'clients'],
  },
  {
    id: '3',
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    role: 'Viewer',
    status: 'blocked',
    permissions: ['users'],
  },
];

const StaffManagement: React.FC = () => {
  const [staff, setStaff] = useState(initialStaff);
  const [searchQuery, setSearchQuery] = useState('');
  const [staffToDelete, setStaffToDelete] = useState<string | null>(null);
  const [staffToEdit, setStaffToEdit] = useState<string | null>(null);

  const filteredStaff = staff.filter(staffMember =>
    staffMember.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    staffMember.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    staffMember.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUpdateStaff = (updatedStaff: any) => {
    setStaff(staff.map(staffMember =>
      staffMember.id === updatedStaff.id ? updatedStaff : staffMember
    ));
    setStaffToEdit(null);
    toast({
      title: "Staff Updated",
      description: `Staff member ${updatedStaff.name} was updated successfully.`,
    });
  };

  const handleDeleteConfirmation = (staffId: string) => {
    setStaffToDelete(staffId);
  };

  const handleDelete = () => {
    if (staffToDelete) {
      const deletedStaff = staff.find(staffMember => staffMember.id === staffToDelete);
      setStaff(staff.filter(staffMember => staffMember.id !== staffToDelete));
      setStaffToDelete(null);
      toast({
        title: "Staff Deleted",
        description: `Staff member ${deletedStaff?.name} was deleted successfully.`,
      });
    }
  };

  const handleEdit = (staffId: string) => {
    setStaffToEdit(staffId);
  };

  const handleBlockUnblock = (staffId: string) => {
    setStaff(staff.map(staffMember => {
      if (staffMember.id === staffId) {
        const newStatus = staffMember.status === 'active' ? 'blocked' : 'active';
        toast({
          title: `Staff ${newStatus === 'active' ? 'Unblocked' : 'Blocked'}`,
          description: `Staff member ${staffMember.name} was ${newStatus === 'active' ? 'unblocked' : 'blocked'} successfully.`,
        });
        return {...staffMember, status: newStatus};
      }
      return staffMember;
    }));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Input
          type="text"
          placeholder="Search staff..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>

      <ScrollArea>
        <Table>
          <TableCaption>List of staff members and their details.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStaff.map(staffMember => (
              <TableRow key={staffMember.id}>
                <TableCell>{staffMember.name}</TableCell>
                <TableCell>{staffMember.email}</TableCell>
                <TableCell>{staffMember.role}</TableCell>
                <TableCell>
                  {staffMember.status === 'active' ? (
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
                    onClick={() => handleEdit(staffMember.id)}
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
                          staff member from our servers.
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
                    onClick={() => handleBlockUnblock(staffMember.id)}
                  >
                    {staffMember.status === 'active' ? (
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

      {/* Edit Staff Form Modal */}
      {staffToEdit && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Edit Staff Member</h3>
            <EditStaffForm
              staff={staff.find(staffMember => staffMember.id === staffToEdit)}
              onUpdateStaff={handleUpdateStaff}
              onCancel={() => setStaffToEdit(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// EditStaffForm component
const EditStaffForm: React.FC<{
  staff: any;
  onUpdateStaff: (updatedStaff: any) => void;
  onCancel: () => void;
}> = ({staff, onUpdateStaff, onCancel}) => {
  const [name, setName] = useState(staff?.name || '');
  const [email, setEmail] = useState(staff?.email || '');
  const [role, setRole] = useState(staff?.role || '');
  const [permissions, setPermissions] = useState(staff?.permissions || []);

  const handleSubmit = () => {
    onUpdateStaff({id: staff.id, name, email, role, permissions, status: staff.status});
  };

  const handlePermissionChange = (permission: string) => {
    if (permissions.includes(permission)) {
      setPermissions(permissions.filter(p => p !== permission));
    } else {
      setPermissions([...permissions, permission]);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Staff Name</label>
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
        <label className="block text-sm font-medium text-gray-700">Role</label>
        <select
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={role}
          onChange={e => setRole(e.target.value)}
        >
          <option value="Admin">Admin</option>
          <option value="Editor">Editor</option>
          <option value="Viewer">Viewer</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Permissions</label>
        <div className="space-y-2">
          <div>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-indigo-600"
                checked={permissions.includes('users')}
                onChange={() => handlePermissionChange('users')}
              />
              <span className="ml-2">Users</span>
            </label>
          </div>
          <div>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-indigo-600"
                checked={permissions.includes('clients')}
                onChange={() => handlePermissionChange('clients')}
              />
              <span className="ml-2">Clients</span>
            </label>
          </div>
          <div>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-indigo-600"
                checked={permissions.includes('settings')}
                onChange={() => handlePermissionChange('settings')}
              />
              <span className="ml-2">Settings</span>
            </label>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-4">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>Update Staff</Button>
      </div>
    </div>
  );
};

export default StaffManagement;
