"use client"

import { useEffect, useState } from "react"
import { getMarsClockData, MarsClockData } from "../lib/mars"

function formatEarthDate(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date)
}

export default function HomePage() {
  const [now, setNow] = useState<Date | null>(null)
  const [clock, setClock] = useState<MarsClockData | null>(null)

  useEffect(() => {
    const updateClock = () => {
      const current = new Date()
      setNow(current)
      setClock(getMarsClockData(current))
    }

    updateClock()

    const interval = window.setInterval(updateClock, 1000)

    return () => window.clearInterval(interval)
  }, [])

  if (!now || !clock) {
    return (
      <main className="page">
        <div className="loading">Loading The Mars Clock…</div>
      </main>
    )
  }

  return (
    <main className="page">
      {/* HERO SECTION */}
      <section className="hero">
        <p className="eyebrow">TRACKING TIME ON TWO WORLDS</p>
        <h1>
          THE MARS
          <span>CLOCK</span>
        </h1>
        <div className="live">
          <span className="live-dot" />
          LIVE
        </div>
      </section>

      {/* CLOCK PANEL */}
      <section className="clock-panel">
        <div className="panel-heading">
          <div>
            <p className="section-label">CURRENT READOUT</p>
            <h2>Earth and Mars time</h2>
          </div>
          <p className="updated">Updated every second</p>
        </div>

        <div className="cards">
          {/* EARTH CARD */}
          <article className="card earth-card">
            <p className="card-label">EARTH</p>
            <p className="date-large">{formatEarthDate(now)}</p>

            <div className="data-grid">
              <div>
                <span>DAY OF YEAR</span>
                <strong>{clock.earthDayOfYear}</strong>
              </div>

              <div>
                <span>TIME</span>
                <strong>{clock.earthTime}</strong>
                <small>{clock.earthTimeZone}</small>
              </div>
            </div>
          </article>

          {/* MARS DAY CARD (Earth Framework) */}
          <article className="card mars-day-card">
            <p className="card-label">MARS DAY</p>

            <div className="data-grid">
              <div>
                <span>DAY</span>
                <strong>{clock.marsDayCount}</strong>
              </div>

              <div>
                <span>MARS DATE</span>
                <strong>{clock.marsDateEarth}</strong>
              </div>
            </div>

            <p className="note">
              Day count and date within the 687-day Mars year, using Amanda
              Yahsarael's calendar system.
            </p>
          </article>

          {/* MARS SOL CARD (Sol Framework + NASA Mars24 Time) */}
          <article className="card mars-sol-card">
            <p className="card-label">MARS SOL</p>

            <div className="data-grid">
              <div>
                <span>SOL</span>
                <strong>{clock.marsSolDay}</strong>
              </div>

              <div>
                <span>MARS DATE</span>
                <strong>{clock.marsDateSol}</strong>
              </div>
            </div>

            <div className="solar-time">
              <span>{clock.marsTime}</span>
              <small>MTC / AIRY-0</small>
            </div>

            <p className="note">
              Sol day and date within the 668-day Mars year, using Amanda
              Yahsarael's calendar system. MTC (Coordinated Mars Time)
              calculated using the NASA Mars24 Airy-0 method.
            </p>
          </article>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <p>
          <strong>The Mars Clock:</strong>
          Mars day, Mars date, sol and sol date follow
          Amanda Yahsarael's calendar system.
        </p>

        <p>
          <strong>Mars solar time:</strong>
          MTC calculated using the NASA Mars24 Airy-0 method.
        </p>

        <p>
          NASA Mars24 is acknowledged for the solar-time calculation method only.
        </p>
      </footer>
    </main>
  )
}
