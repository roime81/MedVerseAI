'use client';

import PatientsTable from '@/components/dashboard/patients-table';
import EncountersTable from '@/components/dashboard/encounters-table';
import ConditionsTable from '@/components/dashboard/conditions-table';
import DrugExposuresTable from '@/components/dashboard/drug-exposures-table';
import BedsTable from '@/components/dashboard/beds-table';
import HospitalsTable from '@/components/dashboard/hospitals-table';
import CostsTable from '@/components/dashboard/costs-table';
import PayerPlansTable from '@/components/dashboard/payer-plans-table';
import VisitDetailsTable from '@/components/dashboard/visit-details-table';
import ProceduresTable from '@/components/dashboard/procedures-table';
import LabResultsTable from '@/components/dashboard/lab-results-table';
import ImagingStudiesTable from '@/components/dashboard/imaging-studies-table';
import ClinicalNotesTable from '@/components/dashboard/clinical-notes-table';


// MAIN DASHBOARD PAGE
export default function DashboardPage() {
  return (
    <div className="p-4 md:p-8 space-y-8">
      <h1 className="text-2xl font-bold">Data Tables</h1>
      <HospitalsTable />
      <PatientsTable />
      <EncountersTable />
      <ConditionsTable />
      <DrugExposuresTable />
      <ProceduresTable />
      <LabResultsTable />
      <ImagingStudiesTable />
      <ClinicalNotesTable />
      <BedsTable />
      <CostsTable />
      <PayerPlansTable />
      <VisitDetailsTable />
    </div>
  );
}
