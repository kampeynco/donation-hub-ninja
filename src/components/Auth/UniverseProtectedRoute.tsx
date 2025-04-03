
import React from "react";
import { useFeatureCache } from "@/hooks/useFeatureCache";
import ProtectedRouteBase from "./ProtectedRouteBase";

interface UniverseProtectedRouteProps {
  children: React.ReactNode;
}

const UniverseProtectedRoute: React.FC<UniverseProtectedRouteProps> = ({ 
  children 
}) => {
  const { hasFeature } = useFeatureCache();

  const checkAccess = async () => {
    return hasFeature("universe");
  };

  return (
    <ProtectedRouteBase 
      checkAccess={checkAccess}
      errorMessage={`You don't have access to the Universe feature. Enable it in your account settings.`}
    >
      {children}
    </ProtectedRouteBase>
  );
};

export default UniverseProtectedRoute;
