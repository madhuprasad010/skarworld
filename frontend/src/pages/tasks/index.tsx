import React, { useState, useMemo } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { DataToolbar } from '@/components/shared/data-toolbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import type { Task, TaskPriority, TaskType, TaskStatus } from '@/types';
import { format, isPast, parseISO, isToday, addDays } from 'date-fns';
import {
  CheckSquare,
  Plus,
  Calendar,
  AlertCircle,
  Trash2,
  Edit2,
  Clock,
  Phone,
  Mail,
  Video,
  FileSearch,
  CheckCircle2,
  User as UserIcon,
  ExternalLink,
} from 'lucide-react';

interface MockUser {
  id: string;
  name: string;
  avatar: string;
}

const TEAM_MEMBERS: MockUser[] = [
  { id: 'user-001', name: 'Alex Rivera', avatar: 'AR' },
  { id: 'user-002', name: 'Elena Rostova', avatar: 'ER' },
  { id: 'user-003', name: 'Marcus Chen', avatar: 'MC' },
  { id: 'user-004', name: 'Sarah Jenkins', avatar: 'SJ' },
  { id: 'user-005', name: 'David Kim', avatar: 'DK' },
];

const INITIAL_TASKS: Task[] = [
  {
    id: 'task-101',
    title: 'Urgent follow-up on Enterprise pricing objection',
    description: 'CloudScale CTO requested breakdown of data residency and SOC2 compliance add-on costs.',
    type: 'follow_up',
    priority: 'urgent',
    status: 'pending',
    dueDate: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(), // 18 hours ago (overdue)
    assignedToId: 'user-003',
    assignedToName: 'Marcus Chen',
    leadId: 'lead-001',
    leadName: 'Sarah Jenkins',
    leadCompany: 'CloudScale Tech',
    tenantId: 'tenant-001',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
  },
  {
    id: 'task-102',
    title: 'Schedule executive demo with Finovate VP',
    description: 'Coordinate with solutions engineering team to prepare fintech custom demo instance.',
    type: 'call',
    priority: 'high',
    status: 'pending',
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 6).toISOString(), // Today in 6 hours
    assignedToId: 'user-002',
    assignedToName: 'Elena Rostova',
    leadId: 'lead-002',
    leadName: 'Michael Chang',
    leadCompany: 'Finovate Capital',
    tenantId: 'tenant-001',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'task-103',
    title: 'Send customized security whitepaper and SLA agreement',
    description: 'Address CISO inquiries regarding GDPR compliance and tenant isolation.',
    type: 'email',
    priority: 'medium',
    status: 'pending',
    dueDate: addDays(new Date(), 2).toISOString(),
    assignedToId: 'user-004',
    assignedToName: 'Sarah Jenkins',
    leadId: 'lead-003',
    leadName: 'Emma Watson',
    leadCompany: 'Nordic Health Systems',
    tenantId: 'tenant-001',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'task-104',
    title: 'Quarterly discovery review call with Horizon Logistics',
    description: 'Analyze telemetry metrics from the 14-day trial evaluation and present expansion options.',
    type: 'meeting',
    priority: 'high',
    status: 'pending',
    dueDate: addDays(new Date(), 4).toISOString(),
    assignedToId: 'user-001',
    assignedToName: 'Alex Rivera',
    leadId: 'lead-004',
    leadName: 'David Vance',
    leadCompany: 'Horizon Logistics',
    tenantId: 'tenant-001',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'task-105',
    title: 'Review AI Autonomous Outreach campaign transcripts',
    description: 'Inspect tone calibration and lead qualification thresholds for the UK fintech cohort.',
    type: 'review',
    priority: 'low',
    status: 'pending',
    dueDate: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(), // 36 hours ago (overdue)
    assignedToId: 'user-005',
    assignedToName: 'David Kim',
    tenantId: 'tenant-001',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'task-106',
    title: 'Conduct procurement terms review with legal counsel',
    description: 'Finalize liability cap revision for $250k annual software and SLA contract.',
    type: 'review',
    priority: 'high',
    status: 'completed',
    dueDate: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    assignedToId: 'user-001',
    assignedToName: 'Alex Rivera',
    leadId: 'lead-005',
    leadName: 'Rachel Green',
    leadCompany: 'Apex Retail Solutions',
    tenantId: 'tenant-001',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'task-107',
    title: 'Prepare sales kickoff presentation deck',
    description: 'Collate Q3 pipeline attainment and AI outbound campaign performance stats.',
    type: 'other',
    priority: 'medium',
    status: 'completed',
    dueDate: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 40).toISOString(),
    assignedToId: 'user-002',
    assignedToName: 'Elena Rostova',
    tenantId: 'tenant-001',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function TasksPage() {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'overdue' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [assignedFilter, setAssignedFilter] = useState<string>('all');

  // Dialog State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formType, setFormType] = useState<TaskType>('follow_up');
  const [formPriority, setFormPriority] = useState<TaskPriority>('medium');
  const [formDueDate, setFormDueDate] = useState('');
  const [formAssignedTo, setFormAssignedTo] = useState('user-001');
  const [formLeadName, setFormLeadName] = useState('');
  const [formLeadCompany, setFormLeadCompany] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const isOverdue = (task: Task) => {
    if (task.status === 'completed') return false;
    return isPast(parseISO(task.dueDate)) && !isToday(parseISO(task.dueDate));
  };

  const isUpcoming = (task: Task) => {
    if (task.status === 'completed') return false;
    return !isPast(parseISO(task.dueDate)) || isToday(parseISO(task.dueDate));
  };

  // Toggle completion
  const handleToggleComplete = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          const isNowCompleted = task.status !== 'completed';
          const newStatus: TaskStatus = isNowCompleted ? 'completed' : 'pending';
          const updated = {
            ...task,
            status: newStatus,
            completedAt: isNowCompleted ? new Date().toISOString() : undefined,
            updatedAt: new Date().toISOString(),
          };

          toast({
            title: isNowCompleted ? 'Task Completed' : 'Task Reopened',
            description: `"${task.title}" marked as ${isNowCompleted ? 'completed' : 'pending'}.`,
            variant: isNowCompleted ? 'success' : 'default',
          });
          return updated;
        }
        return task;
      })
    );
  };

  // Open Create Dialog
  const handleOpenCreate = () => {
    setEditingTask(null);
    setFormTitle('');
    setFormDescription('');
    setFormType('follow_up');
    setFormPriority('medium');
    setFormDueDate(format(addDays(new Date(), 1), "yyyy-MM-dd'T'HH:mm"));
    setFormAssignedTo(TEAM_MEMBERS[0].id);
    setFormLeadName('');
    setFormLeadCompany('');
    setFormErrors({});
    setIsCreateOpen(true);
  };

  // Open Edit Dialog
  const handleOpenEdit = (task: Task) => {
    setEditingTask(task);
    setFormTitle(task.title);
    setFormDescription(task.description || '');
    setFormType(task.type);
    setFormPriority(task.priority);
    setFormDueDate(
      format(parseISO(task.dueDate), "yyyy-MM-dd'T'HH:mm")
    );
    setFormAssignedTo(task.assignedToId);
    setFormLeadName(task.leadName || '');
    setFormLeadCompany(task.leadCompany || '');
    setFormErrors({});
    setIsCreateOpen(true);
  };

  // Validate and Save
  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!formTitle.trim()) errors.title = 'Title is required';
    if (!formDueDate) errors.dueDate = 'Due date is required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const assignedUser = TEAM_MEMBERS.find((u) => u.id === formAssignedTo) || TEAM_MEMBERS[0];

    if (editingTask) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === editingTask.id
            ? {
                ...t,
                title: formTitle.trim(),
                description: formDescription.trim(),
                type: formType,
                priority: formPriority,
                dueDate: new Date(formDueDate).toISOString(),
                assignedToId: assignedUser.id,
                assignedToName: assignedUser.name,
                leadName: formLeadName.trim() || undefined,
                leadCompany: formLeadCompany.trim() || undefined,
                updatedAt: new Date().toISOString(),
              }
            : t
        )
      );
      toast({
        title: 'Task Updated',
        description: `"${formTitle.trim()}" has been updated successfully.`,
      });
    } else {
      const newTask: Task = {
        id: `task-${Date.now()}`,
        title: formTitle.trim(),
        description: formDescription.trim(),
        type: formType,
        priority: formPriority,
        status: 'pending',
        dueDate: new Date(formDueDate).toISOString(),
        assignedToId: assignedUser.id,
        assignedToName: assignedUser.name,
        leadName: formLeadName.trim() || undefined,
        leadCompany: formLeadCompany.trim() || undefined,
        tenantId: 'tenant-001',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setTasks((prev) => [newTask, ...prev]);
      toast({
        title: 'Task Created',
        description: `New task "${formTitle.trim()}" has been assigned.`,
        variant: 'success',
      });
    }

    setIsCreateOpen(false);
  };

  // Delete Task
  const handleDeleteTask = () => {
    if (!deletingTaskId) return;
    setTasks((prev) => prev.filter((t) => t.id !== deletingTaskId));
    toast({
      title: 'Task Deleted',
      description: 'The task has been permanently removed.',
    });
    setDeletingTaskId(null);
  };

  // Filtered Tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Tab filter
      if (activeTab === 'upcoming' && !isUpcoming(task)) return false;
      if (activeTab === 'overdue' && !isOverdue(task)) return false;
      if (activeTab === 'completed' && task.status !== 'completed') return false;

      // Priority filter
      if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;

      // Type filter
      if (typeFilter !== 'all' && task.type !== typeFilter) return false;

      // Assigned To filter
      if (assignedFilter !== 'all' && task.assignedToId !== assignedFilter) return false;

      // Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(query);
        const matchesDesc = task.description?.toLowerCase().includes(query) ?? false;
        const matchesLead = task.leadName?.toLowerCase().includes(query) ?? false;
        const matchesCompany = task.leadCompany?.toLowerCase().includes(query) ?? false;
        const matchesAssignee = task.assignedToName.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesLead && !matchesCompany && !matchesAssignee) {
          return false;
        }
      }

      return true;
    });
  }, [tasks, activeTab, priorityFilter, typeFilter, assignedFilter, searchQuery]);

  // Tab counts
  const counts = useMemo(() => {
    return {
      all: tasks.length,
      upcoming: tasks.filter(isUpcoming).length,
      overdue: tasks.filter(isOverdue).length,
      completed: tasks.filter((t) => t.status === 'completed').length,
    };
  }, [tasks]);

  const getTypeIcon = (type: TaskType) => {
    switch (type) {
      case 'call':
        return <Phone className="h-3.5 w-3.5 text-blue-500" />;
      case 'email':
        return <Mail className="h-3.5 w-3.5 text-indigo-500" />;
      case 'meeting':
        return <Video className="h-3.5 w-3.5 text-emerald-500" />;
      case 'review':
        return <FileSearch className="h-3.5 w-3.5 text-amber-500" />;
      default:
        return <CheckCircle2 className="h-3.5 w-3.5 text-purple-500" />;
    }
  };

  const getPriorityDot = (priority: TaskPriority) => {
    switch (priority) {
      case 'urgent':
        return <span className="h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-red-500/20 animate-pulse" />;
      case 'high':
        return <span className="h-2.5 w-2.5 rounded-full bg-amber-500 ring-2 ring-amber-500/20" />;
      case 'medium':
        return <span className="h-2.5 w-2.5 rounded-full bg-blue-500 ring-2 ring-blue-500/20" />;
      case 'low':
      default:
        return <span className="h-2.5 w-2.5 rounded-full bg-slate-400 ring-2 ring-slate-400/20" />;
    }
  };

  const formatDueDate = (dateStr: string, completed: boolean) => {
    const date = parseISO(dateStr);
    const past = isPast(date) && !isToday(date);
    const formatted = format(date, 'MMM d, yyyy · h:mm a');

    if (completed) {
      return <span className="text-muted-foreground">{formatted}</span>;
    }
    if (past) {
      return (
        <span className="inline-flex items-center gap-1 font-semibold text-destructive">
          <AlertCircle className="h-3.5 w-3.5" />
          {formatted} (Overdue)
        </span>
      );
    }
    if (isToday(date)) {
      return (
        <span className="inline-flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400">
          <Clock className="h-3.5 w-3.5" />
          Today at {format(date, 'h:mm a')}
        </span>
      );
    }
    return <span>{formatted}</span>;
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Tasks"
        description="Manage sales follow-ups, calls, reviews, and automated AI workflow deliverables."
        icon={CheckSquare}
        actions={
          <Button onClick={handleOpenCreate} className="gap-2 shadow-sm">
            <Plus className="h-4 w-4" />
            <span>New Task</span>
          </Button>
        }
      />

      {/* Tabs Row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <Tabs
          value={activeTab}
          onValueChange={(val) => setActiveTab(val as typeof activeTab)}
          className="w-full sm:w-auto"
        >
          <TabsList className="grid grid-cols-4 w-full sm:w-auto">
            <TabsTrigger value="all" className="gap-2">
              All <Badge variant="secondary" className="px-1.5 py-0 text-xs">{counts.all}</Badge>
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="gap-2">
              Upcoming <Badge variant="secondary" className="px-1.5 py-0 text-xs">{counts.upcoming}</Badge>
            </TabsTrigger>
            <TabsTrigger value="overdue" className="gap-2">
              Overdue{' '}
              {counts.overdue > 0 && (
                <Badge variant="destructive" className="px-1.5 py-0 text-xs">
                  {counts.overdue}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="completed" className="gap-2">
              Completed <Badge variant="secondary" className="px-1.5 py-0 text-xs">{counts.completed}</Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Data Toolbar with search & filters */}
      <DataToolbar
        searchPlaceholder="Search tasks, descriptions, leads, or assignees..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        filters={[
          {
            key: 'priority',
            label: 'Priority',
            options: [
              { label: 'Urgent', value: 'urgent' },
              { label: 'High', value: 'high' },
              { label: 'Medium', value: 'medium' },
              { label: 'Low', value: 'low' },
            ],
          },
          {
            key: 'type',
            label: 'Type',
            options: [
              { label: 'Follow Up', value: 'follow_up' },
              { label: 'Phone Call', value: 'call' },
              { label: 'Email', value: 'email' },
              { label: 'Meeting', value: 'meeting' },
              { label: 'Review', value: 'review' },
              { label: 'Other', value: 'other' },
            ],
          },
          {
            key: 'assignedTo',
            label: 'Assigned To',
            options: TEAM_MEMBERS.map((u) => ({ label: u.name, value: u.id })),
          },
        ]}
        activeFilters={{
          priority: priorityFilter,
          type: typeFilter,
          assignedTo: assignedFilter,
        }}
        onFilterChange={(key, val) => {
          if (key === 'priority') setPriorityFilter(val);
          if (key === 'type') setTypeFilter(val);
          if (key === 'assignedTo') setAssignedFilter(val);
        }}
        onClearFilters={() => {
          setPriorityFilter('all');
          setTypeFilter('all');
          setAssignedFilter('all');
          setSearchQuery('');
        }}
      />

      {/* Task Cards List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border p-12 text-center bg-card">
            <CheckSquare className="h-10 w-10 text-muted-foreground/60 mb-3" />
            <h3 className="text-base font-semibold text-foreground">No tasks found</h3>
            <p className="mt-1 text-sm text-muted-foreground max-w-sm">
              No tasks match your current view and filter parameters. Try adjusting filters or create a new task.
            </p>
            <Button onClick={handleOpenCreate} variant="outline" className="mt-4 gap-2">
              <Plus className="h-4 w-4" />
              Create Task
            </Button>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const overdue = isOverdue(task);
            const isDone = task.status === 'completed';

            return (
              <div
                key={task.id}
                className={cn(
                  'group relative flex flex-col justify-between gap-4 rounded-xl border bg-card p-4 shadow-sm transition-all hover:shadow-md sm:flex-row sm:items-center',
                  overdue && 'border-l-4 border-l-destructive border-destructive/40 bg-destructive/5',
                  isDone && 'opacity-65 border-border/60 bg-muted/20'
                )}
              >
                {/* Left section: Checkbox + Info */}
                <div className="flex items-start gap-3.5 sm:items-center">
                  <div className="pt-0.5 sm:pt-0">
                    <Checkbox
                      checked={isDone}
                      onCheckedChange={() => handleToggleComplete(task.id)}
                      className="h-5 w-5 rounded-md border-muted-foreground/40 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={cn(
                          'font-medium text-foreground transition-all',
                          isDone && 'line-through text-muted-foreground'
                        )}
                      >
                        {task.title}
                      </span>

                      {/* Type Badge */}
                      <Badge variant="outline" className="gap-1.5 font-normal capitalize">
                        {getTypeIcon(task.type)}
                        {task.type.replace('_', ' ')}
                      </Badge>

                      {/* Priority Dot */}
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        {getPriorityDot(task.priority)}
                        <span className="capitalize">{task.priority}</span>
                      </div>
                    </div>

                    {task.description && (
                      <p className="text-xs text-muted-foreground line-clamp-1 max-w-2xl">
                        {task.description}
                      </p>
                    )}

                    {/* Metadata line: Due Date & Lead */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-0.5">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>Due: {formatDueDate(task.dueDate, isDone)}</span>
                      </div>

                      {task.leadName && (
                        <div className="flex items-center gap-1.5">
                          <UserIcon className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>Lead:</span>
                          <a
                            href={`/leads?search=${encodeURIComponent(task.leadName)}`}
                            className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
                          >
                            <span>{task.leadName}</span>
                            {task.leadCompany && <span>({task.leadCompany})</span>}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right section: Assignee & Action Buttons */}
                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-7 w-7 text-xs">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold text-2xs">
                        {TEAM_MEMBERS.find((u) => u.id === task.assignedToId)?.avatar || 'SK'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-medium text-foreground hidden sm:inline-block">
                      {task.assignedToName}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenEdit(task)}
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      title="Edit task"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeletingTaskId(task.id)}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      title="Delete task"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create / Edit Task Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingTask ? 'Edit Task' : 'Create New Task'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSaveTask} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="task-title">Task Title *</Label>
              <Input
                id="task-title"
                placeholder="e.g., Follow up on enterprise security questions"
                value={formTitle}
                onChange={(e) => {
                  setFormTitle(e.target.value);
                  if (formErrors.title) {
                    setFormErrors((prev) => ({ ...prev, title: '' }));
                  }
                }}
                className={formErrors.title ? 'border-destructive' : ''}
              />
              {formErrors.title && (
                <p className="text-xs text-destructive">{formErrors.title}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="task-type">Task Type</Label>
                <Select
                  value={formType}
                  onValueChange={(val) => setFormType(val as TaskType)}
                >
                  <SelectTrigger id="task-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="follow_up">Follow Up</SelectItem>
                    <SelectItem value="call">Phone Call</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="meeting">Meeting</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="task-priority">Priority</Label>
                <Select
                  value={formPriority}
                  onValueChange={(val) => setFormPriority(val as TaskPriority)}
                >
                  <SelectTrigger id="task-priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="task-due">Due Date & Time *</Label>
                <Input
                  id="task-due"
                  type="datetime-local"
                  value={formDueDate}
                  onChange={(e) => {
                    setFormDueDate(e.target.value);
                    if (formErrors.dueDate) {
                      setFormErrors((prev) => ({ ...prev, dueDate: '' }));
                    }
                  }}
                  className={formErrors.dueDate ? 'border-destructive' : ''}
                />
                {formErrors.dueDate && (
                  <p className="text-xs text-destructive">{formErrors.dueDate}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="task-assigned">Assignee</Label>
                <Select
                  value={formAssignedTo}
                  onValueChange={setFormAssignedTo}
                >
                  <SelectTrigger id="task-assigned">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TEAM_MEMBERS.map((u) => (
                      <SelectItem key={u.id} value={u.id}>
                        {u.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="task-lead-name">Related Lead (Optional)</Label>
                <Input
                  id="task-lead-name"
                  placeholder="e.g. Sarah Jenkins"
                  value={formLeadName}
                  onChange={(e) => setFormLeadName(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="task-lead-company">Company (Optional)</Label>
                <Input
                  id="task-lead-company"
                  placeholder="e.g. CloudScale Tech"
                  value={formLeadCompany}
                  onChange={(e) => setFormLeadCompany(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="task-desc">Description & Instructions</Label>
              <Textarea
                id="task-desc"
                rows={3}
                placeholder="Specific guidance or details for completing this task..."
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingTask ? 'Save Changes' : 'Create Task'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog
        open={!!deletingTaskId}
        onOpenChange={(open) => !open && setDeletingTaskId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this task from the system. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTask}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Task
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default TasksPage;
