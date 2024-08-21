import {
  ArrowRightIcon,
  BookmarkCheckIcon,
  FileBadgeIcon,
  FileCheck2Icon,
  FileClockIcon,
  FilePlus2Icon,
  FilesIcon,
  FileSpreadsheetIcon,
  FolderIcon,
  FolderOutputIcon,
  FolderPenIcon,
  HomeIcon,
  LayersIcon,
  ListChecksIcon,
  MergeIcon,
  MonitorIcon,
  MousePointerSquareIcon,
  PlusIcon,
  ServerCogIcon,
  SettingsIcon,
  SplitIcon,
  SquareKanbanIcon,
  UserPlusIcon,
  UsersIcon,
} from "lucide-react";

export function Icon({ type }: { type: string }) {
  switch (type) {
    case "settings":
      return <SettingsIcon className="mr-2 h-4 w-4" />;

    case "split":
      return <SplitIcon className="mr-2 h-4 w-4" />;

    case "merge":
      return <MergeIcon className="mr-2 h-4 w-4" />;

    case "plus":
      return <PlusIcon className="mr-2 h-4 w-4" />;

    case "arrow-right":
      return <ArrowRightIcon className="mr-2 h-4 w-4" />;

    case "folder":
      return <FolderIcon className="mr-2 h-4 w-4" />;

    case "layers":
      return <LayersIcon className="mr-2 h-4 w-4" />;

    case "users":
      return <UsersIcon className="mr-2 h-4 w-4" />;

    case "user-plus":
      return <UserPlusIcon className="mr-2 h-4 w-4" />;

    case "file-check-2":
      return <FileCheck2Icon className="mr-2 h-4 w-4" />;

    case "bookmark-check":
      return <BookmarkCheckIcon className="mr-2 h-4 w-4" />;

    case "file-clock":
      return <FileClockIcon className="mr-2 h-4 w-4" />;

    case "server-cog":
      return <ServerCogIcon className="mr-2 h-4 w-4" />;

    case "square-kanban":
      return <SquareKanbanIcon className="mr-2 h-4 w-4" />;

    case "square-mouse-pointer":
      return <MousePointerSquareIcon className="mr-2 h-4 w-4" />;

    case "monitor":
      return <MonitorIcon className="mr-2 h-4 w-4" />;

    case "file-spreadsheet":
      return <FileSpreadsheetIcon className="mr-2 h-4 w-4" />;

    case "folder-output":
      return <FolderOutputIcon className="mr-2 h-4 w-4" />;

    case "list-checks":
      return <ListChecksIcon className="mr-2 h-4 w-4" />;

    case "home":
      return <HomeIcon className="mr-2 h-4 w-4" />;

    case "folder-pen":
      return <FolderPenIcon className="mr-2 h-4 w-4" />;

    case "files":
      return <FilesIcon className="mr-2 h-4 w-4" />;

    case "file-plus-2":
      return <FilePlus2Icon className="mr-2 h-4 w-4" />;

    case "file-badge":
      return <FileBadgeIcon className="mr-2 h-4 w-4" />;

    default:
      return null;
  }
}
