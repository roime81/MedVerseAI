'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Calendar, AlertCircle, Users, Clock, Loader2 } from 'lucide-react';
import { useUser, useFirestore, useMemoFirebase, useCollection } from '@/firebase';
import { collection, query, where, getCountFromServer, Timestamp } from 'firebase/firestore';
import { useEffect, useState } from 'react';

const summaryIcons = {
  "Today's Appointments": Calendar,
  'Pending Tasks': AlertCircle,
  'Active Patients': Users,
  'Avg. Wait Time': Clock,
};

const summaryColors = {
  "Today's Appointments": 'text-blue-500 border-blue-500',
  'Pending Tasks': 'text-orange-500 border-orange-500',
  'Active Patients': 'text-green-500 border-green-500',
  'Avg. Wait Time': 'text-purple-500 border-purple-500',
};


export function SummaryCards() {
  const { user } = useUser();
  const firestore = useFirestore();

  const [summaryData, setSummaryData] = useState({
    "Today's Appointments": '...',
    'Pending Tasks': '...',
    'Active Patients': '...',
    'Avg. Wait Time': '12m', // Static for now
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || !firestore) return;

    const fetchData = async () => {
      setIsLoading(true);

      // 1. Today's Appointments
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const appointmentsQuery = query(
        collection(firestore, 'procedures'), // Assuming procedures are appointments for now
        where('performingClinicianId', '==', user.uid),
        where('procedureDateTime', '>=', Timestamp.fromDate(today)),
        where('procedureDateTime', '<', Timestamp.fromDate(tomorrow))
      );
      const appointmentsSnapshot = await getCountFromServer(appointmentsQuery);
      const appointmentsCount = appointmentsSnapshot.data().count;

      // 2. Pending Tasks
      const tasksQuery = query(
        collection(firestore, `users/${user.uid}/tasks`),
        where('status', '==', 'Pending')
      );
      const tasksSnapshot = await getCountFromServer(tasksQuery);
      const tasksCount = tasksSnapshot.data().count;

      // 3. Active Patients
      const patientsQuery = query(
        collection(firestore, 'patients'),
        where('primaryProviderId', '==', user.uid)
      );
      const patientsSnapshot = await getCountFromServer(patientsQuery);
      const patientsCount = patientsSnapshot.data().count;
      
      setSummaryData(prev => ({
        ...prev,
        "Today's Appointments": appointmentsCount.toString(),
        "Pending Tasks": tasksCount.toString(),
        "Active Patients": patientsCount.toString(),
      }));

      setIsLoading(false);
    };

    fetchData();
  }, [user, firestore]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Object.entries(summaryData).map(([title, value]) => (
        <Card key={title} className={`border-l-4 ${summaryColors[title]} shadow-sm`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-grotesk text-sm font-medium text-muted-foreground">
              {title}
            </CardTitle>
            {React.createElement(summaryIcons[title], { className: `h-5 w-5 ${summaryColors[title]}` })}
          </CardHeader>
          <CardContent>
            <div className="font-grotesk text-2xl font-bold text-gray-800">
                {isLoading ? <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /> : value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
