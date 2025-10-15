import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";


const AuthenticationPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    redirect("/auth")
  }

  if (session?.user) {
    redirect("/archiving/register")
  }

  return null;
}

export default AuthenticationPage;