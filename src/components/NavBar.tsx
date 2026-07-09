import { useEffect, useRef, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { navLinks } from "../constants";
import ModernButton from "./ModernButton";

const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const revealTimer = useRef<number | null>(null);
  const location = useLocation();

  // Handle scroll event to change navbar style
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isScrolled = currentScrollY > 10;

      setScrolled(isScrolled);

      if (!isScrolled || mobileMenuOpen) {
        setHidden(false);
        return;
      }

      setHidden(true);

      if (revealTimer.current) {
        window.clearTimeout(revealTimer.current);
      }

      revealTimer.current = window.setTimeout(() => {
        setHidden(false);
      }, 1000);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    // Cleanup event listener on component unmount
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("scroll", handleScroll);
      if (revealTimer.current) {
        window.clearTimeout(revealTimer.current);
      }
    };
  }, [mobileMenuOpen]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header
      className={`navbar ${scrolled ? "scrolled" : "not-scrolled"} ${
        hidden ? "hidden-up" : "visible-down"
      }`}
    >
      <div className="inner px-2 md:py-5">
        <Link
          className="logo flex w-[280px] shrink-0 items-center justify-start -translate-x-8 md:-translate-x-4"
          to="/"
        >
          <img
            src="/images/logos/codecrafter_logo.png"
            alt="CodeCrafterX"
            className="h-12 md:h-10 w-auto object-contain max-w-none origin-left scale-[1.2] md:scale-[1.9] transition-transform duration-300 ease-in-out"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="desktop">
          <ul>
            {navLinks.map(({ name, href }) => {
              // Check if the link is active based on current route
              const isActive =
                (href.startsWith("/") && location.pathname === href) ||
                (href.startsWith("#") &&
                  location.pathname === "/" &&
                  location.hash === href);

              // Use Link for route navigation, special handling for hash anchors
              if (href.startsWith("#")) {
                return (
                  <li key={name} className="group">
                    <Link to={`/${href}`} className={isActive ? "active" : ""}>
                      <span> {name}</span>
                      <span
                        className={`underline ${isActive ? "animate-pulse bg-gradient-to-r from-green-400 to-emerald-400" : ""}`}
                      ></span>
                      {isActive && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-pulse"></span>
                      )}
                    </Link>
                  </li>
                );
              }

              return (
                <li key={name} className="group">
                  <Link
                    to={href}
                    reloadDocument
                    className={isActive ? "active" : ""}
                  >
                    <span> {name}</span>
                    <span
                      className={`underline ${isActive ? "animate-pulse bg-gradient-to-r from-green-400 to-emerald-400" : ""}`}
                    ></span>
                    {isActive && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-pulse"></span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          className={`md:hidden mobile-menu-btn ${mobileMenuOpen ? "open" : ""}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <div className={`hamburger ${mobileMenuOpen ? "open" : ""}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>

        {/* Action Buttons - Desktop */}
        <div className="desktop-buttons flex-col sm:flex-row gap-2 sm:gap-3">
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

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="mobile-menu-overlay" onClick={toggleMobileMenu}>
            <div
              className="mobile-menu-content"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                className="mobile-close-btn"
                onClick={toggleMobileMenu}
                aria-label="Close mobile menu"
              >
                ×
              </button>

              {/* Mobile Navigation Links */}
              <div className="mobile-nav-links">
                {navLinks.map(({ name, href }) => {
                  const isActive =
                    (href.startsWith("/") && location.pathname === href) ||
                    (href.startsWith("#") &&
                      location.pathname === "/" &&
                      location.hash === href);

                  if (href.startsWith("#")) {
                    return (
                      <Link
                        key={name}
                        to={`/${href}`}
                        className={`mobile-link ${isActive ? "active" : ""}`}
                        onClick={toggleMobileMenu}
                      >
                        {name}
                        {isActive && (
                          <span className="mobile-active-indicator"></span>
                        )}
                      </Link>
                    );
                  }

                  return (
                    <Link
                      key={name}
                      to={href}
                      className={`mobile-link ${isActive ? "active" : ""}`}
                      onClick={toggleMobileMenu}
                    >
                      {name}
                      {isActive && (
                        <span className="mobile-active-indicator"></span>
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* Mobile Action Buttons */}
              <div className="mobile-action-buttons">
                <div onClick={toggleMobileMenu}>
                  <ModernButton
                    href="/#contact"
                    variant="primary"
                    size="sm"
                    icon={<span className="text-xs">📧</span>}
                  >
                    Contact me
                  </ModernButton>
                </div>
                <div onClick={toggleMobileMenu}>
                  <ModernButton
                    href="/about"
                    variant="outline"
                    size="sm"
                    icon={<span className="text-xs">👤</span>}
                  >
                    About me
                  </ModernButton>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default NavBar;
