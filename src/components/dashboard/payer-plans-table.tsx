'use client';
import { useCollection } from '@/firebase';
import { collectionGroup } from 'firebase/firestore';
import { useFirestore, useMemoFirebase } from '@/firebase';

// PAYER PLANS TABLE COMPONENT
export default function PayerPlansTable() {
  const firestore = useFirestore();
  const itemsCollection = useMemoFirebase(
    () => collectionGroup(firestore, 'payerPlanPeriods'),
    [firestore]
  );
  const { data: items, isLoading } = useCollection(itemsCollection);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Insurance Plans</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payer ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Policy Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading && <tr><td colSpan={6}>Loading...</td></tr>}
            {items?.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.personId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.payerId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.policyNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.coverageStartDate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.coverageEndDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
