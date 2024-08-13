import { findDuplicates } from "@/lib/utils/general/find-duplicates";

export function parseForDuplicates<T extends { guid: string; email: string }>(
  data: T[],
) {
  // record of duplicate ids
  const duplicatedGuidsRecord = findDuplicates(data, (a) => a.guid);

  // have duplicate ids
  const ids_of_duplicate_guid_rows = new Set(
    data
      .filter((e) => Object.keys(duplicatedGuidsRecord).includes(e.guid))
      .map((e) => e.guid),
  );

  // record of duplicate emails
  const duplicatedEmailsRecord = findDuplicates(data, (a) => a.email);

  // have duplicate emails
  const ids_of_duplicate_email_rows = new Set(
    data
      .filter((e) => Object.keys(duplicatedEmailsRecord).includes(e.email))
      .map((e) => e.guid),
  );

  const duplicateRowGuids = ids_of_duplicate_guid_rows.union(
    ids_of_duplicate_email_rows,
  );

  const uniqueRows = data.filter((e) => !duplicateRowGuids.has(e.guid));

  return { uniqueRows, duplicateRowGuids };
}
