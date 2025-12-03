
import { User } from '../types';
import { getUsers, addUser, findUserByEmail } from './mockData';

// Simulated delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const login = async (email: string, password: string): Promise<User | null> => {
    await delay(1000); // Fake network request
    const user = findUserByEmail(email);
    
    if (user && user.password === password) {
        localStorage.setItem('billboard_user', JSON.stringify(user));
        return user;
    }
    return null;
};

export const register = async (firstName: string, lastName: string, email: string, password: string): Promise<User> => {
    await delay(1000);
    const existing = findUserByEmail(email);
    if (existing) {
        throw new Error("Email already registered");
    }

    const newUser: User = {
        id: Date.now().toString(),
        firstName,
        lastName,
        email,
        password,
        role: 'Manager' // Default role
    };

    addUser(newUser);
    localStorage.setItem('billboard_user', JSON.stringify(newUser));
    return newUser;
};

export const resetPassword = async (email: string): Promise<void> => {
    await delay(1500);
    const user = findUserByEmail(email);
    if (!user) {
        // For security, usually we don't say if user exists, but for this mock app we might throw or just return
        // Let's pretend it worked regardless to prevent enumeration, or throw for demo purposes
        throw new Error("No account found with this email address");
    }
    // In a real app, this would send an email.
    return;
};

export const logout = () => {
    localStorage.removeItem('billboard_user');
};

export const getCurrentUser = (): User | null => {
    const stored = localStorage.getItem('billboard_user');
    return stored ? JSON.parse(stored) : null;
};
