'use client';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { PlusCircle, CheckCircle2, AlertTriangle, MoreHorizontal, ShieldCheck, ShieldAlert, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Combobox } from '@/components/ui/combobox';
import { analyzeDrugInteractions, AnalyzeDrugInteractionsOutput } from '@/ai/flows/analyze-drug-interactions';
import { useToast } from '@/hooks/use-toast';
import { useDoc, useFirebase, useMemoFirebase, updateDocumentNonBlocking } from '@/firebase';
import { doc } from 'firebase/firestore';
import { allMedicationsList } from '@/lib/sample-data';


type MedicationStatus = 'Active' | 'On Hold' | 'Discontinued' | 'Unverified';

type Medication = {
  id: number;
  name: string;
  dosage: string;
  frequency: string;
  status: MedicationStatus;
};

// This represents all available medications in a pharmacy, for example.
// In a real app, this would also come from a database.
const allMedications = allMedicationsList;


export default function MedicationsPage() {
  const { firestore } = useFirebase();
  const { toast } = useToast();

  // For this demo, we'll hardcode the patient MRN. In a real app, this would be dynamic.
  const patientMrn = 'MRN-1001'; 

  const patientRef = useMemoFirebase(() => {
    if (!firestore || !patientMrn) return null;
    return doc(firestore, 'patients', patientMrn);
  }, [firestore, patientMrn]);

  const { data: patient, isLoading: isPatientLoading } = useDoc(patientRef);
  
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [newMedication, setNewMedication] = useState({ name: '', dosage: '', frequency: '' });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeDrugInteractionsOutput | null>(null);
  
  const medications = useMemo(() => (patient as any)?.medications || [], [patient]);

  const getStatusBadge = (status: MedicationStatus) => {
    switch (status) {
      case 'Active':
        return <Badge variant="default"><CheckCircle2 className="mr-1 h-3 w-3" />Active</Badge>;
      case 'On Hold':
        return <Badge variant="secondary">On Hold</Badge>;
      case 'Unverified':
        return <Badge variant="destructive"><AlertTriangle className="mr-1 h-3 w-3" />Unverified</Badge>;
      case 'Discontinued':
        return <Badge variant="outline">Discontinued</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  const handleAddMedication = async () => {
    if (!newMedication.name || !newMedication.dosage || !newMedication.frequency) {
        toast({ title: "Missing Information", description: "Please fill out all medication details.", variant: "destructive" });
        return;
    }
    
    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
        const currentMeds = medications.filter((m: Medication) => m.status === 'Active').map((m: Medication) => `${m.name} ${m.dosage}`);
        const result = await analyzeDrugInteractions({
            currentMedications: currentMeds,
            newMedication: `${newMedication.name} ${newMedication.dosage}`,
        });
        setAnalysisResult(result);
        
        if (result.riskLevel === 'None' && patientRef) {
            const newMed: Medication = { ...newMedication, id: medications.length + 1, status: 'Active' };
            updateDocumentNonBlocking(patientRef, { medications: [...medications, newMed] });
            toast({ title: "Medication Added", description: `${newMedication.name} added to the list.` });
            setAddDialogOpen(false);
        }

    } catch (error) {
        console.error("Interaction analysis failed:", error);
        toast({ title: "Analysis Failed", description: "Could not analyze drug interactions. Please try again.", variant: "destructive" });
    } finally {
        setIsAnalyzing(false);
    }
  };
  
  const confirmAddMedication = () => {
     if (patientRef) {
        const newMed: Medication = { ...newMedication, id: medications.length + 1, status: 'Active' };
        updateDocumentNonBlocking(patientRef, { medications: [...medications, newMed] });
        toast({ title: "Medication Added", description: `${newMedication.name} was added despite the warning.` });
        setAddDialogOpen(false);
        setAnalysisResult(null);
     }
  }

  const InteractionAnalysisResult = () => {
    if (isAnalyzing) {
        return (
            <div className="flex flex-col items-center justify-center gap-2 p-8 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin"/>
                <p>Analyzing interactions...</p>
            </div>
        )
    }
    
    if (!analysisResult) return null;

    const getRiskIcon = () => {
        switch(analysisResult.riskLevel) {
            case "High": return <ShieldAlert className="h-6 w-6 text-red-500" />;
            case "Moderate": return <ShieldAlert className="h-6 w-6 text-yellow-500" />;
            case "Low": return <ShieldCheck className="h-6 w-6 text-blue-500" />;
            case "None": return <ShieldCheck className="h-6 w-6 text-green-500" />;
        }
    }

    return (
        <div className="mt-4 space-y-4">
             <h3 className="font-semibold text-lg">Interaction Analysis Complete</h3>
            <Alert variant={analysisResult.riskLevel === 'High' ? 'destructive' : 'default'}>
                {getRiskIcon()}
                <AlertTitle>Risk Level: {analysisResult.riskLevel}</AlertTitle>
                <AlertDescription>{analysisResult.summary}</AlertDescription>
            </Alert>
            <p className="text-sm text-muted-foreground">{analysisResult.details}</p>
        </div>
    );
  }


  return (
    <div className="space-y-6 animate-fade-in">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight">
            Medication Reconciliation
          </h1>
          <p className="text-muted-foreground">
            Pharmacist: Dr. Alex Carter | Patient: {isPatientLoading ? '...' : (patient as any)?.name} | MRN: {patientMrn}
          </p>
        </div>
        <div className="mt-4 flex shrink-0 gap-2 md:mt-0">
            <Button variant="outline"><CheckCircle2 className="mr-2 h-4 w-4"/>Reconcile All</Button>
            <Button onClick={() => { setAnalysisResult(null); setNewMedication({ name: '', dosage: '', frequency: '' }); setAddDialogOpen(true); }}><PlusCircle className="mr-2 h-4 w-4"/>Add Medication</Button>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Current Medications</CardTitle>
            <CardDescription>List of medications recorded for the patient.</CardDescription>
          </CardHeader>
          <CardContent>
            {isPatientLoading ? (
                 <div className="flex items-center justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            ) : (
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Medication</TableHead>
                    <TableHead>Dosage</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead><span className="sr-only">Actions</span></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {medications.map((med: Medication) => (
                    <TableRow key={med.id} className="transition-colors hover:bg-secondary/50">
                        <TableCell className="font-medium">{med.name}</TableCell>
                        <TableCell>{med.dosage}</TableCell>
                        <TableCell>{med.frequency}</TableCell>
                        <TableCell>{getStatusBadge(med.status)}</TableCell>
                        <TableCell>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                            <DropdownMenuItem>Verify</DropdownMenuItem>
                            <DropdownMenuItem>Put on Hold</DropdownMenuItem>
                            <DropdownMenuItem>Discontinue</DropdownMenuItem>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            )}
          </CardContent>
        </Card>
      </div>

       <Dialog open={isAddDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Medication</DialogTitle>
            <DialogDescription>
              Enter new medication details to check for interactions before adding.
            </DialogDescription>
          </DialogHeader>
          
          {!analysisResult ? (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="med-name">Medication Name</Label>
                <Combobox
                    items={allMedications}
                    value={newMedication.name}
                    onChange={(value) => setNewMedication(prev => ({...prev, name: allMedications.find(m => m.value === value)?.label || ''}))}
                    placeholder="Select medication..."
                    searchPlaceholder="Search medications..."
                    notfoundtext="No medications found."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="med-dosage">Dosage</Label>
                <Input id="med-dosage" placeholder="e.g., 100mg" value={newMedication.dosage} onChange={(e) => setNewMedication(prev => ({...prev, dosage: e.target.value}))}/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="med-frequency">Frequency</Label>
                <Input id="med-frequency" placeholder="e.g., Twice daily" value={newMedication.frequency} onChange={(e) => setNewMedication(prev => ({...prev, frequency: e.target.value}))}/>
              </div>
            </div>
           ) : (
             <InteractionAnalysisResult />
           )}

          <DialogFooter>
            {analysisResult && analysisResult.riskLevel !== 'None' ? (
                 <div className="w-full flex flex-col sm:flex-row-reverse gap-2">
                    <Button type="button" onClick={confirmAddMedication}>Add Anyway</Button>
                    <Button type="button" variant="outline" onClick={() => setAnalysisResult(null)}>Go Back & Edit</Button>
                 </div>
            ) : (
                <Button type="button" onClick={handleAddMedication} disabled={isAnalyzing}>
                    {isAnalyzing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Analyzing...</> : 'Analyze & Add'}
                </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
