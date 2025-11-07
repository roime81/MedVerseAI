'use client';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { ArrowDown, ArrowUp, User, Users, BedDouble, HeartPulse, Hospital as HospitalIcon } from 'lucide-react';

const genderData = [
  { name: 'Female', value: 120, fill: 'hsl(var(--primary))' },
  { name: 'Male', value: 139, fill: 'hsl(var(--secondary))' },
];

const divisionData = [
    { name: 'Cardiology', value: 45 },
    { name: 'Orthopedics', value: 35 },
    { name: 'Neurology', value: 28 },
    { name: 'Oncology', value: 52 },
    { name: 'Pediatrics', value: 18 },
    { name: 'Other', value: 81 },
];

const ageData = [
  { name: '18-30', value: 26, fill: '#8884d8' },
  { name: '31-45', value: 65, fill: '#82ca9d' },
  { name: '46-60', value: 109, fill: '#ffc658' },
  { name: '61-75', value: 36, fill: '#ff8042' },
  { name: '>75', value: 13, fill: '#d0ed57' },
];

const waitTimeData = [
    { division: 'Cardiology', time: 18.5 },
    { division: 'Obstetrics', time: 12.2 },
    { division: 'Other', time: 14.8 },
    { division: 'Oncology', time: 15.3 },
    { division: 'Telemetry', time: 13.1 },
    { division: 'Orthopedics', time: 11.5 },
];


export default function Patient360Page() {
  return (
    <div className="space-y-6 animate-fade-in">
      <header>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Patient Record Details
        </h1>
        <p className="text-muted-foreground">
          Aggregated analytics dashboard for patient population health.
        </p>
      </header>

      <Card>
        <CardContent className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Date Period</label>
            <Select defaultValue="feb-2017">
              <SelectTrigger><SelectValue/></SelectTrigger>
              <SelectContent>
                <SelectItem value="feb-2017">Feb 2017</SelectItem>
                <SelectItem value="mar-2017">Mar 2017</SelectItem>
              </SelectContent>
            </Select>
          </div>
           <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Hospital</label>
            <Select defaultValue="all">
              <SelectTrigger><SelectValue/></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
              </SelectContent>
            </Select>
          </div>
           <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Division</label>
            <Select defaultValue="all">
              <SelectTrigger><SelectValue/></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Physicians</label>
            <Select defaultValue="all">
              <SelectTrigger><SelectValue/></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Patient Name</label>
            <Select defaultValue="all">
              <SelectTrigger><SelectValue/></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
              </SelectContent>
            </Select>
          </div>
           <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Surgical Specialty</label>
            <Select defaultValue="all">
              <SelectTrigger><SelectValue/></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-12 gap-6">
        {/* KPI Column */}
        <div className="col-span-12 lg:col-span-2 space-y-6">
            <Card>
                <CardHeader className="p-4">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Patients</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                    <p className="text-3xl font-bold">259</p>
                    <p className="text-xs text-muted-foreground flex items-center text-red-500">
                        <ArrowDown className="h-3 w-3 mr-1" />
                        -14.24% from last month (302)
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="p-4">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Patients in ICU</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                    <p className="text-3xl font-bold">15</p>
                     <p className="text-xs text-muted-foreground flex items-center text-red-500">
                        <ArrowDown className="h-3 w-3 mr-1" />
                        -6.25% from last month (16)
                    </p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="p-4">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Died</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                    <p className="text-3xl font-bold">3</p>
                     <p className="text-xs text-muted-foreground flex items-center text-red-500">
                        <ArrowDown className="h-3 w-3 mr-1" />
                        -50% from last month (6)
                    </p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="p-4">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Re-admit Patients</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                    <p className="text-3xl font-bold">18</p>
                     <p className="text-xs text-muted-foreground flex items-center text-red-500">
                        <ArrowDown className="h-3 w-3 mr-1" />
                        -5.26% from last month (19)
                    </p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="p-4">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Avg Days of Discharge</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                    <p className="text-3xl font-bold">8</p>
                     <p className="text-xs text-muted-foreground flex items-center text-green-500">
                        <ArrowUp className="h-3 w-3 mr-1" />
                        +60% from last month (5)
                    </p>
                </CardContent>
            </Card>
        </div>

        {/* Charts Column */}
        <div className="col-span-12 lg:col-span-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Patients by Gender</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
                 <div className="flex items-end gap-8 text-center">
                    <div>
                        <User className="h-20 w-20 mx-auto text-primary" />
                        <p className="font-bold text-2xl mt-2">120</p>
                        <p className="text-sm text-muted-foreground">Female</p>
                    </div>
                    <div>
                        <Users className="h-24 w-24 mx-auto text-secondary" />
                        <p className="font-bold text-2xl mt-2">139</p>
                        <p className="text-sm text-muted-foreground">Male</p>
                    </div>
                </div>
            </CardContent>
          </Card>

          <Card className="col-span-1">
             <CardHeader>
              <CardTitle>Patients by Hospital</CardTitle>
            </CardHeader>
            <CardContent className="h-[250px] flex flex-col items-center justify-center">
                 <HospitalIcon className="h-24 w-24 text-primary" />
                 <p className="font-bold text-4xl mt-2">259</p>
                 <p className="text-sm text-muted-foreground mt-1">City General Hospital</p>
            </CardContent>
          </Card>
          
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Patients by Age Group</CardTitle>
            </CardHeader>
            <CardContent className="h-[250px]">
              <ChartContainer config={{}} className="h-full w-full">
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Pie data={ageData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                     {ageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartLegend content={<ChartLegendContent />} />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Patients by Division</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
               <ChartContainer config={{}} className="h-full w-full">
                <BarChart data={divisionData} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid horizontal={false} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line"/>} />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={4} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="col-span-1 md:col-span-2 lg:col-span-3">
             <CardHeader>
              <CardTitle>Average Waiting Time by Division (Minutes)</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ChartContainer config={{}} className="h-full w-full">
                <BarChart data={waitTimeData} layout="vertical" margin={{ left: 30, right: 30 }}>
                    <CartesianGrid horizontal={false} />
                    <XAxis type="number" dataKey="time" />
                    <YAxis dataKey="division" type="category" tickLine={false} axisLine={false} width={80} />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                    <Bar dataKey="time" fill="hsl(var(--primary))" radius={4} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
