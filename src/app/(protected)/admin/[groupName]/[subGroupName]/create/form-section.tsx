"use client";
import { DatePicker } from "@/components/datepicker";
import { Input } from "@/components/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";

export function FormSection() {
  return (
    <div className="mt-10 flex flex-col gap-6">
      <div className="flex flex-col items-start gap-3">
        <h3 className="text-2xl">Allocation Instance Name</h3>
        <Input className="w-1/2" />
      </div>
      <Separator className="my-14" />
      <h3 className="text-2xl">Project Restrictions</h3>
      <form className="flex flex-col gap-2">
        <p>Add Project Flags</p>
        <div className="flex gap-4">
          <Input className="w-1/3" placeholder="Flag" />
          <Button size="icon">
            <Plus />
          </Button>
        </div>
      </form>
      <form className="flex flex-col gap-2">
        <p>Add Project Tags</p>
        <div className="flex gap-4">
          <Input className="w-1/3" placeholder="Tag" />
          <Button size="icon">
            <Plus />
          </Button>
        </div>
      </form>
      <Separator className="my-14" />
      <h3 className="text-2xl">Supervisor Restrictions</h3>
      <form className="-ml-10 grid w-1/2 grid-cols-2 gap-5">
        {/* TODO: handle submit on debounce */}
        <p className="place-self-end self-center">
          Minimum number of Projects:
        </p>
        <Input className="w-10 self-center" placeholder="1" />
        <p className="place-self-end self-center">
          Maximum number of Projects:
        </p>
        <Input className="w-10 self-center" placeholder="10" />
        <p className="place-self-end self-center">Project upload deadline:</p>
        <DatePicker className="self-center" />
      </form>
      <Separator className="my-14" />
      <h3 className="text-2xl">Student Restrictions</h3>
      <form className="-ml-10 grid w-1/2 grid-cols-2 gap-5">
        <p className="place-self-end self-center">
          Minimum number of Preferences:
        </p>
        <Input className="w-10 self-center" placeholder="1" />
        <p className="place-self-end self-center">
          Maximum number of Preferences:
        </p>
        <Input className="w-10 self-center" placeholder="10" />
        <p className="place-self-end self-center">per Supervisor:</p>
        <Input className="w-10 self-center" placeholder="1" />
        <p className="place-self-end self-center">
          Preference submission deadline:
        </p>
        <DatePicker className="self-center" />
      </form>
      <Separator className="my-10" />
      <div className="flex justify-end">
        <Button size="lg">create new instance</Button>
      </div>
    </div>
  );
}
