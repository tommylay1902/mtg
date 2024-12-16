import { Prescription } from "../types/Prescription";

export const getPrescriptions = async (
  email: string
): Promise<Array<Prescription>> => {
  const data = await fetch(
    `http://localhost:8080/api/v1/prescription/all/${email}`
  );
  return await data.json();
};
