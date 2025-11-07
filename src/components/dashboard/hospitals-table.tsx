'use client';
import { useCollection } from '@/firebase';
import { collection } from 'firebase/firestore';
import { useFirestore, useMemoFirebase } from '@/firebase';

// HOSPITALS TABLE COMPONENT
export default function HospitalsTable() {
  const firestore = useFirestore();
  const careSitesCollection = useMemoFirebase(
    () => collection(firestore, 'careSites'),
    [firestore]
  );
  const { data: careSites, isLoading } = useCollection(careSitesCollection);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Hospitals</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hospital Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hospital Name</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading && <tr><td colSpan={2}>Loading...</td></tr>}
            {careSites?.map((site) => (
              <tr key={site.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{site.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{site.careSiteName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
