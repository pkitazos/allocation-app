"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, getHours, getMinutes } from "date-fns";

export function TimePicker({
  value,
  onHourChange,
  onMinuteChange,
}: {
  value: Date;
  onMinuteChange: (val: string) => void;
  onHourChange: (val: string) => void;
}) {
  return (
    <div className="flex items-center justify-center gap-2">
      <Select onValueChange={onHourChange}>
        <SelectTrigger className="flex w-16 items-center justify-center gap-2">
          <SelectValue placeholder={format(value, "HH")} />
        </SelectTrigger>
        <SelectContent className="h-40">
          {Array.from({ length: 24 }).map((_, i) => (
            <SelectItem key={i} value={i.toString()}>
              {i.toString().padStart(2, "0")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-lg font-bold text-muted-foreground">:</p>
      <Select onValueChange={onMinuteChange}>
        <SelectTrigger className="flex w-16 items-center justify-center gap-2">
          <SelectValue placeholder={format(value, "mm")} />
        </SelectTrigger>
        <SelectContent className="h-40">
          {Array.from({ length: 60 }).map((_, i) => (
            <SelectItem key={i} value={i.toString()}>
              {i.toString().padStart(2, "0")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
