
import { Link } from "react-router-dom";
import AccountTabs from "@/components/Account/AccountTabs";
import { IconArrowLeft } from "@tabler/icons-react";
import { useEffect } from "react";

const Account = () => {
  // Add console log to debug
  useEffect(() => {
    console.log("Account page mounted");
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-2">
        <Link to="/dashboard" className="inline-flex items-center text-primary hover:text-primary/80">
          <IconArrowLeft size={16} className="mr-1" />
          <span>Back to Dashboard</span>
        </Link>
      </div>
      
      <h1 className="text-2xl font-bold">Account Settings</h1>
      <p className="text-gray-500">
        Manage your account information and webhook integration.
      </p>

      <AccountTabs />
    </div>
  );
};

export default Account;
