
'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Search } from 'lucide-react';
import type { User } from '@/lib/schemas';
import { Loader2 } from 'lucide-react';

interface BillableProvidersTableProps {
    providers: User[] | null;
    isLoading: boolean;
}

export function BillableProvidersTable({ providers, isLoading }: BillableProvidersTableProps) {

  const getStatus = (provider: User) => {
    // Demo logic
    if(provider.displayName?.includes('Carter')) return { text: 'Active', variant: 'default' };
    if(provider.displayName?.includes('Stone')) return { text: 'Active', variant: 'default' };
    return { text: 'Pending Activation', variant: 'destructive' };
  }

  return (
    <Card className="bg-white">
      <CardHeader>
        <div className="flex items-center justify-between">
            <div>
                <CardTitle>Billable Providers Registry</CardTitle>
                <p className="text-sm text-muted-foreground">Ensure providers are correctly linked to payor billing codes before claims are submitted.</p>
            </div>
            <div className="flex items-center gap-2">
                 <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Search providers..." className="pl-10 bg-background" />
                </div>
                <Button>+ Add Provider</Button>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Provider Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Status</TableHead>
              <TableHead><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
                <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                        <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                    </TableCell>
                </TableRow>
            ) : providers && providers.length > 0 ? (
                providers.map((provider) => {
                    const status = getStatus(provider);
                    return (
                      <TableRow key={provider.uid}>
                        <TableCell className="font-medium">{provider.displayName}</TableCell>
                        <TableCell className="capitalize">{provider.role}</TableCell>
                        <TableCell className="capitalize">{provider.department || 'N/A'}</TableCell>
                        <TableCell>
                          <Badge variant={status.variant as any}>{status.text}</Badge>
                        </TableCell>
                        <TableCell>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                <DropdownMenuItem>Link to Payor</DropdownMenuItem>
                                <DropdownMenuItem>View Profile</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                })
            ) : (
                <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                        No providers found.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
