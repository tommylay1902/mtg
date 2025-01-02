import { Prescription } from "@/shared/types/Prescription";
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

  useEffect(() => {
    setUpdatePrescriptions(prescriptions);
    return () => {
      setUpdatePrescriptions([]);
    };
  }, [prescriptions, updatePrescriptions]);

  const handleAction = () => {
    //check which operation and cast the confirmAction as the approriate function
    if (operation === ModalOperations.Delete) {
      (confirmAction as deleteAction)(prescriptions.map((p) => p.id));
    } else {
      (confirmAction as updateAction)(updatePrescriptions);
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
            updatePrescriptions={updatePrescriptions}
            operation={operation}
            open={open}
            setUpdatePrescriptions={setUpdatePrescriptions}
          />
        </div>
        <DialogFooter className="flex justify-between">
          <DialogClose asChild>
            <Button className={"bg-red-600"}>Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              className={"bg-blue-600"}
              onClick={() => {
                setUpdatePrescriptions([]);
                handleAction();
              }}
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
