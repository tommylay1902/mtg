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
interface ReviewModalProps {
  prescriptions: Prescription[];
  confirmAction: (list: string[]) => void;
}
const ReviewModal: React.FC<ReviewModalProps> = ({
  prescriptions,
  confirmAction,
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild className={"mb-8"}>
        <Button className={"bg-red-600"}>Delete Prescription</Button>
      </DialogTrigger>

      <DialogContent className="max-w-fit">
        <DialogHeader className=" items-center">
          <DialogTitle>Add New Prescription</DialogTitle>
        </DialogHeader>
        <div>
          {prescriptions.map((p: Prescription) => {
            return (
              <>
                <div className="items-center w-[50vw] text-center font-bold">
                  {p.medication}
                </div>
              </>
            );
          })}
        </div>
        <DialogFooter className="flex justify-between">
          <DialogClose asChild>
            <Button className={"bg-red-600"}>Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              className={"bg-red-600"}
              onClick={() => confirmAction(prescriptions.map((p) => p.id))}
            >
              Confirm Deletion
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewModal;
