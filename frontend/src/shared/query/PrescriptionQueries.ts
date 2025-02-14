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
