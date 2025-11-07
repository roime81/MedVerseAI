'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { User, Users, BriefcaseMedical, Phone, Mail, Home, Shield } from 'lucide-react';


const registrationSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  dob: z.date({ required_error: 'Date of birth is required' }),
  gender: z.string().min(1, 'Gender is required'),
  ssn: z.string().optional(),
  maritalStatus: z.string().optional(),
  primaryPhone: z.string().min(1, 'Primary phone is required'),
  email: z.string().email('Invalid email address'),
  streetAddress: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().min(1, 'ZIP code is required'),
  emergencyContactName: z.string().min(1, 'Emergency contact name is required'),
  emergencyContactPhone: z.string().min(1, 'Emergency contact phone is required'),
  insuranceProvider: z.string().min(1, 'Insurance provider is required'),
  policyNumber: z.string().min(1, 'Policy number is required'),
  groupNumber: z.string().optional(),
  subscriberName: z.string().optional(),
  medicalHistory: z.string().optional(),
});

export type PatientRegistrationData = z.infer<typeof registrationSchema>;

type PatientRegistrationFormProps = {
  onSubmit: (data: PatientRegistrationData) => void;
  onCancel: () => void;
  isSaving: boolean;
};

export function PatientRegistrationForm({ onSubmit, onCancel, isSaving }: PatientRegistrationFormProps) {
  const form = useForm<PatientRegistrationData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      gender: '',
      ssn: '',
      maritalStatus: '',
      primaryPhone: '',
      email: '',
      streetAddress: '',
      city: '',
      state: '',
      zipCode: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
      insuranceProvider: '',
      policyNumber: '',
      groupNumber: '',
      subscriberName: '',
      medicalHistory: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <ScrollArea className="h-[65vh] pr-4">
          <div className="space-y-8">
            {/* Patient Demographics */}
            <section>
                <h3 className="text-lg font-semibold flex items-center mb-4"><Users className="mr-2" /> Patient Demographics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField name="firstName" control={form.control} render={({ field }) => (
                        <FormItem><FormLabel>First Name *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField name="lastName" control={form.control} render={({ field }) => (
                        <FormItem><FormLabel>Last Name *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField name="dob" control={form.control} render={({ field }) => (
                        <FormItem><FormLabel>Date of Birth *</FormLabel><FormControl><DatePicker value={field.value} onChange={field.onChange} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField name="gender" control={form.control} render={({ field }) => (
                        <FormItem><FormLabel>Gender *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger></FormControl>
                            <SelectContent><SelectItem value="male">Male</SelectItem><SelectItem value="female">Female</SelectItem><SelectItem value="other">Other</SelectItem></SelectContent>
                        </Select><FormMessage /></FormItem>
                    )} />
                    <FormField name="ssn" control={form.control} render={({ field }) => (
                        <FormItem><FormLabel>Social Security Number</FormLabel><FormControl><Input {...field} placeholder="XXX-XX-XXXX" /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField name="maritalStatus" control={form.control} render={({ field }) => (
                        <FormItem><FormLabel>Marital Status</FormLabel>
                         <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger></FormControl>
                            <SelectContent><SelectItem value="single">Single</SelectItem><SelectItem value="married">Married</SelectItem><SelectItem value="divorced">Divorced</SelectItem><SelectItem value="widowed">Widowed</SelectItem></SelectContent>
                        </Select><FormMessage /></FormItem>
                    )} />
                </div>
            </section>
            
            <Separator />

            {/* Contact Information */}
            <section>
                <h3 className="text-lg font-semibold flex items-center mb-4"><Phone className="mr-2" /> Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField name="primaryPhone" control={form.control} render={({ field }) => (
                        <FormItem><FormLabel>Primary Phone *</FormLabel><FormControl><Input {...field} placeholder="(555) 123-4567" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField name="email" control={form.control} render={({ field }) => (
                        <FormItem><FormLabel>Email Address *</FormLabel><FormControl><Input {...field} placeholder="patient@email.com" /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
                 <div className="mt-4 space-y-4">
                    <FormField name="streetAddress" control={form.control} render={({ field }) => (
                        <FormItem><FormLabel>Street Address *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                         <FormField name="city" control={form.control} render={({ field }) => (
                            <FormItem><FormLabel>City *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                         <FormField name="state" control={form.control} render={({ field }) => (
                            <FormItem><FormLabel>State *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                         <FormField name="zipCode" control={form.control} render={({ field }) => (
                            <FormItem><FormLabel>ZIP Code *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <FormField name="emergencyContactName" control={form.control} render={({ field }) => (
                        <FormItem><FormLabel>Emergency Contact Name *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField name="emergencyContactPhone" control={form.control} render={({ field }) => (
                        <FormItem><FormLabel>Emergency Contact Phone *</FormLabel><FormControl><Input {...field} placeholder="(555) 987-6543" /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
            </section>
            
            <Separator />
            
            {/* Insurance Information */}
            <section>
                 <h3 className="text-lg font-semibold flex items-center mb-4"><Shield className="mr-2" /> Insurance Information</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField name="insuranceProvider" control={form.control} render={({ field }) => (
                        <FormItem><FormLabel>Insurance Provider *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select provider" /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="blue-shield">Blue Shield PPO</SelectItem>
                                <SelectItem value="aetna">Aetna</SelectItem>
                                <SelectItem value="cigna">Cigna</SelectItem>
                                <SelectItem value="united">United Healthcare</SelectItem>
                                <SelectItem value="medicare">Medicare</SelectItem>
                                <SelectItem value="medicaid">Medicaid</SelectItem>
                            </SelectContent>
                        </Select><FormMessage /></FormItem>
                    )} />
                     <FormField name="policyNumber" control={form.control} render={({ field }) => (
                        <FormItem><FormLabel>Policy Number *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField name="groupNumber" control={form.control} render={({ field }) => (
                        <FormItem><FormLabel>Group Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField name="subscriberName" control={form.control} render={({ field }) => (
                        <FormItem><FormLabel>Subscriber Name</FormLabel><FormControl><Input {...field} placeholder="If different from patient" /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
            </section>

            <Separator />
            
            {/* Medical History */}
            <section>
                 <h3 className="text-lg font-semibold flex items-center mb-4"><BriefcaseMedical className="mr-2" /> Medical History</h3>
                 <FormField name="medicalHistory" control={form.control} render={({ field }) => (
                    <FormItem><FormLabel>Initial Medical History / Reason for Visit</FormLabel><FormControl><Textarea {...field} rows={4} placeholder="Enter any known allergies, past surgeries, chronic conditions, or the primary reason for this registration..." /></FormControl><FormMessage /></FormItem>
                )} />
            </section>
          </div>
        </ScrollArea>
        <div className="flex justify-end gap-2 pt-6">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save and Register Patient'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
