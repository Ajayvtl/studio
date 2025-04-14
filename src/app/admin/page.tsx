
import AddUserForm from "@/components/forms/AddUserForm";
import AddCountryForm from "@/components/forms/AddCountryForm";
import AddExchangeForm from "@/components/forms/AddExchangeForm";
import SettingsPanel from "@/components/SettingsPanel";

export default function AdminPage() {
  return (
    <div className="container mx-auto py-10 grid gap-4 grid-cols-1 md:grid-cols-2">
      <div className="space-y-4">
        <h2>Add User</h2>
        <AddUserForm />
      </div>
      <div className="space-y-4">
        <h2>Add Country</h2>
        <AddCountryForm />
      </div>
      <div className="space-y-4">
        <h2>Add Exchange</h2>
        <AddExchangeForm />
      </div>
      <div className="space-y-4">
        <h2>Settings</h2>
        <SettingsPanel />
      </div>
    </div>
  );
}

