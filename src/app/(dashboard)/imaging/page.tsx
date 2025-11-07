'use client';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useCollection, useFirebase, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { ImagingStudy } from '@/lib/sample-data';


export default function ImagingPage() {
  const { firestore } = useFirebase();

  const studiesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'imagingStudies');
  }, [firestore]);

  const { data: studies, isLoading } = useCollection<ImagingStudy>(studiesQuery);

  return (
    <div className="space-y-6 animate-fade-in">
      <header>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Imaging Archive
        </h1>
        <p className="text-muted-foreground">
          Search and view DICOM-compatible medical images.
        </p>
      </header>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by patient, study, or date..." className="pl-9" />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>

        {isLoading ? (
            <div className="flex items-center justify-center p-16">
              <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {(studies || []).map((study) => (
                study && study.imageUrl && <Card key={study.id} className="overflow-hidden group hover:shadow-xl transition-shadow duration-300">
                    <CardContent className="p-0">
                    <div className="relative aspect-[4/5] bg-secondary">
                        <Image
                        src={study.imageUrl}
                        alt={study.description || study.study}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        data-ai-hint={study.imageHint}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <Badge variant="secondary" className="absolute top-2 right-2">{study.date}</Badge>
                    </div>
                    </CardContent>
                    <CardFooter className="flex-col items-start p-4">
                    <p className="font-semibold">{study.study}</p>
                    <p className="text-sm text-muted-foreground">Patient: {study.patient}</p>
                    </CardFooter>
                </Card>
                ))}
            </div>
        )}
    </div>
  );
}
