import Modal from "@/components/modal/modal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createPrescription } from "@/shared/api/Prescription";
import { getPrescriptions } from "@/shared/query/PrescriptionQueries";
import {
  generatePrescriptionTemplate,
  Prescription,
} from "@/shared/types/Prescription";
import { handleDateFormat } from "@/shared/util/Date";
import { useMutation, useQuery } from "@tanstack/react-query";

import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "react-oidc-context";

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

  const tableHeaders = Object.keys(generatePrescriptionTemplate());

  const createPrescriptionSubmit = (prescription: Prescription) => {
    createPrescriptionMutation.mutate({
      ...prescription,
      started: handleDateFormat(prescription.started),
      ended: handleDateFormat(prescription.ended),
    });
  };

  return (
    <div className={"m-10"}>
      <Modal customSubmit={createPrescriptionSubmit} />
      <Table>
        <TableHeader>
          <TableRow>
            {tableHeaders.map((header) => {
              if (header !== "id") {
                return (
                  <TableHead key={header} className={" font-extrabold"}>
                    {header.toUpperCase()}
                  </TableHead>
                );
              }
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((p) => (
            <TableRow key={p.id}>
              {tableHeaders.map((field) => {
                console.log(field);
                if (field !== "id") {
                  if (field === "ended" && p[field] == null) {
                    return <TableCell key={p.id + field}>Current</TableCell>;
                  } else {
                    return <TableCell key={p.id + field}>{p[field]}</TableCell>;
                  }
                }
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
