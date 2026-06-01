import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";

export default async function GaleriLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("pkakp_admin_token")?.value;
  const secret = process.env.ADMIN_JWT_SECRET;

  if (!token || !secret) redirect("/login");

  try {
    const payload = jwt.verify(token, secret) as Record<string, any>;
    if (payload?.role !== "admin") {
      // staff not allowed here
      redirect("/admin");
    }
  } catch (err) {
    redirect("/login");
  }

  return <>{children}</>;
}
