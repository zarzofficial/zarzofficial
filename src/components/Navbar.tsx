import { Link, useLocation } from "react-router-dom";
import { useCart } from "../lib/CartContext";
import { SiteIcon } from "./SiteIcon";

export function Navbar() {
  const { items } = useCart();
  const location = useLocation();

  const totalItems = items.reduce((sum, item) => sum + item.qty, 0);

  const navLinks = [
    { name: "الرئيسية", path: "/", hasDropdown: false },
    { name: "المنتجات", path: "/products", hasDropdown: true },
    { name: "تتبع طلبك", path: "/account", hasDropdown: false },
    { name: "اتصل بنا", path: "/contact", hasDropdown: true },
  ];

  const handleLogoClick = () => {
    if (location.pathname === "/") {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav className="perf-navbar fixed top-0 w-full z-50 bg-[#000000]/80 backdrop-blur-xl border-b border-white/5 font-headline antialiased">
      <div className="flex justify-between items-center px-6 md:px-12 py-4 w-full max-w-screen-2xl mx-auto flex-row relative">
        {/* Left: Logo */}
        <Link to="/" onClick={handleLogoClick} className="flex items-center gap-2 relative z-10 group mt-1">
          <div className="text-2xl font-black text-white tracking-tight flex items-center gap-2 group-active:scale-95 transition-transform">
            <div className="w-8 h-8 rounded-lg outline outline-2 outline-offset-2 outline-[#a855f7]/50 bg-gradient-to-tr from-[#a855f7] to-[#d8b4fe] flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.4)]">
              <span className="text-black font-extrabold text-lg leading-none -mt-1 -ml-0.5">Z</span>
            </div>
            <span className="text-xl tracking-wide">ZARZ</span>
          </div>
        </Link>

        {/* Center: Desktop Links */}
        <div className="hidden md:flex flex-row items-center justify-center gap-10 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full" dir="ltr">
          {navLinks.slice().reverse().map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center gap-1.5 font-medium text-[0.9rem] transition-all duration-300 ${
                  isActive 
                    ? "text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]" 
                    : "text-[#a1a1aa] hover:text-white"
                }`}
              >
                {link.name}
                {link.hasDropdown && (
                  <SiteIcon name="keyboard_arrow_down" className="text-[18px] opacity-70" />
                )}
              </Link>
            );
          })}
        </div>
        
        {/* Right side: Cart & Action button */}
        <div className="flex items-center justify-end gap-3 md:gap-5 relative z-10 h-full">
          <Link to="/cart" className="relative text-[#a1a1aa] hover:text-white transition-colors group flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/5">
            <SiteIcon name="shopping_cart" className="text-[22px]" />
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 bg-[#e11d48] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full group-hover:scale-110 shadow-[0_0_10px_rgba(225,29,72,0.6)] transition-transform">
                {totalItems}
              </span>
            )}
          </Link>
          <Link to="/account" className="hidden md:flex items-center justify-center px-6 py-2 rounded-full border border-white/20 text-white text-sm font-medium hover:bg-white/10 transition-colors">
            حسابي
          </Link>
        </div>

      </div>
    </nav>
  );
}
