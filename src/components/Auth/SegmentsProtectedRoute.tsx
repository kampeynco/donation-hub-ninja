
import React from "react";
import { useFeatureCache } from "@/hooks/useFeatureCache";
import ProtectedRouteBase from "./ProtectedRouteBase";

interface SegmentsProtectedRouteProps {
  children: React.ReactNode;
}

const SegmentsProtectedRoute: React.FC<SegmentsProtectedRouteProps> = ({ 
  children 
}) => {
  const { hasFeature } = useFeatureCache();

  const checkAccess = async () => {
    return hasFeature("segments");
  };

  return (
    <ProtectedRouteBase 
      checkAccess={checkAccess}
      errorMessage={`You don't have access to the Segments feature. Enable it in your account settings.`}
    >
      {children}
    </ProtectedRouteBase>
  );
};

export default SegmentsProtectedRoute;
