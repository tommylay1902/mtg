import { Prescription } from "../types/Prescription";

export const getPrescriptions = async (
  token: string
): Promise<Array<Prescription>> => {
  console.log(token);
  const data = await fetch(`http://localhost:8080/api/v1/prescription/all`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await data.json();
};

export const createPrescription = (
  token: string,
  prescription: Prescription
) => {
  return fetch("http://localhost:8080/api/v1/prescription", {
    method: "POST",
    headers: new Headers({
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(prescription),
  });
};
