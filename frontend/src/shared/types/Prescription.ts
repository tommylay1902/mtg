interface IObjectKeys {
  [key: string]: string | number | null;
}
export interface Prescription extends IObjectKeys {
  id: string;
  medication: string;
  dosage: string;
  notes: string;
  refills: number;
  started: string | null;
  ended: string | null;
}

export const generatePrescriptionTemplate = () => {
  return {
    id: "",
    medication: "",
    dosage: "",
    notes: "",
    refills: 0,
    started: "",
    ended: "",
  };
};
