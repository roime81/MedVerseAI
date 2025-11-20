
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  FileClock,
  ShieldAlert,
  Hospital,
  ShieldCheck,
  CheckSquare,
  BarChart,
  UserCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { CliniciansBySpecialtyChart } from '@/components/dashboard/medical-affairs/clinicians-by-specialty-chart';
import { MultiFacilityStaffDistributionChart } from '@/components/dashboard/medical-affairs/multi-facility-staff-distribution-chart';

const StatCard = ({ icon: Icon, title, value, footer, cardClassName, iconClassName }) => (
  <Card className={cn("bg-white", cardClassName)}>
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
           <div className={cn("p-3 rounded-md", iconClassName)}>
                <Icon className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
                <p className="text-sm font-medium text-muted-foreground">{title}</p>
                <p className="text-2xl font-bold text-foreground">{value}</p>
            </div>
        </div>
      </div>
      {footer && <p className="text-xs text-muted-foreground mt-2">{footer}</p>}
    </CardContent>
  </Card>
);

const clinicalApprovals = [
  {
    id: 'REQ-2025-0124',
    user: 'DR. Sarah Mitchell',
    specialty: 'Cardiology',
    request: 'Additional facility access',
    facility: 'Hospital B - East Wing',
    privileges: 'Coverage for cardiology emergencies or leave policy',
    submittedBy: 'HOD - Cardiology',
    priority: 'high',
  },
  {
    id: 'REQ-2025-0218',
    user: 'DR. James Wilson',
    specialty: 'Emergency Medicine',
    request: 'Privilege request',
    facility: 'Hospital A - Main Campus',
    privileges: 'Delineated privileges for advanced invasive procedures',
    submittedBy: 'HOD - Emergency',
    priority: 'medium',
  }
];

const privilegeReviews = [
    { name: 'Dr. Emily Carter', specialty: 'Cardiology', type: 'Annual Privilege Renewal', due: 'due 2025-11-20' },
    { name: 'Dr. Michael Renn', specialty: 'Orthopedic Surgery', type: 'Special Privilege Re-assessment', due: 'due 2025-11-28' },
]


export default function MedicalAffairsDashboard() {
    return (
        <div className="flex flex-col h-full bg-[#F8F9FA] text-foreground">
            <div className="p-6">
                <h1 className="text-2xl font-bold text-foreground">Medical Affairs & Clinical Governance Portal</h1>
                <p className="text-muted-foreground">Clinical oversight, privileging, and multi-facility coordination</p>
            </div>
            <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6">
                {/* Stat Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard 
                        icon={Users} 
                        title="Total Clinicians" 
                        value="287"
                        footer="+5 this credentialing period"
                        cardClassName="border-blue-200"
                        iconClassName="bg-blue-600"
                    />
                    <StatCard 
                        icon={FileClock} 
                        title="Pending Approvals" 
                        value="9"
                        footer="+7 this review period"
                        cardClassName="border-yellow-300"
                        iconClassName="bg-yellow-500"
                    />
                    <StatCard 
                        icon={ShieldAlert} 
                        title="Clinical Governance Issues" 
                        value="14"
                        footer="0 issues reported"
                        cardClassName="border-red-300"
                        iconClassName="bg-red-600"
                    />
                    <StatCard 
                        icon={Hospital} 
                        title="Multi-Facility Access" 
                        value="84"
                        footer="+2 this review period"
                        cardClassName="border-purple-300"
                        iconClassName="bg-purple-600"
                    />
                </div>

                {/* Clinical Approvals Required */}
                <Card className="bg-blue-50/50 border-blue-200">
                    <CardHeader className="flex-row justify-between items-center pb-4">
                        <CardTitle className="flex items-center text-sm font-semibold text-blue-800">
                            <ShieldCheck className="mr-2 h-4 w-4" />
                            Clinical Approvals Required
                            <Badge variant="default" className="ml-2 bg-blue-200 text-blue-800">{clinicalApprovals.length}</Badge>
                        </CardTitle>
                        <Button variant="link" size="sm" className="text-blue-800">View All Requests</Button>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {clinicalApprovals.map((item) => (
                            <div key={item.id} className="p-4 rounded-lg border bg-white">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <p className="font-semibold text-foreground">{item.id} - {item.user}</p>
                                        <Badge variant={item.priority === 'high' ? 'destructive' : 'secondary'} className={cn('capitalize', item.priority === 'medium' && 'bg-yellow-200 text-yellow-800')}>{item.priority}</Badge>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" size="sm">Review Details</Button>
                                        <Button size="sm">Approve</Button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-2 text-sm">
                                    <p><span className="font-medium text-muted-foreground">Specialty:</span> {item.specialty}</p>
                                    <p><span className="font-medium text-muted-foreground">Request:</span> {item.request}</p>
                                    <p><span className="font-medium text-muted-foreground">Facility:</span> {item.facility}</p>
                                    <p><span className="font-medium text-muted-foreground">Privileges:</span> {item.privileges}</p>
                                </div>
                                <p className="text-xs text-muted-foreground mt-3">Submitted by {item.submittedBy}</p>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Privilege Reviews Due */}
                <Card className="bg-orange-50/50 border-orange-200">
                    <CardHeader className="flex-row justify-between items-center pb-4">
                        <CardTitle className="flex items-center text-sm font-semibold text-orange-800">
                            <CheckSquare className="mr-2 h-4 w-4" />
                            Privilege Reviews Due
                            <Badge variant="destructive" className="ml-2 bg-orange-200 text-orange-800">{privilegeReviews.length}</Badge>
                        </CardTitle>
                        <Button variant="link" size="sm" className="text-orange-800">View All Reviews</Button>
                    </CardHeader>
                    <CardContent className="space-y-3">
                         {privilegeReviews.map((item) => (
                            <div key={item.name} className="p-4 rounded-lg border bg-white flex justify-between items-center">
                                <div>
                                    <p className="font-semibold text-foreground">{item.name}</p>
                                    <p className="text-sm text-muted-foreground">{item.specialty} • {item.type}</p>
                                    <p className="text-xs text-red-600 font-medium mt-1">{item.due.toUpperCase()}</p>
                                </div>
                                <Button size="sm">Start Review</Button>
                            </div>
                         ))}
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Clinicians by Specialty */}
                    <Card className="bg-white">
                        <CardHeader>
                            <CardTitle>Clinicians by Specialty</CardTitle>
                            <p className="text-sm text-muted-foreground">Distribution across clinical departments</p>
                        </CardHeader>
                        <CardContent>
                            <CliniciansBySpecialtyChart />
                        </CardContent>
                    </Card>

                    {/* Multi-facility Staff Distribution */}
                    <Card className="bg-white">
                        <CardHeader>
                            <CardTitle>Multi-facility Staff Distribution</CardTitle>
                             <p className="text-sm text-muted-foreground">Staff access across all facilities</p>
                        </CardHeader>
                        <CardContent>
                            <MultiFacilityStaffDistributionChart />
                        </CardContent>
                    </Card>
                </div>
                
                {/* Quick Actions */}
                <Card className="bg-white">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                         <p className="text-sm text-muted-foreground">Common governance and oversight tasks</p>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Button variant="outline" className="flex-col h-24 text-foreground"><CheckSquare className="mb-2 h-6 w-6"/>Clinical Approvals</Button>
                        <Button variant="outline" className="flex-col h-24 text-foreground"><UserCheck className="mb-2 h-6 w-6"/>Physician Directory</Button>
                        <Button variant="outline" className="flex-col h-24 text-foreground"><Hospital className="mb-2 h-6 w-6"/>Multi-facility access</Button>
                        <Button variant="outline" className="flex-col h-24 text-foreground"><BarChart className="mb-2 h-6 w-6"/>Clinical Reports</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

    