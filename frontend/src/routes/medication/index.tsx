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
        auth.user?.access_token == undefined ? "" : auth.user?.access_token
      ),
    // The query will not execute until the userId exists
    enabled: !!auth.user?.access_token,
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

  return (
    <div className={"m-10"}>
      <Table>
        <TableHeader>
          <TableRow>
            {tableHeaders.map((header) => {
              if (header !== "id") {
                return <TableHead key={header}>{header}</TableHead>;
              }
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((p) => (
            <TableRow key={p.id}>
              {tableHeaders.map((field) => {
                if (field !== "id") {
                  return <TableCell key={p.id + field}>{p[field]}</TableCell>;
                }
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
