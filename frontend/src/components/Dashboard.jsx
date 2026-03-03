import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';

const PIE_PALETTE = [
  '#8d77a8',
  '#b8a3d4',
  '#6b5a80',
  '#c4addd',
  '#9e89bc',
  '#7a6690',
];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      backgroundColor: 'var(--bg-surface)',
      border: '1px solid var(--border-mid)',
      borderRadius: '8px',
      padding: '8px 12px',
      fontSize: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      color: 'var(--text-primary)',
    }}>
      {label && (
        <p style={{ color: 'var(--text-muted)', marginBottom: 4, fontSize: 11 }}>{label}</p>
      )}
      {payload.map((p, i) => (
        <p key={i} style={{ margin: 0, color: 'var(--text-primary)' }}>
          <span style={{ color: p.fill || p.color }}>{p.name || 'Tasks'}: </span>
          <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  );
}

export default function Dashboard({ stats, tasks = [] }) {
  if (!stats) return (
    <div className="text-center p-8" style={{ color: 'var(--text-muted)' }}>
      Loading stats...
    </div>
  );

  const total     = tasks.length > 0
    ? tasks.length
    : Number(stats.total ?? stats.tasks_count ?? 0);

  const completed = tasks.length > 0
    ? tasks.filter(t => t.is_completed).length
    : Number(stats.completed ?? stats.completed_count ?? 0);

  const pending   = tasks.length > 0
    ? tasks.filter(t => !t.is_completed).length
    : Number(stats.pending ?? stats.pending_count ?? Math.max(0, total - completed));

  const streak    = Number(stats.streak ?? stats.streak_count ?? 0);

  // ── Category data ──
  const categoryData = (stats.by_category || [])
    .map((entry, i) => ({
      name:  entry.category?.name ?? entry.name ?? `Cat ${i + 1}`,
      value: Number(entry.total ?? entry.count ?? 0),
      color: PIE_PALETTE[i % PIE_PALETTE.length],
    }))
    .filter(d => d.value > 0);

  // ── Weekly data — shorten date labels to 3 chars ──
  const weeklyData = (stats.weekly_activity || []).map(entry => ({
    date:  (entry.date ?? entry.day ?? '').slice(-5),  
    count: Number(entry.count ?? entry.completed ?? 0),
  }));

  const cardStyle = {
    backgroundColor: 'var(--bg-surface-60)',
    border: '1px solid var(--border-subtle)',
    borderRadius: '12px',
    padding: '20px',
  };

  const sectionLabel = {
    fontSize: '10px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    fontFamily: 'Syne, sans-serif',
    color: 'var(--text-muted)',
    marginBottom: '16px',
    display: 'block',
  };

  return (
    <div className="space-y-6">

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total',     value: total,        icon: '📋' },
          { label: 'Completed', value: completed,    icon: '✅' },
          { label: 'Pending',   value: pending,      icon: '⏳' },
          { label: 'Streak',    value: `${streak}d`, icon: '🔥' },
        ].map(({ label, value, icon }) => (
          <div key={label} style={cardStyle}>
            <div style={{ fontSize: 20, marginBottom: 8 }}>{icon}</div>
            <div style={{ fontSize: 26, fontWeight: 800, fontFamily: 'Syne, sans-serif', color: 'var(--text-primary)', lineHeight: 1 }}>
              {value}
            </div>
            <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 6, color: 'var(--text-muted)' }}>
              {label}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* ── Weekly Bar Chart ── */}
        <div style={cardStyle}>
          <span style={sectionLabel}>Weekly Productivity</span>
          <div style={{ height: 190 }}>
            {weeklyData.length === 0 ? (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: 'var(--text-faint)' }}>
                No activity data yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={weeklyData}
                  margin={{ top: 4, right: 8, left: -28, bottom: 0 }}
                  barCategoryGap="50%"
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border-subtle)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 10, fill: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif' }}
                  />
                  <YAxis
                    allowDecimals={false}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 10, fill: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif' }}
                    width={28}
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: 'var(--bg-surface-30)', radius: 4 }}
                  />
                  <Bar
                    dataKey="count"
                    name="Tasks"
                    fill="#8d77a8"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={22}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* ── Pie Chart ── */}
        <div style={cardStyle}>
          <span style={sectionLabel}>By Category</span>
          <div style={{ height: 190 }}>
            {categoryData.length === 0 ? (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: 'var(--text-faint)' }}>
                No category data yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    cx="38%"
                    cy="50%"
                    outerRadius={68}
                    innerRadius={32}
                    paddingAngle={3}
                    labelLine={false}
                  >
                    {categoryData.map((entry, i) => (
                      <Cell
                        key={`cell-${i}`}
                        fill={entry.color}
                        stroke="var(--bg-surface)"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    layout="vertical"
                    align="right"
                    verticalAlign="middle"
                    iconSize={7}
                    iconType="circle"
                    wrapperStyle={{ paddingLeft: 12 }}
                    formatter={(value, entry) => (
                      <span style={{
                        color: 'var(--text-primary)',
                        fontSize: '11px',
                        fontFamily: 'DM Sans, sans-serif',
                      }}>
                        {value}
                        <span style={{ color: 'var(--text-muted)', marginLeft: 4 }}>
                          ({entry.payload.value})
                        </span>
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}