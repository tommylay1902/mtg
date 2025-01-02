import Modal from "@/components/modal/modal";

import {
  createPrescription,
  deleteBatchPrescription,
  updateBatchPrescription,
} from "@/shared/api/Prescription";
import { getPrescriptions } from "@/shared/query/PrescriptionQueries";
import { Prescription } from "@/shared/types/Prescription";
import { stringToTimeStamp } from "@/shared/util/Date";
import { useMutation, useQuery } from "@tanstack/react-query";

import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import PrescriptionTable from "@/components/ptable/PrescriptionTable";
import ReviewModal from "@/components/modal/ReviewModal";
import { ModalOperations } from "@/shared/types/enum/ModalOperations";

export const Route = createFileRoute("/prescriptions/")({
  component: RouteComponent,
  errorComponent: () => <div>Error!</div>,
});

function RouteComponent() {
  const auth = useAuth();
  const { isPending, isFetching, data, refetch } = useQuery({
    queryKey: ["prescriptions"],
    queryFn: () => getPrescriptions(auth.user!.access_token),
    // The query will not execute until the userId exists
    enabled: !!auth.user?.access_token,
    staleTime: 40000,
  });

  const createPrescriptionMutation = useMutation({
    mutationFn: (prescription: Prescription) =>
      createPrescription(auth.user!.access_token, prescription),
    onSuccess: () => refetch(),
  });

  const deleteBatchPrescriptionMutation = useMutation({
    mutationFn: (deleteList: string[]) =>
      deleteBatchPrescription(auth.user!.access_token, deleteList),
    onSuccess: () => refetch(),
  });

  const updateBatchPrescriptionMutation = useMutation({
    mutationFn: (prescriptions: Prescription[]) =>
      updateBatchPrescription(auth.user!.access_token, prescriptions),
    onSuccess: () => refetch(),
  });

  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [modalOperation, setModalOperation] = useState<ModalOperations>(
    ModalOperations.NoAction
  );

  useEffect(() => {
    if (!auth.isAuthenticated && !auth.isLoading) {
      throw auth.signinRedirect();
    }
  }, [auth]);

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (isPending || isFetching) {
    console.log("making call with ", auth.user?.access_token);
    return <div>Loading...</div>;
  }

  const createPrescriptionSubmit = (prescription: Prescription) => {
    createPrescriptionMutation.mutate({
      ...prescription,
      started: stringToTimeStamp(prescription.started),
      ended: stringToTimeStamp(prescription.ended),
    });
  };

  const deletePrescriptionHandler = (deleteList: string[]) => {
    deleteBatchPrescriptionMutation.mutate(deleteList);
    setSelectedRows([]);
  };

  const updatePrescriptionHandler = (prescriptions: Prescription[]) => {
    updateBatchPrescriptionMutation.mutate(prescriptions);
    setSelectedRows([]);
  };

  return (
    <div className={"m-10"}>
      <div className={"flex justify-between"}>
        <Modal customSubmit={createPrescriptionSubmit} />
        <ReviewModal
          operation={modalOperation}
          setOperation={setModalOperation}
          prescriptions={(data ?? []).filter((p) =>
            selectedRows.includes(p.id)
          )}
          confirmAction={
            modalOperation === ModalOperations.Delete
              ? deletePrescriptionHandler
              : updatePrescriptionHandler
          }
        />
      </div>

      <PrescriptionTable
        data={data}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        setModalOperation={setModalOperation}
      />
    </div>
  );
}
