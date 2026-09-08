import { OnboardingContent } from './onboarding-content'
import { Header } from '@/components/header'

export default function OnboardingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <OnboardingContent />
      </main>
    </div>
  )
}
