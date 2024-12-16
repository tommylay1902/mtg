import { getPrescriptions } from "@/shared/query/PrescriptionQueries";
import { Prescription } from "@/shared/types/Prescription";
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
  const response = useQuery({
    queryKey: ["medications"],
    queryFn: () =>
      getPrescriptions(
        auth.user?.profile?.email == undefined ? "" : auth.user?.profile?.email
      ),
    // The query will not execute until the userId exists
    enabled: !!auth.user?.profile?.email,
  });

  const medications: Array<Prescription> = response.data;
  useEffect(() => {
    if (!auth.isAuthenticated && !auth.isLoading) {
      throw auth.signinRedirect();
    }
  }, [auth]);

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }
  // const [isAuthReady, setIsAuthReady] = useState(false);
  // const [medications, setMedications] = useState<Array<Prescription>>(Array);
  // // Wait for auth to be loaded before fetching medications

  // useEffect(() => {
  //   if (!auth.isAuthenticated && !auth.isLoading) {
  //     throw auth.signinRedirect();
  //   } else {
  //     (async () => {
  //       try {
  //         const email = auth.user?.profile.email;
  //         setMedications(
  //           await getPrescriptions(email == undefined ? "" : email)
  //         );
  //       } catch (e) {
  //         console.error(e);
  //       }
  //     })();
  //   }
  // }, [auth]);

  // // Show loading message if auth isn't ready yet
  // if (!medications.length) {
  //   return <div>Loading...</div>;
  // }

  return (
    <ul>
      {medications.map((med, index) => {
        return (
          <li key={index}>
            {med.dosage}, {med.notes}
          </li>
        );
      })}
    </ul>
  );
}
