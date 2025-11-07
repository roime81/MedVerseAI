'use client';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type ClaimStatus = 'active' | 'cancelled' | 'draft' | 'entered-in-error';

type Claim = {
  id: string;
  patient: string;
  created: string;
  total: number;
  provider: string;
  status: ClaimStatus;
};

const claimsData: Claim[] = [
  {
    id: 'CL-001284',
    patient: 'Jane Doe',
    created: '2024-07-22',
    total: 450.75,
    provider: 'Blue Shield PPO',
    status: 'active',
  },
  {
    id: 'CL-001283',
    patient: 'Jane Doe',
    created: '2024-06-15',
    total: 125.0,
    provider: 'Blue Shield PPO',
    status: 'active',
  },
  {
    id: 'CL-001280',
    patient: 'Jane Doe',
    created: '2024-05-30',
    total: 890.5,
    provider: 'Blue Shield PPO',
    status: 'cancelled',
  },
   {
    id: 'CL-001279',
    patient: 'Jane Doe',
    created: '2024-05-1',
    total: 75.00,
    provider: 'Blue Shield PPO',
    status: 'draft',
  },
];

const getStatusBadge = (status: ClaimStatus) => {
    switch (status) {
      case 'active':
        return <Badge variant="default">Active</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>;
       case 'entered-in-error':
        return <Badge variant="outline">Error</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };


export default function BillingPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <header className="flex items-center justify-between">
        <div>
            <h1 className="font-headline text-3xl font-bold tracking-tight">
            Billing & Claims
            </h1>
            <p className="text-muted-foreground">
            View and manage patient billing, coverage, and claims.
            </p>
        </div>
        <Button>
            <FileText className="mr-2 h-4 w-4" />
            New Claim
        </Button>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Recent Claims</CardTitle>
          <CardDescription>
            Overview of recent claims for Patient: Jane Doe.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Claim ID</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {claimsData.map((claim) => (
                <TableRow key={claim.id}>
                  <TableCell className="font-medium">{claim.id}</TableCell>
                  <TableCell>{claim.patient}</TableCell>
                  <TableCell>{claim.created}</TableCell>
                  <TableCell>{claim.provider}</TableCell>
                  <TableCell>${claim.total.toFixed(2)}</TableCell>
                  <TableCell>
                    {getStatusBadge(claim.status)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Claim</DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Cancel</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
