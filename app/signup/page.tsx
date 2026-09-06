import { SignupForm } from './signup-form'
import { AuthLayout } from '@/components/layouts/auth-layout'

export default function SignupPage() {
  return (
    <AuthLayout title="Kayıt Ol" description="IDEAI'ye katılın ve fırsatları yakalayın.">
      <SignupForm />
    </AuthLayout>
  )
}
