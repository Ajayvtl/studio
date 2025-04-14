
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
import {Home, Settings} from "lucide-react";
import Link from "next/link";

const SidebarNavigation: React.FC = () => {
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
                <Home/>
                <span>Dashboard</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/admin">
              <SidebarMenuButton>
                <Settings/>
                <span>Admin</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
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
