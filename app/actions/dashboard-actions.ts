"use server";

import { revalidateTag, revalidatePath } from "next/cache";

export async function refreshDashboard() {
  revalidateTag("market-inventory");
  revalidatePath("/dashboard");
}
