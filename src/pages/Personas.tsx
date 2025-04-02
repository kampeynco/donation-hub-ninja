
import React from "react";
import { IconArrowRight, IconLock } from "@tabler/icons-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// Import the uploaded image from public/lovable-uploads/
const personasImage = "/lovable-uploads/35af406b-6b5e-411d-98c7-b9d0642b92a0.png";

const Personas = () => {
  return (
    <div className="space-y-10">
      <div className="flex items-start">
        <div className="max-w-3xl">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 mb-4">
            <IconLock className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">Business Tier</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-6">Get started with Donor Personas today</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Donor Personas is the only solution designed to help campaigns build and share real-time profiles
            at scale and enable marketers with self-service access a complete view of the donor
            in the warehouse.
          </p>
          <div className="flex items-center gap-4">
            <Button className="bg-donor-blue hover:bg-blue-700">
              Request a demo
            </Button>
            <Button variant="link" className="text-donor-blue flex items-center">
              Learn more <IconArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex-1 hidden lg:block">
          <img 
            src={personasImage} 
            alt="Donor Personas visualization" 
            className="max-w-full rounded-lg shadow-lg" 
          />
        </div>
      </div>

      <Separator className="my-12" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card>
          <CardHeader className="pb-2">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 mb-4">
              <IconArrowRight className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-xl">Enrich events with warehouse data</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              Easily link data from the warehouse to any event before it's sent downstream.
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-100 mb-4">
              <IconArrowRight className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-xl">Visualize unified donor profiles</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              Visually explore user profiles in one place to understand donor behavior and traits.
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-purple-100 mb-4">
              <IconArrowRight className="h-6 w-6 text-purple-600" />
            </div>
            <CardTitle className="text-xl">Sync profiles to your warehouse</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              Defines relationships between any entity data set in the warehouse and the Segment Profiles you send with Profiles Sync.
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Personas;
