import { Prescription } from "@/shared/types/Prescription";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { ModalOperations } from "@/shared/types/enum/ModalOperations";
import {
  FieldErrors,
  UseFormClearErrors,
  UseFormRegister,
} from "react-hook-form";
import { stringToHTMLDate } from "@/shared/util/Date";

interface ModalBodyProps {
  operation: ModalOperations;
  data: Prescription[];
  setUpdatePrescriptions: React.Dispatch<React.SetStateAction<Prescription[]>>;
  register: UseFormRegister<{
    prescriptions: Prescription[];
  }>;
  errors: FieldErrors<{
    prescriptions: Prescription[];
  }>;
  clearErrors: UseFormClearErrors<{
    prescriptions: Prescription[];
  }>;
}

const ModalBody: React.FC<ModalBodyProps> = ({
  operation,
  data,
  register,
  errors,
  clearErrors,
}) => {
  if (operation === ModalOperations.Update) {
    return (
      <>
        {data.map((p: Prescription, index) => (
          <div key={p.id} className="py-4">
            <h1 className="font-bold underline text-center">
              Medication: {p.medication}
            </h1>

            <div className="py-4">
              {/* Medication Input */}
              <Input
                type="hidden"
                value={p.id}
                {...register(`prescriptions.${index}.id`)}
              />
              <div className="items-center">
                <Label
                  htmlFor="medication"
                  className={`text-right ${
                    errors.prescriptions?.[index]?.medication
                      ? "text-red-500"
                      : ""
                  }`}
                >
                  Medication
                </Label>
                <Input
                  id="medication"
                  placeholder="e.g. Prednisone"
                  defaultValue={p.medication}
                  className={`${
                    errors.prescriptions?.[index]?.medication
                      ? "text-red-500 focus-visible:ring-red-500 border-red-500"
                      : ""
                  }`}
                  {...register(`prescriptions.${index}.medication`, {
                    required: true,
                  })}
                />
                {errors.prescriptions?.[index]?.medication && (
                  <span className="text-red-500">
                    Medication name is required
                  </span>
                )}
              </div>

              {/* Dosage Input */}
              <div className="items-center">
                <Label
                  htmlFor="dosage"
                  className={`text-right ${
                    errors.prescriptions?.[index]?.dosage ? "text-red-500" : ""
                  }`}
                >
                  Dosage
                </Label>
                <Input
                  id="dosage"
                  placeholder="e.g. 20mg daily"
                  defaultValue={p.dosage}
                  className={`${
                    errors.prescriptions?.[index]?.dosage
                      ? "text-red-500 focus-visible:ring-red-500 border-red-500"
                      : ""
                  }`}
                  {...register(`prescriptions.${index}.dosage`, {
                    required: true,
                  })}
                />
                {errors.prescriptions?.[index]?.dosage && (
                  <span className="text-red-500">
                    Please include dosage, if unknown just input something like
                    "Don't Know"
                  </span>
                )}
              </div>

              <div className="items-center w-[50vw]">
                <Label htmlFor="notes" className="text-right">
                  Notes
                </Label>
                <Input
                  id="notes"
                  placeholder="e.g. Steroid medication prescribed to help reduce inflammation"
                  defaultValue={p.notes}
                  {...register(`prescriptions.${index}.notes`)}
                />
              </div>

              {/* Refills Input */}
              <div className="items-center w-[50vw]">
                <Label
                  htmlFor="refills"
                  className={`text-right ${
                    errors.prescriptions?.[index]?.refills ? "text-red-500" : ""
                  }`}
                >
                  Refills
                </Label>
                <Input
                  id="refills"
                  placeholder="e.g. 3"
                  defaultValue={p.refills}
                  className={`${
                    errors.prescriptions?.[index]?.refills
                      ? "text-red-500 focus-visible:ring-red-500 border-red-500"
                      : ""
                  }`}
                  {...register(`prescriptions.${index}.refills`, {
                    valueAsNumber: true,
                    validate: (value) =>
                      !isNaN(Number(value)) || "Refills must be a valid number",
                  })}
                  onChange={(e) => {
                    if (
                      typeof +e.target.value === "number" &&
                      !Number.isNaN(+e.target.value)
                    ) {
                      clearErrors(`prescriptions.${index}.refills`);
                    }
                  }}
                />
                {errors.prescriptions?.[index]?.refills && (
                  <span className="text-red-500">
                    {errors.prescriptions?.[index]?.refills.message}
                  </span>
                )}
              </div>

              {/* Started Date Input */}
              <div className="items-center w-[50vw]">
                <Label
                  htmlFor="started"
                  className={`text-right ${
                    errors.prescriptions?.[index]?.started ? "text-red-500" : ""
                  }`}
                >
                  Started
                </Label>
                <Input
                  id="started"
                  type="date"
                  defaultValue={stringToHTMLDate(p.started)}
                  className={`${
                    errors.prescriptions?.[index]?.started
                      ? "text-red-500 focus-visible:ring-red-500 border-red-500"
                      : ""
                  }`}
                  {...register(`prescriptions.${index}.started`, {
                    required: true,
                  })}
                />
                {errors.prescriptions?.[index]?.started && (
                  <span className="text-red-500">
                    This field is required, if you don't know the exact date you
                    can guess
                  </span>
                )}
              </div>
            </div>

            {/* Ended Date Input */}
            <div className="items-center w-[50vw]">
              <Label htmlFor="ended" className={`text-right`}>
                Ended
              </Label>
              <Input
                id="ended"
                type="date"
                defaultValue={stringToHTMLDate(p.ended)}
                {...register(`prescriptions.${index}.ended`)}
              />
            </div>
          </div>
        ))}
      </>
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
