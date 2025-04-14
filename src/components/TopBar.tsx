"use client";

import React, {useEffect, useState} from 'react';
import {Button} from "@/components/ui/button";
import {Sun, Moon} from "lucide-react";
import {signOut, useSession} from "next-auth/react";
import {getCurrentStaff} from "@/lib/auth";

const TopBar: React.FC = () => {
  const [staffName, setStaffName] = useState<string | null>(null);
  const [staffRole, setStaffRole] = useState<string | null>(null);
  const {data: session} = useSession();

    useEffect(() => {
        const fetchStaffData = async () => {
            const staff = await getCurrentStaff();
            if (staff) {
                setStaffName(staff.name);
                setStaffRole(staff.role);
            }
        };

        fetchStaffData();
    }, [session]);

    const handleLogout = async () => {
        await signOut({redirect: false});
        window.location.href = '/api/auth/signin';
    };

  return (
    <div className="flex items-center justify-between p-4 bg-background border-b">
      <div>
        {/* You can add a logo or title here */}
      </div>
      <div className="flex items-center space-x-4">
        <div>
          <span className="text-sm">{staffName}</span>
          <span className="text-xs text-muted-foreground"> ({staffRole})</span>
        </div>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </div>
  );
};

export default TopBar;
