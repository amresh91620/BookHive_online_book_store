import { useEffect, useRef } from "react";
import { useAdminOrders } from "./api/useAdmin";
import toast from "react-hot-toast";
import { Bell } from "lucide-react";

export const useAdminOrderNotifications = () => {
  const previousCountRef = useRef(null);
  const hasInitializedRef = useRef(false);

  // Poll for new orders every 30 seconds
  const { data } = useAdminOrders({}, {
    refetchInterval: 30000, // 30 seconds
    refetchIntervalInBackground: false,
  });

  useEffect(() => {
    if (!data?.orders) return;

    const currentPendingOrders = data.orders.filter(
      (order) => order.status === "Pending"
    );
    const currentCount = currentPendingOrders.length;

    // Skip notification on initial load
    if (!hasInitializedRef.current) {
      previousCountRef.current = currentCount;
      hasInitializedRef.current = true;
      return;
    }

    // Check if there are new pending orders
    if (
      previousCountRef.current !== null &&
      currentCount > previousCountRef.current
    ) {
      const newOrdersCount = currentCount - previousCountRef.current;
      
      // Show notification
      toast.success(
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          <div>
            <p className="font-semibold">New Order{newOrdersCount > 1 ? "s" : ""} Received!</p>
            <p className="text-sm">
              {newOrdersCount} new order{newOrdersCount > 1 ? "s" : ""} waiting for processing
            </p>
          </div>
        </div>,
        {
          duration: 5000,
          position: "top-right",
        }
      );

      // Play notification sound (optional)
      try {
        const audio = new Audio("/notification.mp3");
        audio.volume = 0.5;
        audio.play().catch(() => {
          // Ignore if audio fails to play
        });
      } catch (error) {
        // Ignore audio errors
      }
    }

    previousCountRef.current = currentCount;
  }, [data]);

  return {
    pendingOrdersCount: data?.orders?.filter((o) => o.status === "Pending").length || 0,
  };
};
