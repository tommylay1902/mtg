import { ModalOperations } from "@/shared/types/enum/ModalOperations";
import { Prescription } from "@/shared/types/Prescription";
import React from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { stringToHTMLDate, stringToTimeStamp } from "@/shared/util/Date";

interface ModalBodyProps {
  operation: ModalOperations;
  data: Prescription[];
  open: boolean;
  updatePrescriptions: Prescription[];
  setUpdatePrescriptions: React.Dispatch<React.SetStateAction<Prescription[]>>;
}

const ModalBody: React.FC<ModalBodyProps> = ({
  operation,
  data,
  setUpdatePrescriptions,
}) => {
  const handleChange = (
    id: string,
    key: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setUpdatePrescriptions((prev: Prescription[]) => {
      const prescriptionChange = prev.find((e) => e.id === id);
      if (prescriptionChange !== undefined && prescriptionChange !== null) {
        if (key === "started" || key === "ended") {
          prescriptionChange[key] = stringToTimeStamp(e.target.value);
        } else if (key === "refills") {
          prescriptionChange[key] = parseInt(e.target.value);
        } else prescriptionChange[key] = e.target.value;
      }
      return prev;
    });
  };

  if (operation === ModalOperations.Update) {
    return data.map((p) => {
      return (
        <div className="py-4">
          <div className="items-center text-center">
            <h1 className={"font-bold underline"}>
              Medication: {p.medication}
            </h1>
          </div>
          <div className="items-center">
            <Label htmlFor="medication" className="text-right">
              Medication
            </Label>
            <Input
              id="medication"
              placeholder="e.g. Prednisone"
              defaultValue={p.medication}
              onChange={(e) => handleChange(p.id, "medication", e)}
            />
          </div>
          <div className="items-center">
            <Label htmlFor="dosage" className="text-right">
              Dosage
            </Label>
            <Input
              id="dosage"
              placeholder="e.g. 20mg daily"
              defaultValue={p.dosage}
              onChange={(e) => handleChange(p.id, "dosage", e)}
            />
          </div>

          <div className="items-center w-[50vw]">
            <Label htmlFor="notes" className="text-right">
              Notes
            </Label>
            <Input
              id="notes"
              placeholder="e.g. Steroid medication prescribed to help reduce inflamation"
              defaultValue={p.notes}
              onChange={(e) => handleChange(p.id, "notes", e)}
            />
          </div>

          <div className="items-center w-[50vw]">
            <Label htmlFor="refills" className="text-right">
              Refills
            </Label>
            <Input
              id="refills"
              placeholder="e.g. 3"
              type="number"
              defaultValue={
                p.refills == null || p.refills == undefined ? 0 : p.refills
              }
              onChange={(e) => handleChange(p.id, "refills", e)}
            />
          </div>

          <div className="items-center w-[50vw]">
            <Label htmlFor="started" className="text-right">
              Started
            </Label>
            <Input
              id="started"
              type="date"
              defaultValue={stringToHTMLDate(p.started)}
              onChange={(e) => handleChange(p.id, "started", e)}
            />
          </div>

          <div className="items-center w-[50vw]">
            <Label htmlFor="ended" className="text-right">
              Ended
            </Label>
            <Input
              id="ended"
              type="date"
              defaultValue={stringToHTMLDate(p.ended)}
              onChange={(e) => handleChange(p.id, "ended", e)}
            />
          </div>
        </div>
      );
    });
  } else if (operation === ModalOperations.Delete) {
    return data.map((p: Prescription) => {
      return (
        <div key={p.id}>
          <div className="items-center w-[50vw] text-center font-bold">
            {p.medication}
          </div>
        </div>
      );
    });
  }
};

export default ModalBody;
