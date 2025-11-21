'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Loader2, Upload, X, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

export default function CreateDealPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fundingGoal: '',
    revenueSharePercentage: '',
    duration: '12',
    industry: '',
    location: '',
    monthlyRevenue: '',
    revenueGrowth: '',
    riskLevel: 'Medium',
    foundedYear: '',
    minInvestment: '1000',
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be less than 5MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Create FormData to handle file upload
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('fundingGoal', formData.fundingGoal);
      submitData.append('revenueSharePercentage', formData.revenueSharePercentage);
      submitData.append('duration', formData.duration);
      submitData.append('industry', formData.industry);
      submitData.append('location', formData.location);
      submitData.append('monthlyRevenue', formData.monthlyRevenue);
      submitData.append('revenueGrowth', formData.revenueGrowth);
      submitData.append('riskLevel', formData.riskLevel);
      submitData.append('foundedYear', formData.foundedYear);
      submitData.append('minInvestment', formData.minInvestment);
      
      if (imageFile) {
        submitData.append('image', imageFile);
      }

      const res = await fetch('/api/deals', {
        method: 'POST',
        body: submitData,
      });

      const data = await res.json();

      if (!res.ok) {
        console.error('API Error:', data);
        setError(data.error || 'Failed to create deal');
        return;
      }

      // Show success message with next steps
      if (data.message) {
        alert(data.message);
      }

      router.push('/dashboard/business/deals');
      router.refresh();
    } catch (err) {
      console.error('Deal creation error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Create New Deal</h1>
          <p className="text-muted-foreground">Set up a new funding campaign for your business</p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Deal Information</CardTitle>
          <CardDescription>
            Provide details about your funding requirements and revenue-sharing terms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-800">
                <p className="text-sm text-red-700 font-medium dark:text-red-300">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="title">Deal Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Expand Our Online Store"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
              <p className="text-xs text-muted-foreground">
                A clear, compelling title that describes your funding goal
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Deal Image (Optional)</Label>
              <div className="space-y-4">
                {imagePreview ? (
                  <div className="relative w-full h-64 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 bg-gray-50">
                    <Image
                      src={imagePreview}
                      alt="Deal preview"
                      fill
                      className="object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8"
                      onClick={removeImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-64 rounded-lg border-2 border-dashed border-gray-300 hover:border-primary bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer flex flex-col items-center justify-center gap-3"
                  >
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <ImageIcon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-gray-700">Click to upload deal image</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        PNG, JPG up to 5MB
                      </p>
                    </div>
                    <Button type="button" variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Browse Files
                    </Button>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Upload an attractive image that represents your business or funding goal
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe your business, how you'll use the funds, and your revenue model..."
                rows={6}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
              <p className="text-xs text-muted-foreground">
                Explain your business model, growth plans, and how investors will benefit
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="industry">Industry *</Label>
                <select
                  id="industry"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  required
                >
                  <option value="">Select industry...</option>
                  <option value="Technology">Technology</option>
                  <option value="E-commerce">E-commerce</option>
                  <option value="Food & Beverage">Food & Beverage</option>
                  <option value="Renewable Energy">Renewable Energy</option>
                  <option value="FinTech">FinTech</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Logistics">Logistics</option>
                  <option value="Retail">Retail</option>
                  <option value="Services">Services</option>
                  <option value="Other">Other</option>
                </select>
                <p className="text-xs text-muted-foreground">
                  Your business sector or industry
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <select
                  id="location"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                >
                  <option value="">Select location...</option>
                  <option value="Johannesburg">Johannesburg</option>
                  <option value="Cape Town">Cape Town</option>
                  <option value="Durban">Durban</option>
                  <option value="Pretoria">Pretoria</option>
                  <option value="Port Elizabeth">Port Elizabeth</option>
                  <option value="Bloemfontein">Bloemfontein</option>
                  <option value="East London">East London</option>
                  <option value="Polokwane">Polokwane</option>
                  <option value="Nelspruit">Nelspruit</option>
                  <option value="Kimberley">Kimberley</option>
                  <option value="Other">Other</option>
                </select>
                <p className="text-xs text-muted-foreground">
                  Primary business location in South Africa
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="monthlyRevenue">Monthly Revenue (ZAR) *</Label>
                <Input
                  id="monthlyRevenue"
                  type="number"
                  min="0"
                  step="1000"
                  placeholder="50000"
                  value={formData.monthlyRevenue}
                  onChange={(e) => setFormData({ ...formData, monthlyRevenue: e.target.value })}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Average monthly revenue
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="revenueGrowth">Revenue Growth (%) *</Label>
                <Input
                  id="revenueGrowth"
                  type="number"
                  min="0"
                  max="1000"
                  step="0.1"
                  placeholder="15.5"
                  value={formData.revenueGrowth}
                  onChange={(e) => setFormData({ ...formData, revenueGrowth: e.target.value })}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Monthly growth rate
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="foundedYear">Founded Year *</Label>
                <Input
                  id="foundedYear"
                  type="number"
                  min="1900"
                  max="2025"
                  placeholder="2020"
                  value={formData.foundedYear}
                  onChange={(e) => setFormData({ ...formData, foundedYear: e.target.value })}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Year business started
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="riskLevel">Risk Level *</Label>
              <select
                id="riskLevel"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={formData.riskLevel}
                onChange={(e) => setFormData({ ...formData, riskLevel: e.target.value })}
                required
              >
                <option value="Low">Low - Established business, proven track record</option>
                <option value="Medium">Medium - Growing business, moderate risk</option>
                <option value="High">High - Early stage, higher risk/reward</option>
              </select>
              <p className="text-xs text-muted-foreground">
                Honest risk assessment helps investors make informed decisions
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fundingGoal">Funding Goal (ZAR) *</Label>
                <Input
                  id="fundingGoal"
                  type="number"
                  min="10000"
                  step="1000"
                  placeholder="50000"
                  value={formData.fundingGoal}
                  onChange={(e) => setFormData({ ...formData, fundingGoal: e.target.value })}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Minimum: R10,000
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="minInvestment">Minimum Investment (ZAR) *</Label>
                <Input
                  id="minInvestment"
                  type="number"
                  min="1000"
                  step="100"
                  placeholder="1000"
                  value={formData.minInvestment}
                  onChange={(e) => setFormData({ ...formData, minInvestment: e.target.value })}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Minimum: R1,000
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="revenueSharePercentage">Revenue Share (%) *</Label>
                <Input
                  id="revenueSharePercentage"
                  type="number"
                  min="1"
                  max="30"
                  step="0.5"
                  placeholder="10"
                  value={formData.revenueSharePercentage}
                  onChange={(e) => setFormData({ ...formData, revenueSharePercentage: e.target.value })}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  % of monthly revenue shared with investors (1-30%)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Repayment Duration (months) *</Label>
                <Input
                  id="duration"
                  type="number"
                  min="6"
                  max="60"
                  placeholder="12"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  How long you'll share revenue with investors (6-60 months)
                </p>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Create Deal
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
