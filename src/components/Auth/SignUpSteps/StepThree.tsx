
import React from "react";
import { Input } from "@/components/ui/input";
import CopyableInput from "../CopyableInput";
import CopyablePasswordInput from "../CopyablePasswordInput";

interface StepThreeProps {
  email: string;
  apiPassword: string;
  street: string;
  setStreet: (street: string) => void;
  city: string;
  setCity: (city: string) => void;
  state: string;
  setState: (state: string) => void;
  zip: string;
  setZip: (zip: string) => void;
}

const StepThree: React.FC<StepThreeProps> = ({
  email,
  apiPassword,
  street,
  setStreet,
  city,
  setCity,
  state,
  setState,
  zip,
  setZip,
}) => {
  return (
    <>
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">API Access Credentials</h3>
        <p className="text-sm text-gray-600 mb-4">
          Use these credentials to access the DonorCamp API. Save these details as they won't be shown again.
        </p>

        <div className="space-y-4">
          <CopyableInput
            id="endpoint"
            value="https://api.donorcamp.com/v1"
            label="Endpoint URL"
          />
          
          <CopyableInput
            id="username"
            value={email}
            label="Username"
          />
          
          <CopyablePasswordInput
            id="apiPassword"
            value={apiPassword}
            label="Password"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="street" className="block text-sm font-medium text-gray-700">
          Street Address
        </label>
        <Input
          id="street"
          type="text"
          value={street}
          onChange={(e) => setStreet(e.target.value)}
          placeholder="123 Main St"
          required
          className="w-full"
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="city" className="block text-sm font-medium text-gray-700">
          City
        </label>
        <Input
          id="city"
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Your City"
          required
          className="w-full"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="state" className="block text-sm font-medium text-gray-700">
            State
          </label>
          <Input
            id="state"
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
            placeholder="State"
            required
            className="w-full"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="zip" className="block text-sm font-medium text-gray-700">
            ZIP Code
          </label>
          <Input
            id="zip"
            type="text"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            placeholder="12345"
            required
            className="w-full"
          />
        </div>
      </div>
    </>
  );
};

export default StepThree;
