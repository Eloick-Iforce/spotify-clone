"use client";

import { useRouter } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { RxCaretLeft } from "react-icons/rx";
import { RxCaretRight } from "react-icons/rx";
import { HiHome } from "react-icons/hi";
import { BiSearch } from "react-icons/bi";
import Button from "./Button";
import useAuthModal from "@/hooks/useAuthModal";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useUser } from "@/hooks/useUser";

interface HeaderProps {
  children: React.ReactNode;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ children, className }) => {
  const router = useRouter();

  const AuthModal = useAuthModal();

  const supabaseClient = useSupabaseClient();

  const { user } = useUser();


  const handleLogout = async () => {

    const { error } = await supabaseClient.auth.signOut();
    // TODO reset play song
    router.refresh();
    if (error) {
      console.log(error);
    }
  };

  return (
    <div
      className={twMerge(
        `
        h-fit
        bg-gradient-to-b
        from-emerald-800
        p-6
        `,
        className
      )}
    >
      <div
        className="
            w-full
            mb-4
            flex
            items-center
            justify-between"
      >
        <div
          className="hidden
                md:flex
                gap-x-2
                items-center"
        >
          <button
            className="
            rounded-full
            bg-black
            flex
            items-center
            justify-center
            hover:opacity-75
            transition
            "
            onClick={() => router.back()}
          >
            <RxCaretLeft className="text-white" size={35} />
          </button>
          <button
            className="
            rounded-full
            bg-black
            flex
            items-center
            justify-center
            hover:opacity-75
            transition
            "
            onClick={() => router.forward()}
          >
            <RxCaretRight className="text-white" size={35} />
          </button>
        </div>
        <div className="flex md:hidden gap-x-2 items-center">
          <button
            className="
            rounded-full
            p-2
            bg-white
            flex
            items-center
            justify-center
            hover:opacity-75
            transition"
          >
            <HiHome className="text-black" size={20} />
          </button>
          <button
            className="
            rounded-full
            p-2
            bg-white
            flex
            items-center
            justify-center
            hover:opacity-75
            transition"
          >
            <BiSearch className="text-black" size={20} />
          </button>
        </div>
        <div
          className="
            flex
            justify-between
            items-center
            gap-x-4"
        >

          { user ? ( 
            <div className="flex items-center gap-x-4">
              <Button
                onClick={handleLogout}
                className="bg-white
                px-6 py-2
                    font-medium"
              >
                Se déconnecter
              </Button>
            </div>
          ) : (
  <>
          <div>
            <Button
              onClick={AuthModal.onOpen}
              className="bg-transparent
                    text-neutral-300
                    font-medium"
            >
              S'inscrire
            </Button>
          </div>
          <div>
            <Button
              onClick={AuthModal.onOpen}
              className="bg-white
                    px-6
                    py-2"
            >
              Se connecter
            </Button>
          </div>
          </>
          )}
        </div>
      </div>
      {children}
    </div>
  );
};

export default Header;
