import { ModalOperations } from "@/shared/types/enum/ModalOperations";
import {
  generatePrescriptionTemplate,
  Prescription,
} from "@/shared/types/Prescription";
import React from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { stringToHTMLDate, stringToUSDate } from "@/shared/util/Date";

interface ModalBodyProps {
  operation: ModalOperations;
  data: Prescription[];
}
const ModalBody: React.FC<ModalBodyProps> = ({ operation, data }) => {
  const prescription: Prescription =
    data.length === 0 ? generatePrescriptionTemplate() : data[0];
  if (operation === ModalOperations.Update) {
    return (
      <div className="py-4">
        <div className="items-center">
          <Label htmlFor="medication" className="text-right">
            Medication
          </Label>
          <Input
            id="medication"
            placeholder="e.g. Prednisone"
            value={prescription.medication}
            //   className="col-span-3"
          />
        </div>
        <div className="items-center">
          <Label htmlFor="dosage" className="text-right">
            Dosage
          </Label>
          <Input
            id="dosage"
            placeholder="e.g. 20mg daily"
            value={prescription.dosage}
            //   className="col-span-3"
          />
        </div>

        <div className="items-center w-[50vw]">
          <Label htmlFor="notes" className="text-right">
            Notes
          </Label>
          <Input
            id="notes"
            placeholder="e.g. Steroid medication prescribed to help reduce inflamation"
            value={prescription.notes}
            //   className="col-span-3"
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
            value={prescription.refills == null ? 0 : prescription.refills}
          />
        </div>

        <div className="items-center w-[50vw]">
          <Label htmlFor="started" className="text-right">
            Started
          </Label>
          <Input
            id="started"
            type="date"
            value={stringToHTMLDate(prescription.started)}
          />
        </div>

        <div className="items-center w-[50vw]">
          <Label htmlFor="ended" className="text-right">
            Ended
          </Label>
          <Input id="ended" type="date" />
        </div>
      </div>
    );
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
