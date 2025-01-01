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
  const handleAction = () => {
    //check which operation and cast the confirmAction as the approriate function
    if (operation === ModalOperations.Delete) {
      (confirmAction as deleteAction)(prescriptions.map((p) => p.id));
    } else {
      (confirmAction as updateAction)(prescriptions);
    }
    setOperation(ModalOperations.NoAction);
  };
  return (
    <Dialog>
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
              : "Confirm you want to update these prescriptions"}
          </DialogTitle>
        </DialogHeader>
        <div>
          <ModalBody data={prescriptions} operation={operation} />
          {/* {prescriptions.map((p: Prescription) => {
            return (
              <div key={p.id}>
                <div className="items-center w-[50vw] text-center font-bold">
                  {p.medication}
                </div>
              </div>
            );
          })} */}
        </div>
        <DialogFooter className="flex justify-between">
          <DialogClose asChild>
            <Button className={"bg-red-600"}>Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button className={"bg-blue-600"} onClick={handleAction}>
              Confirm
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewModal;
