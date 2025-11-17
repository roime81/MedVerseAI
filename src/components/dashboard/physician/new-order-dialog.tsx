'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Patient } from '@/lib/types';
import { Search, Package, Star, Clock, Beaker } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface NewOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patient: Patient;
}

const calculateAge = (dob: string) => {
    if (!dob) return '';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

const commonOrders = [
    { name: 'CBC' }, { name: 'CMP' },
    { name: 'Chest X-Ray' }, { name: 'ECG - 12 Lead' },
    { name: 'Urinalysis' }, { name: 'CT Head without contrast' },
    { name: 'Troponin I' }, { name: 'D-Dimer' },
    { name: 'Lactate' }, { name: 'Blood Cultures' }
];

export function NewOrderDialog({ open, onOpenChange, patient }: NewOrderDialogProps) {

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[90vh] flex flex-col p-0 gap-0">
        <div className="bg-[#1A73E8] text-white p-6 rounded-t-lg">
            <DialogHeader>
                <DialogTitle className="text-2xl font-bold">New Order</DialogTitle>
                <p className="text-sm text-blue-200">
                    {patient.fullName} • {calculateAge(patient.dateOfBirth)}Y {patient.gender?.charAt(0)} • MRN-{patient.nationalId?.slice(-6)}
                </p>
            </DialogHeader>
        </div>
        <div className="p-6 flex-1 flex flex-col gap-6 bg-slate-50 overflow-y-auto">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search for labs, imaging, medications, procedures..." className="pl-10 h-12 text-base" />
            </div>

            <section>
                <h2 className="text-lg font-semibold flex items-center mb-3 text-foreground">
                    <Package className="mr-2 h-5 w-5 text-muted-foreground" />
                    Order Sets
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-4 flex items-start gap-4 bg-white cursor-pointer hover:border-primary border-2 border-primary/50 transition-colors">
                        <div className="p-2 bg-blue-100 rounded-md">
                            <Beaker className="h-5 w-5 text-blue-600"/>
                        </div>
                        <div>
                            <p className="font-semibold text-primary">ED Chest Pain Protocol</p>
                            <span className="text-sm text-muted-foreground">8 orders</span>
                        </div>
                    </Card>
                     <Card className="p-4 flex items-start gap-4 bg-white cursor-pointer hover:border-primary border-2 border-transparent transition-colors">
                        <div className="p-2 bg-blue-100 rounded-md">
                            <Beaker className="h-5 w-5 text-blue-600"/>
                        </div>
                        <div>
                            <p className="font-semibold text-foreground">Sepsis Bundle</p>
                            <span className="text-sm text-muted-foreground">8 orders</span>
                        </div>
                    </Card>
                     <Card className="p-4 flex items-start gap-4 bg-white cursor-pointer hover:border-primary border-2 border-transparent transition-colors">
                        <div className="p-2 bg-blue-100 rounded-md">
                            <Beaker className="h-5 w-5 text-blue-600"/>
                        </div>
                        <div>
                            <p className="font-semibold text-foreground">Abdominal Pain Workup</p>
                            <span className="text-sm text-muted-foreground">7 orders</span>
                        </div>
                    </Card>
                </div>
            </section>
            
            <section>
                <h2 className="text-lg font-semibold flex items-center mb-3 text-foreground">
                    <Star className="mr-2 h-5 w-5 text-muted-foreground" />
                    Common Orders
                </h2>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    {commonOrders.map(order => (
                        <Button key={order.name} variant="outline" className="justify-start bg-white hover:bg-slate-100 h-12 text-base font-normal">
                           {order.name}
                        </Button>
                    ))}
                </div>
            </section>

             <section>
                <h2 className="text-lg font-semibold flex items-center mb-3 text-foreground">
                    <Clock className="mr-2 h-5 w-5 text-muted-foreground" />
                    Recent Results (for comparison)
                </h2>
                 <div className="bg-white rounded-lg border p-4 space-y-3">
                    <div className="flex justify-between items-center text-base">
                        <p className="text-muted-foreground">Troponin I</p>
                        <p className="font-semibold text-destructive">2.8 <span className="text-sm text-muted-foreground">ng/mL</span></p>
                    </div>
                     <div className="flex justify-between items-center text-base">
                        <p className="text-muted-foreground">BNP</p>
                        <p className="font-semibold text-destructive">450 <span className="text-sm text-muted-foreground">pg/mL</span></p>
                    </div>
                     <div className="flex justify-between items-center text-base">
                        <p className="text-muted-foreground">Creatinine</p>
                        <p className="font-semibold text-destructive">1.8 <span className="text-sm text-muted-foreground">mg/dL</span></p>
                    </div>
                 </div>
            </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
