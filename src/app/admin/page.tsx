'use client';

import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import UserManagement from '@/components/modules/UserManagement';
import CountryManagement from '@/components/modules/CountryManagement';
import ExchangeManagement from '@/components/modules/ExchangeManagement';
import SettingsPanel from '@/components/SettingsPanel';
import {useState} from 'react';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('users');

  return (
    <div className="container mx-auto py-10">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="countries">Countries</TabsTrigger>
          <TabsTrigger value="exchanges">Exchanges</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="users" className="mt-4">
          <UserManagement />
        </TabsContent>
        <TabsContent value="countries" className="mt-4">
          <CountryManagement />
        </TabsContent>
        <TabsContent value="exchanges" className="mt-4">
          <ExchangeManagement />
        </TabsContent>
        <TabsContent value="settings" className="mt-4">
          <SettingsPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}
