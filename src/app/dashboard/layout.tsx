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
import { HomeIcon, ClipboardDocumentListIcon, BanknotesIcon, CpuChipIcon, MagnifyingGlassIcon, Cog8ToothIcon, ArrowRightStartOnRectangleIcon } from '@heroicons/react/24/outline';
import { Strong } from '@/components/text'; // Assuming Catalyst Text components

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Placeholder navigation items
  const navigation = [
    { name: 'Dashboard Home', href: '/dashboard', icon: HomeIcon, current: true },
    { name: 'Prior Authorization', href: '#prior-auth', icon: ClipboardDocumentListIcon, current: false },
    { name: 'Claims Management', href: '#claims-mgmt', icon: BanknotesIcon, current: false },
    { name: 'Agent Monitoring', href: '#agent-monitor', icon: CpuChipIcon, current: false },
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
        <Sidebar className="bg-gradient-to-b from-zinc-900 via-zinc-800 to-black text-zinc-200 shadow-xl">
          <SidebarHeader>
            {/* Logo can go here if desired, or a title */}
            <Strong className="text-xl text-white">Ron AI</Strong>
          </SidebarHeader>
          <SidebarBody>
            <SidebarSection>
              {navigation.map((item) => (
                <SidebarItem key={item.name} href={item.href} current={item.current}>
                  {item.icon && <item.icon className="w-5 h-5" />}
                  <SidebarLabel>{item.name}</SidebarLabel>
                </SidebarItem>
              ))}
            </SidebarSection>
            <SidebarSection className="mt-auto border-t border-zinc-800 pt-4">
              <SidebarItem href="#">
                <Cog8ToothIcon />
                <SidebarLabel>Settings</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/logout">
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
