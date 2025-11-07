'use client';
import { useCollection } from '@/firebase';
import { collection } from 'firebase/firestore';
import { useFirestore, useMemoFirebase } from '@/firebase';

// BEDS TABLE COMPONENT
export default function BedsTable() {
  const firestore = useFirestore();
  const bedsCollection = useMemoFirebase(
    () => collection(firestore, 'beds'),
    [firestore]
  );
  const { data: beds, isLoading } = useCollection(bedsCollection);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Bed Occupancy</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bed ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient ID</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading && <tr><td colSpan={4}>Loading...</td></tr>}
            {beds?.map((bed) => (
              <tr key={bed.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{bed.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bed.location}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bed.status}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bed.patientId || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
