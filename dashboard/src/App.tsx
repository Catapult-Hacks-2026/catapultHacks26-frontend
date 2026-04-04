import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import SideNav from '@/components/dashboard/SideNav'
import DashboardPage from '@/pages/DashboardPage'
import AllAgentsPage from '@/pages/AllAgentsPage'
import CompaniesPage from '@/pages/CompaniesPage'
import CompanyDetailPage from '@/pages/CompanyDetailPage'
import MarketInsightsPage from '@/pages/MarketInsightsPage'
import MarketInsightsResultsPage from '@/pages/MarketInsightsResultsPage'
import ConfigureNegotiationPage from '@/pages/ConfigureNegotiationPage'
import NegotiationShellPage from '@/pages/NegotiationShellPage'
import NegotiationAgentPage from '@/pages/NegotiationAgentPage'
import EventsPage from '@/pages/EventsPage'
import EventDetailPage from '@/pages/EventDetailPage'
import SettingsPage from '@/pages/SettingsPage'
import SupportPage from '@/pages/SupportPage'
import { EventsProvider } from '@/context/EventsContext'

export default function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsSidebarCollapsed(true)
    }
  }, [])

  return (
    <EventsProvider>
      <div className="flex min-h-screen bg-background text-on-surface font-sans antialiased">
        <SideNav
          collapsed={isSidebarCollapsed}
          onToggle={() => setIsSidebarCollapsed((current) => !current)}
        />
        <main className={`min-h-screen flex-1 transition-[padding] duration-200 ${isSidebarCollapsed ? 'pl-20' : 'pl-72 lg:pl-60'}`}>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/all-agents" element={<AllAgentsPage />} />
            <Route path="/companies" element={<CompaniesPage />} />
            <Route path="/companies/:id" element={<CompanyDetailPage />} />
            <Route path="/event-timing" element={<MarketInsightsPage />} />
            <Route path="/event-timing/results" element={<MarketInsightsResultsPage />} />
            <Route path="/negotiations/configure" element={<ConfigureNegotiationPage />} />
            <Route path="/negotiations/setup" element={<NegotiationShellPage />} />
            <Route path="/negotiations/:id" element={<NegotiationShellPage />} />
            <Route path="/negotiations/:id/agent" element={<NegotiationAgentPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:id" element={<EventDetailPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/support" element={<SupportPage />} />
          </Routes>
        </main>
      </div>
    </EventsProvider>
  )
}
