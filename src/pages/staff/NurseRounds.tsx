import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, User, FileText, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

// Mock data for rounds (replace with real data schema later)
const UPCOMING_ROUNDS = [
    { id: 1, doctor: "Dr. Sarah Wilson", specialty: "Cardiology", time: "10:00 AM", ward: "Cardiology Wing A", patients: 5 },
    { id: 2, doctor: "Dr. James Miller", specialty: "Pediatrics", time: "11:30 AM", ward: "Pediatric Ward", patients: 8 },
    { id: 3, doctor: "Dr. Michael Chen", specialty: "Neurology", time: "02:00 PM", ward: "Neuro ICU", patients: 3 },
];

const DOCTOR_ADVICE = [
    { id: 1, patient: "John Doe", doctor: "Dr. Sarah Wilson", advice: "Monitor BP every 2 hours. Increase fluid intake.", timestamp: new Date().toISOString() },
    { id: 2, patient: "Jane Smith", doctor: "Dr. Michael Chen", advice: "Schedule MRI for tomorrow morning. Keep NPO after midnight.", timestamp: new Date(Date.now() - 3600000).toISOString() },
];

const NurseRounds = () => {
    return (
        <DashboardLayout
            title="Rounds & Advice"
            subtitle="Track doctor rounds and medical instructions."
        >
            <Tabs defaultValue="rounds" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="rounds">Doctor Rounds</TabsTrigger>
                    <TabsTrigger value="advice">Doctor Advice & Instructions</TabsTrigger>
                </TabsList>

                <TabsContent value="rounds" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {UPCOMING_ROUNDS.map((round) => (
                            <Card key={round.id} className="hover:shadow-md transition-all">
                                <CardHeader className="pb-3">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-2">
                                            <User className="h-5 w-5 text-primary" />
                                            <CardTitle className="text-base">{round.doctor}</CardTitle>
                                        </div>
                                        <Badge variant="outline">{round.specialty}</Badge>
                                    </div>
                                    <CardDescription>{round.ward}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Clock className="h-4 w-4 text-muted-foreground" />
                                            <span className="font-medium">Today at {round.time}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Users className="h-4 w-4 text-muted-foreground" />
                                            <span>{round.patients} Patients to visit</span>
                                        </div>
                                        <Button className="w-full" variant="secondary">
                                            View Patient List
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="advice">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Medical Advice</CardTitle>
                            <CardDescription>Instructions left by doctors for inpatient care.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {DOCTOR_ADVICE.map((item) => (
                                    <div key={item.id} className="flex gap-4 p-4 border rounded-lg bg-card/50">
                                        <div className="mt-1">
                                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                                                <FileText className="h-4 w-4" />
                                            </div>
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-semibold text-sm">{item.patient}</h4>
                                                <span className="text-xs text-muted-foreground">
                                                    {format(new Date(item.timestamp), "MMM d, h:mm a")}
                                                </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground">by {item.doctor}</p>
                                            <div className="mt-2 text-sm bg-muted/50 p-3 rounded-md">
                                                {item.advice}
                                            </div>
                                            <div className="pt-2 flex justify-end">
                                                <Button size="sm" variant="ghost" className="h-8 text-green-600 hover:text-green-700 hover:bg-green-50">
                                                    <CheckCircle className="w-3 h-3 mr-1" /> Acknowledge
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </DashboardLayout>
    );
};

// Start Icon helper
function Users({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    )
}

export default NurseRounds;
