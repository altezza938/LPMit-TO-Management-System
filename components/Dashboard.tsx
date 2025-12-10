import React, { useMemo } from 'react';
import { ProjectFeature, ChartData } from '../types';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Legend } from 'recharts';
import { COLORS } from '../constants';

interface DashboardProps {
  data: ProjectFeature[];
}

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const s3rStats = useMemo(() => {
    const counts: Record<string, number> = {};
    data.forEach(item => {
      counts[item.s3rCategory] = (counts[item.s3rCategory] || 0) + 1;
    });
    
    return Object.keys(counts).map(key => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value: counts[key],
      color: COLORS[key as keyof typeof COLORS] || '#ccc'
    }));
  }, [data]);

  const approvalStats = useMemo(() => {
    // Aggregating multiple approval types for a bar chart
    const stats = [
        { name: 'STLA/XP', approved: 0, pending: 0, na: 0 },
        { name: 'TPRP', approved: 0, pending: 0, na: 0 },
        { name: 'HSSP', approved: 0, pending: 0, na: 0 },
    ];

    data.forEach(item => {
        // STLA
        if (item.stlaCategory === 'approved') stats[0].approved++;
        else if (item.stlaCategory === 'not-applicable') stats[0].na++;
        else stats[0].pending++;

        // TPRP (Simplistic check based on string content for demo, ideally categorized in data)
        const tprpLower = item.tprpStatus.toLowerCase();
        if (tprpLower.includes('approved') || tprpLower.includes('endorsed')) stats[1].approved++;
        else if (tprpLower.includes('n/a')) stats[1].na++;
        else stats[1].pending++;

        // HSSP
        const hsspLower = item.hsspStatus.toLowerCase();
        if (hsspLower.includes('approved') || hsspLower.includes('endorsed')) stats[2].approved++;
        else if (hsspLower.includes('n/a')) stats[2].na++;
        else stats[2].pending++;
    });

    return stats;
  }, [data]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Key Metrics Cards */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Total Features</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">{data.length}</p>
          <div className="mt-2 text-xs text-green-600 font-medium">Active Monitoring</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">S3R Approved</h3>
          <p className="text-3xl font-bold text-emerald-600 mt-2">
            {data.filter(d => d.s3rCategory === 'approved').length}
          </p>
           <div className="mt-2 text-xs text-gray-400">
            {((data.filter(d => d.s3rCategory === 'approved').length / data.length) * 100).toFixed(0)}% Completion
           </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Access Issues</h3>
          <p className="text-3xl font-bold text-amber-500 mt-2">
             {data.filter(d => d.accessPermission.toLowerCase().includes('seeking') || d.accessPermission.toLowerCase().includes('liaison')).length}
          </p>
           <div className="mt-2 text-xs text-amber-600 font-medium">Requires Follow-up</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* S3R Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-96">
            <h3 className="text-gray-800 text-lg font-semibold mb-6">S3R Status Distribution</h3>
            <ResponsiveContainer width="100%" height="80%">
                <PieChart>
                    <Pie
                        data={s3rStats}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {s3rStats.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>

        {/* Approvals Overview */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-96">
            <h3 className="text-gray-800 text-lg font-semibold mb-6">Approvals & Permits Progress</h3>
             <ResponsiveContainer width="100%" height="85%">
                <BarChart data={approvalStats} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip cursor={{fill: '#f3f4f6'}} />
                    <Legend />
                    <Bar dataKey="approved" stackId="a" fill={COLORS.approved} name="Approved/Endorsed" radius={[0, 0, 4, 4]} />
                    <Bar dataKey="pending" stackId="a" fill={COLORS.pending} name="Pending/In Progress" />
                    <Bar dataKey="na" stackId="a" fill={COLORS['not-applicable']} name="N/A" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;