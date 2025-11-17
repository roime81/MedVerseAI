
import { z } from 'zod';

export const UserSchema = z.object({
  uid: z.string().describe("Unique user ID from Firebase Auth."),
  email: z.string().email().describe("User's email address."),
  role: z.enum(["physician", "nurse", "radiology", "lab", "billing", "admin", "pharmacist"]).describe("The role of the user, which determines their permissions and dashboard."),
  displayName: z.string().optional().describe("User's display name."),
  associatedCareSites: z.array(z.string()).optional().describe("An array of care site IDs the user is associated with."),
});
export type User = z.infer<typeof UserSchema>;

export const PatientSchema = z.object({
  personId: z.string().describe("Unique identifier for the Patient entity."),
  nationalId: z.string().optional().describe("Government-issued identifier."),
  fullName: z.string().describe("Patient's full name."),
  dateOfBirth: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date format" }).describe("Patient's date of birth."),
  gender: z.string().optional().describe("Gender of the patient."),
  race: z.string().optional().describe("Race classification of the patient."),
  ethnicity: z.string().optional().describe("Ethnicity classification of the patient."),
  maritalStatus: z.string().optional().describe("Civil status of the patient."),
  contactInfo: z.string().optional().describe("Patient's phone or email."),
  address: z.string().optional().describe("Patient's full address."),
  emergencyContact: z.string().optional().describe("Emergency contact information."),
  primaryProviderId: z.string().optional().describe("Assigned primary care physician."),
  insuranceNumber: z.string().optional().describe("Link to insurance table."),
  allergyFlag: z.string().optional().describe("Summary for clinical decision support."),
  activeProblemList: z.string().optional().describe("Summary for clinical decision support."),
});
export type Patient = z.infer<typeof PatientSchema>;


export const EncounterSchema = z.object({
  encounterId: z.string().describe("Unique identifier for the Encounter entity."),
  personId: z.string().describe("Link to the Patient."),
  facilityId: z.string().optional().describe("Hospital or clinic unit where the encounter occurred."),
  encounterType: z.string().optional().describe("Type of visit (inpatient, outpatient, emergency)."),
  admissionDatetime: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date-time format" }).describe("Start time of the visit."),
  dischargeDatetime: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date-time format" }).optional().describe("End time of the visit."),
  attendingProviderId: z.string().optional().describe("Doctor in charge of the visit."),
  visitReason: z.string().optional().describe("The initial reason for the visit."),
  visitStatus: z.string().optional().describe("Status of the visit (e.g., Active, Discharged)."),
});
export type Encounter = z.infer<typeof EncounterSchema>;

export const ConditionSchema = z.object({
  diagnosisId: z.string().describe("Unique identifier for the Diagnosis entity."),
  personId: z.string().describe("Link to the Patient."),
  encounterId: z.string().optional().describe("Link to the Encounter when diagnosed."),
  icd10Code: z.string().optional().describe("ICD-10 or SNOMED code for the condition."),
  diagnosisType: z.string().optional().describe("Principal or Secondary diagnosis."),
  onsetDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date format" }).optional().describe("Onset date of the condition."),
  resolutionDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date format" }).optional().describe("Resolution date of the condition."),
  status: z.string().optional().describe("Active or Resolved."),
  certainty: z.string().optional().describe("Confirmed or Suspected."),
});
export type Condition = z.infer<typeof ConditionSchema>;

export const DrugExposureSchema = z.object({
  medicationId: z.string().describe("Unique identifier for the Medication order."),
  personId: z.string().describe("Link to the Patient."),
  encounterId: z.string().optional().describe("Link to the Encounter when prescribed."),
  drugCode: z.string().optional().describe("RxNorm / ATC code for the drug."),
  drugName: z.string().describe("Name of the medication."),
  dose: z.string().optional().describe("Dosage details (e.g., '10mg')."),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date-time format" }).describe("Start time of the drug exposure."),
  endDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date-time format" }).optional().describe("End time of the drug exposure."),
  prescribingPhysicianId: z.string().optional().describe("ID of the prescribing doctor."),
  dispenseStatus: z.string().optional().describe("Dispensed or Not dispensed."),
});
export type DrugExposure = z.infer<typeof DrugExposureSchema>;

export const LabResultSchema = z.object({
    labOrderId: z.string().describe("Unique identifier for the lab order."),
    personId: z.string().describe("Link to the Patient."),
    encounterId: z.string().optional().describe("Link to the Encounter."),
    testCode: z.string().optional().describe("LOINC code for the test."),
    resultValue: z.string().optional().describe("The resulting value of the test."),
    resultDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date-time format" }).describe("Date and time the result was available."),
    resultFlag: z.string().optional().describe("Flag for the result (e.g., High, Low, Normal)."),
});
export type LabResult = z.infer<typeof LabResultSchema>;


export const PendingTaskSchema = z.object({
  taskId: z.string().describe("Unique identifier for the task."),
  assignedTo: z.string().describe("UID of the user the task is assigned to."),
  description: z.string().describe("A description of the task to be completed."),
  priority: z.string().describe("The priority level of the task."),
  dueDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date format" }).describe("The date the task is due."),
  status: z.enum(["Pending", "Completed"]).describe("The current status of the task."),
  patientId: z.string().optional().describe("Optional patient ID related to the task."),
});
export type PendingTask = z.infer<typeof PendingTaskSchema>;

export const CareSiteSchema = z.object({
  careSiteId: z.string().describe("Unique identifier for the CareSite entity (hospital code)."),
  careSiteName: z.string().describe("The official name of the hospital or care site."),
});
export type CareSite = z.infer<typeof CareSiteSchema>;
