'use client';
import { useAuth } from '@/hooks/use-mock-auth';
import AdminDashboard from './admin-dashboard';
import PhysicianDashboard from './physician-dashboard';
import NurseDashboard from './nurse-dashboard';
import { BrainCircuit } from 'lucide-react';

export default function DashboardPage() {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-200px)]">
                <div className="flex flex-col items-center gap-4">
                    <BrainCircuit className="size-12 text-primary animate-pulse" />
                    <p className="text-muted-foreground">Loading dashboard...</p>
                </div>
            </div>
        );
    }
    
    switch (user?.role) {
        case 'Admin':
            return <AdminDashboard />;
        case 'Physician':
            return <PhysicianDashboard />;
        case 'Nurse':
            return <NurseDashboard />;
        default:
            // Fallback for other roles or if role is not defined
            return <AdminDashboard />;
    }
}
