import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Calculator,
  Car,
  Clock,
  MapPin,
  CreditCard,
  Shield,
  Percent,
  Receipt,
  Plus,
  Trash2,
  Calendar,
  Timer
} from 'lucide-react';

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
    extraCharges: 0,
  });

  const [peakHours, setPeakHours] = useState([]);
  const [peakDateRanges, setPeakDateRanges] = useState([]);
  const [showPeakHoursDialog, setShowPeakHoursDialog] = useState(false);
  const [showPeakDatesDialog, setShowPeakDatesDialog] = useState(false);

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: parseFloat(e.target.value) || 0,
    });
  };

  const addPeakHour = () => {
    setPeakHours([...peakHours, {
      id: Date.now(),
      startTime: '',
      endTime: '',
      price: 0
    }]);
  };

  const removePeakHour = (id) => {
    setPeakHours(peakHours.filter(hour => hour.id !== id));
  };

  const updatePeakHour = (id, field, value) => {
    setPeakHours(peakHours.map(hour => 
      hour.id === id ? { ...hour, [field]: value } : hour
    ));
  };

  const addPeakDateRange = () => {
    setPeakDateRanges([...peakDateRanges, {
      id: Date.now(),
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
      price: 0
    }]);
  };

  const removePeakDateRange = (id) => {
    setPeakDateRanges(peakDateRanges.filter(range => range.id !== id));
  };

  const updatePeakDateRange = (id, field, value) => {
    setPeakDateRanges(peakDateRanges.map(range => 
      range.id === id ? { ...range, [field]: value } : range
    ));
  };

  // Calculations
  const remainingKm = Math.max(data.totalKm - data.minKmIncluded, 0);
  const amountForKm = remainingKm * data.extraPerKm;

  const remainingMinutes = Math.max(data.totalMinutes - data.includedMinutes, 0);
  const amountForMinutes = remainingMinutes * data.extraPerMin;

  const peakHourCharges = peakHours.reduce((total, hour) => total + hour.price, 0);
  const peakDateCharges = peakDateRanges.reduce((total, range) => total + range.price, 0);

  const additionalCharges =
    data.pickCharges + 
    data.nightCharges + 
    data.cancellationFee + 
    data.insurance + 
    data.extraCharges +
    peakHourCharges +
    peakDateCharges;

  const subtotal =
    data.baseFare + amountForKm + amountForMinutes + additionalCharges;

  const rawCommission = (subtotal * 10) / 100;

  const discount = Math.min(data.discount, rawCommission + additionalCharges);
  const discountFromCommission = Math.min(discount, rawCommission);
  const discountFromAdditional = discount - discountFromCommission;

  const adjustedCommission = rawCommission - discountFromCommission;
  const adjustedAdditionalCharges = additionalCharges - discountFromAdditional;

  const gst = (adjustedCommission * 18) / 100;

  const grandTotal =
    data.baseFare +
    amountForKm +
    amountForMinutes +
    adjustedAdditionalCharges +
    adjustedCommission +
    gst;

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
        { key: 'extraCharges', label: 'Extra Other Charges (₹)' },
        { key: 'discount', label: 'Discount (₹)' },
      ]
    }
  ];

  const calculations = [
    { label: 'Remaining KM', value: remainingKm, icon: <MapPin className="h-4 w-4" /> },
    { label: 'Amount for KM', value: `₹${amountForKm}`, icon: <Car className="h-4 w-4" /> },
    { label: 'Remaining Minutes', value: remainingMinutes, icon: <Clock className="h-4 w-4" /> },
    { label: 'Amount for Minutes', value: `₹${amountForMinutes}`, icon: <Clock className="h-4 w-4" /> },
    { label: 'Peak Hour Charges', value: `₹${peakHourCharges}`, icon: <Timer className="h-4 w-4" /> },
    { label: 'Peak Date Charges', value: `₹${peakDateCharges}`, icon: <Calendar className="h-4 w-4" /> },
    { label: 'Subtotal', value: `₹${subtotal.toFixed(2)}`, icon: <Calculator className="h-4 w-4" /> },
    { label: 'Discount', value: `₹${discount}`, icon: <Percent className="h-4 w-4" /> },
    { label: 'Company Commission (10%)', value: `₹${adjustedCommission.toFixed(2)}`, icon: <CreditCard className="h-4 w-4" /> },
    { label: 'GST (18% of Commission)', value: `₹${gst.toFixed(2)}`, icon: <Shield className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
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
                          value={data[field.key]}
                          onChange={handleChange}
                          className="text-right"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    ))}
                  </div>
                  
                  {section.title === "Additional Charges" && (
                    <div className="mt-6 space-y-3">
                      <Separator />
                      <div className="flex flex-wrap gap-3">
                        <Dialog open={showPeakHoursDialog} onOpenChange={setShowPeakHoursDialog}>
                          <DialogTrigger asChild>
                            <Button variant="outline" className="flex items-center gap-2">
                              <Timer className="h-4 w-4" />
                              Peak Hours ({peakHours.length})
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                <Timer className="h-5 w-5" />
                                Peak Hours
                              </DialogTitle>
                              <DialogDescription>
                                Add peak hour time slots with additional charges
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <Button onClick={addPeakHour} className="w-full">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Peak Hour
                              </Button>
                              {peakHours.map((hour, index) => (
                                <Card key={hour.id}>
                                  <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                      <CardTitle className="text-base">Peak Hour {index + 1}</CardTitle>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => removePeakHour(hour.id)}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </CardHeader>
                                  <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <Label>Start Time</Label>
                                        <Input
                                          type="time"
                                          value={hour.startTime}
                                          onChange={(e) => updatePeakHour(hour.id, 'startTime', e.target.value)}
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label>End Time</Label>
                                        <Input
                                          type="time"
                                          value={hour.endTime}
                                          onChange={(e) => updatePeakHour(hour.id, 'endTime', e.target.value)}
                                        />
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Price (₹)</Label>
                                      <Input
                                        type="number"
                                        value={hour.price}
                                        onChange={(e) => updatePeakHour(hour.id, 'price', parseFloat(e.target.value) || 0)}
                                        min="0"
                                        step="0.01"
                                      />
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Dialog open={showPeakDatesDialog} onOpenChange={setShowPeakDatesDialog}>
                          <DialogTrigger asChild>
                            <Button variant="outline" className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              Peak Date Ranges ({peakDateRanges.length})
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Peak Date Ranges
                              </DialogTitle>
                              <DialogDescription>
                                Add peak date ranges with specific time slots and charges
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <Button onClick={addPeakDateRange} className="w-full">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Peak Date Range
                              </Button>
                              {peakDateRanges.map((range, index) => (
                                <Card key={range.id}>
                                  <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                      <CardTitle className="text-base">Peak Date Range {index + 1}</CardTitle>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => removePeakDateRange(range.id)}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </CardHeader>
                                  <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <Label>Start Date</Label>
                                        <Input
                                          type="date"
                                          value={range.startDate}
                                          onChange={(e) => updatePeakDateRange(range.id, 'startDate', e.target.value)}
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label>End Date</Label>
                                        <Input
                                          type="date"
                                          value={range.endDate}
                                          onChange={(e) => updatePeakDateRange(range.id, 'endDate', e.target.value)}
                                        />
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <Label>Start Time</Label>
                                        <Input
                                          type="time"
                                          value={range.startTime}
                                          onChange={(e) => updatePeakDateRange(range.id, 'startTime', e.target.value)}
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label>End Time</Label>
                                        <Input
                                          type="time"
                                          value={range.endTime}
                                          onChange={(e) => updatePeakDateRange(range.id, 'endTime', e.target.value)}
                                        />
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Price (₹)</Label>
                                      <Input
                                        type="number"
                                        value={range.price}
                                        onChange={(e) => updatePeakDateRange(range.id, 'price', parseFloat(e.target.value) || 0)}
                                        min="0"
                                        step="0.01"
                                      />
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

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
                      <div className="font-semibold">₹{(amountForKm + amountForMinutes + data.pickCharges + data.nightCharges + peakHourCharges + peakDateCharges).toFixed(2)}</div>
                    </div>
                  </div>
                </div>
                
                {(peakHours.length > 0 || peakDateRanges.length > 0) && (
                  <>
                    <Separator className="my-3" />
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-muted-foreground">Peak Pricing Active:</div>
                      {peakHours.length > 0 && (
                        <div className="text-xs">• {peakHours.length} Peak Hour(s)</div>
                      )}
                      {peakDateRanges.length > 0 && (
                        <div className="text-xs">• {peakDateRanges.length} Peak Date Range(s)</div>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CabCostCalculator;