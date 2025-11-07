'use client';
import { useCollection } from '@/firebase';
import { collectionGroup } from 'firebase/firestore';
import { useFirestore, useMemoFirebase } from '@/firebase';

// CLINICAL NOTES TABLE COMPONENT
export default function ClinicalNotesTable() {
  const firestore = useFirestore();
  const itemsCollection = useMemoFirebase(
    () => collectionGroup(firestore, 'clinicalNotes'),
    [firestore]
  );
  const { data: items, isLoading } = useCollection(itemsCollection);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Clinical Notes</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Note ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Encounter ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Text</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading && <tr><td colSpan={5}>Loading...</td></tr>}
            {items?.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.encounterId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.noteType}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.noteText}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.dateTimeCreated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
