"use strict";

module.exports = {
  /**
   * Calculates PWM Period and Duty based on provided params.
   *
   * @param {Number} scaledDuty the scaled duty value
   * @param {Number} freq frequency to use
   * @param {Number} pulseWidth pulse width
   * @param {String} [polarity=high] polarity value (high or low)
   * @return {Object} calculated period and duty encapsulated in an object
   */
  periodAndDuty: function(scaledDuty, freq, pulseWidth, polarity) {
    var period, duty, maxDuty;

    polarity = polarity || "high";
    period = Math.round(1.0e9 / freq);

    if (pulseWidth != null) {
      var pulseWidthMin = pulseWidth.min * 1000,
          pulseWidthMax = pulseWidth.max * 1000;

      maxDuty = pulseWidthMax - pulseWidthMin;
      duty = Math.round(pulseWidthMin + (maxDuty * scaledDuty));
    } else {
      duty = Math.round(period * scaledDuty);
    }

    if (polarity === "low") {
      duty = period - duty;
    }

    return { period: period, duty: duty };
  }
};
