import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../lib/CartContext";
import { SiteIcon } from "./SiteIcon";

const CATEGORIES = [
  { name: "الذكاء الاصطناعي", path: "/products/catalog/ai", icon: "neurology" as const },
  { name: "سوشيال ميديا",     path: "/products/catalog/social", icon: "campaign" as const },
  { name: "الألعاب",          path: "/products/catalog/gaming", icon: "sports_esports" as const },
  { name: "مواقع ومتاجر",     path: "/products/catalog/web", icon: "code" as const },
];

export function Navbar() {
  const { items } = useCart();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const totalItems = items.reduce((sum, item) => sum + item.qty, 0);

  const navLinks = [
    { name: "الرئيسية",  path: "/",        hasDropdown: false },
    { name: "المنتجات",  path: "/products", hasDropdown: true  },
    { name: "تتبع طلبك", path: "/account",  hasDropdown: false },
    { name: "اتصل بنا", path: "/contact",  hasDropdown: false },
  ];

  const handleLogoClick = () => {
    if (location.pathname === "/") window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close dropdown on route change
  useEffect(() => { setDropdownOpen(false); }, [location.pathname]);

  return (
    <nav className="perf-navbar fixed md:absolute top-0 w-full z-50 bg-transparent md:backdrop-blur-none backdrop-blur-xl font-headline antialiased transition-all duration-500 ease-in-out">
      <div className="flex justify-between items-center px-6 md:px-12 py-4 w-full max-w-screen-2xl mx-auto relative">

        {/* Right: Logo (original "زارز" text) */}
        <Link
          to="/"
          onClick={handleLogoClick}
          className="text-3xl font-black text-[#d0bcff] tracking-tight relative z-10 hover:text-white transition-colors"
        >
          زارز
        </Link>

        {/* Center: Desktop Links */}
        <div
          className="hidden md:flex flex-row items-center justify-center gap-10 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          dir="ltr"
        >
          {navLinks.slice().reverse().map((link) => {
            const isActive =
              link.path === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(link.path);

            if (link.hasDropdown) {
              return (
                <div key={link.name} className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen((v) => !v)}
                    className={`flex items-center gap-1 font-medium text-[0.9rem] transition-all duration-200 ${
                      isActive ? "text-white" : "text-[#a1a1aa] hover:text-white"
                    }`}
                  >
                    {link.name}
                    <SiteIcon
                      name="keyboard_arrow_down"
                      className={`text-[18px] transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* Dropdown */}
                  {dropdownOpen && (
                    <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 w-56 bg-surface/40 border border-white/10 rounded-3xl shadow-[0_30px_80px_rgba(0,0,0,0.8)] backdrop-blur-2xl overflow-hidden animate-fade-in ring-1 ring-white/5">
                      <div className="p-2 space-y-1">
                        {CATEGORIES.map((cat) => (
                          <Link
                            key={cat.path}
                            to={cat.path}
                            className={`flex items-center gap-3 px-4 py-3 text-sm transition-all duration-300 rounded-2xl ${
                              location.pathname === cat.path
                                ? "bg-primary/20 text-white shadow-[inset_0_0_20px_rgba(125,60,255,0.2)]"
                                : "text-[#a1a1aa] hover:bg-white/10 hover:text-white hover:translate-x-1"
                            }`}
                          >
                            <SiteIcon name={cat.icon} className={`text-[18px] shrink-0 ${location.pathname === cat.path ? 'text-primary' : 'text-primary/70'}`} />
                            <span className="font-semibold">{cat.name}</span>
                          </Link>
                        ))}
                      </div>
                      <div className="p-2 pt-0">
                        <Link
                          to="/products"
                          className="flex items-center justify-center gap-2 px-4 py-3 mt-1 text-xs font-bold text-white transition-all bg-primary/20 hover:bg-primary/40 rounded-2xl"
                        >
                          عرض جميع المنتجات
                          <SiteIcon name="arrow_forward" className="text-[14px]" />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={link.name}
                to={link.path}
                className={`font-medium text-[0.9rem] transition-all duration-200 ${
                  isActive ? "text-white" : "text-[#a1a1aa] hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Left: Cart & Account */}
        <div className="flex items-center justify-end gap-3 md:gap-5 relative z-10">
          {/* Mobile: store icon */}
          <Link to="/products" className="md:hidden text-[#d0bcff] hover:text-white transition-colors">
            <SiteIcon name="storefront" className="text-[24px]" />
          </Link>

          <Link
            to="/cart"
            className="relative text-[#a1a1aa] hover:text-white transition-colors group flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/5"
          >
            <SiteIcon name="shopping_cart" className="text-[22px]" />
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 bg-[#e11d48] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-[0_0_10px_rgba(225,29,72,0.6)] group-hover:scale-110 transition-transform">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Mobile: account icon */}
          <Link to="/account" className="md:hidden text-[#d0bcff] hover:text-white transition-colors">
            <SiteIcon name="person" className="text-[24px]" />
          </Link>

          <Link
            to="/account"
            className="hidden md:flex items-center justify-center px-5 py-2 rounded-full border border-white/20 text-white text-sm font-medium hover:bg-white/10 transition-colors"
          >
            حسابي
          </Link>
        </div>
      </div>
    </nav>
  );
}
