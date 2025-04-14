'use client';

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

const initialStaff = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Admin',
    status: 'active',
    permissions: {
      users: ['create', 'read', 'update', 'delete'],
      clients: ['create', 'read', 'update', 'delete'],
      settings: ['create', 'read', 'update', 'delete'],
    },
    departments: ['users', 'clients', 'settings']
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'Editor',
    status: 'active',
    permissions: {
      users: ['read', 'update'],
      clients: ['create', 'read'],
    },
    departments: ['users', 'clients']
  },
  {
    id: '3',
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    role: 'Viewer',
    status: 'blocked',
    permissions: {
      users: ['read'],
    },
    departments: ['users']
  },
];

const availableModules = ['users', 'clients', 'settings', 'countries', 'exchanges'];
const crudPermissions = ['create', 'read', 'update', 'delete'];

const PermissionsPage = () => {
  const [staff, setStaff] = useState(initialStaff);
  const [searchQuery, setSearchQuery] = useState('');
    const { toast } = useToast();

  const filteredStaff = staff.filter(staffMember =>
    staffMember.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    staffMember.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    staffMember.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePermissionChange = (staffId: string, module: string, permission: string) => {
    setStaff(prevStaff =>
      prevStaff.map(staffMember => {
        if (staffMember.id === staffId) {
          const currentPermissions = { ...staffMember.permissions };
          const modulePermissions = currentPermissions[module] || [];

          const hasPermission = modulePermissions.includes(permission);

          let updatedPermissions;
          if (hasPermission) {
            updatedPermissions = {
              ...currentPermissions,
              [module]: modulePermissions.filter(p => p !== permission),
            };
          } else {
            updatedPermissions = {
              ...currentPermissions,
              [module]: [...modulePermissions, permission],
            };
          }

          return {
            ...staffMember,
            permissions: updatedPermissions,
          };
        }
        return staffMember;
      })
    );
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Permissions Management</CardTitle>
          <CardDescription>Assign permissions to staff members.</CardDescription>
        </CardHeader>
        <CardContent>
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
              <TableCaption>List of staff members and their permissions.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  {availableModules.map(module => (
                    <TableHead key={module}>{module}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStaff.map(staffMember => (
                  <TableRow key={staffMember.id}>
                    <TableCell>{staffMember.name}</TableCell>
                    <TableCell>{staffMember.email}</TableCell>
                    <TableCell>{staffMember.role}</TableCell>
                    {availableModules.map(module => (
                      <TableCell key={module}>
                        <div className="flex flex-col">
                          {crudPermissions.map(permission => (
                            <label key={permission} className="inline-flex items-center">
                              <Checkbox
                                checked={staffMember.permissions[module]?.includes(permission) || false}
                                onCheckedChange={(checked) => {
                                  handlePermissionChange(staffMember.id, module, permission);
                                  toast({
                                    title: `Permission Updated`,
                                    description: `Staff member ${staffMember.name}'s permission for ${permission} in ${module} was updated successfully.`,
                                  });
                                }}
                              />
                              <span className="ml-2">{permission}</span>
                            </label>
                          ))}
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default PermissionsPage;
