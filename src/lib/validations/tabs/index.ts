export type TabType = {
  title: string;
  href: string;
  icon?: string;
};

export type TabGroup = {
  title: string;
  tabs: TabType[];
};
