import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { authService } from '../services/auth'
import { Zap, Mail, Lock, User, ArrowRight } from 'lucide-react'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [isRegister, setIsRegister] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = isRegister
        ? await authService.register(form.name, form.email, form.password)
        : await authService.login(form.email, form.password)
      await login(res.access_token)
      navigate('/')
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { detail?: string } } }).response?.data?.detail
        : null
      setError(msg || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const inputCls = "w-full pl-10 pr-4 py-2.5 rounded-lg text-sm text-text bg-white border border-border outline-none focus:border-primary transition-all shadow-input placeholder:text-text-muted"

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left branding panel */}
      <div className="hidden lg:flex flex-1 flex-col justify-center px-16 bg-white border-r border-border relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-5 -translate-y-1/2 translate-x-1/2"
          style={{ background: 'radial-gradient(circle, #635bff, transparent)' }} />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-5 translate-y-1/2 -translate-x-1/2"
          style={{ background: 'radial-gradient(circle, #635bff, transparent)' }} />

        <div className="relative max-w-sm">
          <div className="flex items-center gap-2.5 mb-12">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center shadow-card">
              <Zap size={17} className="text-white" />
            </div>
            <span className="text-lg font-bold text-text">LeadVault</span>
          </div>

          <h2 className="text-3xl font-bold text-text mb-3 leading-tight">
            Manage your leads<br />
            <span className="text-primary">like a pro.</span>
          </h2>
          <p className="text-sm text-text-muted mb-10 leading-relaxed">
            Track leads, follow-ups, and get AI-powered insights from your meetings.
          </p>

          {['Never miss a follow-up again', 'AI-powered meeting summaries', 'Visual sales pipeline'].map((item, i) => (
            <div key={i} className="flex items-center gap-3 mb-3">
              <div className="w-5 h-5 rounded-full bg-success/10 border border-success/20 flex items-center justify-center flex-shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-success" />
              </div>
              <span className="text-sm text-text-muted">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2.5 mb-8 justify-center">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Zap size={15} className="text-white" />
            </div>
            <span className="text-base font-bold text-text">LeadVault</span>
          </div>

          <div className="bg-white rounded-2xl shadow-card-lg border border-border p-8">
            <div className="mb-6">
              <h1 className="text-xl font-bold text-text mb-1">
                {isRegister ? 'Create account' : 'Welcome back'}
              </h1>
              <p className="text-sm text-text-muted">
                {isRegister ? 'Start managing your leads today.' : 'Sign in to your LeadVault account.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {isRegister && (
                <div className="relative">
                  <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input type="text" placeholder="Full name" value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className={inputCls} required />
                </div>
              )}
              <div className="relative">
                <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                <input type="email" placeholder="Email address" value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className={inputCls} required />
              </div>
              <div className="relative">
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                <input type="password" placeholder="Password" value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className={inputCls} required />
              </div>

              {error && (
                <div className="px-3 py-2.5 rounded-lg text-xs text-danger bg-danger/5 border border-danger/20">
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading}
                className="w-full py-2.5 rounded-lg text-sm font-semibold text-white bg-primary hover:bg-primary-dark disabled:opacity-50 flex items-center justify-center gap-2 transition-colors mt-1">
                {loading
                  ? <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  : <>{isRegister ? 'Create account' : 'Sign in'}<ArrowRight size={14} /></>
                }
              </button>
            </form>

            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-text-muted">or</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <a onClick={async (e) => {
                e.preventDefault()
                const url = await authService.googleAuthUrl()
                if (url.startsWith('https://accounts.google.com/')) {
                  window.location.href = url
                }
              }}
              href="#"
              className="flex items-center justify-center gap-3 w-full py-2.5 rounded-lg text-sm font-medium text-text-muted border border-border hover:bg-background hover:border-primary/30 transition-all cursor-pointer">
              <svg width="15" height="15" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </a>

            <p className="text-xs text-center mt-5 text-text-muted">
              {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button onClick={() => setIsRegister(!isRegister)} className="font-semibold text-primary hover:underline">
                {isRegister ? 'Sign in' : 'Register'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
