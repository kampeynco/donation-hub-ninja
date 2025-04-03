
import React from "react";
import { useFeatureCache } from "@/hooks/useFeatureCache";
import ProtectedRouteBase from "./ProtectedRouteBase";

interface FeatureProtectedRouteProps {
  children: React.ReactNode;
  featureId: string;
}

const FeatureProtectedRoute: React.FC<FeatureProtectedRouteProps> = ({ 
  children, 
  featureId 
}) => {
  const { hasFeature } = useFeatureCache();

  const checkAccess = async () => {
    return hasFeature(featureId);
  };

  return (
    <ProtectedRouteBase 
      checkAccess={checkAccess}
      errorMessage={`You don't have access to this feature. Enable it in your account settings.`}
    >
      {children}
    </ProtectedRouteBase>
  );
};

export default FeatureProtectedRoute;
