"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  ArrowLeft, 
  Plus, 
  Search, 
  Filter,
  SortAsc,
  SortDesc,
  Edit,
  Trash2,
  Eye,
  Mail,
  Phone,
  Calendar,
  Trophy,
  Target,
  Activity,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  MoreVertical,
  Download,
  RefreshCw
} from "lucide-react";
import { getCurrentUser, isAuthenticated } from "@/lib/api/googleAuth";
import type { Athlete } from "@/lib/injury-analysis/database";
import { AthleteFormModal } from "@/components/injury-analysis/athlete-form-modal";

type SortField = 'name' | 'age' | 'primary_sport' | 'team' | 'status' | 'created_at';
type SortDirection = 'asc' | 'desc';

export default function AthleteRosterPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [athleteRiskData, setAthleteRiskData] = useState<Map<string, any>>(new Map());
  
  // Modal states
  const [isAthleteFormOpen, setIsAthleteFormOpen] = useState(false);
  const [athleteFormMode, setAthleteFormMode] = useState<'create' | 'edit'>('create');
  const [editingAthlete, setEditingAthlete] = useState<Athlete | null>(null);
  const [viewingAthlete, setViewingAthlete] = useState<Athlete | null>(null);
  const [selectedAthletes, setSelectedAthletes] = useState<Set<string>>(new Set());
  const [bulkActionMode, setBulkActionMode] = useState(false);

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated()) {
      router.push('/');
      return;
    }

    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push('/');
      return;
    }

    setUser(currentUser);
    loadAthletes(currentUser.id);
  }, [router]);

  async function loadAthletes(userId: string) {
    try {
      setIsLoading(true);
      const { getUserAthletes, getInjuryRiskAnalysis, getActivityHistory } = await import('@/lib/injury-analysis/database');
      const userAthletes = await getUserAthletes(userId);
      
      // Load risk data and injury status for each athlete
      const riskDataMap = new Map();
      const updatedAthletes = await Promise.all(
        userAthletes.map(async (athlete) => {
          try {
            // Get injury risk analysis
            const riskAnalysis = await getInjuryRiskAnalysis(athlete.id);
            
            // Get recent activities to check for injuries
            const activities = await getActivityHistory(athlete.id, 10, 0);
            
            // Check for recent injuries (last 7 days)
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            
            const hasRecentInjury = activities.some((activity: any) => {
              if (activity.activity_type !== 'sports') return false;
              const activityDate = new Date(activity.date);
              return activityDate >= sevenDaysAgo && activity.injuries && activity.injuries.length > 0;
            });
            
            // Count body parts with >90% risk
            const highRiskParts = riskAnalysis.body_part_risks.filter(
              (risk: any) => risk.percentage >= 90
            );
            
            // Determine status based on criteria
            let calculatedStatus = athlete.status;
            if (hasRecentInjury) {
              calculatedStatus = 'injured';
            } else if (highRiskParts.length >= 2) {
              calculatedStatus = 'recovering';
            } else if (riskAnalysis.body_part_risks.length === 0 || 
                       riskAnalysis.body_part_risks.every((r: any) => r.percentage < 60)) {
              calculatedStatus = 'active';
            }
            
            riskDataMap.set(athlete.id, {
              riskAnalysis,
              hasRecentInjury,
              highRiskPartsCount: highRiskParts.length,
              calculatedStatus,
            });
            
            // Update athlete status if it's different
            if (calculatedStatus !== athlete.status) {
              return { ...athlete, status: calculatedStatus };
            }
            
            return athlete;
          } catch (error) {
            console.error(`Error loading risk data for athlete ${athlete.id}:`, error);
            riskDataMap.set(athlete.id, {
              riskAnalysis: { body_part_risks: [] },
              hasRecentInjury: false,
              highRiskPartsCount: 0,
              calculatedStatus: athlete.status,
            });
            return athlete;
          }
        })
      );
      
      setAthleteRiskData(riskDataMap);
      setAthletes(updatedAthletes);
    } catch (error) {
      console.error('Error loading athletes:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleCreateAthlete = async (athleteData: any) => {
    try {
      if (!user) return;
      
      const { createOrUpdateAthlete } = await import('@/lib/injury-analysis/database');
      const newAthlete = await createOrUpdateAthlete({
        user_id: user.id,
        ...athleteData,
      });

      setAthletes([...athletes, newAthlete]);
      setAthleteRiskData(new Map(athleteRiskData.set(newAthlete.id, {
        riskAnalysis: { body_part_risks: [] },
        hasRecentInjury: false,
        highRiskPartsCount: 0,
        calculatedStatus: newAthlete.status,
      })));
      setIsAthleteFormOpen(false);
      setAthleteFormMode('create');
      setEditingAthlete(null);
    } catch (error) {
      console.error('Error creating athlete:', error);
      throw error;
    }
  };

  const handleEditAthlete = async (athleteData: any) => {
    try {
      if (!editingAthlete) return;
      
      const { updateAthlete } = await import('@/lib/injury-analysis/database');
      const updated = await updateAthlete(editingAthlete.id, athleteData);
      
      setAthletes(athletes.map(a => a.id === updated.id ? updated : a));
      setIsAthleteFormOpen(false);
      setAthleteFormMode('create');
      setEditingAthlete(null);
    } catch (error) {
      console.error('Error updating athlete:', error);
      throw error;
    }
  };

  const handleDeleteAthlete = async (athlete: Athlete) => {
    if (!confirm(`Delete ${athlete.name}? This will also delete all their activity data and cannot be undone.`)) {
      return;
    }

    try {
      const { deleteAthlete } = await import('@/lib/injury-analysis/database');
      await deleteAthlete(athlete.id);
      setAthletes(athletes.filter(a => a.id !== athlete.id));
    } catch (error) {
      console.error('Error deleting athlete:', error);
      alert('Failed to delete athlete');
    }
  };

  // Filter and sort athletes
  const filteredAndSortedAthletes = useMemo(() => {
    let filtered = [...athletes];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(athlete =>
        athlete.name.toLowerCase().includes(query) ||
        athlete.primary_sport?.toLowerCase().includes(query) ||
        athlete.team?.toLowerCase().includes(query) ||
        athlete.position?.toLowerCase().includes(query) ||
        athlete.email?.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(athlete => athlete.status === statusFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      // Handle null/undefined values
      if (!aVal) aVal = '';
      if (!bVal) bVal = '';

      // Convert to comparable values
      if (sortField === 'age') {
        aVal = Number(aVal) || 0;
        bVal = Number(bVal) || 0;
      } else if (sortField === 'created_at') {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      } else {
        aVal = String(aVal).toLowerCase();
        bVal = String(bVal).toLowerCase();
      }

      // Compare
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [athletes, searchQuery, statusFilter, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      active: "bg-green-500/10 text-green-400 border-green-500/20",
      recovering: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      injured: "bg-red-500/10 text-red-400 border-red-500/20",
    };

    const icons = {
      active: <CheckCircle className="h-3 w-3" />,
      recovering: <AlertCircle className="h-3 w-3" />,
      injured: <XCircle className="h-3 w-3" />,
    };

    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles] || styles.active}`}>
        {icons[status as keyof typeof icons] || icons.active}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </div>
    );
  };

  const stats = {
    total: athletes.length,
    active: athletes.filter(a => a.status === 'active').length,
    recovering: athletes.filter(a => a.status === 'recovering').length,
    injured: athletes.filter(a => a.status === 'injured').length,
  };

  const toggleSelectAthlete = (athleteId: string) => {
    const newSelected = new Set(selectedAthletes);
    if (newSelected.has(athleteId)) {
      newSelected.delete(athleteId);
    } else {
      newSelected.add(athleteId);
    }
    setSelectedAthletes(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedAthletes.size === filteredAndSortedAthletes.length) {
      setSelectedAthletes(new Set());
    } else {
      setSelectedAthletes(new Set(filteredAndSortedAthletes.map(a => a.id)));
    }
  };

  const handleBulkStatusUpdate = async (newStatus: 'active' | 'recovering' | 'injured') => {
    if (selectedAthletes.size === 0) return;
    
    if (!confirm(`Update status to "${newStatus}" for ${selectedAthletes.size} athlete(s)?`)) {
      return;
    }

    try {
      const { updateAthlete } = await import('@/lib/injury-analysis/database');
      
      const updatePromises = Array.from(selectedAthletes).map(athleteId =>
        updateAthlete(athleteId, { status: newStatus })
      );
      
      const updatedAthletes = await Promise.all(updatePromises);
      
      // Update local state
      setAthletes(athletes.map(athlete => {
        const updated = updatedAthletes.find(u => u.id === athlete.id);
        return updated || athlete;
      }));
      
      setSelectedAthletes(new Set());
      setBulkActionMode(false);
    } catch (error) {
      console.error('Error updating athletes:', error);
      alert('Failed to update athletes');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedAthletes.size === 0) return;
    
    if (!confirm(`Delete ${selectedAthletes.size} athlete(s)? This will also delete all their activity data and cannot be undone.`)) {
      return;
    }

    try {
      const { deleteAthlete } = await import('@/lib/injury-analysis/database');
      
      const deletePromises = Array.from(selectedAthletes).map(athleteId =>
        deleteAthlete(athleteId)
      );
      
      await Promise.all(deletePromises);
      
      setAthletes(athletes.filter(a => !selectedAthletes.has(a.id)));
      setSelectedAthletes(new Set());
      setBulkActionMode(false);
    } catch (error) {
      console.error('Error deleting athletes:', error);
      alert('Failed to delete athletes');
    }
  };

  const exportToCSV = () => {
    const athletesToExport = selectedAthletes.size > 0 
      ? athletes.filter(a => selectedAthletes.has(a.id))
      : filteredAndSortedAthletes;

    if (athletesToExport.length === 0) {
      alert('No athletes to export');
      return;
    }

    // CSV headers
    const headers = ['Name', 'Email', 'Age', 'Position', 'Height', 'Weight', 'Sport', 'Team', 'Status', 'Created', 'Updated'];
    
    // CSV rows
    const rows = athletesToExport.map(athlete => [
      athlete.name,
      athlete.email || '',
      athlete.age || '',
      athlete.position || '',
      athlete.height || '',
      athlete.weight || '',
      athlete.primary_sport || '',
      athlete.team || '',
      athlete.status,
      athlete.created_at ? new Date(athlete.created_at).toLocaleDateString() : '',
      athlete.updated_at ? new Date(athlete.updated_at).toLocaleDateString() : '',
    ]);

    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    // Download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `athletes_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-blue-600/30 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
          </div>
          <p className="text-white font-semibold">Loading athletes...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Athlete Form Modal */}
      <AthleteFormModal
        isOpen={isAthleteFormOpen}
        onClose={() => {
          setIsAthleteFormOpen(false);
          setEditingAthlete(null);
          setAthleteFormMode('create');
        }}
        onSubmit={athleteFormMode === 'create' ? handleCreateAthlete : handleEditAthlete}
        initialData={editingAthlete}
        mode={athleteFormMode}
      />

      {/* Athlete Detail Modal */}
      {viewingAthlete && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={() => setViewingAthlete(null)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-[#0a0a0a] border border-white/10 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-lg bg-blue-500/10 flex items-center justify-center text-2xl font-bold text-blue-400 border-2 border-blue-500/20">
                      {viewingAthlete.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </div>
                    <div>
                      <h2 className="text-2xl font-medium text-white mb-1">{viewingAthlete.name}</h2>
                      <p className="text-sm text-white/50">Athlete ID: {viewingAthlete.id.substring(0, 8)}...</p>
                    </div>
                  </div>
                  <button onClick={() => setViewingAthlete(null)} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                    <XCircle className="h-6 w-6 text-white/50" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Status */}
                  <div>
                    <p className="text-xs text-white/50 mb-2 font-medium uppercase">Status</p>
                    {getStatusBadge(viewingAthlete.status)}
                  </div>

                  {/* Personal Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-white/50 mb-2 font-medium">Age</p>
                      <p className="text-white">{viewingAthlete.age || '-'} years</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/50 mb-2 font-medium">Email</p>
                      <p className="text-white text-sm">{viewingAthlete.email || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/50 mb-2 font-medium">Height</p>
                      <p className="text-white">{viewingAthlete.height || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/50 mb-2 font-medium">Weight</p>
                      <p className="text-white">{viewingAthlete.weight || '-'}</p>
                    </div>
                  </div>

                  {/* Sport Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-white/50 mb-2 font-medium">Primary Sport</p>
                      <p className="text-white">{viewingAthlete.primary_sport || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/50 mb-2 font-medium">Position</p>
                      <p className="text-white">{viewingAthlete.position || '-'}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-white/50 mb-2 font-medium">Team</p>
                      <p className="text-white">{viewingAthlete.team || '-'}</p>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                    <div>
                      <p className="text-xs text-white/50 mb-2 font-medium">Added</p>
                      <p className="text-white text-sm">
                        {viewingAthlete.created_at ? new Date(viewingAthlete.created_at).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        }) : '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-white/50 mb-2 font-medium">Last Updated</p>
                      <p className="text-white text-sm">
                        {viewingAthlete.updated_at ? new Date(viewingAthlete.updated_at).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        }) : '-'}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4 border-t border-white/10">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => {
                        setViewingAthlete(null);
                        setEditingAthlete(viewingAthlete);
                        setAthleteFormMode('edit');
                        setIsAthleteFormOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                    <Button 
                      variant="default"
                      className="flex-1"
                      onClick={() => {
                        router.push(`/injury-analysis`);
                      }}
                    >
                      <Activity className="h-4 w-4 mr-2" />
                      View Analysis
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="min-h-screen bg-black">
        {/* Header */}
        <header className="border-b border-white/5 bg-black/80 backdrop-blur-sm sticky top-0 z-40">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/5 rounded-md">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-medium text-white">
                    Athlete Roster
                  </h1>
                  <p className="text-xs text-white/40">Manage all your athletes in one place</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => router.push('/dashboard')}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-6 py-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="border-blue-500/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/50 mb-1 font-medium">Total Athletes</p>
                    <p className="text-3xl font-bold text-white">{stats.total}</p>
                    <p className="text-xs text-white/40 mt-1">In your roster</p>
                  </div>
                  <div className="h-12 w-12 bg-blue-500/10 rounded-lg flex items-center justify-center border border-blue-500/20">
                    <Users className="h-6 w-6 text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-500/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/50 mb-1 font-medium">Active</p>
                    <p className="text-3xl font-bold text-green-400">{stats.active}</p>
                    <p className="text-xs text-white/40 mt-1">Ready to train</p>
                  </div>
                  <div className="h-12 w-12 bg-green-500/10 rounded-lg flex items-center justify-center border border-green-500/20">
                    <CheckCircle className="h-6 w-6 text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-500/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/50 mb-1 font-medium">Recovering</p>
                    <p className="text-3xl font-bold text-amber-400">{stats.recovering}</p>
                    <p className="text-xs text-white/40 mt-1">2+ parts &gt;90% risk</p>
                  </div>
                  <div className="h-12 w-12 bg-amber-500/10 rounded-lg flex items-center justify-center border border-amber-500/20">
                    <AlertCircle className="h-6 w-6 text-amber-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-500/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/50 mb-1 font-medium">Injured</p>
                    <p className="text-3xl font-bold text-red-400">{stats.injured}</p>
                    <p className="text-xs text-white/40 mt-1">Recent injury reported</p>
                  </div>
                  <div className="h-12 w-12 bg-red-500/10 rounded-lg flex items-center justify-center border border-red-500/20">
                    <XCircle className="h-6 w-6 text-red-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Actions */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                  <Input
                    placeholder="Search by name, sport, team, position, email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white/[0.05] border-white/10 text-white"
                  />
                </div>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 bg-white/[0.05] border border-white/10 rounded-md text-white text-sm focus:outline-none focus:ring-1 focus:ring-white/20"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="recovering">Recovering</option>
                  <option value="injured">Injured</option>
                </select>

                {/* Bulk Actions Toggle */}
                {athletes.length > 0 && (
                  <Button
                    variant={bulkActionMode ? "default" : "outline"}
                    onClick={() => {
                      setBulkActionMode(!bulkActionMode);
                      setSelectedAthletes(new Set());
                    }}
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    {bulkActionMode ? 'Exit Bulk' : 'Bulk Actions'}
                  </Button>
                )}

                {/* Export Button */}
                <Button
                  variant="outline"
                  onClick={exportToCSV}
                  disabled={filteredAndSortedAthletes.length === 0}
                >
                  <Download className="h-4 w-4" />
                </Button>

                {/* Add Athlete Button */}
                <Button
                  onClick={() => {
                    setEditingAthlete(null);
                    setAthleteFormMode('create');
                    setIsAthleteFormOpen(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Athlete
                </Button>

                {/* Refresh Button */}
                <Button
                  variant="outline"
                  onClick={() => user && loadAthletes(user.id)}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Bulk Actions Bar */}
          {bulkActionMode && selectedAthletes.size > 0 && (
            <Card className="mb-6 border-blue-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <p className="text-white font-medium">
                    {selectedAthletes.size} athlete{selectedAthletes.size !== 1 ? 's' : ''} selected
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBulkStatusUpdate('active')}
                    >
                      <CheckCircle className="h-4 w-4 mr-2 text-green-400" />
                      Mark Active
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBulkStatusUpdate('recovering')}
                    >
                      <AlertCircle className="h-4 w-4 mr-2 text-amber-400" />
                      Mark Recovering
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBulkStatusUpdate('injured')}
                    >
                      <XCircle className="h-4 w-4 mr-2 text-red-400" />
                      Mark Injured
                    </Button>
                    <div className="w-px h-6 bg-white/10 mx-2" />
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleBulkDelete}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Selected
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Athletes Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-400" />
                All Athletes
              </CardTitle>
              <CardDescription>
                {filteredAndSortedAthletes.length} athlete{filteredAndSortedAthletes.length !== 1 ? 's' : ''} found
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredAndSortedAthletes.length === 0 ? (
                <div className="text-center py-16">
                  <div className="h-20 w-20 rounded-lg bg-blue-500/10 flex items-center justify-center mx-auto mb-5">
                    <Users className="h-10 w-10 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-medium text-white mb-2">
                    {searchQuery || statusFilter !== 'all' ? 'No athletes found' : 'No athletes yet'}
                  </h3>
                  <p className="text-sm text-white/50 mb-6 max-w-md mx-auto">
                    {searchQuery || statusFilter !== 'all' 
                      ? 'Try adjusting your search or filters'
                      : 'Get started by adding your first athlete to the roster'
                    }
                  </p>
                  {!searchQuery && statusFilter === 'all' && (
                    <Button 
                      onClick={() => {
                        setEditingAthlete(null);
                        setAthleteFormMode('create');
                        setIsAthleteFormOpen(true);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Athlete
                    </Button>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        {bulkActionMode && (
                          <th className="p-4 w-12">
                            <input
                              type="checkbox"
                              checked={selectedAthletes.size === filteredAndSortedAthletes.length && filteredAndSortedAthletes.length > 0}
                              onChange={toggleSelectAll}
                              className="rounded border-white/20 bg-white/5 text-blue-500 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
                            />
                          </th>
                        )}
                        <th 
                          className="text-left p-4 text-sm font-medium text-white/70 cursor-pointer hover:text-white transition-colors"
                          onClick={() => handleSort('name')}
                        >
                          <div className="flex items-center gap-2">
                            Name
                            {sortField === 'name' && (
                              sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                            )}
                          </div>
                        </th>
                        <th 
                          className="text-left p-4 text-sm font-medium text-white/70 cursor-pointer hover:text-white transition-colors"
                          onClick={() => handleSort('status')}
                        >
                          <div className="flex items-center gap-2">
                            Status
                            {sortField === 'status' && (
                              sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                            )}
                          </div>
                        </th>
                        <th 
                          className="text-left p-4 text-sm font-medium text-white/70 cursor-pointer hover:text-white transition-colors"
                          onClick={() => handleSort('primary_sport')}
                        >
                          <div className="flex items-center gap-2">
                            Sport
                            {sortField === 'primary_sport' && (
                              sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                            )}
                          </div>
                        </th>
                        <th 
                          className="text-left p-4 text-sm font-medium text-white/70 cursor-pointer hover:text-white transition-colors"
                          onClick={() => handleSort('team')}
                        >
                          <div className="flex items-center gap-2">
                            Team
                            {sortField === 'team' && (
                              sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                            )}
                          </div>
                        </th>
                        <th 
                          className="text-left p-4 text-sm font-medium text-white/70 cursor-pointer hover:text-white transition-colors"
                          onClick={() => handleSort('age')}
                        >
                          <div className="flex items-center gap-2">
                            Age
                            {sortField === 'age' && (
                              sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                            )}
                          </div>
                        </th>
                        <th className="text-right p-4 text-sm font-medium text-white/70">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAndSortedAthletes.map((athlete) => (
                        <tr 
                          key={athlete.id} 
                          className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group"
                        >
                          {bulkActionMode && (
                            <td className="p-4">
                              <input
                                type="checkbox"
                                checked={selectedAthletes.has(athlete.id)}
                                onChange={() => toggleSelectAthlete(athlete.id)}
                                className="rounded border-white/20 bg-white/5 text-blue-500 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
                              />
                            </td>
                          )}
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-md bg-blue-500/10 flex items-center justify-center text-sm font-bold text-blue-400 border border-blue-500/20">
                                {athlete.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                              </div>
                              <div>
                                <p className="font-medium text-white">{athlete.name}</p>
                                <p className="text-xs text-white/50">
                                  {athlete.position || 'No position'}
                                  {athleteRiskData.get(athlete.id)?.highRiskPartsCount > 0 && (
                                    <span className="ml-2 text-amber-400">
                                      • {athleteRiskData.get(athlete.id)?.highRiskPartsCount} high risk
                                    </span>
                                  )}
                                  {athleteRiskData.get(athlete.id)?.hasRecentInjury && (
                                    <span className="ml-2 text-red-400">
                                      • Injured
                                    </span>
                                  )}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            {getStatusBadge(athlete.status)}
                          </td>
                          <td className="p-4 text-white/70">{athlete.primary_sport || '-'}</td>
                          <td className="p-4 text-white/70">{athlete.team || '-'}</td>
                          <td className="p-4 text-white/70">{athlete.age || '-'}</td>
                          <td className="p-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setViewingAthlete(athlete)}
                                className="p-2 hover:bg-white/5 rounded-md text-white/50 hover:text-blue-400 transition-colors"
                                title="View Details"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setEditingAthlete(athlete);
                                  setAthleteFormMode('edit');
                                  setIsAthleteFormOpen(true);
                                }}
                                className="p-2 hover:bg-white/5 rounded-md text-white/50 hover:text-blue-400 transition-colors"
                                title="Edit"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteAthlete(athlete)}
                                className="p-2 hover:bg-white/5 rounded-md text-white/50 hover:text-red-400 transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => router.push('/injury-analysis')}
                                className="p-2 hover:bg-white/5 rounded-md text-white/50 hover:text-green-400 transition-colors"
                                title="View Analysis"
                              >
                                <Activity className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </>
  );
}

