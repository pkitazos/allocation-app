import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DangerZone({
  spaceTitle,
  action,
}: {
  spaceTitle: string;
  action: () => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-red-600">Danger Zone</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center gap-5">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="lg">
              Delete {spaceTitle}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this
                Allocation {spaceTitle} and all related data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Yes, delete everything
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <p>Once you delete an Allocation {spaceTitle} there is no going back</p>
      </CardContent>
    </Card>
  );
}
