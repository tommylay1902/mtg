// import { Prescription } from "@/shared/types/Prescription";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { ModalOperations } from "@/shared/types/enum/ModalOperations";
import ModalBody from "./ModalBody";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Prescription } from "@/shared/types/Prescription";

type deleteAction = (list: string[]) => void;
type updateAction = (prescriptions: Prescription[]) => void;

interface ReviewModalProps {
  operation: ModalOperations;
  setOperation: React.Dispatch<React.SetStateAction<ModalOperations>>;
  prescriptions: Prescription[];
  confirmAction: deleteAction | updateAction;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  operation,
  setOperation,
  prescriptions,
  confirmAction,
}) => {
  const [open, setOpen] = useState(false);
  const [updatePrescriptions, setUpdatePrescriptions] = useState<
    Prescription[]
  >(JSON.parse(JSON.stringify(prescriptions)));

  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    setError,
    getValues,
  } = useForm<{ prescriptions: Prescription[] }>({
    defaultValues: { prescriptions: updatePrescriptions },
  });

  useEffect(() => {
    setUpdatePrescriptions(prescriptions);
    return () => {
      setUpdatePrescriptions([]);
    };
  }, [prescriptions, updatePrescriptions]);

  const onSubmit = (formData: { prescriptions: Prescription[] }) => {
    if (operation === ModalOperations.Delete) {
      (confirmAction as deleteAction)(prescriptions.map((p) => p.id));
    } else {
      (confirmAction as updateAction)(formData.prescriptions);
    }
    setOperation(ModalOperations.NoAction);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div
        className={
          ModalOperations.NoAction === operation ? "invisible" : "visible"
        }
      >
        <DialogTrigger asChild className={"mb-8 mr-8"}>
          <Button
            className={"bg-blue-600"}
            onClick={() => setOperation(ModalOperations.Update)}
          >
            Update Prescription
          </Button>
        </DialogTrigger>

        <DialogTrigger asChild className={"mb-8"}>
          <Button
            className={"bg-red-600"}
            onClick={() => setOperation(ModalOperations.Delete)}
          >
            Delete Prescription
          </Button>
        </DialogTrigger>
      </div>

      <DialogContent className="max-w-fit">
        <DialogHeader className=" items-center pt-3">
          <DialogTitle>
            {ModalOperations.Delete === operation
              ? "Confirm you want to delete these prescriptions"
              : "Update Prescriptions"}
          </DialogTitle>
        </DialogHeader>
        <div>
          <ModalBody
            data={prescriptions}
            operation={operation}
            setUpdatePrescriptions={setUpdatePrescriptions}
            register={register} // Pass `register` to ModalBody
            errors={errors} // Pass `errors` to ModalBody
            clearErrors={clearErrors}
          />
        </div>
        <DialogFooter className="flex justify-between">
          <DialogClose asChild>
            <Button className={"bg-red-600"}>Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              className={"bg-blue-600"}
              onClick={(e) => {
                if (operation === ModalOperations.Update) {
                  const prescriptions = getValues("prescriptions");
                  let hasError = false;
                  prescriptions.forEach((_, index) => {
                    const refillsValue = getValues(
                      `prescriptions.${index}.refills`
                    );
                    const refillsNumber = Number(refillsValue); // Convert to number

                    if (Number.isNaN(refillsNumber)) {
                      hasError = true;
                      setError(`prescriptions.${index}.refills`, {
                        type: "manual",
                        message: "Refills must be a valid number",
                      });
                    } else {
                      clearErrors(`prescriptions.${index}.refills`);
                    }
                  });

                  if (!hasError) {
                    // Trigger the handleSubmit function to process the form data
                    handleSubmit(onSubmit)(e);
                  } else {
                    e.preventDefault();
                  }
                } else {
                  handleSubmit(onSubmit)(e);
                }
              }} // Validate before handling action
            >
              Confirm
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewModal;
