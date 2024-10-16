"use server";

import { revalidatePath } from "next/cache";

import { api } from "~/trpc/server";

export async function updateUserSettings({
  walletId,
  language,
  email,
  isThemeDark,
  dueDate,
  comments,
  assignedToCard,
  removedFromCard,
  changeCardStatus,
  newBadge,
  image,
  bio,
  emailVerified,
  twoFactorAuth,
}: {
  walletId: string;
  language?: string;
  email?: string;
  isThemeDark?: boolean;
  dueDate?: boolean;
  comments?: boolean;
  assignedToCard?: boolean;
  removedFromCard?: boolean;
  changeCardStatus?: boolean;
  newBadge?: boolean;
  image?: string;
  bio?: string;
  emailVerified?: boolean;
  twoFactorAuth?: boolean;
}) {
  try {
    await api.user.update({
      walletId,
      email,
      image,
      bio,
      emailVerified,
      userSettings: {
        isThemeDark,
        language,
        dueDate,
        comments,
        twoFactorAuth,
        assignedToCard,
        removedFromCard,
        changeCardStatus,
        newBadge,
      },
    });
    revalidatePath("/user-settings", "page");
    revalidatePath("/proilfe", "page");
    return { success: true };
  } catch (error) {
    console.error("Error updating user settings:", error);
    return new Error("An error occurred while updating user settings.");
  }
}
