import { LoginForm } from './login-form'
import { AuthLayout } from '@/components/layouts/auth-layout'

export default function LoginPage() {
  return (
    <AuthLayout title="Giriş Yap" description="Hesabınıza giriş yapın.">
      <LoginForm />
    </AuthLayout>
  )
}
