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
      <h2 className="text-xl font-semibold mb-4">Billing (Costs)</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Charge ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Charge</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Responsibility</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading && <tr><td colSpan={6}>Loading...</td></tr>}
            {items?.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.personId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.totalCharge}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.patientResponsibility}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.paymentStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
