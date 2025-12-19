import { useEffect, useState } from "react";

function DeadlineTimer({ dueDate, graceMinutes = 120 }) {
  const [label, setLabel] = useState("");
  const [status, setStatus] = useState("ok");

  useEffect(() => {
    if (!dueDate) {
      setLabel("No deadline");
      return;
    }

    const update = () => {
      const now = Date.now();
      const due = new Date(dueDate).getTime();
      const graceEnd = due + graceMinutes * 60 * 1000;

      if (now < due) {
        // ⏳ ON TIME
        const diff = due - now;
        const mins = Math.floor(diff / 60000);
        const hrs = Math.floor(mins / 60);
        const days = Math.floor(hrs / 24);

        if (days > 0) {
          setStatus("ok");
          setLabel(`${days}d ${hrs % 24}h remaining`);
          return;
        }

        setStatus(hrs < 24 ? "warning" : "ok");
        setLabel(
          hrs > 0 ? `${hrs}h ${mins % 60}m remaining` : `${mins}m remaining`
        );
        return;
      }

      if (now >= due && now <= graceEnd) {
        // ⚠ GRACE PERIOD
        const diff = graceEnd - now;
        const mins = Math.floor(diff / 60000);
        setStatus("grace");
        setLabel(`Grace ends in ${mins}m`);
        return;
      }

      // ❌ CLOSED
      setStatus("late");
      setLabel("Submission Closed");
    };

    update(); // 🔥 immediate render (NO DELAY)

    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [dueDate, graceMinutes]);

  const color =
    status === "ok"
      ? "text-green-600"
      : status === "warning"
      ? "text-yellow-500"
      : status === "grace"
      ? "text-orange-500"
      : "text-red-600";

  return <p className={`text-sm font-semibold ${color}`}>⏳ {label}</p>;
}

export default DeadlineTimer;
