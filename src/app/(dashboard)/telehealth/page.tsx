'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Video, Phone, Clock, Loader2 } from 'lucide-react';
import { placeholderImages } from '@/lib/placeholder-images';
import { Badge } from '@/components/ui/badge';
import { useCollection, useFirebase, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { TelehealthAppointment } from '@/lib/sample-data';


export default function TelehealthPage() {
    const { firestore } = useFirebase();

    const appointmentsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return collection(firestore, 'telehealthAppointments');
    }, [firestore]);

    const { data: allAppointments, isLoading } = useCollection<TelehealthAppointment>(appointmentsQuery);

    const appointments = allAppointments?.filter(a => a.status !== 'Completed') || [];
    const completedAppointments = allAppointments?.filter(a => a.status === 'Completed') || [];

  const getAvatarUrl = (id: string) => {
    return placeholderImages.find(p => p.id === id)?.imageUrl || '';
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <header>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Telehealth Dashboard
        </h1>
        <p className="text-muted-foreground">
          Dr. Aisha Khan - General Practice
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Today's Virtual Appointments</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
             <div className="flex items-center justify-center p-8 md:col-span-3">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : appointments.map((appt, index) => (
            <Card key={index} className="flex flex-col shadow-md hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center gap-4">
                <Avatar className="h-12 w-12 border-2 border-primary/20">
                   <AvatarImage src={getAvatarUrl(appt.avatarId)} data-ai-hint="person face" />
                  <AvatarFallback>{appt.patientName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{appt.patientName}</p>
                  <p className="text-sm text-muted-foreground">{appt.time}</p>
                </div>
              </CardHeader>
              <CardContent className="mt-auto flex flex-col gap-2 pt-0">
                {appt.status === 'Waiting' ? (
                  <Button className="w-full">
                    <Video className="mr-2 h-4 w-4" /> Start Consultation
                  </Button>
                ) : (
                  <Button disabled variant="secondary" className="w-full cursor-not-allowed">
                    <Clock className="mr-2 h-4 w-4" />
                    Awaiting Patient
                  </Button>
                )}
                 <Button variant="outline" className="w-full">
                    <Phone className="mr-2 h-4 w-4" /> Contact Patient
                </Button>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      <Card>
          <CardHeader>
              <CardTitle>Completed Consultations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
                 <div className="flex items-center justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            ) : completedAppointments.map((appt, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-card border transition-colors hover:bg-secondary/50">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={getAvatarUrl(appt.avatarId)} data-ai-hint="person professional" />
                            <AvatarFallback>{appt.patientName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold">{appt.patientName}</p>
                            <p className="text-sm text-muted-foreground">{appt.notes}</p>
                        </div>
                    </div>
                    <Badge variant="outline">Completed at {appt.time}</Badge>
                </div>
            ))}
          </CardContent>
      </Card>
    </div>
  );
}
