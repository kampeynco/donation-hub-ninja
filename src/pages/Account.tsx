
import AccountTabs from "@/components/Account/AccountTabs";

const Account = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Account Settings</h1>
      <p className="text-gray-500">
        Manage your account information and webhook integration.
      </p>

      <AccountTabs />
    </div>
  );
};

export default Account;
