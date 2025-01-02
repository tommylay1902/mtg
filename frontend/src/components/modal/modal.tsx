import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Prescription } from "@/shared/types/Prescription";

import { useForm } from "react-hook-form";

interface ModalPropType {
  customSubmit: (event: Prescription) => void;
}

export const Modal: React.FC<ModalPropType> = ({ customSubmit }) => {
  const {
    register,
    handleSubmit,
    // formState: { errors },
  } = useForm<Prescription>();

  return (
    <Dialog>
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
        <form onSubmit={handleSubmit(customSubmit)}>
          <div className="py-4">
            <div className="items-center">
              <Label htmlFor="medication" className="text-right">
                Medication
              </Label>
              <Input
                id="medication"
                placeholder="e.g. Prednisone"
                {...register("medication")}
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
                //   className="col-span-3"
                {...register("dosage")}
              />
            </div>

            <div className="items-center w-[50vw]">
              <Label htmlFor="notes" className="text-right">
                Notes
              </Label>
              <Input
                id="notes"
                placeholder="e.g. Steroid medication prescribed to help reduce inflamation"
                {...register("notes")}
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
                {...register("refills", { valueAsNumber: true })}
              />
            </div>

            <div className="items-center w-[50vw]">
              <Label htmlFor="started" className="text-right">
                Started
              </Label>
              <Input id="started" type="date" {...register("started")} />
            </div>

            <div className="items-center w-[50vw]">
              <Label htmlFor="ended" className="text-right">
                Ended
              </Label>
              <Input id="ended" type="date" {...register("ended")} />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button className={"bg-blue-600"} type="submit">
                Add Prescription
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
