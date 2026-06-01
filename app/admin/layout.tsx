import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import AdminClientLayout from "./AdminClientLayout";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("pkakp_admin_token")?.value;
  const secret = process.env.ADMIN_JWT_SECRET;

  if (!token || !secret) redirect("/login");

  try {
    jwt.verify(token, secret);
  } catch (err) {
    redirect("/login");
  }

  return <AdminClientLayout>{children}</AdminClientLayout>;
}
