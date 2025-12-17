import { useEffect, useState } from "react";

function DeadlineTimer({ dueDate, graceMinutes = 120 }) {
  const [timeLeft, setTimeLeft] = useState("");
  const [status, setStatus] = useState("ok");

  useEffect(() => {
    if (!dueDate) return;

    const interval = setInterval(() => {
      const now = new Date();
      const due = new Date(dueDate);
      const diff = due - now;

      if (diff <= 0) {
        const graceEnd = new Date(due.getTime() + graceMinutes * 60000);
        if (now <= graceEnd) {
          setStatus("grace");
          setTimeLeft("⏳ Grace Period Active");
        } else {
          setStatus("late");
          setTimeLeft("⛔ Deadline Passed");
          clearInterval(interval);
        }
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diff / (1000 * 60)) % 60);

      if (days === 0 && hours < 24) setStatus("warning");
      else setStatus("ok");

      setTimeLeft(`${days}d ${hours}h ${mins}m remaining`);
    }, 60000);

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

  return <p className={`text-sm font-semibold ${color}`}>⏳ {timeLeft}</p>;
}

export default DeadlineTimer;
