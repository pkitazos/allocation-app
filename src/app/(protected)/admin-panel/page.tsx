import { ClientSection } from "./client-section";

export default async function AdminPanel() {
  return (
    <div className="flex flex-col w-2/3 max-w-7xl">
      <div className="flex rounded-md bg-accent py-5 px-6">
        <h1 className="text-5xl text-accent-foreground">Admin Panel</h1>
      </div>
      <ClientSection />
    </div>
  );
}
