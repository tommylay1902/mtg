import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getPrescriptions } from "@/shared/query/PrescriptionQueries";
import { generatePrescriptionTemplate } from "@/shared/types/Prescription";
import { useQuery } from "@tanstack/react-query";

import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "react-oidc-context";

export const Route = createFileRoute("/medication/")({
  component: RouteComponent,
  errorComponent: () => <div>Error!</div>,
});

function RouteComponent() {
  const auth = useAuth();
  const { isPending, isFetching, data } = useQuery({
    queryKey: ["medications"],
    queryFn: () =>
      getPrescriptions(
        auth.user?.profile?.email == undefined ? "" : auth.user?.profile?.email
      ),
    // The query will not execute until the userId exists
    enabled: !!auth.user?.profile?.email,
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
    return <div>Loading...</div>;
  }

  const tableHeaders = Object.keys(generatePrescriptionTemplate());

  return (
    <div className={"m-10"}>
      <Table>
        <TableHeader>
          <TableRow>
            {tableHeaders.map((header) => {
              if (header !== "id") {
                return <TableHead>{header}</TableHead>;
              }
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((p) => (
            <TableRow key={p.id}>
              {tableHeaders.map((field) => {
                if (field !== "id") {
                  return <TableCell>{p[field]}</TableCell>;
                }
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
