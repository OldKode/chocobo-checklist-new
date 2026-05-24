import { TrackerDashboard } from "@/components/TrackerDashboard";
import { getTrackerSnapshot } from "@/lib/tracker";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const snapshot = await getTrackerSnapshot();

  return <TrackerDashboard snapshot={snapshot} />;
}
