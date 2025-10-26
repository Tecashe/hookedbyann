import { auth } from "@clerk/nextjs/server"
import { prisma } from "./db"

export async function getCurrentUser() {
  const { userId } = await auth()

  if (!userId) {
    return null
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  })

  return user
}

export async function getOrCreateUser(clerkUser: any) {
  const user = await prisma.user.upsert({
    where: { clerkId: clerkUser.id },
    update: {
      email: clerkUser.emailAddresses[0]?.emailAddress,
      name: clerkUser.firstName + " " + clerkUser.lastName,
      image: clerkUser.imageUrl,
    },
    create: {
      clerkId: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress,
      name: clerkUser.firstName + " " + clerkUser.lastName,
      image: clerkUser.imageUrl,
    },
  })

  return user
}

export async function isAdmin() {
  const user = await getCurrentUser()
  return user?.role === "admin"
}
