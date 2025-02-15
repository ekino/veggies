const formatterCache = new Map<string, Intl.DateTimeFormat>()

const getFormatter = (locale: string, options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat => {
    const key = locale + JSON.stringify(options)
    if (formatterCache.has(key)) {
        return formatterCache.get(key) as Intl.DateTimeFormat
    }
    const formatter = new Intl.DateTimeFormat(locale, options)
    formatterCache.set(key, formatter)
    return formatter
}

/**
 * Adds a relative offset to a given Date.
 * @param date - The base date.
 * @param opts - Options with properties:
 *   - unit: a string such as 'days', 'months', etc.
 *   - amount: a number (can be negative)
 * @returns A new Date instance with the offset applied.
 */
export const addTime = (date: Date, { unit, amount }: { unit: string; amount: number }): Date => {
    const newDate = new Date(date.getTime())
    const lowerUnit = unit.toLowerCase()
    switch (lowerUnit) {
        case 'year':
        case 'years':
            newDate.setFullYear(newDate.getFullYear() + amount)
            break
        case 'month':
        case 'months':
            newDate.setMonth(newDate.getMonth() + amount)
            break
        case 'week':
        case 'weeks':
            newDate.setDate(newDate.getDate() + amount * 7)
            break
        case 'day':
        case 'days':
            newDate.setDate(newDate.getDate() + amount)
            break
        case 'hour':
        case 'hours':
            newDate.setHours(newDate.getHours() + amount)
            break
        case 'minute':
        case 'minutes':
            newDate.setMinutes(newDate.getMinutes() + amount)
            break
        case 'second':
        case 'seconds':
            newDate.setSeconds(newDate.getSeconds() + amount)
            break
        case 'millisecond':
        case 'milliseconds':
            newDate.setMilliseconds(newDate.getMilliseconds() + amount)
            break
        default:
            throw new Error(`Unsupported unit: ${unit}`)
    }
    return newDate
}

/**
 * Formats a Date object into a string according to a custom format.
 *
 * Supported tokens (case-sensitive):
 *   - YYYY or yyyy: 4-digit year
 *   - YY or yy: 2-digit year
 *   - MMMM: full month name (locale-dependent)
 *   - MMM: abbreviated month name (locale-dependent)
 *   - MM: 2-digit month number
 *   - M: month number without leading zero
 *   - DD or dd: 2-digit day of month
 *   - D or d: day of month without leading zero
 *   - HH: 2-digit hour (24-hour clock)
 *   - H: hour (24-hour clock) without leading zero
 *   - hh: 2-digit hour (12-hour clock)
 *   - h: hour (12-hour clock) without leading zero
 *   - mm: 2-digit minute
 *   - m: minute without leading zero
 *   - ss: 2-digit second
 *   - s: second without leading zero
 *
 * Literal text can be included by wrapping it in square brackets, e.g. [Today].
 *
 * @param date - The Date to format.
 * @param fmt - The format string.
 * @param locale - A BCP47 locale string.
 * @returns The formatted date.
 */
export const formatTime = (date: Date, fmt: string, locale: string): string => {
    const pad = (n: number, width = 2): string => n.toString().padStart(width, '0')
    const fullMonthFormatter = getFormatter(locale, { month: 'long' })
    const shortMonthFormatter = getFormatter(locale, { month: 'short' })
    const fullMonth = fullMonthFormatter.format(date)
    const shortMonth = shortMonthFormatter.format(date)

    const tokenMap: Record<string, string> = {
        yyyy: pad(date.getFullYear(), 4),
        YYYY: pad(date.getFullYear(), 4),
        yy: pad(date.getFullYear() % 100, 2),
        YY: pad(date.getFullYear() % 100, 2),
        MMMM: fullMonth,
        MMM: shortMonth,
        MM: pad(date.getMonth() + 1, 2),
        M: (date.getMonth() + 1).toString(),
        dd: pad(date.getDate(), 2),
        DD: pad(date.getDate(), 2),
        d: date.getDate().toString(),
        D: date.getDate().toString(),
        HH: pad(date.getHours(), 2),
        H: date.getHours().toString(),
        // 12-hour clock tokens:
        hh: pad(date.getHours() % 12 || 12, 2),
        h: (date.getHours() % 12 || 12).toString(),
        mm: pad(date.getMinutes(), 2),
        m: date.getMinutes().toString(),
        ss: pad(date.getSeconds(), 2),
        s: date.getSeconds().toString(),
    }
    const regex = /\[([^\]]+)\]|(YYYY|yyyy|YY|yy|MMMM|MMM|MM|M|DD|dd|D|d|HH|H|hh|h|mm|m|ss|s)/g
    return fmt.replace(regex, (match: string, literal: string, token: string): string => {
        if (literal !== undefined) {
            return literal
        }
        return tokenMap[token] !== undefined ? tokenMap[token] : match
    })
}
