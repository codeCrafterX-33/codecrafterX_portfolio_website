import { type ReactNode } from "react";
import { Link } from "react-router-dom";

type ModernButtonProps = {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  icon?: ReactNode;
  target?: "_blank" | "_self";
  rel?: string;
};

const ModernButton = ({
  href,
  onClick,
  children,
  variant = "primary",
  size = "md",
  className = "",
  icon,
  target,
  rel,
}: ModernButtonProps) => {
  const baseClasses = `
    relative overflow-hidden group
    inline-flex items-center justify-center gap-2
    font-medium transition-all duration-300 ease-out
    rounded-xl border backdrop-blur-sm
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent
    transform hover:scale-105 active:scale-95
  `;

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm",
    md: "px-4 py-2 text-sm sm:px-6 sm:py-3 sm:text-base",
    lg: "px-6 py-3 text-base sm:px-8 sm:py-4 sm:text-lg",
  };

  const variantClasses = {
    primary: `
      bg-gradient-to-r from-purple-500 to-pink-500 
      border-transparent text-white shadow-lg shadow-purple-500/25
      hover:shadow-xl hover:shadow-purple-500/40
      focus:ring-purple-500
      before:absolute before:inset-0 before:bg-gradient-to-r before:from-pink-500 before:to-purple-500 
      before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100
    `,
    secondary: `
      bg-gradient-to-r from-blue-500 to-cyan-500 
      border-transparent text-white shadow-lg shadow-blue-500/25
      hover:shadow-xl hover:shadow-blue-500/40
      focus:ring-blue-500
      before:absolute before:inset-0 before:bg-gradient-to-r before:from-cyan-500 before:to-blue-500 
      before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100
    `,
    outline: `
      bg-transparent border-2 border-white/20 text-white
      hover:bg-white/10 hover:border-white/40
      focus:ring-white/50
      backdrop-blur-md
    `,
    ghost: `
      bg-white/5 border-white/10 text-white/90
      hover:bg-white/10 hover:text-white hover:border-white/20
      focus:ring-white/30
      backdrop-blur-md
    `,
  };

  const classes = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;

  const content = (
    <>
      <span className="relative z-10 flex items-center gap-2">
        {icon && <span className="transition-transform group-hover:scale-110">{icon}</span>}
        {children}
      </span>
      
      {/* Shimmer effect */}
      <div className="absolute inset-0 -top-2 -left-2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
      
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-purple-400/20 to-pink-400/20 blur-xl -z-10" />
    </>
  );

  if (href) {
    // Use React Router Link for route navigation, regular <a> for hash anchors
    if (href.startsWith('/') && !href.includes('#')) {
      return (
        <Link to={href} className={classes}>
          {content}
        </Link>
      );
    }
    
    // Regular link for hash anchors or external URLs
    return (
      <Link to={href} target={target} rel={rel} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={classes}>
      {content}
    </button>
  );
};

export default ModernButton;
