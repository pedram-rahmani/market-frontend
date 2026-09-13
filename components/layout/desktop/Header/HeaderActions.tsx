"use client";

import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

import useClickOutside from "@/store/hooks/useClickOutside";
import useTheme from "@/store/hooks/useTheme";
import BasketModal from "@/components/cart/BasketModal/BasketModal";
import UserModal from "@/components/user/UserModal/UserModal";
import SearchInput from "@/components/ui/SearchInput/SearchInput";
import Link from "next/link";
import { getProducts } from "@/services/product";

const ASSET_URL = process.env.NEXT_PUBLIC_ASSET_URL || "http://127.0.0.1:8000";

export default function HeaderActions() {
  const userInfo = useSelector((state: RootState) => state.auth.user);
  const isLoggedIn = useSelector((state: RootState) => !!state.auth.user);

  const [theme, toggleTheme] = useTheme();
  const [showBasket, setShowBasket] = useState<boolean>(false);
  const [showProfile, setShowProfile] = useState<boolean>(false);

  const basketRef = useRef<HTMLDivElement>(null!);
  const profileRef = useRef<HTMLDivElement>(null!);

  useClickOutside(() => setShowBasket(false), [basketRef]);
  useClickOutside(() => setShowProfile(false), [profileRef]);

  return (
    <div className="flex items-center gap-x-3 md:gap-x-4 shrink-0">
      {/* Search Box */}
      <div className="hidden xl:block w-64 3xl:w-80">
        <SearchInput
          placeholder="به دنبال چه میگردی؟"
          showImage={true}
          filterKey="name"
          redirectUrl="/search"
          searchParamName="search"
          getItemLink={(item: any) => `/products/${item.slug || item.id}`}
          fetcher={async (query) => {
            const products = await getProducts({ search: query });
            return products.map((product) => {
              let imageUrl = product.img;
              if (imageUrl && !imageUrl.startsWith("http")) {
                imageUrl = `${ASSET_URL}/storage/${imageUrl.replace(/^\/?storage\//, "")}`;
              }
              return { ...product, img: imageUrl };
            });
          }}
        />
      </div>
      
      {/* Toggle Theme Button */}
      <div
        className="hidden md:flex button-xl h-btn cursor-pointer"
        onClick={() => toggleTheme()}
      >
        <svg className={`${theme === "dark" ? "hidden" : "inline"}`}>
          <path d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
        </svg>
        <svg className={`${theme === "dark" ? "inline" : "hidden"}`}>
          <path d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
        </svg>
      </div>

      {/* Basket */}
      <div className="relative rounded-full group z-50" ref={basketRef}>
        <button
          className="h-btn"
          type="button"
          onClick={() => {
            setShowBasket((prev) => !prev);
            showProfile && setShowProfile(false);
          }}
        >
          <svg>
            <path d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
          </svg>
        </button>
        <BasketModal 
          showBasket={showBasket} 
          onClose={() => setShowBasket(false)} 
        />
      </div>

      {/* Profile / Login */}
      {isLoggedIn ? (
        <div className="relative rounded-full group z-50" ref={profileRef}>
          <button
            className="h-btn"
            type="button"
            onClick={() => {
              setShowProfile((prev) => !prev);
              showBasket && setShowBasket(false);
            }}
          >
            <svg>
              <path d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
          </button>
          <UserModal 
            showProfile={showProfile} 
            onClose={() => setShowProfile(false)} 
          />
        </div>
      ) : (
        <Link className="btn btn--link text-white! text-xs md:text-sm whitespace-nowrap" href="/login">
          <svg viewBox="0 0 24 24" className="size-5!">
            <path d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
          </svg>
          <span>ورود | عضویت</span>
        </Link>
      )}
    </div>
  );
}