import Modal from "@/components/modal/modal";

import { createPrescription } from "@/shared/api/Prescription";
import { getPrescriptions } from "@/shared/query/PrescriptionQueries";
import { Prescription } from "@/shared/types/Prescription";
import { stringToTimeStamp } from "@/shared/util/Date";
import { useMutation, useQuery } from "@tanstack/react-query";

import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import PrescriptionTable from "@/components/ptable/PrescriptionTable";

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

  return (
    <div className={"m-10"}>
      <Modal customSubmit={createPrescriptionSubmit} />
      <PrescriptionTable data={data} />
    </div>
  );
}
