"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { updateOrderStatus } from "@/app/actions/admin"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

interface UpdateOrderStatusButtonProps {
  orderId: string
  currentStatus: string
  nextStatus: string
}

export function UpdateOrderStatusButton({ orderId, currentStatus, nextStatus }: UpdateOrderStatusButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleUpdateStatus = async () => {
    setLoading(true)
    try {
      await updateOrderStatus(orderId, nextStatus)
      router.refresh()
    } catch (error) {
      console.error("Error updating order status:", error)
      alert("Failed to update order status")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleUpdateStatus} disabled={loading} className="w-full">
      {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
      Mark as {nextStatus.charAt(0).toUpperCase() + nextStatus.slice(1)}
    </Button>
  )
}
