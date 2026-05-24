import { TrackerBoard } from "@/components/TrackerBoard";
import { getTrackerSnapshot } from "@/lib/tracker";

export const dynamic = "force-dynamic";

export default async function WeekliesPage() {
  const snapshot = await getTrackerSnapshot();

  return <TrackerBoard type="weekly" snapshot={snapshot} />;
}
