'use client';
import { useCollection } from '@/firebase';
import { collectionGroup } from 'firebase/firestore';
import { useFirestore, useMemoFirebase } from '@/firebase';

// COSTS TABLE COMPONENT
export default function CostsTable() {
  const firestore = useFirestore();
  const costsCollection = useMemoFirebase(
    () => collectionGroup(firestore, 'costs'),
    [firestore]
  );
  const { data: items, isLoading } = useCollection(costsCollection);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Costs</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Cost</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid by Payer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid by Patient</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading && <tr><td colSpan={6}>Loading...</td></tr>}
            {items?.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.personId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.costEventId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.cost}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.paidByPayer}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.paidByPatient}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

    