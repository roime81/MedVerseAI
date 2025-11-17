
'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Patient, OrderSet, CommonOrder, LabResult } from '@/lib/types';
import { Search, Package, Star, Clock, Beaker, Loader2, CheckCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFirestore, useMemoFirebase } from '@/firebase';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, limit, orderBy } from 'firebase/firestore';
import { cn } from '@/lib/utils';


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

export function NewOrderDialog({ open, onOpenChange, patient }: NewOrderDialogProps) {
  const firestore = useFirestore();
  const [selectedOrders, setSelectedOrders] = React.useState<CommonOrder[]>([]);

  const orderSetsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'orderSets'));
  }, [firestore]);
  const { data: orderSets, isLoading: isLoadingOrderSets } = useCollection<OrderSet>(orderSetsQuery);

  const commonOrdersQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'commonOrders'));
  }, [firestore]);
  const { data: commonOrders, isLoading: isLoadingCommonOrders } = useCollection<CommonOrder>(commonOrdersQuery);
  
  const recentLabsQuery = useMemoFirebase(() => {
    if (!firestore || !patient) return null;
    return query(collection(firestore, 'patients', patient.personId, 'labResults'), orderBy('resultDate', 'desc'), limit(3));
  }, [firestore, patient]);
  const { data: recentLabs, isLoading: isLoadingRecentLabs } = useCollection<LabResult>(recentLabsQuery);

  const handleToggleOrder = (order: CommonOrder) => {
    setSelectedOrders(prev => 
      prev.find(o => o.orderId === order.orderId)
        ? prev.filter(o => o.orderId !== order.orderId)
        : [...prev, order]
    );
  };
  
  const isOrderSelected = (order: CommonOrder) => {
    return selectedOrders.some(o => o.orderId === order.orderId);
  }

  React.useEffect(() => {
    if (!open) {
      setSelectedOrders([]);
    }
  }, [open]);


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
        <div className="p-6 flex-1 flex flex-col gap-6 bg-slate-50 overflow-y-auto pb-48">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search for labs, imaging, medications, procedures..." className="pl-10 h-12 text-base bg-white" />
            </div>

            <section>
                <h2 className="text-lg font-semibold flex items-center mb-3 text-foreground">
                    <Package className="mr-2 h-5 w-5 text-muted-foreground" />
                    Order Sets
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {isLoadingOrderSets ? (
                        <Loader2 className="h-5 w-5 animate-spin"/>
                    ) : orderSets?.map((orderSet) => (
                         <Card key={orderSet.id} className="p-4 flex items-start gap-4 bg-white cursor-pointer hover:border-primary border-2 border-transparent transition-colors">
                            <div className="p-2 bg-blue-100 rounded-md">
                                <Beaker className="h-5 w-5 text-blue-600"/>
                            </div>
                            <div>
                                <p className="font-semibold text-foreground">{orderSet.name}</p>
                                <span className="text-sm text-muted-foreground">{orderSet.orderCount} orders</span>
                            </div>
                        </Card>
                    ))}
                </div>
            </section>
            
            <section>
                <h2 className="text-lg font-semibold flex items-center mb-3 text-foreground">
                    <Star className="mr-2 h-5 w-5 text-muted-foreground" />
                    Common Orders
                </h2>
                 {isLoadingCommonOrders ? (
                    <Loader2 className="h-5 w-5 animate-spin"/>
                 ) : (
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                        {commonOrders?.map(order => (
                            <Button
                                key={order.id}
                                variant="outline"
                                className={cn(
                                    "justify-between bg-white hover:bg-slate-100 h-12 text-base font-normal",
                                    isOrderSelected(order) && "border-green-500 ring-2 ring-green-500/20 text-green-700 font-semibold"
                                )}
                                onClick={() => handleToggleOrder(order)}
                            >
                                <span>{order.name}</span>
                                {isOrderSelected(order) && <CheckCircle className="h-5 w-5 text-green-500" />}
                            </Button>
                        ))}
                    </div>
                 )}
            </section>

             <section>
                <h2 className="text-lg font-semibold flex items-center mb-3 text-foreground">
                    <Clock className="mr-2 h-5 w-5 text-muted-foreground" />
                    Recent Results (for comparison)
                </h2>
                 <div className="bg-white rounded-lg border p-4 space-y-3">
                    {isLoadingRecentLabs ? (
                        <Loader2 className="h-5 w-5 animate-spin"/>
                    ) : recentLabs && recentLabs.length > 0 ? (
                        recentLabs.map(lab => (
                            <div key={lab.id} className="flex justify-between items-center text-base">
                                <p className="text-muted-foreground">{lab.testCode}</p>
                                <p className={cn(
                                    "font-semibold",
                                     lab.resultFlag === 'High' ? 'text-destructive' : 'text-foreground'
                                 )}>
                                    {lab.resultValue}
                                </p>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">No recent lab results found.</p>
                    )}
                 </div>
            </section>
        </div>
        
        {selectedOrders.length > 0 && (
             <div className="absolute bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg-top">
                <div className="mb-4">
                    <h3 className="font-semibold mb-2">Selected Orders ({selectedOrders.length})</h3>
                    <div className="max-h-28 overflow-y-auto space-y-2">
                        {selectedOrders.map(order => (
                            <div key={order.orderId} className="flex justify-between items-center p-2 rounded-md bg-green-50 border border-green-200">
                                <span className="font-medium text-green-800">{order.name}</span>
                                <Button variant="ghost" size="icon" className="h-6 w-6 text-green-600 hover:bg-green-100" onClick={() => handleToggleOrder(order)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
                <DialogFooter className="border-t pt-4 flex justify-between">
                     <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                     <Button className="w-full sm:w-auto" onClick={() => onOpenChange(false)}>
                         <CheckCircle className="mr-2 h-4 w-4" />
                         Submit Orders ({selectedOrders.length})
                     </Button>
                </DialogFooter>
             </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
