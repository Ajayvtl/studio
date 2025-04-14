import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="p-4 text-center text-sm text-muted-foreground border-t">
      © {new Date().getFullYear()} DataLens. All rights reserved.
    </footer>
  );
};

export default Footer;
