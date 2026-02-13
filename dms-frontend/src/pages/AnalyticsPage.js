import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { 
  FileText, 
  Users, 
  Search, 
  TrendingUp,
  RefreshCw
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';

const StatCard = ({ title, value, icon: Icon, description, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600'
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-500 uppercase tracking-wider">{title}</p>
            <p className="text-3xl font-bold font-outfit text-zinc-900 mt-2">{value}</p>
            {description && (
              <p className="text-sm text-zinc-500 mt-1">{description}</p>
            )}
          </div>
          <div className={`h-12 w-12 rounded-lg ${colorClasses[color]} flex items-center justify-center`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const AnalyticsPage = () => {
  const { api } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    try {
      const response = await api.get('/analytics');
      setAnalytics(response.data);
    } catch (error) {
      toast.error('Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <RefreshCw className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="p-8" data-testid="analytics-page">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-outfit tracking-tight text-zinc-900">Analytics</h1>
            <p className="text-zinc-500 mt-1">Monitor usage and access trends</p>
          </div>
          <Button 
            onClick={fetchAnalytics}
            variant="outline"
            className="gap-2"
            data-testid="refresh-analytics-btn"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Documents"
            value={analytics?.total_documents || 0}
            icon={FileText}
            description="In knowledge base"
            color="blue"
          />
          <StatCard
            title="Total Users"
            value={analytics?.total_users || 0}
            icon={Users}
            description="Active accounts"
            color="green"
          />
          <StatCard
            title="Total Queries"
            value={analytics?.total_queries || 0}
            icon={Search}
            description="Searches & chats"
            color="purple"
          />
          <StatCard
            title="Avg Daily Queries"
            value={Math.round((analytics?.total_queries || 0) / 7)}
            icon={TrendingUp}
            description="Last 7 days"
            color="orange"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Access Trends */}
          <Card data-testid="access-trends-chart">
            <CardHeader className="border-b border-zinc-100">
              <CardTitle className="text-lg font-outfit">Access Trends (7 days)</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {analytics?.access_trends?.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analytics.access_trends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={formatDate}
                      stroke="#71717a"
                      fontSize={12}
                    />
                    <YAxis stroke="#71717a" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e4e4e7',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                      labelFormatter={formatDate}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="queries" 
                      stroke="#2563eb" 
                      strokeWidth={2}
                      dot={{ fill: '#2563eb', strokeWidth: 2 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center h-[300px] text-zinc-400">
                  <TrendingUp className="h-12 w-12 mb-4" />
                  <p>No data available yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top Queries */}
          <Card data-testid="top-queries-chart">
            <CardHeader className="border-b border-zinc-100">
              <CardTitle className="text-lg font-outfit">Top Queries</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {analytics?.top_queries?.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart 
                    data={analytics.top_queries.slice(0, 5)} 
                    layout="vertical"
                    margin={{ left: 20, right: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                    <XAxis type="number" stroke="#71717a" fontSize={12} />
                    <YAxis 
                      type="category" 
                      dataKey="query" 
                      width={150}
                      stroke="#71717a"
                      fontSize={12}
                      tickFormatter={(value) => value.length > 20 ? value.slice(0, 20) + '...' : value}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e4e4e7',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                    />
                    <Bar 
                      dataKey="count" 
                      fill="#2563eb" 
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center h-[300px] text-zinc-400">
                  <Search className="h-12 w-12 mb-4" />
                  <p>No queries recorded yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Top Queries Table */}
        <Card data-testid="top-queries-table">
          <CardHeader className="border-b border-zinc-100">
            <CardTitle className="text-lg font-outfit">All Top Queries</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {analytics?.top_queries?.length > 0 ? (
              <div className="divide-y divide-zinc-100">
                {analytics.top_queries.map((item, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-4 hover:bg-zinc-50 transition-colors"
                    data-testid={`query-row-${index}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-8 w-8 rounded-full bg-zinc-100 flex items-center justify-center text-sm font-medium text-zinc-600">
                        {index + 1}
                      </div>
                      <p className="text-zinc-900 font-medium">{item.query}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-500 text-sm">{item.count} times</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-zinc-400">
                <Search className="h-12 w-12 mb-4" />
                <p className="text-lg font-medium">No queries yet</p>
                <p className="text-sm">Start searching to see popular queries</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
