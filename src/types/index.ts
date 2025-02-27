
export interface BloodSugarReading {
  id: string;
  value: number;
  date: string;
  time: string;
  testType: string;
  note?: string;
  status: 'normal' | 'high' | 'low';
}

export type TestType = 'Finger Prick' | 'Continuous Monitor' | 'Lab Test';

export const TEST_TYPES: TestType[] = [
  'Finger Prick',
  'Continuous Monitor',
  'Lab Test'
];

export const BLOOD_SUGAR_THRESHOLDS = {
  LOW: 70,     // Below 70 mg/dL is considered low
  HIGH: 180    // Above 180 mg/dL is considered high
};
