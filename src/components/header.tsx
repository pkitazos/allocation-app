"use client";
import whiteLogo from "@/assets/uofg-white.png";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import { Button } from "./ui/button";
import { useClearance } from "@/app/clearance";

export function Header() {
  const [userClearance, _recompute] = useClearance();

  return (
    <>
      <nav className="fixed w-full h-[8dvh] max-h-[5rem] py-5 bg-primary flex items-center justify-center gap-6">
        <a href="/">
          <Image
            className="object-scale-down max-w-[10rem]"
            width={300}
            height={100}
            src={whiteLogo}
            alt="University of Glasgow logo"
          />
        </a>
        <a className="text-white hover:underline" href="/projects">
          <Button variant="ghost">Projects</Button>
        </a>
        {userClearance >= 1 && (
          <a className="text-white hover:underline" href="/students">
            <Button variant="ghost">Students</Button>
          </a>
        )}
        {userClearance >= 2 && (
          <a className="text-white hover:underline" href="/admin-panel">
            <Button variant="ghost">Admin Panel</Button>
          </a>
        )}
        <a className="text-white hover:underline" href="/help">
          <Button variant="ghost">Help</Button>
        </a>
        {/* <ModeToggle /> */}
        <UserButton afterSignOutUrl="/" />
      </nav>
    </>
  );
}
