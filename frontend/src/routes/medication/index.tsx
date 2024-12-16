import { getPrescriptions } from "@/shared/query/PrescriptionQueries";
import { Prescription } from "@/shared/types/Prescription";

import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";

export const Route = createFileRoute("/medication/")({
  component: RouteComponent,
  errorComponent: () => <div>Error!</div>,
});

function RouteComponent() {
  const auth = useAuth();
  // const [isAuthReady, setIsAuthReady] = useState(false);
  const [medications, setMedications] = useState<Array<Prescription>>(Array);
  // Wait for auth to be loaded before fetching medications

  useEffect(() => {
    if (!auth.isAuthenticated && !auth.isLoading) {
      throw auth.signinRedirect();
    } else {
      (async () => {
        try {
          const email = auth.user?.profile.email;
          setMedications(
            await getPrescriptions(email == undefined ? " " : email)
          );
        } catch (e) {
          console.error(e);
        }
      })();
    }
  }, [auth]);

  // Show loading message if auth isn't ready yet
  if (!medications.length) {
    return <div>Loading...</div>;
  }

  return (
    <ul>
      {medications.map((med, index) => {
        return <li key={index}>{med.dosage}</li>;
      })}
    </ul>
  );
}
