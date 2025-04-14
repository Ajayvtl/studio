"use client";

import React from 'react';
import {Button} from "@/components/ui/button";
import {Sun, Moon} from "lucide-react";

const TopBar: React.FC = () => {
  // Dummy user data
  const userName = 'John Doe';
  const userRole = 'Admin';

  return (
    <div className="flex items-center justify-between p-4 bg-background border-b">
      <div>
        {/* You can add a logo or title here */}
      </div>
      <div className="flex items-center space-x-4">
        <div>
          <span className="text-sm">{userName}</span>
          <span className="text-xs text-muted-foreground"> ({userRole})</span>
        </div>
        <Button variant="outline" size="sm">
          Logout
        </Button>
      </div>
    </div>
  );
};

export default TopBar;
