"use client";

import { useEffect, useState } from "react";

/* ------------------------------------------------------------------
   The Mars Clock — Amandah Yahsarael's calendar system
   Mars time of day (MTC) — NASA Mars24 Airy-0 method
   ------------------------------------------------------------------ */

const EPOCH_UTC = Date.UTC(2021, 1, 7); // 7 February 2021
const MARS_YEAR = 687;
const MARS_MONTH = 57.25;
const SOL_YEAR = 668;
const SOL_MONTH = 55.667;
const DAY_MS = 86400000;

type Readout = {
  earthDate: string;
  dayOfYear: number;
  earthTime: string;
  zone: string;
  marsDay: number;
  marsDate: string;
  sol: number;
  solDate: string;
  mtc: string;
};

const pad = (n: number) => String(n).padStart(2, "0");

/** Calendar date, time and zone in the UK (switches BST/GMT automatically). */
function londonParts(now: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
    timeZoneName: "short",
  }).formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return {
    y: Number(get("year")),
    m: Number(get("month")),
    d: Number(get("day")),
    time: `${get("hour")}:${get("minute")}:${get("second")}`,
    zone: get("timeZoneName"),
  };
}

/** Day count, month and day within a cycle (Amandah Yahsarael's method). */
function cycle(totalDays: number, yearLen: number, monthLen: number) {
  // Last day of each cycle shows as the full count (687 / 668), not 0
  const dayInYear = ((totalDays % yearLen) + yearLen) % yearLen || yearLen;
  const complete = Math.floor(dayInYear / monthLen);
  const remaining = dayInYear - complete * monthLen;
  let month = complete + 1;
  let day = Math.floor(remaining);
  if (remaining === 0) {
    day = 57;
    month = complete;
  }
  return { dayInYear, date: `${pad(month)}.${pad(day)}` };
}

/** Coordinated Mars Time, NASA Mars24 Airy-0 algorithm. */
function coordinatedMarsTime(now: Date) {
  const jdUT = now.getTime() / DAY_MS + 2440587.5;
  const jdTT = jdUT + 69.184 / 86400; // TT = UTC + 69.184 s
  const msd = (jdTT - 2451549.5) / 1.0274912517 + 44796.0 - 0.0009626;
  const hours = (((msd % 1) + 1) % 1) * 24;
  const h = Math.floor(hours);
  const mFloat = (hours - h) * 60;
  const m = Math.floor(mFloat);
  const s = Math.floor((mFloat - m) * 60);
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

function getReadout(now: Date): Readout {
  const L = londonParts(now);
  const todayUTC = Date.UTC(L.y, L.m - 1, L.d);
  const totalDays = Math.round((todayUTC - EPOCH_UTC) / DAY_MS);
  const dayOfYear = Math.round((todayUTC - Date.UTC(L.y, 0, 1)) / DAY_MS) + 1;
  const mars = cycle(totalDays, MARS_YEAR, MARS_MONTH);
  const sol = cycle(totalDays, SOL_YEAR, SOL_MONTH);

  const dp = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).formatToParts(now);
  const dget = (t: string) => dp.find((p) => p.type === t)?.value ?? "";
  const earthDate = `${dget("weekday")}, ${dget("day")} ${dget("month")} ${dget("year")}`;

  return {
    earthDate,
    dayOfYear,
    earthTime: L.time,
    zone: L.zone,
    marsDay: mars.dayInYear,
    marsDate: mars.date,
    sol: sol.dayInYear,
    solDate: sol.date,
    mtc: coordinatedMarsTime(now),
  };
}

export default function Home() {
  const [data, setData] = useState<Readout | null>(null);

  useEffect(() => {
    const tick = () => setData(getReadout(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <main className="page">
      <header className="head">
        <div>
          <p className="eyebrow">Current readout</p>
          <h1>Earth and Mars time</h1>
        </div>
        <p className="updated">
          <span className="live">
            <span className="live-dot" aria-hidden="true" />
            Live
          </span>
          Updated every second
        </p>
      </header>

      <section className="cards">
        <article className="card">
          <h2 className="card-title">Earth</h2>
          <p className="earth-date">{data ? data.earthDate : "\u00a0"}</p>
          <div className="pair">
            <div>
              <p className="label">Day of year</p>
              <p className="value">{data ? data.dayOfYear : "—"}</p>
            </div>
            <div>
              <p className="label">Time</p>
              <p className="value">{data ? data.earthTime : "--:--:--"}</p>
              <p className="zone">{data ? data.zone : "\u00a0"}</p>
            </div>
          </div>
        </article>

        <article className="card">
          <h2 className="card-title">Mars day</h2>
          <div className="pair">
            <div>
              <p className="label">Day</p>
              <p className="value">{data ? data.marsDay : "—"}</p>
            </div>
            <div>
              <p className="label">Mars date</p>
              <p className="value">{data ? data.marsDate : "—"}</p>
            </div>
          </div>
        </article>

        <article className="card">
          <h2 className="card-title">Mars sol</h2>
          <div className="pair">
            <div>
              <p className="label">Sol</p>
              <p className="value">{data ? data.sol : "—"}</p>
            </div>
            <div>
              <p className="label">Mars date</p>
              <p className="value">{data ? data.solDate : "—"}</p>
            </div>
          </div>
          <p className="value big">{data ? data.mtc : "--:--:--"}</p>
          <p className="label">MTC / Airy-0</p>
        </article>
      </section>

      <footer className="credit">
        The Mars Clock by Amandah Yahsarael. MTC uses the NASA Mars24 Airy-0 method.
      </footer>
    </main>
  );
}
