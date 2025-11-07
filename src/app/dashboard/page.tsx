'use client';

import PatientsTable from '@/components/dashboard/patients-table';
import EncountersTable from '@/components/dashboard/encounters-table';
import ConditionsTable from '@/components/dashboard/conditions-table';
import ObservationsTable from '@/components/dashboard/observations-table';
import MeasurementsTable from '@/components/dashboard/measurements-table';
import DrugExposuresTable from '@/components/dashboard/drug-exposures-table';
import BedsTable from '@/components/dashboard/beds-table';
import HospitalsTable from '@/components/dashboard/hospitals-table';


// MAIN DASHBOARD PAGE
export default function DashboardPage() {
  return (
    <div className="p-4 md:p-8 space-y-8">
      <h1 className="text-2xl font-bold">Data Tables</h1>
      <HospitalsTable />
      <PatientsTable />
      <EncountersTable />
      <ConditionsTable />
      <ObservationsTable />
      <MeasurementsTable />
      <DrugExposuresTable />
      <BedsTable />
    </div>
  );
}
