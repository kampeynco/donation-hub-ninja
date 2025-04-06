
import React from "react";
import { useFeatureCache } from "@/hooks/useFeatureCache";
import ProtectedRouteBase from "./ProtectedRouteBase";

interface DonorsProtectedRouteProps {
  children: React.ReactNode;
}

const DonorsProtectedRoute: React.FC<DonorsProtectedRouteProps> = ({ 
  children 
}) => {
  const { hasFeature } = useFeatureCache();

  const checkAccess = async () => {
    return hasFeature("donors");
  };

  return (
    <ProtectedRouteBase 
      checkAccess={checkAccess}
      errorMessage={`You don't have access to the Donors feature. Enable it in your account settings.`}
    >
      {children}
    </ProtectedRouteBase>
  );
};

export default DonorsProtectedRoute;
