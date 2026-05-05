import {
  addDays,
  nextMonday,
  setHours,
  setMinutes,
  setSeconds,
  startOfDay,
} from "date-fns";
import { fromZonedTime } from "date-fns-tz";
import { supabase } from "./supabase";

const TZ = "America/Recife";
const PUBLISH_HOUR = 9;

function publishMomentBRT(base: Date): Date {
  const local = setSeconds(setMinutes(setHours(base, PUBLISH_HOUR), 0), 0);
  return fromZonedTime(local, TZ);
}

export async function nextFreeSlot(): Promise<Date> {
  const { data, error } = await supabase
    .from("blog_publish_queue")
    .select("scheduled_for")
    .is("published_at", null)
    .order("scheduled_for", { ascending: false })
    .limit(1);
  if (error) throw error;
  if (!data?.length) {
    return publishMomentBRT(nextMonday(new Date()));
  }
  return publishMomentBRT(addDays(new Date(data[0].scheduled_for), 7));
}

export async function isDateFree(date: Date): Promise<boolean> {
  const dayStart = startOfDay(date).toISOString();
  const dayEnd = addDays(startOfDay(date), 1).toISOString();
  const { count, error } = await supabase
    .from("blog_publish_queue")
    .select("id", { count: "exact", head: true })
    .is("published_at", null)
    .gte("scheduled_for", dayStart)
    .lt("scheduled_for", dayEnd);
  if (error) throw error;
  return (count ?? 0) === 0;
}

export function toLocalIsoBRT(date: Date): string {
  return publishMomentBRT(date).toISOString();
}
