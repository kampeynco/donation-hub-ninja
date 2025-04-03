
import React, { useState } from "react";
import { IconArrowRight, IconLock } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import NotInterestedModal from "@/components/Personas/NotInterestedModal";
import WaitlistButton from "@/components/Personas/WaitlistButton";
import { Card, CardContent } from "@/components/ui/card";

// Import the uploaded image from public/lovable-uploads/
const personasImage = "/lovable-uploads/35af406b-6b5e-411d-98c7-b9d0642b92a0.png";
const Personas = () => {
  const [modalOpen, setModalOpen] = useState(false);
  return <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] mt-6">
      <div className="max-w-6xl w-full space-y-10 px-4 md:px-6">
        {/* Main section */}
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="max-w-xl">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 mb-4">
              <IconLock className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Paid Plans</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-6">Get started with Personas today</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Donor Personas is the only solution designed to help campaigns build and share real-time profiles
              at scale and enable marketers with self-service access a complete view of the donor
              in the warehouse.
            </p>
            <div className="flex items-center gap-4">
              <WaitlistButton />
              <Button variant="link" onClick={() => setModalOpen(true)} className="text-donor-blue flex items-center">
                Not interested <IconArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex-1 hidden md:block">
            <img src={personasImage} alt="Donor Personas visualization" className="max-w-full rounded-lg shadow-lg" />
          </div>
        </div>

        <Separator className="my-10" />

        {/* Feature columns - improved layout with proper spacing */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:divide-x divide-gray-200 dark:divide-gray-700">
          <Card className="border-0 shadow-none bg-transparent">
            <CardContent className="p-6">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 mb-4">
                <IconArrowRight className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Enrich events with warehouse data</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Easily link data from the warehouse to any event before it's sent downstream.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-none bg-transparent md:pl-8">
            <CardContent className="p-6">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-100 mb-4">
                <IconArrowRight className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Visualize unified donor profiles</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Visually explore user profiles in one place to understand donor behavior and traits.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-none bg-transparent md:pl-8">
            <CardContent className="p-6">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-purple-100 mb-4">
                <IconArrowRight className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Sync profiles to your warehouse</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Defines relationships between any entity data set in the warehouse and the Segment Profiles you send with Profiles Sync.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal for "Not Interested" feedback */}
      <NotInterestedModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>;
};
export default Personas;
