'use client';

import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';

interface ResponseButtonsProps {
  onRespond: (response: 'INTERESTED' | 'NOT_INTERESTED') => void;
}

export function ResponseButtons({ onRespond }: ResponseButtonsProps) {
  return (
    <div className="space-y-3">
      <Button
        onClick={() => onRespond('INTERESTED')}
        className="w-full h-14 bg-green-600 hover:bg-green-700 text-white text-lg font-medium rounded-full"
      >
        <Check className="w-5 h-5 mr-2" />
        I&apos;m Interested
      </Button>

      <Button
        onClick={() => onRespond('NOT_INTERESTED')}
        variant="outline"
        className="w-full h-14 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 text-lg font-medium rounded-full"
      >
        <X className="w-5 h-5 mr-2" />
        Not Interested
      </Button>
    </div>
  );
}
