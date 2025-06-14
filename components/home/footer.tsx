import React from "react";

const Footer = () => {
  return (
    <footer className="w-full text-center py-4 text-muted-foreground text-sm z-10">
      <p>&copy; {new Date().getFullYear()} Sakibur Rahman. All Rights Reserved.</p>
    </footer>
  );
};

export default Footer;
