import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Mail, User, Calendar } from "lucide-react"

export default async function ProfilePage() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/")
  }

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) {
    redirect("/")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profile Information</h1>
        <p className="text-muted-foreground">View and manage your account details</p>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          {/* Profile Header */}
          <div className="flex items-center gap-6 pb-6 border-b">
            {user.image && (
              <img
                src={user.image || "/placeholder.svg"}
                alt={user.name || "User"}
                className="w-20 h-20 rounded-full object-cover"
              />
            )}
            <div>
              <h2 className="text-2xl font-bold">{user.name || "User"}</h2>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>

          {/* Account Details */}
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <label className="text-sm font-medium text-muted-foreground">Full Name</label>
              </div>
              <p className="text-lg font-medium">{user.name || "Not set"}</p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <label className="text-sm font-medium text-muted-foreground">Email Address</label>
              </div>
              <p className="text-lg font-medium">{user.email}</p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <label className="text-sm font-medium text-muted-foreground">Member Since</label>
              </div>
              <p className="text-lg font-medium">{new Date(user.createdAt).toLocaleDateString()}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Account Type</label>
              <p className="text-lg font-medium capitalize">{user.role}</p>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              To update your profile information like name, email, or password, please visit your Clerk account
              settings.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4 border-t">
            <Button asChild>
              <a href="https://dashboard.clerk.com" target="_blank" rel="noopener noreferrer">
                Manage Account Settings
              </a>
            </Button>
            <Button asChild variant="outline">
              <Link href="/account">Back to Dashboard</Link>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
