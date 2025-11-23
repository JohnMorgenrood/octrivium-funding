'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Users, 
  Plus, 
  Calculator,
  FileText,
  TrendingUp,
  DollarSign,
  ArrowLeft,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface PayrollCalculation {
  basicSalary: number;
  paye: number;
  uif: number;
  sdl: number;
  netSalary: number;
}

export default function PayrollPage() {
  const router = useRouter();
  const [employees, setEmployees] = useState<any[]>([]);
  const [showCalculator, setShowCalculator] = useState(false);
  const [basicSalary, setBasicSalary] = useState('');
  const [calculation, setCalculation] = useState<PayrollCalculation | null>(null);

  const calculatePayroll = () => {
    const salary = parseFloat(basicSalary);
    if (isNaN(salary) || salary <= 0) return;

    // PAYE (Pay As You Earn) - 2024 SA Tax Brackets
    let paye = 0;
    if (salary <= 237100 / 12) {
      paye = salary * 0.18;
    } else if (salary <= 370500 / 12) {
      paye = 42678 / 12 + (salary - 237100 / 12) * 0.26;
    } else if (salary <= 512800 / 12) {
      paye = 77362 / 12 + (salary - 370500 / 12) * 0.31;
    } else if (salary <= 673000 / 12) {
      paye = 121475 / 12 + (salary - 512800 / 12) * 0.36;
    } else if (salary <= 857900 / 12) {
      paye = 179147 / 12 + (salary - 673000 / 12) * 0.39;
    } else if (salary <= 1817000 / 12) {
      paye = 251258 / 12 + (salary - 857900 / 12) * 0.41;
    } else {
      paye = 644489 / 12 + (salary - 1817000 / 12) * 0.45;
    }

    // Apply monthly tax rebates (2024)
    const primaryRebate = 17235 / 12; // R1,436.25 per month
    paye = Math.max(0, paye - primaryRebate);

    // UIF (Unemployment Insurance Fund) - 1% of salary (capped at R17,712 monthly)
    const uifSalary = Math.min(salary, 17712);
    const uif = uifSalary * 0.01;

    // SDL (Skills Development Levy) - 1% of total payroll (employer only)
    const sdl = salary * 0.01;

    const netSalary = salary - paye - uif;

    setCalculation({
      basicSalary: salary,
      paye: Math.round(paye * 100) / 100,
      uif: Math.round(uif * 100) / 100,
      sdl: Math.round(sdl * 100) / 100,
      netSalary: Math.round(netSalary * 100) / 100,
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(amount);
  };

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-4 py-4 sm:py-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/dashboard/accounting/overview')}
              className="h-8 w-8 p-0"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Payroll</h1>
              <p className="text-sm text-muted-foreground">
                South African payroll management
              </p>
            </div>
          </div>
        </div>
        <Button onClick={() => setShowCalculator(!showCalculator)}>
          <Calculator className="h-4 w-4 mr-2" />
          Calculator
        </Button>
      </div>

      {/* Payroll Calculator */}
      {showCalculator && (
        <Card className="border-2 border-primary/20 shadow-lg backdrop-blur-sm bg-background/95">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              SA Payroll Calculator
            </CardTitle>
            <CardDescription>
              Calculate PAYE, UIF, and SDL for 2024 tax year
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="basicSalary">Basic Monthly Salary (ZAR)</Label>
                <Input
                  id="basicSalary"
                  type="number"
                  placeholder="Enter monthly salary"
                  value={basicSalary}
                  onChange={(e) => setBasicSalary(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && calculatePayroll()}
                />
              </div>
              <div className="flex items-end">
                <Button onClick={calculatePayroll} className="w-full">
                  <Calculator className="h-4 w-4 mr-2" />
                  Calculate
                </Button>
              </div>
            </div>

            {calculation && (
              <div className="mt-6 space-y-4 p-4 rounded-lg bg-muted/30 dark:bg-muted/10 border border-border">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Basic Salary:</span>
                      <span className="font-semibold">{formatCurrency(calculation.basicSalary)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-red-600 dark:text-red-400">
                      <span>PAYE (Tax):</span>
                      <span className="font-semibold">-{formatCurrency(calculation.paye)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-red-600 dark:text-red-400">
                      <span>UIF (1%):</span>
                      <span className="font-semibold">-{formatCurrency(calculation.uif)}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-amber-600 dark:text-amber-400">
                      <span>SDL (Employer - 1%):</span>
                      <span className="font-semibold">{formatCurrency(calculation.sdl)}</span>
                    </div>
                    <div className="h-px bg-border my-2"></div>
                    <div className="flex justify-between text-base sm:text-lg font-bold text-green-600 dark:text-green-500">
                      <span>Net Salary:</span>
                      <span>{formatCurrency(calculation.netSalary)}</span>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded">
                  <p className="font-semibold mb-1">Tax Year 2024 Calculations:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>PAYE based on 2024 tax brackets with primary rebate (R1,436/month)</li>
                    <li>UIF capped at R177.12 per month (1% of R17,712)</li>
                    <li>SDL is employer contribution (not deducted from employee)</li>
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Stats Overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="backdrop-blur-sm bg-background/95">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {employees.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Active employees
            </p>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-background/95">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Payroll</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total monthly cost
            </p>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-background/95">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">PAYE Due</CardTitle>
            <FileText className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Monthly tax payment
            </p>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-background/95">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">UIF + SDL</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {formatCurrency(0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Monthly contributions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Employee List */}
      <Card className="backdrop-blur-sm bg-background/95">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Employees</CardTitle>
              <CardDescription>
                Manage employee payroll information
              </CardDescription>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Employee
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {employees.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No employees yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Add your first employee to start managing payroll
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add First Employee
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Employee list will go here */}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Info */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-800 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-blue-900 dark:text-blue-100">
            South African Payroll Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
              <div>
                <span className="font-semibold">PAYE:</span> Pay-As-You-Earn tax based on income brackets, deducted monthly
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
              <div>
                <span className="font-semibold">UIF:</span> 1% employee + 1% employer contribution (capped at R17,712 salary)
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
              <div>
                <span className="font-semibold">SDL:</span> 1% of total payroll paid by employer for skills development
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
              <div>
                <span className="font-semibold">Payment Dates:</span> PAYE/UIF/SDL due by 7th of following month
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
