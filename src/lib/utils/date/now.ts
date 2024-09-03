import { format } from "date-fns";

export const now = () => format(new Date(), "yyyy-MM-dd HH:mm:ss");
