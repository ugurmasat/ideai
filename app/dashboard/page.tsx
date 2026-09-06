import { Header } from '@/components/header'
import { DashboardContent } from './dashboard-content'

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <DashboardContent />
      </main>
    </div>
  )
}
