import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AlertCircle, Info } from 'lucide-react';

const InsuranceCalculator = () => {
  const [formData, setFormData] = useState({
    age: 30,
    nationality: '',
    currentCountry: '',
    hasPreExisting: false,
    coverageType: 'IP',
    paymentFrequency: 'annual'
  });

  const [premium, setPremium] = useState(0);

  // Premium rates from the policy document
  const premiumRates = {
    IP: {
      '0-3': 440, '4-18': 380, '19-25': 419, '26-30': 474,
      '31-35': 566, '36-40': 656, '41-45': 768, '46-50': 901,
      '51-55': 1069, '56-60': 1275, '61-65': 1560, '66-70': 1984,
      '71-75': 2335, '76-80': 2900, '81-85': 3600, '86-90': 4200,
      '91-95': 5100, '96-100': 6500
    },
    'IP+OP': {
      '0-3': 1309, '4-18': 818, '19-25': 765, '26-30': 893,
      '31-35': 1020, '36-40': 1148, '41-45': 1339, '46-50': 1466,
      '51-55': 1785, '56-60': 2550, '61-65': 3432, '66-70': 4365,
      '71-75': 5137, '76-80': 6380, '81-85': 7920, '86-90': 9240,
      '91-95': 11220, '96-100': 14300
    }
  };

  // Available countries for residence
  const availableCountries = [
    'Thailand', 'Vietnam', 'Indonesia', 'Malaysia', 'Philippines',
    'Cambodia', 'Laos', 'Myanmar', 'India', 'Sri Lanka',
    'France', 'Germany', 'Italy', 'Spain', 'Netherlands'
  ].sort();

  // Premium hospitals with 40% co-payment
  const premiumHospitals = {
    'Thailand': ['Bumrungrad International Hospital', 'First Western Hospital'],
    'Indonesia': ['BIMC Hospital, Kuta', 'BIMC Hospital, Nusa Dua'],
    'Vietnam': ['Franco-Vietnamese Hospital'],
    'Philippines': [
      'Asian Hospital and Medical Center',
      'St Luke\'s Medical Center',
      'The Medical City',
      'Makati Medical Center'
    ],
    'India': ['Wockhardt Hospital'],
    'France': ['American Hospital of Paris', 'Clinique Victor Hugo']
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getAgeGroup = (age) => {
    const ranges = [3, 18, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];
    for (let i = 0; i < ranges.length; i++) {
      if (age <= ranges[i]) {
        if (i === 0) return '0-3';
        return `${ranges[i-1]+1}-${ranges[i]}`;
      }
    }
    return '96-100';
  };

  const calculatePremium = () => {
    const ageGroup = getAgeGroup(formData.age);
    const basePremium = premiumRates[formData.coverageType][ageGroup];
    return formData.paymentFrequency === 'semi-annual' ? (basePremium * 1.02) / 2 : basePremium;
  };

  useEffect(() => {
    setPremium(calculatePremium());
  }, [formData]);

  const getWarnings = () => {
    const warnings = [];
    if (formData.age > 55) {
      warnings.push('Age exceeds the maximum enrollment age of 55 years');
    }
    if (formData.hasPreExisting) {
      warnings.push('Pre-existing conditions are not covered under this policy');
    }
    return warnings;
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Pacific Cross First Care 200 Premium Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Personal Information Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Age</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', Number(e.target.value))}
                  className="w-full p-2 border rounded"
                  min="0"
                  max="100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Nationality</label>
                <input
                  type="text"
                  value={formData.nationality}
                  onChange={(e) => handleInputChange('nationality', e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Country of Residence</label>
                <select
                  value={formData.currentCountry}
                  onChange={(e) => handleInputChange('currentCountry', e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Country</option>
                  {availableCountries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Pre-existing Conditions</label>
                <select
                  value={formData.hasPreExisting}
                  onChange={(e) => handleInputChange('hasPreExisting', e.target.value === 'true')}
                  className="w-full p-2 border rounded"
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </div>
            </div>
          </div>

          {/* Insurance Options Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-4">Insurance Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Coverage Type</label>
                <select
                  value={formData.coverageType}
                  onChange={(e) => handleInputChange('coverageType', e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="IP">Inpatient Only</option>
                  <option value="IP+OP">Inpatient + Outpatient</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Payment Frequency</label>
                <select
                  value={formData.paymentFrequency}
                  onChange={(e) => handleInputChange('paymentFrequency', e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="annual">Annual</option>
                  <option value="semi-annual">Semi-Annual (+2%)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Premium Display */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Premium Summary</h3>
            <p className="text-3xl font-bold text-blue-600">
              ${premium.toFixed(2)} 
              <span className="text-sm text-gray-500">
                USD per {formData.paymentFrequency === 'annual' ? 'year' : '6 months'}
              </span>
            </p>
            
            {/* Premium Breakdown */}
            <div className="mt-4 space-y-2 text-sm border-t pt-4">
              <div className="flex justify-between">
                <span>Base Premium:</span>
                <span>${(premium / (formData.paymentFrequency === 'semi-annual' ? 1.02 : 1)).toFixed(2)} USD</span>
              </div>
              {formData.paymentFrequency === 'semi-annual' && (
                <div className="flex justify-between text-gray-600">
                  <span>Loading (2%):</span>
                  <span>${(premium - (premium / 1.02)).toFixed(2)} USD</span>
                </div>
              )}
            </div>
          </div>

          {/* Warnings Section */}
          {getWarnings().length > 0 && (
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <AlertCircle className="w-4 h-4 mr-2 text-yellow-600" />
                <span className="font-medium text-yellow-600">Important Notices</span>
              </div>
              <ul className="list-disc pl-5 space-y-1">
                {getWarnings().map((warning, index) => (
                  <li key={index} className="text-sm text-yellow-700">{warning}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Hospital Network Section */}
          {formData.currentCountry && premiumHospitals[formData.currentCountry] && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-4">Premium Hospital Network</h3>
              <div className="space-y-2">
                <div className="text-sm text-yellow-600 mb-2">
                  <AlertCircle className="w-4 h-4 inline mr-2" />
                  40% co-payment applies at the following hospitals:
                </div>
                {premiumHospitals[formData.currentCountry].map(hospital => (
                  <div key={hospital} className="flex items-center p-2 bg-white rounded border">
                    <div className="flex-1">{hospital}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Benefits Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-4">Coverage Benefits</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-blue-600 mb-2">Inpatient Coverage</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-white p-2 rounded">Room & Board: Private Room</div>
                  <div className="bg-white p-2 rounded">Surgery: Full Refund</div>
                  <div className="bg-white p-2 rounded">ICU: Full Refund</div>
                  <div className="bg-white p-2 rounded">Physician Fees: Full Refund</div>
                </div>
              </div>

              {formData.coverageType === 'IP+OP' && (
                <div>
                  <h4 className="text-sm font-medium text-blue-600 mb-2">Outpatient Coverage</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-white p-2 rounded">Consultations: Full Refund</div>
                    <div className="bg-white p-2 rounded">Diagnostics: Full Refund</div>
                    <div className="bg-white p-2 rounded">Medications: Full Refund</div>
                    <div className="bg-white p-2 rounded">Annual Limit: $2,500</div>
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-sm font-medium text-blue-600 mb-2">Additional Benefits</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-white p-2 rounded">Emergency Evacuation</div>
                  <div className="bg-white p-2 rounded">Cancer Treatment</div>
                  <div className="bg-white p-2 rounded">Organ Transplant: $100,000</div>
                  <div className="bg-white p-2 rounded">Emergency Dental</div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Notes */}
          <div className="text-sm text-gray-600">
            <div className="flex items-start">
              <Info className="w-4 h-4 mr-2 mt-0.5 text-blue-500" />
              <div>
                <p className="font-medium">Key Information:</p>
                <ul className="list-disc pl-5 space-y-1 mt-1">
                  <li>Maximum coverage: $200,000 USD per year</li>
                  <li>Inpatient deductible: $100 USD</li>
                  <li>30-day waiting period for non-emergency treatments</li>
                  <li>14-day free look period</li>
                  <li>24/7 emergency assistance included</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InsuranceCalculator;
