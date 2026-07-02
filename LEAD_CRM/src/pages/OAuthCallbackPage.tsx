import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { authService } from '../services/auth'

export default function OAuthCallbackPage() {
  const [params] = useSearchParams()
  const { login } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const code = params.get('code')
    const token = params.get('token')
    console.log('Callback params:', Object.fromEntries(params.entries()))
    console.log('code:', code, 'token:', token)
    if (code) {
      authService.googleCallback(code)
        .then(res => login(res.access_token))
        .then(() => navigate('/'))
        .catch((err) => {
          console.error('Google callback error:', err?.response?.data || err)
          navigate('/login')
        })
    } else if (token) {
      login(token).then(() => navigate('/'))
    } else {
      navigate('/login')
    }
  }, [])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <p className="text-secondary text-sm">Signing you in...</p>
    </div>
  )
}
