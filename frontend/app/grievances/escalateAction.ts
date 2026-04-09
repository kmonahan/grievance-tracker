"use server";

export type EscalateGrievanceState = {
  error: string | null;
};

export async function escalateGrievance(
  _prevState: EscalateGrievanceState,
  _formData: FormData,
): Promise<EscalateGrievanceState> {
  throw new Error("Not implemented");
}
