'use client';

import PatientsTable from './patients-table';
import EncountersTable from './encounters-table';
import ConditionsTable from './conditions-table';
import ObservationsTable from './observations-table';
import MeasurementsTable from './measurements-table';
import DrugExposuresTable from './drug-exposures-table';
import BedsTable from './beds-table';


// MAIN DASHBOARD PAGE
export default function DashboardPage() {
  return (
    <div className="p-4 md:p-8 space-y-8">
      <h1 className="text-2xl font-bold">Data Tables</h1>
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
