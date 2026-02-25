import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Heart,
  AlertTriangle,
  Clock,
  MessageSquare,
  CheckCircle,
  XCircle,
  Eye,
  BarChart3,
  TrendingUp,
  Activity,
  LogOut,
  Bell,
  Loader2,
  RefreshCw,
  Shield,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

type CrisisAlert = {
  id: string;
  pseudo_user_id: string;
  risk_level: "high" | "medium";
  primary_feeling: string;
  message_preview: string;
  created_at: string;
  status: "pending" | "acknowledged" | "resolved";
};

// 🔴 Dummy AI detected crisis alerts
const dummyAlerts: CrisisAlert[] = [
  {
    id: "1",
    pseudo_user_id: "USR_1021",
    risk_level: "high",
    primary_feeling: "hopeless",
    message_preview: "I feel like there is no reason to continue anymore.",
    created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    status: "pending",
  },
  {
    id: "2",
    pseudo_user_id: "USR_1045",
    risk_level: "medium",
    primary_feeling: "anxiety",
    message_preview: "I am feeling extremely anxious and can't sleep.",
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    status: "pending",
  },
  {
    id: "3",
    pseudo_user_id: "USR_1102",
    risk_level: "high",
    primary_feeling: "lonely",
    message_preview: "Nobody understands me. I feel completely alone.",
    created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    status: "acknowledged",
  },
  {
    id: "4",
    pseudo_user_id: "USR_1208",
    risk_level: "medium",
    primary_feeling: "stress",
    message_preview: "Too much pressure from work, I feel overwhelmed.",
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    status: "resolved",
  }
];

const TherapistDashboard = () => {

  const navigate = useNavigate();
  const [alerts, setAlerts] = useState<CrisisAlert[]>(dummyAlerts);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<CrisisAlert | null>(null);
  const [riskFilter, setRiskFilter] = useState<"all" | "high" | "medium">("all");
  const [therapistEmail, setTherapistEmail] = useState<string | null>(null);

  useEffect(() => {
    const session = localStorage.getItem("therapist_session");
    if (!session) {
      navigate("/therapist");
      return;
    }
    const parsed = JSON.parse(session);
    setTherapistEmail(parsed.email);
  }, []);

  const acknowledgeAlert = (id: string) => {
    setAlerts(prev =>
      prev.map(alert =>
        alert.id === id ? { ...alert, status: "acknowledged" } : alert
      )
    );
    toast.success("Alert Acknowledged");
  };

  const resolveAlert = (id: string) => {
    setAlerts(prev =>
      prev.map(alert =>
        alert.id === id ? { ...alert, status: "resolved" } : alert
      )
    );
    toast.success("Alert Resolved");
  };

  const refetch = () => {
    setIsLoading(true);
    setTimeout(() => {
      setAlerts([...dummyAlerts]);
      setIsLoading(false);
    }, 1000);
  };

  const stats = {
    pending: alerts.filter(a => a.status === "pending").length,
    highRisk: alerts.filter(a => a.risk_level === "high" && a.status === "pending").length,
    acknowledged: alerts.filter(a => a.status === "acknowledged").length,
    resolvedToday: alerts.filter(a => a.status === "resolved").length,
  };

  const filteredAlerts = alerts.filter(
    (a) => riskFilter === "all" || a.risk_level === riskFilter
  );

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  if (!therapistEmail) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">

      {/* HEADER */}
      <header className="bg-card border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary"/>
            <span className="font-bold">EmpathyConnect</span>
            <Badge variant="secondary" className="text-xs gap-1">
              <Shield className="w-3 h-3" />
              Therapist
            </Badge>
          </div>

          <div className="flex items-center gap-3">
            {stats.highRisk > 0 && (
              <Badge variant="destructive" className="animate-pulse gap-1">
                <Bell className="w-3 h-3" />
                {stats.highRisk} High Risk
              </Badge>
            )}
            <Button variant="ghost" size="sm" onClick={()=>navigate("/therapist")}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="container mx-auto px-4 py-6 space-y-6">

        {/* STAT */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

          <Card>
            <CardContent className="p-5">
              <AlertTriangle className="text-warning mb-2"/>
              <p className="text-3xl font-bold">{stats.pending}</p>
              <p className="text-xs">Pending</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <Bell className="text-destructive mb-2"/>
              <p className="text-3xl font-bold">{stats.highRisk}</p>
              <p className="text-xs">High Risk</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <Clock className="mb-2"/>
              <p className="text-3xl font-bold">{stats.acknowledged}</p>
              <p className="text-xs">In Progress</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <CheckCircle className="text-success mb-2"/>
              <p className="text-3xl font-bold">{stats.resolvedToday}</p>
              <p className="text-xs">Resolved</p>
            </CardContent>
          </Card>

        </div>

        {/* TABLE */}
        <Card>
          <CardHeader>
            <CardTitle>Real-Time AI Crisis Alerts</CardTitle>
          </CardHeader>
          <CardContent>

            <Button onClick={refetch} className="mb-4">
              <RefreshCw className="w-4 h-4 mr-2"/>
              Refresh
            </Button>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Risk</TableHead>
                  <TableHead>Feeling</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredAlerts.map(alert=>(
                  <TableRow key={alert.id} onClick={()=>setSelectedAlert(alert)} className="cursor-pointer">
                    <TableCell>{alert.pseudo_user_id}</TableCell>
                    <TableCell>
                      <Badge variant={alert.risk_level}>
                        {alert.risk_level}
                      </Badge>
                    </TableCell>
                    <TableCell>{alert.primary_feeling}</TableCell>
                    <TableCell>{formatTime(alert.created_at)}</TableCell>
                    <TableCell>{alert.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>

            </Table>

          </CardContent>
        </Card>

        {/* DETAILS */}
        {selectedAlert && (
          <Card>
            <CardHeader>
              <CardTitle>Case Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>{selectedAlert.message_preview}</p>

              {selectedAlert.status==="pending" && (
                <Button onClick={()=>acknowledgeAlert(selectedAlert.id)}>
                  Acknowledge
                </Button>
              )}

              {selectedAlert.status!=="resolved" && (
                <Button onClick={()=>resolveAlert(selectedAlert.id)}>
                  Resolve
                </Button>
              )}
            </CardContent>
          </Card>
        )}

      </main>
    </div>
  );
};

export default TherapistDashboard;
