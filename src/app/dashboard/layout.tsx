'use client';

import React from 'react';
import { AIInsightsBar } from '@/components/dashboard/ai-insights-bar';
import {
  Navbar,
  NavbarItem,
  NavbarSection,
  NavbarSpacer,
} from '@/components/navbar'; // Assuming Catalyst Navbar components
import {
  Sidebar,
  SidebarBody,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
} from '@/components/sidebar'; // Sidebar components
import { SidebarLayout } from '@/components/sidebar-layout'; // SidebarLayout component
import { Avatar } from '@/components/avatar'; // Assuming Catalyst Avatar
import { MagnifyingGlassIcon, Cog8ToothIcon, ArrowRightStartOnRectangleIcon } from '@heroicons/react/24/outline'; // Example icons
import { Strong } from '@/components/text'; // Assuming Catalyst Text components

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Placeholder navigation items
  const navigation = [
    { name: 'Dashboard Home', href: '/dashboard', current: true }, // Example
    { name: 'Prior Authorization', href: '#prior-auth', current: false },
    { name: 'Claims Management', href: '#claims-mgmt', current: false },
    { name: 'Agent Monitoring', href: '#agent-monitor', current: false },
    { name: 'Command Center', href: '/dashboard/command-center', current: false },
  ];

  return (
    <SidebarLayout
      navbar={
        <Navbar>
          <NavbarSpacer />
          <NavbarSection>
            <NavbarItem href="/search" aria-label="Search">
              <MagnifyingGlassIcon />
            </NavbarItem>
            <NavbarItem href="/settings" aria-label="Settings">
              <Cog8ToothIcon />
            </NavbarItem>
            <Avatar src="/placeholder-user.jpg" initials="T" alt="User" className="size-8" />
          </NavbarSection>
        </Navbar>
      }
      sidebar={
        <Sidebar>
          <SidebarHeader>
            {/* Logo can go here if desired, or a title */}
            <Strong className="text-xl text-white">Ron AI</Strong>
          </SidebarHeader>
          <SidebarBody>
            <SidebarSection>
              {navigation.map((item) => (
                <SidebarItem key={item.name} href={item.href} current={item.current}>
                  {/* Add icons here if available/desired */}
                  <SidebarLabel>{item.name}</SidebarLabel>
                </SidebarItem>
              ))}
            </SidebarSection>
            <SidebarSection className="mt-auto">
              <SidebarItem href="#">
                <Cog8ToothIcon />
                <SidebarLabel>Settings</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/logout"> {/* Or handle logout via function */}
                <ArrowRightStartOnRectangleIcon />
                <SidebarLabel>Logout</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
          </SidebarBody>
        </Sidebar>
      }
    >
      <div className="flex-1 bg-zinc-900 text-white min-h-screen"> {/* Dark theme base */}
        {/* AI Insights Bar */}
        <AIInsightsBar />
        <div className="p-4 sm:p-6 lg:p-8">
         {children}
        </div>
      </div>
    </SidebarLayout>
  );
}
