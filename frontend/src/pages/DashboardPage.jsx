import { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import Dashboard from '../components/Dashboard';
import TaskForm from '../components/TaskForm';
import TaskItem from '../components/TaskItem';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';

function groupByDate(tasks) {
  const today = new Date(); today.setHours(0,0,0,0);
  const groups = { overdue: [], today: [], upcoming: [], 'no date': [] };
  tasks.forEach(task => {
    if (!task.due_date) { groups['no date'].push(task); return; }
    const d = new Date(task.due_date); d.setHours(0,0,0,0);
    const diff = Math.ceil((d - today) / (1000*60*60*24));
    if (diff < 0) groups.overdue.push(task);
    else if (diff === 0) groups.today.push(task);
    else groups.upcoming.push(task);
  });
  groups.upcoming.sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
  return groups;
}

const GROUP_META = {
  overdue:   { label: 'Overdue',      color: 'text-red-400',    icon: '⚠' },
  today:     { label: `Today · ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`, color: 'text-orange-400', icon: '☀' },
  upcoming:  { label: 'Upcoming',     color: 'text-[var(--text-muted)]', icon: '📅' },
  'no date': { label: 'No Due Date',  color: 'text-[var(--text-faint)]', icon: '—' },
};

export default function DashboardPage() {
  const { request } = useApi();
  const [tasks, setTasks]             = useState([]);
  const [stats, setStats]             = useState(null);
  const [filter, setFilter]           = useState('all');
  const [showSummary, setShowSummary] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const fetchData = async () => {
    try {
      const endpoint = filter === 'all' ? '/tasks' : `/tasks?status=${filter}`;
      const [tasksData, statsData] = await Promise.all([
        request('get', endpoint),
        request('get', '/dashboard/stats'),
      ]);
      setTasks(tasksData); setStats(statsData);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchData(); }, [filter]);

  const handleToggle      = async task  => { await request('put',    `/tasks/${task.id}`, { is_completed: !task.is_completed }).catch(console.error); fetchData(); };
  const handleDelete      = async id    => { await request('delete', `/tasks/${id}`).catch(console.error); fetchData(); };
  const handleSubtaskToggle = async (taskId, sub) => { await request('put', `/tasks/${taskId}/subtasks/${sub.id}`, { is_completed: !sub.is_completed }).catch(console.error); fetchData(); };
  const handleReschedule  = async ()    => { await request('post',   '/tasks/reschedule').catch(console.error); fetchData(); };

  const grouped     = groupByDate(tasks);
  const totalPending = tasks.filter(t => !t.is_completed).length;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-(--text-primary)">Dashboard</h1>
          <p className="text-sm mt-1 text-(--text-muted)">
            {totalPending} task{totalPending !== 1 ? 's' : ''} pending
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant={showSummary ? 'primary' : 'outline'} onClick={() => setShowSummary(!showSummary)} className="text-sm px-4 py-2">
            {showSummary ? 'Hide Summary' : '📊 View Summary'}
          </Button>
          <Button variant="secondary" onClick={handleReschedule} className="text-sm px-4 py-2">↺ Reschedule</Button>
          <Button onClick={() => setShowAddModal(true)} className="text-sm px-4 py-2">+ New Task</Button>
        </div>
      </div>

      {/* Summary */}
      {showSummary && (
        <div className="mb-8">
          <Dashboard stats={stats} tasks={tasks} />
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-1 mb-6 p-1 rounded-xl w-fit bg-(--bg-surface-30)">
        {['all', 'pending', 'completed'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all
              ${filter === status
                ? 'bg-(--accent) text-(--accent-text)'
                : 'bg-transparent text-(--text-muted) hover:text-(--text-primary)'}`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Task Groups */}
      <div className="space-y-8">
        {Object.entries(grouped).map(([key, groupTasks]) => {
          if (groupTasks.length === 0) return null;
          const meta = GROUP_META[key];
          return (
            <div key={key}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-base">{meta.icon}</span>
                <h2 className={`text-xs font-bold uppercase tracking-widest ${meta.color}`}>{meta.label}</h2>
                <span className="text-xs px-2 py-0.5 rounded-full text-(--text-muted) bg-(--bg-surface-60)">
                  {groupTasks.length}
                </span>
              </div>
              <div className="space-y-2">
                {groupTasks.map(task => (
                  <TaskItem key={task.id} task={task} onToggle={handleToggle} onDelete={handleDelete} onEdit={setEditingTask} onSubtaskToggle={handleSubtaskToggle} />
                ))}
              </div>
            </div>
          );
        })}

        {tasks.length === 0 && (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">✦</div>
            <p className="text-(--text-muted)">
              {filter === 'pending'   ? 'No pending tasks.' :
              filter === 'completed' ? 'No completed tasks.' :
              'No tasks here. Add one to get started.'}
            </p>
            {filter === 'all' && (
              <Button onClick={() => setShowAddModal(true)} className="mt-4 text-sm">+ Add your first task</Button>
            )}
          </div>
        )}
      </div>

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="New Task">
        <TaskForm onTaskAdded={() => { fetchData(); setShowAddModal(false); }} />
      </Modal>
      <Modal isOpen={!!editingTask} onClose={() => setEditingTask(null)} title="Edit Task">
        {editingTask && <TaskForm initialData={editingTask} onTaskAdded={() => { fetchData(); setEditingTask(null); }} />}
      </Modal>
    </div>
  );
}