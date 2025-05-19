'use client';

import React from 'react';
import { PatientDataProvider } from '@/context/PatientDataContext';
import { GuidedTourProvider } from '@/context/GuidedTourContext';
import { GuidedTourOverlay } from '@/components/guidedtour/guided-tour-overlay';
import { SidebarLayout } from '@/components/sidebar-layout';
import {
  Sidebar,
  SidebarBody,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
} from '@/components/sidebar';
import { Strong } from '@/components/text';

const navItems = [
  { name: 'Dashboard', href: '/demo', key: 'dashboard' },
  { name: 'AI Agent Insights', href: '/demo/insights', key: 'insights' },
  { name: 'Prior Authorizations', href: '/demo/prior-auth', key: 'pa' },
];

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <PatientDataProvider>
      <GuidedTourProvider>
        <SidebarLayout
          sidebar={
            <Sidebar>
            <SidebarHeader>
              <Strong className="text-xl text-white">Ron AI Demo</Strong>
            </SidebarHeader>
            <SidebarBody>
              <SidebarSection>
              {navItems.map((item) => (
                <SidebarItem
                  key={item.key}
                  href={item.href}
                  current={false}
                  id={item.key === 'insights' ? 'insights-link' : undefined}
                >
                  <SidebarLabel>{item.name}</SidebarLabel>
                </SidebarItem>
              ))}
              </SidebarSection>
            </SidebarBody>
          </Sidebar>
        }
      >
          <div className="flex-1 bg-zinc-900 text-white min-h-screen p-4">
            {children}
            <GuidedTourOverlay />
          </div>
        </SidebarLayout>
      </GuidedTourProvider>
    </PatientDataProvider>
  );
}

