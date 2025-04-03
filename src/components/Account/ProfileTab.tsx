
import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import ProfileForm from "./ProfileForm";
import DeleteAccountDialog from "./DeleteAccountDialog";

const ProfileTab = () => {
  const { user, deleteAccount } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [mobilePhone, setMobilePhone] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setEmail(user.email || "");
      
      const fetchProfileData = async () => {
        setLoading(true);
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
            
          if (error) {
            console.error('Error fetching profile:', error);
            return;
          }
          
          if (data) {
            setFirstName(data.contact_first_name || "");
            setLastName(data.contact_last_name || "");
            setOrganization(data.committee_name || "");
            setMobilePhone(data.mobile_phone || "");
          }
        } catch (error) {
          console.error('Error in profile fetch:', error);
        } finally {
          setLoading(false);
        }
      };
      
      fetchProfileData();
    }
  }, [user]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>
          Update your account details and organization information
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="py-4 text-center text-gray-500">
            Loading profile data...
          </div>
        ) : (
          <>
            <ProfileForm
              user={user}
              firstName={firstName}
              lastName={lastName}
              email={email}
              organization={organization}
              mobilePhone={mobilePhone}
              setFirstName={setFirstName}
              setLastName={setLastName}
              setOrganization={setOrganization}
              setMobilePhone={setMobilePhone}
            />
            <div className="mt-6 pt-6 border-t flex">
              <DeleteAccountDialog onDelete={deleteAccount} />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileTab;
