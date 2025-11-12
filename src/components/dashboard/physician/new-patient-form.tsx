'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, User, Phone, Briefcase, ScrollText } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useUser, useFirestore } from '@/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { faker } from '@faker-js/faker';

interface NewPatientFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewPatientForm({ open, onOpenChange }: NewPatientFormProps) {
    const { user } = useUser();
    const firestore = useFirestore();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState<Date>();
    const [gender, setGender] = useState('');
    const [socialSecurity, setSocialSecurity] = useState('');
    const [maritalStatus, setMaritalStatus] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zip, setZip] = useState('');
    const [emergencyContactName, setEmergencyContactName] = useState('');
    const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
    const [insuranceProvider, setInsuranceProvider] = useState('');
    const [policyNumber, setPolicyNumber] = useState('');
    const [groupNumber, setGroupNumber] = useState('');
    const [subscriberName, setSubscriberName] = useState('');
    const [isSaving, setIsSaving] = useState(false);


    const handleSubmit = async () => {
        if (!firestore || !user) return;

        setIsSaving(true);
        try {
            const newPatient = {
                personId: faker.string.uuid(),
                fullName: `${firstName} ${lastName}`,
                dateOfBirth: dateOfBirth ? dateOfBirth.toISOString().split('T')[0] : '',
                gender,
                nationalId: socialSecurity,
                maritalStatus,
                contactInfo: phone,
                address: `${address}, ${city}, ${state} ${zip}`,
                emergencyContact: `${emergencyContactName}, ${emergencyContactPhone}`,
                primaryProviderId: user.uid,
                insuranceNumber: policyNumber,
                allergyFlag: 'None',
                activeProblemList: '',
            };
            await addDoc(collection(firestore, 'patients'), newPatient);
            console.log('Patient created');
            onOpenChange(false);
            // Optionally, reset form state here
        } catch (error) {
            console.error('Error creating patient:', error);
        } finally {
            setIsSaving(false);
        }
    };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-white text-foreground">
        <DialogHeader>
          <DialogTitle>New Patient Registration</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Complete the form below to register a new patient in the system.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto pr-4">
          <div className="space-y-6">
            
            <FormSection icon={User} title="Patient Demographics">
              <div className="grid grid-cols-2 gap-4">
                <FormField label="First Name" required>
                  <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="John" />
                </FormField>
                <FormField label="Last Name" required>
                  <Input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Doe" />
                </FormField>
                <FormField label="Date of Birth" required>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dateOfBirth && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateOfBirth ? format(dateOfBirth, "MM/dd/yyyy") : <span>mm/dd/yyyy</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dateOfBirth}
                        onSelect={setDateOfBirth}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormField>
                <FormField label="Gender" required>
                    <Select onValueChange={setGender} value={gender}>
                        <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                </FormField>
                <FormField label="Social Security Number">
                    <Input value={socialSecurity} onChange={(e) => setSocialSecurity(e.target.value)} placeholder="XXX-XX-XXXX" />
                </FormField>
                <FormField label="Marital Status">
                    <Select onValueChange={setMaritalStatus} value={maritalStatus}>
                        <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="single">Single</SelectItem>
                            <SelectItem value="married">Married</SelectItem>
                            <SelectItem value="divorced">Divorced</SelectItem>
                            <SelectItem value="widowed">Widowed</SelectItem>
                        </SelectContent>
                    </Select>
                </FormField>
              </div>
            </FormSection>

            <FormSection icon={Phone} title="Contact Information">
                <div className="grid grid-cols-2 gap-4">
                    <FormField label="Primary Phone" required>
                        <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(555) 123-4567" />
                    </FormField>
                     <FormField label="Email Address">
                        <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="patient@email.com" type="email" />
                    </FormField>
                     <FormField label="Street Address" required fullWidth>
                        <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="123 Main Street" />
                    </FormField>
                    <FormField label="City" required>
                        <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="New York" />
                    </FormField>
                     <FormField label="State" required>
                        <Input value={state} onChange={(e) => setState(e.target.value)} placeholder="NY" />
                    </FormField>
                     <FormField label="ZIP Code" required>
                        <Input value={zip} onChange={(e) => setZip(e.target.value)} placeholder="10001" />
                    </FormField>
                    <FormField label="Emergency Contact Name">
                        <Input value={emergencyContactName} onChange={(e) => setEmergencyContactName(e.target.value)} placeholder="Jane Doe" />
                    </FormField>
                    <FormField label="Emergency Contact Phone">
                        <Input value={emergencyContactPhone} onChange={(e) => setEmergencyContactPhone(e.target.value)} placeholder="(555) 987-6543" />
                    </FormField>
                </div>
            </FormSection>

            <FormSection icon={Briefcase} title="Insurance Information">
                <div className="grid grid-cols-2 gap-4">
                     <FormField label="Insurance Provider">
                        <Select onValueChange={setInsuranceProvider} value={insuranceProvider}>
                            <SelectTrigger><SelectValue placeholder="Select provider" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="provider1">BlueCross BlueShield</SelectItem>
                                <SelectItem value="provider2">Aetna</SelectItem>
                                <SelectItem value="provider3">United Healthcare</SelectItem>
                            </SelectContent>
                        </Select>
                    </FormField>
                    <FormField label="Policy Number">
                        <Input value={policyNumber} onChange={(e) => setPolicyNumber(e.target.value)} placeholder="ABC123456789" />
                    </FormField>
                    <FormField label="Group Number">
                        <Input value={groupNumber} onChange={(e) => setGroupNumber(e.target.value)} placeholder="GRP12345" />
                    </FormField>
                    <FormField label="Subscriber Name">
                        <Input value={subscriberName} onChange={(e) => setSubscriberName(e.target.value)} placeholder="If different from patient" />
                    </FormField>
                </div>
            </FormSection>

            <FormSection icon={ScrollText} title="Medical History">
                <p className="text-sm text-muted-foreground">This section can be expanded with fields for allergies, past surgeries, chronic conditions, etc.</p>
            </FormSection>

          </div>
        </div>
        <DialogFooter className="pt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Patient'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


function FormSection({ icon: Icon, title, children }: { icon: React.ElementType, title: string, children: React.ReactNode }) {
    return (
        <div className="space-y-4">
            <h3 className="flex items-center text-lg font-semibold text-foreground">
                <Icon className="mr-3 h-5 w-5 text-primary" />
                {title}
            </h3>
            <div className="pl-8">{children}</div>
        </div>
    )
}

function FormField({ label, required, fullWidth, children }: { label: string, required?: boolean, fullWidth?: boolean, children: React.ReactNode }) {
    return (
        <div className={cn("space-y-2", fullWidth && 'col-span-2')}>
            <Label className="text-foreground">
                {label} {required && <span className="text-destructive">*</span>}
            </Label>
            {children}
        </div>
    )
}
