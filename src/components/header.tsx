import whiteLogo from "@/assets/uofg-white.png";
import Image from "next/image";
import { Button } from "./ui/button";
import { UserButton } from "@clerk/nextjs";

export function Header() {
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
        <a className="text-white hover:underline" href="/students">
          <Button variant="ghost">Students</Button>
        </a>
        <a className="text-white hover:underline" href="/admin-panel">
          <Button variant="ghost">Admin Panel</Button>
        </a>
        <a className="text-white hover:underline" href="/help">
          <Button variant="ghost">Help</Button>
        </a>
        {/* <ModeToggle /> */}
        <UserButton afterSignOutUrl="/" />
      </nav>
    </>
  );
}
