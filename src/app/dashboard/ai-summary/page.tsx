'use client';
import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Search, Sparkles } from 'lucide-react';
import { useFirestore, useMemoFirebase } from '@/firebase';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, where, limit } from 'firebase/firestore';
import type { Patient, Condition, DrugExposure, ClinicalNote } from '@/lib/types';
import { summarizePatientChart } from '@/ai/flows/summarize-patient-flow';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';

export default function AiSummaryPage() {
    const firestore = useFirestore();
    const [searchTerm, setSearchTerm] = React.useState('Leila Richardson');
    const [activeSearch, setActiveSearch] = React.useState('Leila Richardson');
    const [summary, setSummary] = React.useState('');
    const [isGenerating, setIsGenerating] = React.useState(false);
    const [error, setError] = React.useState('');

    const patientQuery = useMemoFirebase(() => {
        if (!firestore || !activeSearch) return null;
        return query(collection(firestore, 'patients'), where('fullName', '==', activeSearch), limit(1));
    }, [firestore, activeSearch]);

    const { data: patientData, isLoading: isLoadingPatient } = useCollection<Patient>(patientQuery);
    const patient = patientData?.[0];
    
    const conditionsQuery = useMemoFirebase(() => {
        if (!firestore || !patient) return null;
        return collection(firestore, 'patients', patient.id, 'conditions');
    }, [firestore, patient]);
    const { data: conditions, isLoading: isLoadingConditions } = useCollection<Condition>(conditionsQuery);

    const medicationsQuery = useMemoFirebase(() => {
        if (!firestore || !patient) return null;
        return collection(firestore, 'patients', patient.id, 'drugExposures');
    }, [firestore, patient]);
    const { data: medications, isLoading: isLoadingMedications } = useCollection<DrugExposure>(medicationsQuery);
    
    const clinicalNotesQuery = useMemoFirebase(() => {
        if (!firestore || !patient) return null;
        return query(collection(firestore, 'patients', patient.id, 'clinicalNotes'), limit(5));
    }, [firestore, patient]);
    const { data: recentNotes, isLoading: isLoadingNotes } = useCollection<ClinicalNote>(clinicalNotesQuery);


    const handleSearch = () => {
        setActiveSearch(searchTerm);
        setSummary('');
        setError('');
    };

    const handleGenerateSummary = async () => {
        if (!patient) return;
        setIsGenerating(true);
        setSummary('');
        setError('');
        try {
            const summaryText = await summarizePatientChart({
                patient,
                conditions: conditions || [],
                medications: medications || [],
                recentNotes: recentNotes || [],
            });
            setSummary(summaryText);
        } catch (e: any) {
            setError('Failed to generate summary. Please try again.');
            console.error(e);
        } finally {
            setIsGenerating(false);
        }
    };

    const isLoading = isLoadingPatient || isLoadingConditions || isLoadingMedications || isLoadingNotes;

    return (
        <div className="flex flex-col h-full bg-slate-50 text-foreground">
            <DashboardHeader title="AI Patient Summary" description="Generate a clinical summary for any patient using GenAI." />
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <Card className="bg-white">
                    <CardHeader>
                        <CardTitle>Find a Patient</CardTitle>
                    </CardHeader>
                    <CardContent className="flex gap-2">
                        <Input 
                            placeholder="Enter patient name..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        <Button onClick={handleSearch}><Search className="mr-2 h-4 w-4" /> Search</Button>
                    </CardContent>
                </Card>

                {isLoading && activeSearch && (
                    <div className="flex justify-center items-center h-40">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                )}
                
                {patient && (
                    <Card className="bg-white">
                         <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                <span>Summary for {patient.fullName}</span>
                                <Button onClick={handleGenerateSummary} disabled={isGenerating}>
                                    {isGenerating ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <Sparkles className="mr-2 h-4 w-4" />
                                    )}
                                    Generate AI Summary
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {isGenerating && <p className="text-muted-foreground">Generating summary...</p>}
                            {error && <p className="text-destructive">{error}</p>}
                            {summary && (
                                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <p className="whitespace-pre-wrap">{summary}</p>
                                </div>
                            )}
                            {!summary && !isGenerating && !error && (
                                <div className="text-center text-muted-foreground py-10">
                                    <p>Click "Generate AI Summary" to create a clinical overview for this patient.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {!isLoading && !patient && activeSearch && (
                    <Card className="bg-white">
                        <CardContent className="p-6 text-center text-muted-foreground">
                            <p>No patient found for "{activeSearch}".</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
