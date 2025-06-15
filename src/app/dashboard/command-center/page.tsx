'use client';

import React from 'react';
import { CalmCommandCenter } from '@/components/chat/calm-command-center';

export default function CommandCenterPage() {
  return (
    <div className="h-[calc(100vh-100px)] max-h-[800px]">
      <CalmCommandCenter />
    </div>
  );
}
