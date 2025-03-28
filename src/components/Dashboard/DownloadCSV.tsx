
import { Button } from "@/components/ui/button";
import { IconDownload } from "@tabler/icons-react";
import { toast } from "@/components/ui/use-toast";
import { Donation } from "@/types/donation";

interface DownloadCSVProps {
  donations: Donation[];
}

const DownloadCSV = ({ donations }: DownloadCSVProps) => {
  const downloadCSV = () => {
    try {
      // Check if there are any donations to download
      if (donations.length === 0) {
        toast({
          title: "No data to download",
          description: "There are no donations matching your filter criteria.",
          variant: "destructive"
        });
        return;
      }
      
      // Create CSV header row
      const headers = ["Date", "Name", "Email", "Amount"];
      
      // Convert donation data to CSV rows
      const csvRows = [
        headers.join(","),
        ...donations.map(d => 
          [
            d.date, 
            d.name ? `"${d.name}"` : "Anonymous", 
            d.email ? `"${d.email}"` : "---", 
            d.amount
          ].join(",")
        )
      ];
      
      // Create blob and download link
      const csvString = csvRows.join("\n");
      const blob = new Blob([csvString], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      
      // Create download link and trigger click
      const a = document.createElement("a");
      a.setAttribute("hidden", "");
      a.setAttribute("href", url);
      a.setAttribute("download", `donations-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast({
        title: "Success",
        description: "Donations CSV downloaded successfully",
      });
    } catch (error) {
      console.error("Error downloading CSV:", error);
      toast({
        title: "Error",
        description: "Failed to download donations CSV",
        variant: "destructive"
      });
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={downloadCSV}>
      <IconDownload className="h-4 w-4 mr-2" size={16} />
      Download CSV
    </Button>
  );
};

export default DownloadCSV;
