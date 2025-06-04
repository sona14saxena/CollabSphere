import React from 'react';
import { Network } from 'lucide-react';

interface LogoProps {
  className?: string;
}

const Logo = ({ className = "h-6 w-6" }: LogoProps) => {
  return <Network className={`text-primary-light ${className}`} />;
};

export default Logo;