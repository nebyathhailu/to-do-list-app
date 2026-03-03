import { useState } from 'react';
import Badge from './ui/Badge';

function formatDate(dateStr) {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  const today = new Date(); today.setHours(0,0,0,0);
  const diff = Math.ceil((date - today) / (1000*60*60*24));
  if (diff < 0) return { label: `${Math.abs(diff)}d overdue`, color: '#f87171' };
  if (diff === 0) return { label: 'Due today',    color: '#fb923c' };
  if (diff === 1) return { label: 'Due tomorrow', color: '#fbbf24' };
  return { label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), color: 'var(--text-muted)' };
}

function ProgressBar({ completed, total }) {
  const pct   = total === 0 ? 0 : Math.round((completed / total) * 100);
  const color = pct === 100 ? '#4ade80' : pct >= 50 ? 'var(--accent)' : 'var(--text-secondary)';
  return (
    <div className="mt-2.5">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs uppercase tracking-widest text-(--text-faint)">Progress</span>
        <span className="text-xs font-bold" style={{ color }}>{pct}%</span>
      </div>
      <div className="w-full h-1.5 rounded-full overflow-hidden bg-(--bg-base)">
        <div className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

export default function TaskItem({ task, onToggle, onDelete, onEdit, onSubtaskToggle }) {
  const [expanded, setExpanded]           = useState(true);
  const [showCompletePrompt, setShowCompletePrompt] = useState(false);

  const dateInfo       = formatDate(task.due_date);
  const subtasks       = task.subtasks || [];
  const hasSubtasks    = subtasks.length > 0;
  const completedCount = subtasks.filter(s => s.is_completed).length;
  const hasDetails     = task.description || hasSubtasks;
  const actionBtn      = 'p-1.5 rounded-lg text-xs transition-all text-[var(--text-muted)] hover:bg-[var(--bg-deep)]';

  const handleSubtaskToggle = async (taskId, sub) => {
    await onSubtaskToggle?.(taskId, sub);

    // Check if this toggle will complete all subtasks
    const updatedCompleted = sub.is_completed
      ? completedCount - 1
      : completedCount + 1;

    if (!task.is_completed && updatedCompleted === subtasks.length) {
      setShowCompletePrompt(true);
    } else {
      setShowCompletePrompt(false);
    }
  };

  const handleCompleteTask = () => {
    onToggle(task);
    setShowCompletePrompt(false);
  };

  return (
    <div
      className="rounded-xl overflow-hidden transition-all duration-200 bg-(--bg-surface-60) border border-(--border-subtle) hover:border-(--border-mid)"
      style={{
        borderLeft: `3px solid ${task.category?.color || 'var(--accent)'}`,
        opacity: task.is_completed ? 0.55 : 1,
      }}
    >
      <div className="flex items-start gap-3 p-3 sm:p-4">
        <input
          type="checkbox"
          checked={!!task.is_completed}
          onChange={() => {
            onToggle(task);
            setShowCompletePrompt(false);
          }}
          className="mt-0.5 w-4 h-4 rounded cursor-pointer shrink-0"
          style={{ accentColor: 'var(--accent)' }}
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className={`font-semibold text-sm leading-snug ${task.is_completed ? 'line-through text-(--text-muted)' : 'text-(--text-primary)'}`}>
              {task.title}
            </h4>
            {task.auto_rescheduled && (
              <span className="text-xs px-1.5 py-0.5 rounded-md text-orange-400 bg-orange-400/10">
                ↺ Rescheduled
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            {task.category && <Badge color={task.category.color}>{task.category.name}</Badge>}
            {dateInfo && (
              <span className="text-xs font-medium" style={{ color: dateInfo.color }}>
                📅 {dateInfo.label}
              </span>
            )}
            {hasSubtasks && (
              <span className="text-xs text-(--text-muted)">
                ☑ {completedCount}/{subtasks.length} subtasks
              </span>
            )}
          </div>

          {hasSubtasks && !expanded && (
            <ProgressBar completed={completedCount} total={subtasks.length} />
          )}
        </div>

        <div className="flex items-center gap-0.5 shrink-0 mt-0.5">
          {hasDetails && (
            <button onClick={() => setExpanded(!expanded)} title={expanded ? 'Collapse' : 'Expand'}
              className={`${actionBtn} hover:text-(--text-primary)`}>
              {expanded ? '▲' : '▼'}
            </button>
          )}
          <button onClick={() => onEdit(task)} title="Edit"
            className={`${actionBtn} hover:text-(--text-secondary)`}>✎</button>
          <button onClick={() => onDelete(task.id)} title="Delete"
            className={`${actionBtn} hover:text-red-400 hover:bg-red-400/10`}>✕</button>
        </div>
      </div>

      {expanded && hasDetails && (
        <div className="px-4 pb-5 pt-4 space-y-4 border-t border-(--border-subtle)">
          {task.description && (
            <div>
              <p className="text-xs uppercase tracking-widest mb-1.5 text-(--text-faint)">Description</p>
              <p className="text-sm leading-relaxed text-(--text-secondary)">{task.description}</p>
            </div>
          )}

          {hasSubtasks && (
            <div>
              <p className="text-xs uppercase tracking-widest mb-2 text-(--text-faint)">Subtasks</p>
              <div className="mt-3 space-y-2">
                {subtasks.map(sub => (
                  <label key={sub.id} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!sub.is_completed}
                      onChange={() => handleSubtaskToggle(task.id, sub)}
                      className="w-3.5 h-3.5 rounded cursor-pointer shrink-0"
                      style={{ accentColor: 'var(--accent)' }}
                    />
                    <span className={`text-sm transition-colors ${sub.is_completed ? 'line-through text-(--text-muted)' : 'text-(--text-secondary)'}`}>
                      {sub.title}
                    </span>
                    {sub.is_completed && <span className="ml-auto text-xs text-green-400">✓</span>}
                  </label>
                ))}
              </div>

              <ProgressBar completed={completedCount} total={subtasks.length} />

              {/* Inline prompt when all subtasks are done */}
              {showCompletePrompt && !task.is_completed && (
                <div className="mt-3 flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg"
                  style={{ backgroundColor: 'var(--bg-surface-30)', border: '1px solid var(--border-mid)' }}>
                  <span className="text-xs text-(--text-secondary)">
                    ✓ All subtasks done, mark task as complete?
                  </span>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={handleCompleteTask}
                      className="text-xs font-semibold px-2.5 py-1 rounded-lg transition-all"
                      style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-text)' }}
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setShowCompletePrompt(false)}
                      className="text-xs px-2.5 py-1 rounded-lg transition-all text-(--text-muted) hover:text-(--text-primary)"
                      style={{ border: '1px solid var(--border-subtle)' }}
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}