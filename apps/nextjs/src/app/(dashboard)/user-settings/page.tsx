import { cookies } from "next/headers";

import type { LoginHistoryClass, UserClass } from "@acme/db";

import AccountSettings from "~/app/_components/userSettingsPage/AccountSettings";
import DeleteAccount from "~/app/_components/userSettingsPage/DeleteAccount";
import EmailNotifications from "~/app/_components/userSettingsPage/EmailNotifications";
import Security from "~/app/_components/userSettingsPage/Security";
import { api } from "~/trpc/server";

export default async function Page() {
  const walletId = cookies().get("wallet")?.value;

  if (!walletId) {
    console.error("Wallet ID is undefined or not found in cookies.");
    return <div>Error: Wallet ID not found.</div>;
  }

  const response = await api.loginHistory.loginHistories({ walletId });

  const userData: UserClass | null = response as LoginHistoryClass as UserClass;

  return (
    <section className="my-8 flex flex-col items-center justify-center gap-4 pb-48">
      <AccountSettings
        language={userData.userSettings?.language}
        theme={userData.userSettings?.isThemeDark}
        walletId={walletId}
      />
      <EmailNotifications
        dueDate={userData.userSettings?.dueDate}
        email={userData.email}
        comments={userData.userSettings?.comments}
        assignToCard={userData.userSettings?.assignedToCard}
        removeFromCard={userData.userSettings?.removedFromCard}
        changeCardStatus={userData.userSettings?.changeCardStatus}
        newBadge={userData.userSettings?.newBadge}
        walletId={walletId}
      />
      <Security
        emailVerified={userData.emailVerified}
        authentication={userData.userSettings?.twoFactorAuth}
        walletId={walletId}
      />
      <DeleteAccount walletId={walletId} />
    </section>
  );
}
