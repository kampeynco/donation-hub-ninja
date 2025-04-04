
import React, { useState } from "react";
import { IconArrowRight, IconLock } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import NotInterestedModal from "@/components/Personas/NotInterestedModal";
import WaitlistButton from "@/components/Personas/WaitlistButton";
import { Card, CardContent } from "@/components/ui/card";

// Using the Supabase URL for the image
const universeImage = "https://igjnhwvtasegwyiwcdkr.supabase.co/storage/v1/object/public/assets/images/universecard.png";

const Universe = () => {
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
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-6">Get started with Universe today</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">The Universe feature offers a real-time overview of donor activity across the entire platform, ensuring you stay informed about your shared supporters. </p>
            <div className="flex items-center gap-4">
              <WaitlistButton />
              <Button variant="link" onClick={() => setModalOpen(true)} className="text-donor-blue flex items-center">
                Not interested <IconArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex-1 hidden md:block">
            <img 
              src={universeImage} 
              alt="Universe visualization" 
              className="max-w-[75%] mx-auto rounded-lg shadow-lg" 
            />
          </div>
        </div>

        <Separator className="my-10" />

        {/* Feature columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:divide-x divide-gray-200 dark:divide-gray-700">
          <Card className="border-0 shadow-none bg-transparent">
            <CardContent className="p-6">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 mb-4">
                <IconArrowRight className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Real-time donor activity</h3>
              <p className="text-gray-600 dark:text-gray-300">Stay informed about donor contributions across the platform with immediate notifications.</p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-none bg-transparent md:pl-8">
            <CardContent className="p-6">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-100 mb-4">
                <IconArrowRight className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Shared supporter awareness</h3>
              <p className="text-gray-600 dark:text-gray-300">Receive detailed information about shared donors including donation amounts and recipient details.</p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-none bg-transparent md:pl-8">
            <CardContent className="p-6">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-purple-100 mb-4">
                <IconArrowRight className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Collaborative impact tracking</h3>
              <p className="text-gray-600 dark:text-gray-300">Foster a collaborative awareness of donor engagement and understand the full impact of your shared supporters.</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal for "Not Interested" feedback */}
      <NotInterestedModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>;
};
export default Universe;
