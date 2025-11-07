'use client';
import { Header } from './header';
import PatientsTable from './patients-table';
import EncountersTable from './encounters-table';
import ConditionsTable from './conditions-table';
import DrugExposuresTable from './drug-exposures-table';
import BedsTable from './beds-table';
import HospitalsTable from './hospitals-table';
import CostsTable from './costs-table';
import PayerPlansTable from './payer-plans-table';
import VisitDetailsTable from './visit-details-table';
import ClinicalNotesTable from './clinical-notes-table';
import ProceduresTable from './procedures-table';
import LabResultsTable from './lab-results-table';
import ImagingStudiesTable from './imaging-studies-table';
import MeasurementsTable from './measurements-table';
import ObservationsTable from './observations-table';

export default function AdminDashboard() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <main className="p-8 space-y-8">
        <h1 className="text-3xl font-bold font-grotesk text-gray-800">Admin Dashboard</h1>
        
        <div className="p-6 bg-white rounded-lg shadow">
          <PatientsTable />
        </div>
        <div className="p-6 bg-white rounded-lg shadow">
          <EncountersTable />
        </div>
         <div className="p-6 bg-white rounded-lg shadow">
          <ConditionsTable />
        </div>
         <div className="p-6 bg-white rounded-lg shadow">
          <ProceduresTable />
        </div>
        <div className="p-6 bg-white rounded-lg shadow">
          <DrugExposuresTable />
        </div>
        <div className="p-6 bg-white rounded-lg shadow">
          <LabResultsTable />
        </div>
        <div className="p-6 bg-white rounded-lg shadow">
          <ImagingStudiesTable />
        </div>
        <div className="p-6 bg-white rounded-lg shadow">
          <ClinicalNotesTable />
        </div>
        <div className="p-6 bg-white rounded-lg shadow">
          <BedsTable />
        </div>
        <div className="p-6 bg-white rounded-lg shadow">
          <HospitalsTable />
        </div>
        <div className="p-6 bg-white rounded-lg shadow">
          <CostsTable />
        </div>
        <div className="p-6 bg-white rounded-lg shadow">
          <PayerPlansTable />
        </div>
        <div className="p-6 bg-white rounded-lg shadow">
          <VisitDetailsTable />
        </div>
        <div className="p-6 bg-white rounded-lg shadow">
          <MeasurementsTable />
        </div>
        <div className="p-6 bg-white rounded-lg shadow">
          <ObservationsTable />
        </div>
      </main>
    </div>
  );
}
