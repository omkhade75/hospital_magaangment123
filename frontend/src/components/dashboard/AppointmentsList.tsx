import { Clock, User, Stethoscope } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const appointments = [
  {
    id: 1,
    patient: "John Smith",
    doctor: "Dr. Sarah Wilson",
    time: "09:00 AM",
    type: "General Checkup",
    status: "confirmed",
  },
  {
    id: 2,
    patient: "Emily Davis",
    doctor: "Dr. Michael Chen",
    time: "10:30 AM",
    type: "Cardiology",
    status: "pending",
  },
  {
    id: 3,
    patient: "Robert Johnson",
    doctor: "Dr. Lisa Anderson",
    time: "11:00 AM",
    type: "Orthopedics",
    status: "confirmed",
  },
  {
    id: 4,
    patient: "Maria Garcia",
    doctor: "Dr. James Miller",
    time: "02:00 PM",
    type: "Neurology",
    status: "in-progress",
  },
  {
    id: 5,
    patient: "David Brown",
    doctor: "Dr. Sarah Wilson",
    time: "03:30 PM",
    type: "General Checkup",
    status: "confirmed",
  },
];

const statusStyles = {
  confirmed: "bg-success/10 text-success border-success/20",
  pending: "bg-warning/10 text-warning border-warning/20",
  "in-progress": "bg-info/10 text-info border-info/20",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
};

const AppointmentsList = () => {
  return (
    <div className="bg-card rounded-xl card-shadow border border-border/50 animate-fade-in">
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-heading font-semibold text-foreground">
          Today's Appointments
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          {appointments.length} appointments scheduled
        </p>
      </div>
      <div className="divide-y divide-border">
        {appointments.map((apt) => (
          <div
            key={apt.id}
            className="p-4 hover:bg-muted/50 transition-colors duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-secondary text-secondary-foreground text-sm font-medium">
                    {apt.patient
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-foreground">{apt.patient}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Stethoscope className="w-3 h-3 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {apt.doctor}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-sm text-foreground">
                  <Clock className="w-3 h-3" />
                  {apt.time}
                </div>
                <Badge
                  variant="outline"
                  className={cn("mt-1 capitalize", statusStyles[apt.status as keyof typeof statusStyles])}
                >
                  {apt.status}
                </Badge>
              </div>
            </div>
            <div className="mt-2">
              <Badge variant="secondary" className="text-xs">
                {apt.type}
              </Badge>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-border">
        <button className="w-full text-center text-sm font-medium text-primary hover:text-primary/80 transition-colors">
          View All Appointments →
        </button>
      </div>
    </div>
  );
};

export default AppointmentsList;
