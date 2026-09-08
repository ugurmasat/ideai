import { Header } from '@/components/header'
import { ProfileContent } from './profile-content'

export default function ProfilePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <ProfileContent />
      </main>
    </div>
  )
}
