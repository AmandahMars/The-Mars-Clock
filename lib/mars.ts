/**
 * THE MARS CLOCK
 * 
 * Integration of:
 * 1. Amanda Yahsarael's Mars Calendar System (Ethiopia framework)
 * 2. NASA Mars24 Airy-0 algorithm for Coordinated Mars Time (MTC only)
 * 
 * Epoch: February 7, 2021
 * © 2026 Amanda Murrain / Amandah Yahsarael
 * 
 * Amanda Yahsarael's calendar values (Mars day, date, sol, sol date) are 
 * distinct from and independent of NASA's Mars24 calendar system.
 * NASA Mars24 is used only for MTC calculation at the Airy-0 prime meridian.
 */

export type MarsClockData = {
  // Earth
  earthDate: string           // "2026-09-13"
  earthDayOfYear: number      // 256
  earthTime: string           // "11:39:32"
  earthTimeZone: string       // "BST"

  // Mars Day (Earth Framework - 687 day cycle)
  // From Amanda Yahsarael's calendar system
  marsDayCount: number        // 670
  marsDateEarth: string       // "12.40"

  // Mars Sol (Sol Framework - 668 day cycle)
  // From Amanda Yahsarael's calendar system
  // MTC calculated using NASA Mars24 Airy-0 method
  marsSolDay: number          // 40
  marsDateSol: string         // "01.40"
  marsTime: string            // "15:51:32"

  // NASA Mars24 reference values (MTC calculation only)
  marsSolDate: number         // Full MSD with decimals
  marsSolFraction: number     // Fractional part of MSD
}

// ============================================================================
// CONSTANTS
// ============================================================================

const MARS_SOL_LENGTH_EARTH_DAYS = 1.0274912517
const MARS_EPOCH_JD = 2451549.5
const NASA_OFFSET = 44796.0 - 0.0009626

// Amanda Yahsarael Mars Calendar Epoch
const RESEARCH_EPOCH = new Date(Date.UTC(2021, 1, 7)) // February 7, 2021

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function pad(value: number, length = 2): string {
  return String(value).padStart(length, "0")
}

function modulo(value: number, divisor: number): number {
  return ((value % divisor) + divisor) % divisor
}

/**
 * Calculate day of year (1-366)
 */
function getDayOfYear(date: Date): number {
  const start = new Date(Date.UTC(date.getUTCFullYear(), 0, 0))
  const difference = date.getTime() - start.getTime()
  return Math.floor(difference / 86400000)
}

/**
 * Calculate Julian Date from JavaScript Date
 */
function julianDate(date: Date): number {
  return date.getTime() / 86400000 + 2440587.5
}

/**
 * Calculate days between two dates
 */
function daysBetween(startDate: Date, endDate: Date): number {
  const msPerDay = 86400000
  return Math.floor((endDate.getTime() - startDate.getTime()) / msPerDay)
}

/**
 * Format Earth time with timezone
 * BST = UTC+1 (British Summer Time)
 */
function formatEarthTime(date: Date, timeZone: string = "Europe/London"): string {
  // Get UTC time
  const utcHours = date.getUTCHours()
  const minutes = pad(date.getUTCMinutes())
  const seconds = pad(date.getUTCSeconds())
  
  // Convert UTC to BST (UTC+1)
  // Note: This assumes BST year-round for consistency
  // In production, detect actual timezone offset
  const bstHours = pad((utcHours + 1) % 24)

  return `${bstHours}:${minutes}:${seconds}`
}

// ============================================================================
// NASA MARS24 ALGORITHM
// ============================================================================

/**
 * Calculate Mars Sol Date using NASA Mars24 method
 * This is the NASA-standard Mars timekeeping system
 */
function calculateMarsSolDate(date: Date): number {
  const jdUtc = julianDate(date)

  return (jdUtc - MARS_EPOCH_JD) / MARS_SOL_LENGTH_EARTH_DAYS + NASA_OFFSET
}

/**
 * Calculate Coordinated Mars Time (MTC) from Mars Sol Date
 * MTC is mean solar time at the Airy-0 prime meridian
 * 
 * PRECISION: Calculated to the second with no rounding drift
 */
function calculateMtc(msd: number): string {
  const fractionalSol = modulo(msd, 1)
  
  // Convert fractional sol to total Mars seconds
  // Mars sol = 88,642.6 Earth seconds (24h 37m 22.6s)
  const marsSecPerSol = 24 * 3600 + 37 * 60 + 22.6  // 88,642.6 seconds
  const totalMarsSeconds = Math.floor(fractionalSol * marsSecPerSol)
  
  // Extract hours, minutes, seconds from total Mars seconds
  const hours = Math.floor(totalMarsSeconds / 3600)
  const remaining = totalMarsSeconds % 3600
  const minutes = Math.floor(remaining / 60)
  const seconds = remaining % 60
  
  return `${pad(hours % 24)}:${pad(minutes)}:${pad(seconds)}`
}

// ============================================================================
// AMANDA YAHSARAEL MARS RESEARCH CALENDAR
// ============================================================================

/**
 * Calculate Mars Date in M.DD format
 * 
 * Algorithm from Amanda Yahsarael's spreadsheet:
 * 1. Days in current cycle: MOD(totalDays, cycleLength)
 * 2. Complete months: INT(days / daysPerMonth)
 * 3. Days used in complete months: completeMonths × daysPerMonth
 * 4. Day of month: IF(daysRemaining = 0, daysPerMonth, INT(daysRemaining))
 * 5. Month: IF(daysRemaining = 0, completeMonths, completeMonths + 1)
 */
function calculateMarsDate(
  totalDays: number,
  cycleLength: number,
  daysPerMonth: number
): string {
  // Days in current Mars year/cycle
  const daysInCycle = totalDays % cycleLength

  // Complete months
  const completeMonths = Math.floor(daysInCycle / daysPerMonth)

  // Days used in complete months
  const daysUsed = completeMonths * daysPerMonth

  // Days remaining
  const daysRemaining = daysInCycle - daysUsed

  // Day of month (if 0, it's the last day = daysPerMonth)
  const dayOfMonth = daysRemaining === 0 ? daysPerMonth : Math.floor(daysRemaining)

  // Month number
  const monthNumber = daysRemaining === 0 ? completeMonths : completeMonths + 1

  return `${pad(monthNumber)}.${pad(dayOfMonth)}`
}

/**
 * Calculate Amanda Yahsarael's Mars Calendar System values
 * Using Ethiopia framework (Column B/C in spreadsheet)
 * 
 * This system is independent of NASA Mars24 and represents
 * Amanda Yahsarael's own calendar methodology.
 */
function calculateResearchCalendar(date: Date): {
  marsDayCount: number
  marsDateEarth: string
  marsSolDay: number
  marsDateSol: string
} {
  // Total days from epoch (Feb 7, 2021)
  const totalDaysFromEpoch = daysBetween(RESEARCH_EPOCH, date)

  // =========================================================================
  // EARTH FRAMEWORK (Column B)
  // 687-day Mars year, 57.25-day months
  // From Amanda Yahsarael's calendar system
  // =========================================================================

  const earthCycleLength = 687
  const earthDaysPerMonth = 57.25

  // Mars Day: Day count within the 687-day Earth cycle
  const marsDayCount = totalDaysFromEpoch % earthCycleLength

  // Mars Date (Earth)
  const marsDateEarth = calculateMarsDate(
    totalDaysFromEpoch,
    earthCycleLength,
    earthDaysPerMonth
  )

  // =========================================================================
  // SOL FRAMEWORK (Column C)
  // 668-day Mars year, 55.667-day months
  // From Amanda Yahsarael's calendar system
  // =========================================================================

  const solCycleLength = 668
  const solDaysPerMonth = 55.666666 // 668 / 12

  // Days in current Sol cycle
  const daysInSolCycle = totalDaysFromEpoch % solCycleLength

  // Complete Sol months
  const completeSolMonths = Math.floor(daysInSolCycle / solDaysPerMonth)

  // Sol days used in complete months
  const solDaysUsed = completeSolMonths * solDaysPerMonth

  // Sol days remaining
  const solDaysRemaining = daysInSolCycle - solDaysUsed

  // Mars Sol Day: Day number within the Sol cycle
  // If remaining = 0, show 55 (last day); otherwise show the day
  const marsSolDay = solDaysRemaining === 0 ? 55 : Math.floor(solDaysRemaining)

  // Mars Date (Sol)
  const marsDateSol = calculateMarsDate(
    totalDaysFromEpoch,
    solCycleLength,
    solDaysPerMonth
  )

  return {
    marsDayCount,
    marsDateEarth,
    marsSolDay,
    marsDateSol,
  }
}

// ============================================================================
// MAIN EXPORT
// ============================================================================

/**
 * Calculate complete Mars Clock data for a given Earth date/time
 * Combines Amanda Yahsarael's Mars Calendar System with NASA Mars24 Airy-0 (MTC only)
 */
export function getMarsClockData(date: Date): MarsClockData {
  // Format Earth date and time
  const earthYear = date.getUTCFullYear()
  const earthMonth = pad(date.getUTCMonth() + 1)
  const earthDay = pad(date.getUTCDate())

  const earthDate = `${earthYear}-${earthMonth}-${earthDay}`
  const earthDayOfYear = getDayOfYear(date)
  const earthTime = formatEarthTime(date)

  // Calculate Mars calendar values (Amanda Yahsarael's system)
  const research = calculateResearchCalendar(date)

  // Calculate NASA Mars24 values
  const marsSolDate = calculateMarsSolDate(date)
  const marsSolFraction = modulo(marsSolDate, 1)
  const marsTime = calculateMtc(marsSolDate)

  return {
    // Earth
    earthDate,
    earthDayOfYear,
    earthTime,
    earthTimeZone: "BST", // Configure per user's timezone

    // Mars Day (Earth Framework)
    marsDayCount: research.marsDayCount,
    marsDateEarth: research.marsDateEarth,

    // Mars Sol (Sol Framework)
    marsSolDay: research.marsSolDay,
    marsDateSol: research.marsDateSol,
    marsTime,

    // NASA reference values
    marsSolDate,
    marsSolFraction,
  }
}

// ============================================================================
// TEST (run with: npx ts-node lib-mars-complete.ts)
// ============================================================================

if (require.main === module) {
  const testDate = new Date(Date.UTC(2026, 8, 13, 11, 39, 32)) // Sept 13, 2026, 11:39:32 UTC
  const result = getMarsClockData(testDate)

  console.log("TEST: September 13, 2026, 11:39:32 UTC")
  console.log("========================================")
  console.log()
  console.log("EARTH")
  console.log(`  Date: ${result.earthDate}`)
  console.log(`  Day of Year: ${result.earthDayOfYear}`)
  console.log(`  Time: ${result.earthTime} ${result.earthTimeZone}`)
  console.log()
  console.log("MARS DAY (Amanda Yahsarael's Calendar System - 687 day cycle)")
  console.log(`  Mars Day: ${result.marsDayCount}`)
  console.log(`  Mars Date: ${result.marsDateEarth}`)
  console.log()
  console.log("MARS SOL (Amanda Yahsarael's Calendar System - 668 day cycle)")
  console.log(`  Mars Sol: ${result.marsSolDay}`)
  console.log(`  Mars Date: ${result.marsDateSol}`)
  console.log(`  Mars Time (MTC): ${result.marsTime}`)
  console.log()
  console.log("EXPECTED FROM TIKTOK (Sept 13, 2026)")
  console.log("  Earth: Day 256, 13.09.26, 11:39 BST")
  console.log("  Mars Day: 670, Date: 12.40")
  console.log("  Mars Sol: 40, Date: 01.40, Time: 15:51 MTC")
  console.log()
  console.log("ATTRIBUTION")
  console.log("  Calendar System: Amanda Yahsarael / Amanda Murrain")
  console.log("  NASA Mars24 Airy-0: Used for MTC calculation only")
  console.log("  © 2026 The Mars Clock")
}
