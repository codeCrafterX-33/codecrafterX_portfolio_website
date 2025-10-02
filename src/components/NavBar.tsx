import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { navLinks } from "../constants";
import ModernButton from "./ModernButton";

const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll event to change navbar style

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <header className={`navbar ${scrolled ? "scrolled" : "not-scrolled"}`}>
      <div className="inner">
        <Link className="logo" to="/#hero">
          Sopefoluwa | CodecrafterX
        </Link>
        <nav className="desktop">
          <ul>
            {navLinks.map(({ name, href }) => {
              // Check if the link is active based on current route
              const isActive = 
                (href.startsWith('/') && location.pathname === href) ||
                (href.startsWith('#') && location.pathname === '/' && location.hash === href);
              
              // Use Link for route navigation, special handling for hash anchors
              if (href.startsWith('#')) {
                return (
                  <li key={name} className="group">
                    <Link to={`/${href}`} className={isActive ? 'active' : ''}>
                      <span> {name}</span>
                      <span className={`underline ${isActive ? 'animate-pulse bg-gradient-to-r from-purple-400 to-pink-400' : ''}`}></span>
                      {isActive && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse"></span>
                      )}
                    </Link>
                  </li>
                );
              }
              
              return (
                <li key={name} className="group">
                  <Link to={href} className={isActive ? 'active' : ''}>
                    <span> {name}</span>
                    <span className={`underline ${isActive ? 'animate-pulse bg-gradient-to-r from-purple-400 to-pink-400' : ''}`}></span>
                    {isActive && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse"></span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <ModernButton 
            href="/#contact" 
            variant="primary" 
            size="sm"
            className="text-xs sm:text-sm"
            icon={<span className="text-xs">📧</span>}
          >
            Contact me
          </ModernButton>
          <ModernButton 
            href="/about" 
            variant="outline" 
            size="sm"
            className="text-xs sm:text-sm"
            icon={<span className="text-xs">👤</span>}
          >
            About me
          </ModernButton>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
