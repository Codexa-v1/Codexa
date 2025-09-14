import cron from "node-cron";
import Event from "../models/event.js";

export const startEventStatusUpdater = () => {
  cron.schedule("0 * * * *", async () => {
    try {
      const now = new Date();

      await Event.updateMany({ date: { $gt: now } }, { status: "Planned" });

      await Event.updateMany(
        { date: { $lte: now }, endDate: { $gte: now } },
        { status: "Ongoing" }
      );

      await Event.updateMany(
        { endDate: { $lt: now } },
        { status: "Completed" }
      );
    } catch (err) {
      console.error("❌ Error updating event statuses:", err);
    }
  });
};
