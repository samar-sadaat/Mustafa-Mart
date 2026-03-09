import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { api } from "../../api/api";
import { logout as logoutAction } from "../../store/authSlice";

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "rounded-xl px-3 py-2 text-sm transition",
          isActive
            ? "bg-white/10 text-white"
            : "text-slate-200 hover:bg-white/5",
        ].join(" ")
      }
    >
      {children}
    </NavLink>
  );
}

export default function Navbar() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await api.post("/user/logout");
    } catch (err) {
      console.log(err);
    }

    dispatch(logoutAction());
  };
  const cartItems = useSelector((state) => state.cart.items);

  const count = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/70 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-extrabold tracking-wide">
          <span className="h-2.5 w-2.5 rounded-full bg-violet-500 shadow-[0_0_0_6px_rgba(139,92,246,0.18)]" />
          <img
            src="/logo.png"
            alt="Logo"
            className="h-20 w-auto object-contain cursor-pointer transition duration-200 hover:scale-105"
          />
        </Link>

        <nav className="flex items-center gap-2">

          <NavItem to="/">Home</NavItem>
          <NavItem to="/shop">Shop</NavItem>

          {/* If NOT logged in */}
          {!user && (
            <NavItem to="/signin">Get Started</NavItem>
          )}

          {/* If logged in */}
          {user && (
            <>
              <Link
                to="/cart"
                className="ml-1 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
              >
                Cart
                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs">
                  { count }
                </span>
              </Link>

              <div className="relative">

                {/* Avatar button */}
                <button
                  onClick={() => setOpen(!open)}
                  className="ml-2 flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 hover:bg-white/10"
                >
                  {user.image ? (
                    <img
                      src={user.image}
                      alt="user"
                      className="h-7 w-7 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-500 text-xs font-bold text-white">
                      {user.name?.charAt(0)}
                    </div>
                  )}

                  <span className="text-sm text-white">{user.name?.split(" ")[0]}</span>
                </button>

                {/* Dropdown */}
                {open && (
                  <div className="absolute right-0 mt-2 w-40 rounded-xl border border-white/10 bg-slate-900 shadow-lg">

                    <Link
                      to='/user-profile'
                      className="block px-4 py-2 text-sm text-white hover:bg-white/5"
                      onClick={() => setOpen(false)}
                    >
                      Profile
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/5"
                    >
                      Logout
                    </button>

                  </div>
                )}

              </div>
            </>
          )}

        </nav>
      </div>
    </header>
  );
}