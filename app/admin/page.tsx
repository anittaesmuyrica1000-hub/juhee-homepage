import AdminDashboard from "@/components/admin/AdminDashboard";
import { getProjects } from "@/lib/projects";

export const revalidate = 0;

export default async function AdminPage() {
  const projects = await getProjects();
  return <AdminDashboard initialProjects={projects} />;
}
