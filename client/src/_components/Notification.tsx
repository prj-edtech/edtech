import { apiURL } from "@/api/apiURL";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import axios from "axios";
import dayjs from "dayjs";
import { Bell, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

const Notification = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiURL}/notifications`);
      setData(response.data.data.slice(0, 5));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(() => {
      loadNotifications();
    }, 10000); // every 10 seconds

    return () => clearInterval(interval); // clean up on unmount
  }, []);

  const handleReadAll = async () => {
    setLoading(true);
    try {
      await axios.patch(`${apiURL}/notifications/readall`);
      loadNotifications();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      onOpenChange={(open) => {
        if (open) {
          loadNotifications();
        }
      }}
    >
      <DialogTrigger asChild>
        <div className="relative cursor-pointer">
          <Bell className="w-5 h-5" />
          {data.length > 0 && (
            <span className="absolute -top-1 -right-1 flex items-center justify-center w-2 h-2 text-[10px] font-medium rounded-full border border-white text-white bg-blue-500"></span>
          )}
        </div>
      </DialogTrigger>

      <DialogContent className="flex flex-col gap-y-4 lg:p-6 max-h-[70vh] overflow-y-auto font-redhat">
        <h3 className="text-lg font-semibold">Notifications</h3>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="w-5 h-5 animate-spin" />
          </div>
        ) : data.length === 0 ? (
          <div className="text-sm text-gray-500">No notifications found.</div>
        ) : (
          <>
            {data.map((notification, idx) => (
              <div
                key={idx}
                className="flex flex-col gap-y-1 border-b pb-3 last:border-b-0 last:pb-0"
              >
                <div className="text-sm font-bold uppercase">
                  {notification.title}
                </div>
                <div className="text-xs text-gray-500">
                  From: {notification.User.name}
                </div>
                <div className="text-[10px] text-gray-400">
                  {dayjs(notification.createdAt).format("D MMMM, YYYY")}
                </div>
                <div className="text-[10px] text-gray-400">
                  {new Date(notification.createdAt).toLocaleTimeString()}
                </div>
              </div>
            ))}
            <Button
              disabled={loading}
              className="w-full rounded-none"
              onClick={handleReadAll}
            >
              Read All
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Notification;
