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

// TODO get styling on this correct
function YesNoActionTrigger({ trigger }: { trigger: ReactNode }) {
  return <DestructiveActionTrigger asChild>{trigger}</DestructiveActionTrigger>;
}

function YesNoActionContainer({
  action,
  title,
  description,
  children,
}: {
  action: () => void;
  title: ReactNode;
  description: ReactNode;
  children: ReactNode;
}) {
  return (
    <DestructiveAction action={action}>
      {children}
      <DestructiveActionContent className="w-96">
        <DestructiveActionHeader>
          <DestructiveActionTitle>{title}</DestructiveActionTitle>
          <DestructiveActionDescription>
            {description}
          </DestructiveActionDescription>
        </DestructiveActionHeader>
        <div className="flex w-full flex-row justify-evenly gap-4">
          <DestructiveActionCancel asChild>
            <Button className="w-full">No</Button>
          </DestructiveActionCancel>
          <DestructiveActionConfirm asChild>
            <Button className="w-full" variant="destructive">
              Yes
            </Button>
          </DestructiveActionConfirm>
        </div>
      </DestructiveActionContent>
    </DestructiveAction>
  );
}

function YesNoAction({
  trigger,
  ...rest
}: {
  action: () => void;
  trigger: ReactNode;
  title: ReactNode;
  description: ReactNode;
}) {
  return (
    <YesNoActionContainer {...rest}>
      <YesNoActionTrigger trigger={trigger} />
    </YesNoActionContainer>
  );
}

export { YesNoAction, YesNoActionContainer, YesNoActionTrigger };
