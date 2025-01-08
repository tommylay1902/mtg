import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ModalOperations } from "@/shared/types/enum/ModalOperations";

import { Prescription } from "@/shared/types/Prescription";

import { useForm } from "react-hook-form";

interface ModalPropType {
  customSubmit: (event: Prescription) => void;
  setSelectedRows?: React.Dispatch<React.SetStateAction<string[]>>;
  setOperation?: React.Dispatch<React.SetStateAction<ModalOperations>>;
}

export const Modal: React.FC<ModalPropType> = ({ customSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    clearErrors,
    reset,
    setError,
  } = useForm<Prescription>();

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          clearErrors();
          reset();
        }
      }}
    >
      <DialogTrigger asChild className={"mb-8"}>
        <Button className={"bg-blue-600"}>Add Prescription+</Button>
      </DialogTrigger>

      <DialogContent className="max-w-fit">
        <DialogHeader className=" items-center">
          <DialogTitle>Add New Prescription</DialogTitle>
          <DialogDescription>
            Add a new prescription to view in your prescription list
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            if (Number.isNaN(getValues("refills"))) {
              // setRefillsInputError(true);
              setError("refills", { type: "refills", message: "refills" });
              // e.preventDefault();
            } else {
              clearErrors("refills");
              handleSubmit(customSubmit)(e);
            }
          }}
        >
          <div className="py-4">
            <div className="items-center">
              <Label
                htmlFor="medication"
                className={`text-right ${errors.medication ? "text-red-500" : ""}`}
              >
                Medication
              </Label>
              <Input
                id="medication"
                placeholder="e.g. Prednisone"
                className={`${errors.medication ? "text-red-500 focus-visible:ring-red-500 border-red-500" : ""}  `}
                {...register("medication", { required: true })}
              />
              {errors.medication && (
                <span className={"text-red-500"}>
                  Medication name is required
                </span>
              )}
            </div>
            <div className="items-center">
              <Label
                htmlFor="dosage"
                className={`text-right ${errors.dosage ? "text-red-500" : ""}`}
              >
                Dosage
              </Label>
              <Input
                id="dosage"
                placeholder="e.g. 20mg daily"
                className={`${errors.dosage ? "text-red-500 focus-visible:ring-red-500 border-red-500" : ""}  `}
                {...register("dosage", { required: true })}
              />
              {errors.dosage && (
                <span className={"text-red-500"}>
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
                placeholder="e.g. Steroid medication prescribed to help reduce inflamation"
                {...register("notes")}
              />
            </div>

            <div className="items-center w-[50vw]">
              <Label
                htmlFor="refills"
                className={`text-right ${errors.refills ? "text-red-500" : ""}`}
              >
                Refills
              </Label>
              <Input
                id="refills"
                placeholder="e.g. 3"
                className={`${errors.refills ? "text-red-500 focus-visible:ring-red-500 border-red-500" : ""}  `}
                {...register("refills", { valueAsNumber: true })}
                defaultValue={0}
                onChange={(e) => {
                  if (
                    typeof +e.target.value === "number" &&
                    !Number.isNaN(+e.target.value)
                  ) {
                    clearErrors("refills");
                  }
                }}
              />
              {errors.refills && (
                <span className={"text-red-500"}>
                  This field must be a number
                </span>
              )}
            </div>

            <div className="items-center w-[50vw]">
              <Label
                htmlFor="started"
                className={`text-right ${errors.started ? "text-red-500" : ""}`}
              >
                Started
              </Label>
              <Input
                id="started"
                type="date"
                className={`${errors.started ? "text-red-500 focus-visible:ring-red-500 border-red-500" : ""}  `}
                {...register("started", { required: true })}
              />
              {errors.started && (
                <span className={"text-red-500"}>
                  This field is require, if you don't know exact date you can
                  guess
                </span>
              )}
            </div>

            <div className="items-center w-[50vw]">
              <Label htmlFor="ended" className="text-right">
                Ended
              </Label>
              <Input id="ended" type="date" {...register("ended")} />
            </div>
          </div>
          <DialogFooter>
            <Button className={"bg-blue-600"} type="submit">
              Add Prescription
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
