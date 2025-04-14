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
import {Settings, Users, Globe, Building, Shapes, BarChart3, Home} from "lucide-react";
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
                <Home />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/admin/users">
              <SidebarMenuButton>
                <Users/>
                <span>Users</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/admin/countries">
              <SidebarMenuButton>
                <Globe/>
                <span>Countries</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/admin/exchanges">
              <SidebarMenuButton>
                <Building/>
                <span>Exchanges</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/admin/settings">
              <SidebarMenuButton>
                <Settings/>
                <span>Settings</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
              <Link href="/patterns">
                  <SidebarMenuButton>
                      <Shapes />
                      <span>Patterns</span>
                  </SidebarMenuButton>
              </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
              <Link href="/charts">
                  <SidebarMenuButton>
                      <BarChart3 />
                      <span>Charts</span>
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
