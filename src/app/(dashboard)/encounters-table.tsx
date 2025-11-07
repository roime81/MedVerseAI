'use client';
import { useCollection } from '@/firebase';
import { collectionGroup } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { useMemo } from 'react';

export function EncountersTable() {
  const firestore = useFirestore();
  const encountersCollection = useMemo(
    () => collectionGroup(firestore, 'encounters'),
    [firestore]
  );
  const { data: encounters, isLoading } = useCollection(encountersCollection);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Encounters</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Time</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading && <tr><td colSpan={4}>Loading...</td></tr>}
            {encounters?.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.personId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.visitStartDatetime}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.visitEndDatetime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
