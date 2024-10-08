import { cookies } from "next/headers";

import { api } from "~/trpc/server";

// Define the interface for the user overview data
interface UserOverviewData {
  activeProjects: number;
  totalBadges: number;
  badgesInLast30Days: number;
  daysSinceLastBadge: number;
  topSkill: string;
}

export default async function UserOverview() {
  const walletId: string = cookies().get("wallet")?.value ?? "";

  if (!walletId) {
    console.error("Wallet ID is undefined or not found on cookies.");
    return <div>Error: Wallet ID is required.</div>;
  }
  try {
    const userData: UserOverviewData = await api.user.overview({
      walletId,
    });

    return (
      <>
        <div className="flex flex-col p-0 text-sm">
          <h1 className="mb-0">Overview</h1>
          <p className="mb-4 text-gray-400">History of performance.</p>

          <div className="flex justify-between py-2">
            <p>Active Projects</p>
            <p>{userData.activeProjects}</p>
          </div>

          <div className="flex justify-between py-2">
            <p>Total Badges</p>
            <p>{userData.totalBadges}</p>
          </div>

          <div className="flex justify-between py-2">
            <p>Badges in last 30d</p>
            <p>{userData.badgesInLast30Days}</p>
          </div>

          <div className="flex justify-between py-2">
            <p>Days since last badge</p>
            <p>{userData.daysSinceLastBadge}</p>
          </div>

          <div className="flex justify-between py-2">
            <p>Top skill</p>
            <p>{userData.topSkill}</p>
          </div>
        </div>
      </>
    );
  } catch (error) {
    console.error("Error fetching user data:", error);
    return <div>Error fetching user data.</div>;
  }
}