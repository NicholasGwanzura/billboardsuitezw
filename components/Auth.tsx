
import React, { useState } from 'react';
import { login, register, resetPassword } from '../services/authService';
import { User, Lock, Mail, ArrowRight, Loader2, CheckCircle, Box, ArrowLeft } from 'lucide-react';

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
    };

    return (
        <div className="min-h-screen w-full flex bg-slate-50 font-sans">
            {/* Left Side - Form */}
            <div className="w-full lg:w-[45%] flex flex-col justify-center px-8 sm:px-12 lg:px-20 relative z-10 bg-white shadow-2xl shadow-slate-200/50">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-600 to-accent-600"></div>
                {/* Subtle Grain Texture Overlay */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`}}></div>

                <div className="max-w-md w-full mx-auto animate-slide-up relative z-10">
                    {/* Brand Logo */}
                    <div className="mb-12 flex items-center gap-3">
                        <span className="text-4xl font-black text-slate-900 tracking-tight">Dream</span>
                        <div className="flex items-center gap-1">
                            <div className="bg-gradient-to-br from-brand-600 to-accent-600 text-white p-1.5 rounded-lg shadow-lg shadow-brand-500/30">
                                <Box size={26} strokeWidth={3} />
                            </div>
                            <span className="text-4xl font-black text-slate-900 tracking-tight">ox</span>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">
                            {mode === 'login' && 'Welcome back'}
                            {mode === 'register' && 'Join the team'}
                            {mode === 'forgot' && 'Reset Password'}
                        </h1>
                        <p className="text-slate-500 text-lg leading-relaxed">
                            {mode === 'login' && 'Enter your credentials to access the management portal.'}
                            {mode === 'register' && 'Create your account to start managing inventory.'}
                            {mode === 'forgot' && 'Enter your email to receive recovery instructions.'}
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 text-sm p-4 rounded-xl mb-6 border border-red-100 flex items-center gap-2 animate-fade-in font-medium">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div> {error}
                        </div>
                    )}
                    
                    {successMessage && (
                        <div className="bg-green-50 text-green-700 text-sm p-4 rounded-xl mb-6 border border-green-100 flex items-center justify-center gap-2 animate-fade-in font-medium">
                            <CheckCircle size={16} /> {successMessage}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {mode === 'register' && (
                            <div className="grid grid-cols-2 gap-4 animate-fade-in">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">First Name</label>
                                    <div className="relative group">
                                        <User className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-brand-600 transition-colors" size={18} />
                                        <input 
                                            type="text" 
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-semibold"
                                            placeholder="John"
                                            value={firstName}
                                            onChange={e => setFirstName(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Last Name</label>
                                    <div className="relative group">
                                        <User className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-brand-600 transition-colors" size={18} />
                                        <input 
                                            type="text" 
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-semibold"
                                            placeholder="Doe"
                                            value={lastName}
                                            onChange={e => setLastName(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-brand-600 transition-colors" size={18} />
                                <input 
                                    type="email" 
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-semibold"
                                    placeholder="name@dreambox.co.zw"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {(mode === 'login' || mode === 'register') && (
                            <div className="space-y-1 animate-fade-in">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Password</label>
                                    {mode === 'login' && (
                                        <button 
                                            type="button" 
                                            onClick={() => toggleMode('forgot')}
                                            className="text-xs font-bold text-brand-600 hover:text-brand-700 transition-colors"
                                        >
                                            Forgot Password?
                                        </button>
                                    )}
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-brand-600 transition-colors" size={18} />
                                    <input 
                                        type="password" 
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-semibold"
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
                            className="w-full bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-700 hover:to-accent-700 text-white py-4 rounded-xl font-extrabold uppercase tracking-widest text-sm shadow-lg shadow-brand-500/25 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 mt-8"
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={20} /> : (
                                mode === 'login' ? 'Sign In' : 
                                mode === 'register' ? 'Create Account' : 
                                successMessage ? 'Email Sent' : 'Send Reset Link'
                            )}
                            {!isLoading && !successMessage && <ArrowRight size={20} />}
                        </button>
                    </form>

                    <div className="mt-8 text-center border-t border-slate-100 pt-6">
                        {mode === 'forgot' ? (
                            <button 
                                onClick={() => toggleMode('login')}
                                className="text-slate-500 text-sm hover:text-slate-900 font-medium flex items-center justify-center gap-2 mx-auto transition-colors"
                            >
                                <ArrowLeft size={16} /> Back to Login
                            </button>
                        ) : (
                            <p className="text-slate-500 text-sm font-medium">
                                {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
                                <button 
                                    onClick={() => toggleMode(mode === 'login' ? 'register' : 'login')}
                                    className="ml-2 text-brand-600 font-bold hover:underline focus:outline-none"
                                >
                                    {mode === 'login' ? 'Register Now' : 'Login'}
                                </button>
                            </p>
                        )}
                    </div>
                </div>
                
                <div className="absolute bottom-6 left-0 w-full text-center text-slate-400 text-xs font-semibold">
                    &copy; 2025 Dreambox Advertising. Powered by Spiritus.
                </div>
            </div>

            {/* Right Side - Visual */}
            <div className="hidden lg:block lg:w-[55%] relative overflow-hidden bg-brand-950">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=2070')] bg-cover bg-center opacity-40 mix-blend-overlay grayscale"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-brand-900/90 via-slate-900/80 to-accent-900/90"></div>
                
                {/* Decorative Blobs */}
                <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-brand-500/20 rounded-full blur-[100px] animate-blob"></div>
                <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-accent-500/20 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>

                <div className="absolute inset-0 flex flex-col justify-between p-24 z-10">
                    <div className="flex justify-end">
                       <div className="px-5 py-2.5 bg-white/5 backdrop-blur-md rounded-full text-white/90 text-xs font-bold uppercase tracking-widest border border-white/10 shadow-xl">
                           Enterprise Edition v1.5.7
                       </div>
                    </div>
                    
                    <div className="max-w-2xl">
                        <h2 className="text-6xl font-black text-white mb-8 leading-tight tracking-tight">
                            Elevate Your <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-accent-300">Advertising Impact.</span>
                        </h2>
                        <p className="text-xl text-slate-300 leading-relaxed font-medium">
                            Comprehensive inventory management, automated billing, and real-time analytics for the modern billboard fleet.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
