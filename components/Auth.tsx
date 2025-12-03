import React, { useState } from 'react';
import { login, register, resetPassword } from '../services/authService';
import { User, Lock, Mail, ArrowRight, Loader2, Sparkles, ArrowLeft, CheckCircle } from 'lucide-react';

interface AuthProps {
    onLogin: () => void;
}

type AuthMode = 'login' | 'register' | 'forgot';

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
    const [mode, setMode] = useState<AuthMode>('login');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    
    // Form State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setIsLoading(true);

        try {
            if (mode === 'login') {
                const user = await login(email, password);
                if (user) {
                    onLogin();
                } else {
                    setError('Invalid email or password');
                }
            } else if (mode === 'register') {
                if(!firstName || !lastName) {
                    setError("Please fill in all fields");
                    setIsLoading(false);
                    return;
                }
                await register(firstName, lastName, email, password);
                onLogin();
            } else if (mode === 'forgot') {
                await resetPassword(email);
                setSuccessMessage('Password reset link has been sent to your email.');
                // Optional: clear email or return to login after delay
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleMode = (newMode: AuthMode) => {
        setMode(newMode);
        setError('');
        setSuccessMessage('');
        setPassword('');
        // Keep email if user was typing it
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-900 relative overflow-hidden font-sans">
            {/* Animated Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-1/3 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            <div className="relative z-10 w-full max-w-md p-6">
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 transition-all duration-500">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 mb-4 shadow-lg shadow-blue-500/30">
                            <span className="text-white font-bold text-xl">S</span>
                        </div>
                        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Billboard Suite</h1>
                        <p className="text-slate-400 text-sm">
                            {mode === 'login' && 'Premium Inventory Management'}
                            {mode === 'register' && 'Create your account'}
                            {mode === 'forgot' && 'Recover your password'}
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-200 text-sm p-3 rounded-lg mb-6 text-center animate-fade-in">
                            {error}
                        </div>
                    )}
                    
                    {successMessage && (
                        <div className="bg-green-500/10 border border-green-500/20 text-green-200 text-sm p-3 rounded-lg mb-6 text-center flex items-center justify-center gap-2 animate-fade-in">
                            <CheckCircle size={16} /> {successMessage}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {mode === 'register' && (
                            <div className="grid grid-cols-2 gap-4 animate-fade-in">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wide ml-1">First Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 text-slate-400" size={16} />
                                        <input 
                                            type="text" 
                                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-2.5 pl-10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
                                            placeholder="John"
                                            value={firstName}
                                            onChange={e => setFirstName(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wide ml-1">Last Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 text-slate-400" size={16} />
                                        <input 
                                            type="text" 
                                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-2.5 pl-10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
                                            placeholder="Doe"
                                            value={lastName}
                                            onChange={e => setLastName(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-300 uppercase tracking-wide ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 text-slate-400" size={16} />
                                <input 
                                    type="email" 
                                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-2.5 pl-10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
                                    placeholder="name@company.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {(mode === 'login' || mode === 'register') && (
                            <div className="space-y-1 animate-fade-in">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">Password</label>
                                    {mode === 'login' && (
                                        <button 
                                            type="button" 
                                            onClick={() => toggleMode('forgot')}
                                            className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                                        >
                                            Forgot Password?
                                        </button>
                                    )}
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 text-slate-400" size={16} />
                                    <input 
                                        type="password" 
                                        className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-2.5 pl-10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        <button 
                            type="submit" 
                            disabled={isLoading || (mode === 'forgot' && !!successMessage)}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white py-3 rounded-xl font-bold uppercase tracking-wider text-sm shadow-lg shadow-blue-500/25 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 mt-6"
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={18} /> : (
                                mode === 'login' ? 'Sign In' : 
                                mode === 'register' ? 'Create Account' : 
                                successMessage ? 'Email Sent' : 'Send Reset Link'
                            )}
                            {!isLoading && !successMessage && <ArrowRight size={18} />}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        {mode === 'forgot' ? (
                            <button 
                                onClick={() => toggleMode('login')}
                                className="text-slate-400 text-sm hover:text-white font-medium flex items-center justify-center gap-2 mx-auto transition-colors"
                            >
                                <ArrowLeft size={16} /> Back to Login
                            </button>
                        ) : (
                            <p className="text-slate-400 text-sm">
                                {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
                                <button 
                                    onClick={() => toggleMode(mode === 'login' ? 'register' : 'login')}
                                    className="ml-2 text-white font-bold hover:underline focus:outline-none"
                                >
                                    {mode === 'login' ? 'Register' : 'Login'}
                                </button>
                            </p>
                        )}
                    </div>
                </div>
                
                <div className="mt-8 text-center text-slate-500 text-xs">
                    &copy; 2025 Spiritus Systems. All rights reserved.
                </div>
            </div>
        </div>
    );
};