'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, AlertTriangle, FileText, Building } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface Deal {
  id: number;
  businessName: string;
  amount: number;
  revenueShare: number;
  submittedDate: string;
  status: string;
  industry: string;
  documentsComplete: boolean;
  kycVerified: boolean;
}

interface Stats {
  pending: number;
  approved: number;
  rejected: number;
  underReview: number;
}

interface Props {
  deals: Deal[];
  stats: Stats;
}

export function AdminDealsList({ deals, stats }: Props) {
  return (
    <>
      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0, duration: 0.5 }}
          whileHover={{ y: -5, scale: 1.02 }}
        >
          <Card className="glass-card-light dark:glass-card-dark border-none bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardHeader className="pb-3 relative z-10">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Pending Review</CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center shadow-lg"
                >
                  <Clock className="h-6 w-6 text-white" />
                </motion.div>
                <p className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">{stats.pending}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          whileHover={{ y: -5, scale: 1.02 }}
        >
          <Card className="glass-card-light dark:glass-card-dark border-none bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardHeader className="pb-3 relative z-10">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Under Review</CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg"
                >
                  <AlertTriangle className="h-6 w-6 text-white" />
                </motion.div>
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{stats.underReview}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          whileHover={{ y: -5, scale: 1.02 }}
        >
          <Card className="glass-card-light dark:glass-card-dark border-none bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardHeader className="pb-3 relative z-10">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Approved</CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center shadow-lg"
                >
                  <CheckCircle className="h-6 w-6 text-white" />
                </motion.div>
                <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">{stats.approved}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          whileHover={{ y: -5, scale: 1.02 }}
        >
          <Card className="glass-card-light dark:glass-card-dark border-none bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30 overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardHeader className="pb-3 relative z-10">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Rejected</CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center shadow-lg"
                >
                  <XCircle className="h-6 w-6 text-white" />
                </motion.div>
                <p className="text-3xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">{stats.rejected}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Pending Deals */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <Card className="glass-card-light dark:glass-card-dark border-none overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Pending Deal Applications
            </CardTitle>
            <CardDescription>Review these applications for approval</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              {deals.map((deal, index) => (
                <motion.div
                  key={deal.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                  whileHover={{ x: 5, scale: 1.01 }}
                  className="p-6 glass-card-light dark:glass-card-dark border-none rounded-xl hover:shadow-xl transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                        <Building className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{deal.businessName}</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{deal.industry}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          Submitted: {new Date(deal.submittedDate).toLocaleDateString('en-ZA')}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {deal.status === 'PENDING_REVIEW' && (
                        <Badge className="bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-700">
                          Pending Review
                        </Badge>
                      )}
                      {deal.status === 'UNDER_REVIEW' && (
                        <Badge className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700">
                          Under Review
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg">
                      <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Funding Amount</p>
                      <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">R{deal.amount.toLocaleString()}</p>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-950/30 p-4 rounded-lg">
                      <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Revenue Share</p>
                      <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{deal.revenueShare}%</p>
                    </div>
                    <div className="bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-lg">
                      <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Repayment Cap</p>
                      <p className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">R{(deal.amount * 1.7).toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 mb-4">
                    <div className="flex items-center gap-2">
                      {deal.documentsComplete ? (
                        <>
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span className="text-sm font-medium text-green-700 dark:text-green-400">Documents Complete</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="h-5 w-5 text-orange-600" />
                          <span className="text-sm font-medium text-orange-700 dark:text-orange-400">Documents Pending</span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {deal.kycVerified ? (
                        <>
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span className="text-sm font-medium text-green-700 dark:text-green-400">KYC Verified</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="h-5 w-5 text-orange-600" />
                          <span className="text-sm font-medium text-orange-700 dark:text-orange-400">KYC Pending</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="default" className="bg-green-600 hover:bg-green-700 transition-transform hover:scale-105">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve Deal
                    </Button>
                    <Button variant="destructive" className="transition-transform hover:scale-105">
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                    <Button variant="outline" className="glass-card-light dark:glass-card-dark border-white/50 dark:border-slate-700/50 transition-transform hover:scale-105">
                      <FileText className="h-4 w-4 mr-2" />
                      View Documents
                    </Button>
                    <Link href={`/admin/deals/${deal.id}`}>
                      <Button variant="ghost" className="transition-transform hover:scale-105">Full Review</Button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
}
