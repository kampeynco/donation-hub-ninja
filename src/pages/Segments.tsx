
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { IconStarFilled } from "@tabler/icons-react";

const Segments = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-semibold mb-6">Segments Beta</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        Create and manage donor segments to target specific groups with personalized messaging.
      </p>
      
      <Card className="bg-gray-50 dark:bg-gray-800 border-0">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-donor-blue text-white rounded-full p-3">
              <IconStarFilled size={24} />
            </div>
          </div>
          <CardTitle className="text-xl">Welcome to Segments</CardTitle>
          <CardDescription>
            This feature is currently in beta. Segments allow you to group donors based on common characteristics.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-4">
            With Segments, you can create targeted groups of donors based on donation history, 
            location, interests, and more to improve your fundraising strategy.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Segments;
