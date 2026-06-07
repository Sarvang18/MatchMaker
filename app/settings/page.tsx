import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50 pl-60">
      <div className="p-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your matchmaker account and preferences</p>
        </div>

        <div className="space-y-6">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Your matchmaker account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Name</label>
                  <p className="text-gray-900 mt-1">{session.user?.name || 'Not set'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="text-gray-900 mt-1">{session.user?.email || 'Not set'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Email Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Email Configuration</CardTitle>
              <CardDescription>Gmail SMTP settings for sending match emails</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">Email Service</p>
                  <p className="text-gray-600 text-sm mt-1">Gmail SMTP</p>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Active
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Sending Email</p>
                <p className="text-gray-900 mt-1">{process.env.GMAIL_USER || 'Not configured'}</p>
              </div>
              <div className="text-sm text-gray-500 bg-blue-50 p-3 rounded-lg border border-blue-200">
                <p className="font-medium text-blue-900 mb-1">ℹ️ Configuration</p>
                <p>Email settings are configured in your .env file. Update GMAIL_USER and GMAIL_APP_PASSWORD to change email credentials.</p>
              </div>
            </CardContent>
          </Card>

          {/* AI Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>AI Configuration</CardTitle>
              <CardDescription>Google Gemini AI for match insights</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">AI Service</p>
                  <p className="text-gray-600 text-sm mt-1">Google Gemini 1.5 Flash</p>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Active
                </Badge>
              </div>
              <div className="text-sm text-gray-500 bg-blue-50 p-3 rounded-lg border border-blue-200">
                <p className="font-medium text-blue-900 mb-1">ℹ️ Configuration</p>
                <p>AI settings are configured in your .env file. Update GEMINI_API_KEY to change API credentials.</p>
              </div>
            </CardContent>
          </Card>

          {/* Database Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Database</CardTitle>
              <CardDescription>PostgreSQL database connection</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">Database Type</p>
                  <p className="text-gray-600 text-sm mt-1">PostgreSQL</p>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Connected
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
