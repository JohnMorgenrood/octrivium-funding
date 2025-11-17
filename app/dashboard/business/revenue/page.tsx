import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { TrendingUp, DollarSign, FileText, Upload } from 'lucide-react';

export default async function RevenueReportingPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'BUSINESS') {
    redirect('/login');
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Revenue Reporting
        </h1>
        <p className="text-slate-600">Submit your monthly revenue to calculate investor payouts</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              Last Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">R250,000</p>
            <p className="text-sm text-slate-600 mt-1">November 2025</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
              Investor Share
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">R12,500</p>
            <p className="text-sm text-slate-600 mt-1">5% of revenue</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>
              Reports Filed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">8 / 18</p>
            <p className="text-sm text-slate-600 mt-1">44% complete</p>
          </CardContent>
        </Card>
      </div>

      {/* Submit New Report */}
      <Card className="mb-8">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <CardTitle className="text-2xl">Submit Monthly Revenue Report</CardTitle>
          <CardDescription className="text-blue-100">
            Report your revenue for November 2025 (Due: December 10, 2025)
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="month">Reporting Month *</Label>
                <Input id="month" type="month" defaultValue="2025-11" required />
              </div>
              <div>
                <Label htmlFor="revenue">Total Revenue (ZAR) *</Label>
                <Input id="revenue" type="number" placeholder="e.g. 250000" required />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="transactions">Transaction Count</Label>
                <Input id="transactions" type="number" placeholder="Number of sales" />
              </div>
              <div>
                <Label htmlFor="growth">Growth vs Last Month</Label>
                <Input id="growth" type="text" placeholder="e.g. +15%" />
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                placeholder="Any additional context about this month's performance..."
                rows={4}
              />
            </div>

            <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
              <Upload className="h-12 w-12 mx-auto mb-4 text-slate-400" />
              <p className="text-sm font-medium mb-2">Upload Supporting Documents</p>
              <p className="text-xs text-slate-500">Bank statements, invoices, or financial reports (PDF, up to 10MB)</p>
              <Input type="file" className="hidden" accept=".pdf,.jpg,.png" multiple />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Revenue Share Calculation</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Monthly Revenue:</span>
                  <span className="font-medium">R250,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Revenue Share Percentage:</span>
                  <span className="font-medium">5.0%</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-blue-200">
                  <span className="font-semibold text-blue-900">Investor Payout:</span>
                  <span className="font-bold text-blue-900">R12,500</span>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Total Paid to Date:</span>
                  <span>R100,000 / R850,000 (12%)</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" size="lg" className="flex-1">
                Submit Revenue Report
              </Button>
              <Button type="button" variant="outline" size="lg">
                Save as Draft
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Previous Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Previous Reports</CardTitle>
          <CardDescription>Your submitted monthly revenue reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { month: 'October 2025', revenue: 230000, share: 11500, status: 'Paid' },
              { month: 'September 2025', revenue: 215000, share: 10750, status: 'Paid' },
              { month: 'August 2025', revenue: 198000, share: 9900, status: 'Paid' },
              { month: 'July 2025', revenue: 210000, share: 10500, status: 'Paid' },
              { month: 'June 2025', revenue: 225000, share: 11250, status: 'Paid' },
            ].map((report, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold">{report.month}</p>
                    <p className="text-sm text-slate-600">
                      Revenue: R{report.revenue.toLocaleString()} • Share: R{report.share.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    {report.status}
                  </span>
                  <Button variant="ghost" size="sm">View Details</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
