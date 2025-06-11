
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Calculator, Car, Clock, MapPin, CreditCard, Shield, Percent, Receipt } from 'lucide-react';

const CabCostCalculator = () => {
  const [data, setData] = useState({
    baseFare: 100,
    minKmIncluded: 10,
    totalKm: 15,
    extraPerKm: 10,
    includedMinutes: 60,
    totalMinutes: 70,
    extraPerMin: 2,
    pickCharges: 10,
    nightCharges: 40,
    cancellationFee: 0,
    insurance: 0,
    discount: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      [e.target.name]: parseFloat(e.target.value) || 0,
    });
  };

  // Calculations
  const remainingKm = Math.max(data.totalKm - data.minKmIncluded, 0);
  const amountForKm = remainingKm * data.extraPerKm;

  const remainingMinutes = Math.max(data.totalMinutes - data.includedMinutes, 0);
  const amountForMinutes = remainingMinutes * data.extraPerMin;

  const subtotal =
    data.baseFare +
    amountForKm +
    amountForMinutes +
    data.pickCharges +
    data.nightCharges +
    data.cancellationFee +
    data.insurance;

  const discountedTotal = subtotal - data.discount;
  const companyCommission = (discountedTotal * 10) / 100;
  const gst = (companyCommission * 18) / 100;
  const grandTotal = discountedTotal + companyCommission + gst;

  const inputSections = [
    {
      title: "Basic Fare",
      icon: <Car className="h-5 w-5" />,
      fields: [
        { key: 'baseFare', label: 'Base Fare (₹)' },
        { key: 'minKmIncluded', label: 'Min KM Included' },
        { key: 'totalKm', label: 'Total KM' },
        { key: 'extraPerKm', label: 'Extra Per KM (₹)' },
      ]
    },
    {
      title: "Time Charges",
      icon: <Clock className="h-5 w-5" />,
      fields: [
        { key: 'includedMinutes', label: 'Included Minutes' },
        { key: 'totalMinutes', label: 'Total Minutes' },
        { key: 'extraPerMin', label: 'Extra Per Minute (₹)' },
      ]
    },
    {
      title: "Additional Charges",
      icon: <MapPin className="h-5 w-5" />,
      fields: [
        { key: 'pickCharges', label: 'Pick Charges (₹)' },
        { key: 'nightCharges', label: 'Night Charges (₹)' },
        { key: 'cancellationFee', label: 'Cancellation Fee (₹)' },
        { key: 'insurance', label: 'Insurance (₹)' },
        { key: 'discount', label: 'Discount (₹)' },
      ]
    }
  ];

  const calculations = [
    { label: 'Remaining KM', value: remainingKm, icon: <MapPin className="h-4 w-4" /> },
    { label: 'Amount for KM', value: `₹${amountForKm}`, icon: <Car className="h-4 w-4" /> },
    { label: 'Remaining Minutes', value: remainingMinutes, icon: <Clock className="h-4 w-4" /> },
    { label: 'Amount for Minutes', value: `₹${amountForMinutes}`, icon: <Clock className="h-4 w-4" /> },
    { label: 'Subtotal', value: `₹${subtotal.toFixed(2)}`, icon: <Calculator className="h-4 w-4" /> },
    { label: 'Discount', value: `₹${data.discount}`, icon: <Percent className="h-4 w-4" /> },
    { label: 'Company Commission (10%)', value: `₹${companyCommission.toFixed(2)}`, icon: <CreditCard className="h-4 w-4" /> },
    { label: 'GST (18% of Commission)', value: `₹${gst.toFixed(2)}`, icon: <Shield className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-primary flex items-center justify-center gap-2">
              <Car className="h-8 w-8" />
              DriveGo Service Calculator
            </CardTitle>
            <CardDescription className="text-lg">
              Calculate your cab fare with detailed breakdown
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Sections */}
          <div className="lg:col-span-2 space-y-6">
            {inputSections.map((section) => (
              <Card key={section.title}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    {section.icon}
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {section.fields.map((field) => (
                      <div key={field.key} className="space-y-2">
                        <Label htmlFor={field.key} className="text-sm font-medium">
                          {field.label}
                        </Label>
                        <Input
                          id={field.key}
                          type="number"
                          name={field.key}
                          value={data[field.key as keyof typeof data]}
                          onChange={handleChange}
                          className="text-right"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Calculations Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Calculations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {calculations.map((calc, index) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2">
                      {calc.icon}
                      <span className="text-sm font-medium">{calc.label}</span>
                    </div>
                    <span className="font-semibold text-right">{calc.value}</span>
                  </div>
                ))}
                
                <Separator className="my-4" />
                
                {/* Grand Total */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Receipt className="h-6 w-6 text-green-600" />
                      <span className="text-lg font-bold text-green-800">Grand Total</span>
                    </div>
                    <span className="text-2xl font-bold text-green-700">
                      ₹{grandTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Summary Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Trip Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="space-y-2">
                    <div>
                      <span className="text-muted-foreground">Distance:</span>
                      <div className="font-semibold">{data.totalKm} KM</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Duration:</span>
                      <div className="font-semibold">{data.totalMinutes} min</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="text-muted-foreground">Base Fare:</span>
                      <div className="font-semibold">₹{data.baseFare}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Extra Charges:</span>
                      <div className="font-semibold">₹{(amountForKm + amountForMinutes + data.pickCharges + data.nightCharges).toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CabCostCalculator;
