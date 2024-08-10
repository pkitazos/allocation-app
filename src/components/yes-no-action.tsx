import { ReactNode } from "react";
import { Button } from "./ui/button";
import {
  DestructiveAction,
  DestructiveActionCancel,
  DestructiveActionConfirm,
  DestructiveActionContent,
  DestructiveActionDescription,
  DestructiveActionHeader,
  DestructiveActionTitle,
  DestructiveActionTrigger,
} from "./ui/destructive-action";
import { DropdownMenuItem } from "./ui/dropdown-menu";

export function YesNoAction({
  action,
  trigger,
  title,
  description,
}: {
  action: () => void;
  trigger: ReactNode;
  title: ReactNode;
  description: ReactNode;
}) {
  return (
    <DestructiveAction action={action}>
      <DestructiveActionTrigger asChild>
        <Button variant="destructive" asChild>
          {trigger}
        </Button>
      </DestructiveActionTrigger>
      <DestructiveActionContent>
        <DestructiveActionHeader>
          <DestructiveActionTitle>{title}</DestructiveActionTitle>
          <DestructiveActionDescription>
            {description}
          </DestructiveActionDescription>
        </DestructiveActionHeader>
        <div className="flex w-full flex-row justify-between">
          <DestructiveActionCancel asChild>
            <Button>No</Button>
          </DestructiveActionCancel>
          <DestructiveActionConfirm>
            <Button variant="destructive">Yes</Button>
          </DestructiveActionConfirm>
        </div>
      </DestructiveActionContent>
    </DestructiveAction>
  );
}

// export function YesNoActionDropdownItem({
//   action,
//   trigger,
//   title,
//   description,
//   onSelect,
//   onOpenChange
// }: {
//   action: () => void;
//   trigger: ReactNode;
//   title: ReactNode;
//   description: ReactNode;
//   onSelect?:(event: Event) => void)
//   onOpenChange?:
// }) {
//   return (
//     <DestructiveAction action={action}>
//       <DestructiveActionTrigger asChild>
//         <DropdownMenuItem asChild>

//         <Button variant="destructive">{trigger}</Button>
//         </DropdownMenuItem>
//       </DestructiveActionTrigger>
//       <DestructiveActionContent>
//         <DestructiveActionHeader>
//           <DestructiveActionTitle>{title}</DestructiveActionTitle>
//           <DestructiveActionDescription>
//             {description}
//           </DestructiveActionDescription>
//         </DestructiveActionHeader>
//         <div className="flex w-full flex-row justify-between">
//           <DestructiveActionCancel asChild>
//             <Button>No</Button>
//           </DestructiveActionCancel>
//           <DestructiveActionConfirm>
//             <Button variant="destructive">Yes</Button>
//           </DestructiveActionConfirm>
//         </div>
//       </DestructiveActionContent>
//     </DestructiveAction>
//   );
// }
