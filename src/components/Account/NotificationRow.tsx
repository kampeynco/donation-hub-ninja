
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface NotificationRowProps {
  id: string;
  title: string;
  description: string;
  webChecked?: boolean;
  emailChecked?: boolean;
  textChecked?: boolean;
}

const NotificationRow = ({
  id,
  title,
  description,
  webChecked = false,
  emailChecked = false,
  textChecked = false,
}: NotificationRowProps) => {
  return (
    <div className="grid grid-cols-[1fr_100px_100px_100px] items-center">
      <div className="space-y-0.5">
        <Label>{title}</Label>
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      </div>
      <div className="flex justify-center">
        <Checkbox id={`web-${id}`} defaultChecked={webChecked} />
      </div>
      <div className="flex justify-center">
        <Checkbox id={`email-${id}`} defaultChecked={emailChecked} />
      </div>
      <div className="flex justify-center">
        <Checkbox id={`text-${id}`} defaultChecked={textChecked} />
      </div>
    </div>
  );
};

export default NotificationRow;
