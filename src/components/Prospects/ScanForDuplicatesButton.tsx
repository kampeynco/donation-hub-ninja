
import React from 'react';
import { Button } from '@/components/ui/button';
import { IconSearch } from '@tabler/icons-react';
import { useDuplicateDetection } from '@/hooks/useDuplicateDetection';

export default function ScanForDuplicatesButton() {
  const { startScan, isScanning } = useDuplicateDetection();

  return (
    <Button
      onClick={startScan}
      disabled={isScanning}
      variant="outline"
      size="sm"
      className="gap-1"
    >
      <IconSearch className="h-4 w-4" />
      {isScanning ? 'Scanning...' : 'Scan for Duplicates'}
    </Button>
  );
}
