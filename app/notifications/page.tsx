import { NotificationList } from "@/components/notifications/NotificationList"

export default function NotificationsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Your Notifications</h1>
      <NotificationList />
    </div>
  )
}
