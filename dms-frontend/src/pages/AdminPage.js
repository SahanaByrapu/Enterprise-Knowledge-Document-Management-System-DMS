import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ScrollArea } from '../components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { 
  Users, 
  Shield, 
  FileText, 
  RefreshCw,
  Trash2,
  Crown,
  UserCheck,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';

const getRoleBadge = (role) => {
  switch (role) {
    case 'admin':
      return <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100"><Crown className="h-3 w-3 mr-1" />Admin</Badge>;
    case 'user':
      return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100"><UserCheck className="h-3 w-3 mr-1" />User</Badge>;
    case 'viewer':
      return <Badge className="bg-zinc-100 text-zinc-700 hover:bg-zinc-100"><Eye className="h-3 w-3 mr-1" />Viewer</Badge>;
    default:
      return <Badge>{role}</Badge>;
  }
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getActionBadge = (action) => {
  const colors = {
    'LOGIN': 'bg-green-100 text-green-700',
    'REGISTER': 'bg-blue-100 text-blue-700',
    'UPLOAD': 'bg-purple-100 text-purple-700',
    'DELETE': 'bg-red-100 text-red-700',
    'SEARCH': 'bg-yellow-100 text-yellow-700',
    'UPDATE_ROLE': 'bg-orange-100 text-orange-700',
    'DELETE_USER': 'bg-red-100 text-red-700'
  };
  return (
    <Badge className={`${colors[action] || 'bg-zinc-100 text-zinc-700'} hover:${colors[action] || 'bg-zinc-100'}`}>
      {action}
    </Badge>
  );
};

export const AdminPage = () => {
  const { api, user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingLogs, setLoadingLogs] = useState(true);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoadingUsers(false);
    }
  }, [api]);

  const fetchAuditLogs = useCallback(async () => {
    try {
      const response = await api.get('/admin/audit-logs?limit=100');
      setAuditLogs(response.data);
    } catch (error) {
      toast.error('Failed to fetch audit logs');
    } finally {
      setLoadingLogs(false);
    }
  }, [api]);

  useEffect(() => {
    fetchUsers();
    fetchAuditLogs();
  }, [fetchUsers, fetchAuditLogs]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put('/admin/users/role', { user_id: userId, role: newRole });
      toast.success('Role updated successfully');
      fetchUsers();
      fetchAuditLogs();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to update role');
    }
  };

  const handleDeleteUser = async (userId, email) => {
    if (!window.confirm(`Delete user "${email}"? This action cannot be undone.`)) return;
    
    try {
      await api.delete(`/admin/users/${userId}`);
      toast.success('User deleted successfully');
      fetchUsers();
      fetchAuditLogs();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to delete user');
    }
  };

  return (
    <div className="p-8" data-testid="admin-page">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-outfit tracking-tight text-zinc-900">Admin Console</h1>
            <p className="text-zinc-500 mt-1">Manage users, roles, and view audit logs</p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="users" className="gap-2" data-testid="users-tab">
              <Users className="h-4 w-4" />
              Users & Roles
            </TabsTrigger>
            <TabsTrigger value="audit" className="gap-2" data-testid="audit-tab">
              <FileText className="h-4 w-4" />
              Audit Logs
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="mt-6">
            <Card data-testid="users-card">
              <CardHeader className="border-b border-zinc-100">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-outfit flex items-center gap-2">
                    <Shield className="h-5 w-5 text-zinc-500" />
                    User Management
                  </CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={fetchUsers}
                    className="gap-2"
                    data-testid="refresh-users-btn"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {loadingUsers ? (
                  <div className="flex items-center justify-center py-16">
                    <RefreshCw className="h-6 w-6 animate-spin text-zinc-400" />
                  </div>
                ) : users.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-zinc-400">
                    <Users className="h-12 w-12 mb-4" />
                    <p className="text-lg font-medium">No users found</p>
                  </div>
                ) : (
                  <div className="divide-y divide-zinc-100">
                    {users.map((user, index) => (
                      <div
                        key={user.id}
                        className="flex items-center gap-4 p-4 hover:bg-zinc-50 transition-colors animate-fade-in"
                        style={{ animationDelay: `${index * 50}ms` }}
                        data-testid={`user-row-${user.id}`}
                      >
                        <div className="h-10 w-10 rounded-full bg-zinc-200 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-medium text-zinc-600">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-zinc-900">{user.name}</p>
                          <p className="text-sm text-zinc-500 truncate">{user.email}</p>
                        </div>

                        <div className="flex items-center gap-3">
                          <Select
                            value={user.role}
                            onValueChange={(value) => handleRoleChange(user.id, value)}
                            disabled={user.id === currentUser?.id}
                          >
                            <SelectTrigger className="w-32" data-testid={`role-select-${user.id}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="user">User</SelectItem>
                              <SelectItem value="viewer">Viewer</SelectItem>
                            </SelectContent>
                          </Select>
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-zinc-400 hover:text-red-600"
                            onClick={() => handleDeleteUser(user.id, user.email)}
                            disabled={user.id === currentUser?.id}
                            data-testid={`delete-user-${user.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Audit Logs Tab */}
          <TabsContent value="audit" className="mt-6">
            <Card data-testid="audit-logs-card">
              <CardHeader className="border-b border-zinc-100">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-outfit flex items-center gap-2">
                    <FileText className="h-5 w-5 text-zinc-500" />
                    Audit Logs
                  </CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={fetchAuditLogs}
                    className="gap-2"
                    data-testid="refresh-logs-btn"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[600px]">
                  {loadingLogs ? (
                    <div className="flex items-center justify-center py-16">
                      <RefreshCw className="h-6 w-6 animate-spin text-zinc-400" />
                    </div>
                  ) : auditLogs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-zinc-400">
                      <FileText className="h-12 w-12 mb-4" />
                      <p className="text-lg font-medium">No audit logs yet</p>
                      <p className="text-sm">User actions will appear here</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-zinc-100">
                      {auditLogs.map((log, index) => (
                        <div
                          key={log.id}
                          className="p-4 hover:bg-zinc-50 transition-colors animate-fade-in"
                          style={{ animationDelay: `${index * 30}ms` }}
                          data-testid={`audit-log-${index}`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                {getActionBadge(log.action)}
                                <span className="text-sm font-medium text-zinc-900">{log.user_email}</span>
                              </div>
                              <p className="text-sm text-zinc-600">{log.details}</p>
                              <p className="text-xs text-zinc-400">Resource: {log.resource}</p>
                            </div>
                            <p className="text-xs text-zinc-500 whitespace-nowrap">
                              {formatDate(log.timestamp)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
