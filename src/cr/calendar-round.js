const tzolkin = require('../cr/tzolkin')
const haab = require('../cr/haab')
const wildcard = require('../wildcard')

/**
 * A combination of 260-day cycles and the Haab cycle.
 * @example
 *  let cr = new CalendarRound(8, "Ajaw", 4, "Kumk'u");
 */
class CalendarRound {
  /**
   *
   * @param {number} tzolkin_coeff Coefficient for the 260-day cycle
   * @param {string} tzolkin_day Name of the name in the 260-day cycle
   * @param {number} haab_coeff Day in the Haab month
   * @param {string} haab_month Name of the Haab month
   */
  constructor (tzolkin_coeff, tzolkin_day, haab_coeff, haab_month) {
    /**
     * 260-day cycle component of the Calendar Round
     * @type {Tzolkin}
     */
    this.tzolkin = new tzolkin.Tzolkin(tzolkin_coeff, tzolkin_day)
    /**
     * Haab cycle component of the Calendar Round
     * @type {Haab}
     */
    this.haab = new haab.Haab(haab_coeff, haab_month)
  }

  /**
   * Increment both the Haab and 260-day cycle to the next day in the Calendar Round
   * @returns {CalendarRound}
   */
  next () {
    let new_cr = new CalendarRound()
    new_cr.haab = this.haab.next()
    new_cr.tzolkin = this.tzolkin.next()
    return new_cr
  }

  equal (new_cr) {
    return this.haab.equal(new_cr.haab) &&
      this.tzolkin.equal(new_cr.tzolkin)
  }

  match (new_cr) {
    return this.haab.match(new_cr.haab) &&
      this.tzolkin.match(new_cr.tzolkin)
  }

  shift (increment) {
    let new_cr = this.clone()
    new_cr.haab = new_cr.haab.shift(increment)
    new_cr.tzolkin = new_cr.tzolkin.shift(increment)
    return new_cr
  }

  clone () {
    return new CalendarRound(
      this.tzolkin.coeff,
      this.tzolkin.day,
      this.haab.coeff,
      this.haab.month,
    )
  }

  is_partial () {
    return (this.tzolkin.day === wildcard) ||
      (this.tzolkin.coeff === wildcard) ||
      (this.haab.month === wildcard) ||
      (this.haab.coeff === wildcard)
  }

  /**
   * Render the CalendarRound cycle date as a string
   * @returns {string}
   */
  toString () {
    return `${this.tzolkin} ${this.haab}`
  }
}

module.exports = CalendarRound
