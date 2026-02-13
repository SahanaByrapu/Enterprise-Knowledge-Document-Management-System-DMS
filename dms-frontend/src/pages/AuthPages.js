import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { FileText, ArrowRight, AlertCircle } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left side - Image */}
      <div className="hidden lg:block relative">
        <img
          src="https://images.unsplash.com/photo-1762849538488-f34e77b50655?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2OTF8MHwxfHNlYXJjaHwzfHxtb2Rlcm4lMjB3aGl0ZSUyMGFyY2hpdGVjdHVyZSUyMGRldGFpbCUyMGdsYXNzfGVufDB8fHx8MTc3MTAwMTAxMnww&ixlib=rb-4.1.0&q=85"
          alt="Modern architecture"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-zinc-900/20" />
        <div className="absolute bottom-8 left-8 right-8">
          <div className="glass p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-zinc-900 font-outfit">Enterprise Knowledge Hub</h2>
            <p className="text-zinc-600 mt-2">Centralize, search, and leverage your organization's knowledge with AI-powered insights.</p>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex items-center justify-center p-8 bg-zinc-50">
        <div className="w-full max-w-md space-y-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-zinc-900 flex items-center justify-center">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-semibold font-outfit">KnowledgeHub</span>
          </div>

          <Card className="border-zinc-200 shadow-sm" data-testid="login-card">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-outfit">Welcome back</CardTitle>
              <CardDescription>Sign in to access your knowledge base</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm" data-testid="login-error">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="focus-ring"
                    data-testid="login-email-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="focus-ring"
                    data-testid="login-password-input"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-zinc-900 hover:bg-zinc-800 active:scale-[0.98] transition-all"
                  disabled={loading}
                  data-testid="login-submit-btn"
                >
                  {loading ? 'Signing in...' : 'Sign in'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>

              <div className="mt-6 text-center text-sm text-zinc-500">
                Don't have an account?{' '}
                <Link to="/register" className="text-blue-600 hover:underline font-medium" data-testid="register-link">
                  Create one
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(email, password, name);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left side - Image */}
      <div className="hidden lg:block relative">
        <img
          src="https://images.unsplash.com/photo-1762849538488-f34e77b50655?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2OTF8MHwxfHNlYXJjaHwzfHxtb2Rlcm4lMjB3aGl0ZSUyMGFyY2hpdGVjdHVyZSUyMGRldGFpbCUyMGdsYXNzfGVufDB8fHx8MTc3MTAwMTAxMnww&ixlib=rb-4.1.0&q=85"
          alt="Modern architecture"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-zinc-900/20" />
        <div className="absolute bottom-8 left-8 right-8">
          <div className="glass p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-zinc-900 font-outfit">Join Enterprise Knowledge Hub</h2>
            <p className="text-zinc-600 mt-2">Start organizing and accessing your team's collective knowledge today.</p>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex items-center justify-center p-8 bg-zinc-50">
        <div className="w-full max-w-md space-y-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-zinc-900 flex items-center justify-center">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-semibold font-outfit">KnowledgeHub</span>
          </div>

          <Card className="border-zinc-200 shadow-sm" data-testid="register-card">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-outfit">Create account</CardTitle>
              <CardDescription>Get started with your knowledge hub</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm" data-testid="register-error">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="focus-ring"
                    data-testid="register-name-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="focus-ring"
                    data-testid="register-email-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="focus-ring"
                    data-testid="register-password-input"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-zinc-900 hover:bg-zinc-800 active:scale-[0.98] transition-all"
                  disabled={loading}
                  data-testid="register-submit-btn"
                >
                  {loading ? 'Creating account...' : 'Create account'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>

              <div className="mt-6 text-center text-sm text-zinc-500">
                Already have an account?{' '}
                <Link to="/login" className="text-blue-600 hover:underline font-medium" data-testid="login-link">
                  Sign in
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
