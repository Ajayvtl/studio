'use client';

import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {Settings, Users, Globe, Building, Shapes, BarChart3, Home, UserPlus, ShieldCheck} from "lucide-react";
import Link from "next/link";
import {getCurrentStaff} from "@/lib/auth";
import {redirect} from "next/navigation";

const SidebarNavigation: React.FC = () => {
  const [staff, setStaff] = React.useState(null);

    React.useEffect(() => {
        const fetchStaff = async () => {
            const staffData = await getCurrentStaff();
            setStaff(staffData);
        };
        fetchStaff();
    }, []);

    if (!staff) {
        return <div>Loading...</div>;
    }

    const hasPermission = (module: string) => {
        return staff.permissions && staff.permissions[module];
    };

  return (
    <Sidebar>
      <SidebarHeader>
        <h2>DataLens</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
           <SidebarMenuItem>
            <Link href="/dashboard">
              <SidebarMenuButton>
                <Home />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          {hasPermission('users') && (
            <SidebarMenuItem>
              <Link href="/admin/users">
                <SidebarMenuButton>
                  <Users/>
                  <span>Users</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          )}
          {hasPermission('staff') && (
            <SidebarMenuItem>
              <Link href="/admin/staff">
                <SidebarMenuButton>
                  <UserPlus/>
                  <span>Staff</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          )}
          {hasPermission('clients') && (
            <SidebarMenuItem>
              <Link href="/admin/clients">
                <SidebarMenuButton>
                  <Users/>
                  <span>Clients</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          )}
          {hasPermission('countries') && (
            <SidebarMenuItem>
              <Link href="/admin/countries">
                <SidebarMenuButton>
                  <Globe/>
                  <span>Countries</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          )}
          {hasPermission('exchanges') && (
            <SidebarMenuItem>
              <Link href="/admin/exchanges">
                <SidebarMenuButton>
                  <Building/>
                  <span>Exchanges</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          )}
           {hasPermission('permissions') && (
            <SidebarMenuItem>
              <Link href="/admin/permissions">
                <SidebarMenuButton>
                  <ShieldCheck/>
                  <span>Permissions</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          )}
          {hasPermission('settings') && (
            <SidebarMenuItem>
              <Link href="/admin/settings">
                <SidebarMenuButton>
                  <Settings/>
                  <span>Settings</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          )}
          {hasPermission('patterns') && (
              <SidebarMenuItem>
                  <Link href="/patterns">
                      <SidebarMenuButton>
                          <Shapes />
                          <span>Patterns</span>
                      </SidebarMenuButton>
                  </Link>
              </SidebarMenuItem>
          )}
          {hasPermission('charts') && (
            <SidebarMenuItem>
              <Link href="/charts">
                <SidebarMenuButton>
                  <BarChart3 />
                  <span>Charts</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarSeparator/>
        <SidebarGroup>
          DataLens v0.1.0
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
};

export default SidebarNavigation;
