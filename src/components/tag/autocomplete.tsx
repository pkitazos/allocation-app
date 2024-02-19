import React from "react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { type TagType } from "./tag-input";

type AutocompleteProps = {
  tags: TagType[];
  setTags: React.Dispatch<React.SetStateAction<TagType[]>>;
  autocompleteOptions: TagType[];
  onTagAdd?: (tag: string) => void;
  children: React.ReactNode;
};

export function Autocomplete({
  tags,
  setTags,
  autocompleteOptions,
  onTagAdd,
  children,
}: AutocompleteProps) {
  return (
    <Command className="min-w-[400px] border">
      {children}
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions" className="h-32 overflow-y-scroll">
          {autocompleteOptions.map((option) => (
            <CommandItem key={option.id}>
              <div
                className="w-full"
                onClick={() => {
                  if (tags.some((tag) => tag.title === option.title)) return;
                  setTags([...tags, option]);
                  onTagAdd?.(option.title);
                }}
              >
                {option.title}
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
