import * as React from 'react';

const Footer = () => {
  return (
    <div
      className="w-full text-center text-sm"
      style={{ color: 'var(--color-text-muted)' }}
    >
      &copy; {new Date().getFullYear()} P-Frog by Yotam Achrak
    </div>
  );
};
export default Footer;
