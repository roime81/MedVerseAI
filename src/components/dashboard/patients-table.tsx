'use client';
import { useCollection } from '@/firebase';
import { collection } from 'firebase/firestore';
import { useFirestore, useMemoFirebase } from '@/firebase';

// PATIENTS TABLE COMPONENT
export default function PatientsTable() {
  const firestore = useFirestore();
  const patientsCollection = useMemoFirebase(
    () => collection(firestore, 'patients'),
    [firestore]
  );
  const { data: patients, isLoading } = useCollection(patientsCollection);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Patients</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Birth Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading && <tr><td colSpan={5}>Loading...</td></tr>}
            {patients?.map((patient) => (
              <tr key={patient.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{patient.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.fullName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.dateOfBirth}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.gender}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.contactInfo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
