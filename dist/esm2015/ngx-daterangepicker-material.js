import { Component, ElementRef, ViewChild, EventEmitter, Output, Directive, ViewContainerRef, ComponentFactoryResolver, HostListener, forwardRef, ChangeDetectorRef, Input, KeyValueDiffers, Renderer2, NgModule } from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR, FormsModule, ReactiveFormsModule } from '@angular/forms';
import * as _moment from 'moment';
import { CommonModule } from '@angular/common';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
const moment = _moment;
/** @enum {string} */
const SideEnum = {
    left: 'left',
    right: 'right',
};
class DaterangepickerComponent {
    /**
     * @param {?} el
     */
    constructor(el) {
        this.el = el;
        this._old = { start: null, end: null };
        this.calendarVariables = { left: {}, right: {} };
        this.daterangepicker = { start: new FormControl(), end: new FormControl() };
        this.applyBtn = { disabled: false };
        this.startDate = moment().startOf('day');
        this.endDate = moment().endOf('day');
        this.minDate = null;
        this.maxDate = null;
        this.dateLimit = null;
        this.autoApply = false;
        this.singleDatePicker = false;
        this.showDropdowns = false;
        this.showWeekNumbers = false;
        this.showISOWeekNumbers = false;
        this.linkedCalendars = false;
        this.autoUpdateInput = true;
        this.alwaysShowCalendars = false;
        this.maxSpan = false;
        this.timePicker = false;
        this.showClearButton = false;
        this.firstMonthDayClass = null;
        this.lastMonthDayClass = null;
        this.emptyWeekRowClass = null;
        this.firstDayOfNextMonthClass = null;
        this.lastDayOfPreviousMonthClass = null;
        this.keepCalendarVisibleAfterApplying = false;
        this.locale = {
            direction: 'ltr',
            format: moment.localeData().longDateFormat('L'),
            separator: ' - ',
            weekLabel: 'W',
            applyLabel: 'Apply',
            cancelLabel: 'Cancel',
            customRangeLabel: 'Custom range',
            daysOfWeek: moment.weekdaysMin(),
            monthNames: moment.monthsShort(),
            firstDay: moment.localeData().firstDayOfWeek()
        };
        // some state information
        this.isShown = false;
        this.leftCalendar = {};
        this.rightCalendar = {};
        // custom ranges
        this.ranges = {};
        this.rangesArray = [];
        // states
        this.showCalInRanges = false;
        this.options = {};
        this.choosedDate = new EventEmitter();
        this.rangeClicked = new EventEmitter();
        this.datesUpdated = new EventEmitter();
        this.updateMonthsInView();
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        if (this.locale.firstDay != 0) {
            var /** @type {?} */ iterator = this.locale.firstDay;
            while (iterator > 0) {
                this.locale.daysOfWeek.push(this.locale.daysOfWeek.shift());
                iterator--;
            }
        }
        this.renderCalendar(SideEnum.left);
        this.renderCalendar(SideEnum.right);
        this.renderRanges();
    }
    /**
     * @return {?}
     */
    renderRanges() {
        let /** @type {?} */ start, /** @type {?} */ end;
        if (typeof this.ranges === 'object') {
            for (const /** @type {?} */ range in this.ranges) {
                if (typeof this.ranges[range][0] === 'string') {
                    start = moment(this.ranges[range][0], this.locale.format);
                }
                else {
                    start = moment(this.ranges[range][0]);
                }
                if (typeof this.ranges[range][1] === 'string') {
                    end = moment(this.ranges[range][1], this.locale.format);
                }
                else {
                    end = moment(this.ranges[range][1]);
                }
                // If the start or end date exceed those allowed by the minDate or maxSpan
                // options, shorten the range to the allowable period.
                if (this.minDate && start.isBefore(this.minDate)) {
                    start = this.minDate.clone();
                }
                var /** @type {?} */ maxDate = this.maxDate;
                if (this.maxSpan && maxDate && start.clone().add(this.maxSpan).isAfter(maxDate)) {
                    maxDate = start.clone().add(this.maxSpan);
                }
                if (maxDate && end.isAfter(maxDate)) {
                    end = maxDate.clone();
                }
                // If the end of the range is before the minimum or the start of the range is
                // after the maximum, don't display this range option at all.
                if ((this.minDate && end.isBefore(this.minDate, this.timePicker ? 'minute' : 'day'))
                    || (maxDate && start.isAfter(maxDate, this.timePicker ? 'minute' : 'day'))) {
                    continue;
                }
                //Support unicode chars in the range names.
                var /** @type {?} */ elem = document.createElement('textarea');
                elem.innerHTML = range;
                var /** @type {?} */ rangeHtml = elem.value;
                this.ranges[rangeHtml] = [start, end];
            }
            for (const /** @type {?} */ range in this.ranges) {
                this.rangesArray.push(range);
            }
            if (this.showCustomRangeLabel) {
                this.rangesArray.push(this.locale.customRangeLabel);
            }
            this.showCalInRanges = (!this.rangesArray.length) || this.alwaysShowCalendars;
        }
    }
    /**
     * @param {?} side
     * @return {?}
     */
    renderCalendar(side) {
        // site enum
        let /** @type {?} */ mainCalendar = (side === SideEnum.left) ? this.leftCalendar : this.rightCalendar;
        const /** @type {?} */ month = mainCalendar.month.month();
        const /** @type {?} */ year = mainCalendar.month.year();
        const /** @type {?} */ hour = mainCalendar.month.hour();
        const /** @type {?} */ minute = mainCalendar.month.minute();
        const /** @type {?} */ second = mainCalendar.month.second();
        const /** @type {?} */ daysInMonth = moment([year, month]).daysInMonth();
        const /** @type {?} */ firstDay = moment([year, month, 1]);
        const /** @type {?} */ lastDay = moment([year, month, daysInMonth]);
        const /** @type {?} */ lastMonth = moment(firstDay).subtract(1, 'month').month();
        const /** @type {?} */ lastYear = moment(firstDay).subtract(1, 'month').year();
        const /** @type {?} */ daysInLastMonth = moment([lastYear, lastMonth]).daysInMonth();
        const /** @type {?} */ dayOfWeek = firstDay.day();
        // initialize a 6 rows x 7 columns array for the calendar
        let /** @type {?} */ calendar = [];
        calendar.firstDay = firstDay;
        calendar.lastDay = lastDay;
        for (let /** @type {?} */ i = 0; i < 6; i++) {
            calendar[i] = [];
        }
        // populate the calendar with date objects
        let /** @type {?} */ startDay = daysInLastMonth - dayOfWeek + this.locale.firstDay + 1;
        if (startDay > daysInLastMonth) {
            startDay -= 7;
        }
        if (dayOfWeek === this.locale.firstDay) {
            startDay = daysInLastMonth - 6;
        }
        let /** @type {?} */ curDate = moment([lastYear, lastMonth, startDay, 12, minute, second]);
        for (let /** @type {?} */ i = 0, /** @type {?} */ col = 0, /** @type {?} */ row = 0; i < 42; i++, col++, curDate = moment(curDate).add(24, 'hour')) {
            if (i > 0 && col % 7 === 0) {
                col = 0;
                row++;
            }
            calendar[row][col] = curDate.clone().hour(hour).minute(minute).second(second);
            curDate.hour(12);
            if (this.minDate && calendar[row][col].format('YYYY-MM-DD') === this.minDate.format('YYYY-MM-DD') &&
                calendar[row][col].isBefore(this.minDate) && side === 'left') {
                calendar[row][col] = this.minDate.clone();
            }
            if (this.maxDate && calendar[row][col].format('YYYY-MM-DD') === this.maxDate.format('YYYY-MM-DD') &&
                calendar[row][col].isAfter(this.maxDate) && side === 'right') {
                calendar[row][col] = this.maxDate.clone();
            }
            if (!this.singleDatePicker && this.maxDate && calendar[row][col].format('YYYY-MM-DD') === this.maxDate.format('YYYY-MM-DD') && side === 'left') {
                // use previous calendars
                this.leftCalendar.month.subtract(1, 'month');
                this.rightCalendar.month.subtract(1, 'month');
            }
        }
        // make the calendar object available to hoverDate/clickDate
        if (side === SideEnum.left) {
            this.leftCalendar.calendar = calendar;
        }
        else {
            this.rightCalendar.calendar = calendar;
        }
        //
        // Display the calendar
        //
        const /** @type {?} */ minDate = side === 'left' ? this.minDate : this.startDate;
        let /** @type {?} */ maxDate = this.maxDate;
        const /** @type {?} */ selected = side === 'left' ? this.startDate : this.endDate;
        this.calendarVariables[side] = {
            month: month,
            year: year,
            hour: hour,
            minute: minute,
            second: second,
            daysInMonth: daysInMonth,
            firstDay: firstDay,
            lastDay: lastDay,
            lastMonth: lastMonth,
            lastYear: lastYear,
            daysInLastMonth: daysInLastMonth,
            dayOfWeek: dayOfWeek,
            // other vars
            calRows: Array.from(Array(6).keys()),
            calCols: Array.from(Array(7).keys()),
            classes: {},
            minDate: minDate,
            maxDate: maxDate,
            calendar: calendar
        };
        if (this.showDropdowns) {
            const /** @type {?} */ currentMonth = calendar[1][1].month();
            const /** @type {?} */ currentYear = calendar[1][1].year();
            const /** @type {?} */ maxYear = (maxDate && maxDate.year()) || (currentYear + 5);
            const /** @type {?} */ minYear = (minDate && minDate.year()) || (currentYear - 50);
            const /** @type {?} */ inMinYear = currentYear === minYear;
            const /** @type {?} */ inMaxYear = currentYear === maxYear;
            const /** @type {?} */ years = [];
            for (var /** @type {?} */ y = minYear; y <= maxYear; y++) {
                years.push(y);
            }
            this.calendarVariables[side].dropdowns = {
                currentMonth: currentMonth,
                currentYear: currentYear,
                maxYear: maxYear,
                minYear: minYear,
                inMinYear: inMinYear,
                inMaxYear: inMaxYear,
                monthArrays: Array.from(Array(12).keys()),
                yearArrays: years
            };
        }
        // adjust maxDate to reflect the dateLimit setting in order to
        // grey out end dates beyond the dateLimit
        if (this.endDate === null && this.dateLimit) {
            const /** @type {?} */ maxLimit = this.startDate.clone().add(this.dateLimit).endOf('day');
            if (!maxDate || maxLimit.isBefore(maxDate)) {
                maxDate = maxLimit;
            }
        }
        for (let /** @type {?} */ row = 0; row < 6; row++) {
            this.calendarVariables[side].classes[row] = {};
            const /** @type {?} */ rowClasses = [];
            if (this.emptyWeekRowClass && !this.hasCurrentMonthDays(month, calendar[row])) {
                rowClasses.push(this.emptyWeekRowClass);
            }
            for (let /** @type {?} */ col = 0; col < 7; col++) {
                const /** @type {?} */ classes = [];
                // highlight today's date
                if (calendar[row][col].isSame(new Date(), 'day')) {
                    classes.push('today');
                }
                // highlight weekends
                if (calendar[row][col].isoWeekday() > 5) {
                    classes.push('weekend');
                }
                // grey out the dates in other months displayed at beginning and end of this calendar
                if (calendar[row][col].month() !== calendar[1][1].month()) {
                    classes.push('off');
                    // mark the last day of the previous month in this calendar
                    if (this.lastDayOfPreviousMonthClass && (calendar[row][col].month() < calendar[1][1].month() || calendar[1][1].month() === 0) && calendar[row][col].date() === daysInLastMonth) {
                        classes.push(this.lastDayOfPreviousMonthClass);
                    }
                    // mark the first day of the next month in this calendar
                    if (this.firstDayOfNextMonthClass && (calendar[row][col].month() > calendar[1][1].month() || calendar[row][col].month() === 0) && calendar[row][col].date() === 1) {
                        classes.push(this.firstDayOfNextMonthClass);
                    }
                }
                // mark the first day of the current month with a custom class
                if (this.firstMonthDayClass && calendar[row][col].month() === calendar[1][1].month() && calendar[row][col].date() === calendar.firstDay.date()) {
                    classes.push(this.firstMonthDayClass);
                }
                // mark the last day of the current month with a custom class
                if (this.lastMonthDayClass && calendar[row][col].month() === calendar[1][1].month() && calendar[row][col].date() === calendar.lastDay.date()) {
                    classes.push(this.lastMonthDayClass);
                }
                // don't allow selection of dates before the minimum date
                if (this.minDate && calendar[row][col].isBefore(this.minDate, 'day')) {
                    classes.push('off', 'disabled');
                }
                // don't allow selection of dates after the maximum date
                if (maxDate && calendar[row][col].isAfter(maxDate, 'day')) {
                    classes.push('off', 'disabled');
                }
                // don't allow selection of date if a custom function decides it's invalid
                if (this.isInvalidDate(calendar[row][col])) {
                    classes.push('off', 'disabled');
                }
                // highlight the currently selected start date
                if (this.startDate && calendar[row][col].format('YYYY-MM-DD') === this.startDate.format('YYYY-MM-DD')) {
                    classes.push('active', 'start-date');
                }
                // highlight the currently selected end date
                if (this.endDate != null && calendar[row][col].format('YYYY-MM-DD') === this.endDate.format('YYYY-MM-DD')) {
                    classes.push('active', 'end-date');
                }
                // highlight dates in-between the selected dates
                if (this.endDate != null && calendar[row][col] > this.startDate && calendar[row][col] < this.endDate) {
                    classes.push('in-range');
                }
                // apply custom classes for this date
                const /** @type {?} */ isCustom = this.isCustomDate(calendar[row][col]);
                if (isCustom !== false) {
                    if (typeof isCustom === 'string') {
                        classes.push(isCustom);
                    }
                    else {
                        Array.prototype.push.apply(classes, isCustom);
                    }
                }
                // store classes var
                let /** @type {?} */ cname = '', /** @type {?} */ disabled = false;
                for (let /** @type {?} */ i = 0; i < classes.length; i++) {
                    cname += classes[i] + ' ';
                    if (classes[i] === 'disabled') {
                        disabled = true;
                    }
                }
                if (!disabled) {
                    cname += 'available';
                }
                this.calendarVariables[side].classes[row][col] = cname.replace(/^\s+|\s+$/g, '');
            }
            this.calendarVariables[side].classes[row].classList = rowClasses.join(' ');
        }
    }
    /**
     * @param {?} startDate
     * @return {?}
     */
    setStartDate(startDate) {
        if (typeof startDate === 'string') {
            this.startDate = moment(startDate, this.locale.format);
        }
        if (typeof startDate === 'object') {
            this.startDate = moment(startDate);
        }
        this.startDate = this.startDate.startOf('day');
        if (this.minDate && this.startDate.isBefore(this.minDate)) {
            this.startDate = this.minDate.clone();
        }
        if (this.maxDate && this.startDate.isAfter(this.maxDate)) {
            this.startDate = this.maxDate.clone();
        }
        if (!this.isShown) {
            this.updateElement();
        }
        this.updateMonthsInView();
        this.datesUpdated.emit({ startDate: this.startDate, endDate: this.endDate });
    }
    /**
     * @param {?} endDate
     * @return {?}
     */
    setEndDate(endDate) {
        if (typeof endDate === 'string') {
            this.endDate = moment(endDate, this.locale.format);
        }
        if (typeof endDate === 'object') {
            this.endDate = moment(endDate);
        }
        this.endDate = this.endDate.add(1, 'd').startOf('day').subtract(1, 'second');
        if (this.endDate.isBefore(this.startDate)) {
            this.endDate = this.startDate.clone();
        }
        if (this.maxDate && this.endDate.isAfter(this.maxDate)) {
            this.endDate = this.maxDate.clone();
        }
        if (this.dateLimit && this.startDate.clone().add(this.dateLimit).isBefore(this.endDate)) {
            this.endDate = this.startDate.clone().add(this.dateLimit);
        }
        if (!this.isShown) {
            // this.updateElement();
        }
        this.updateMonthsInView();
        this.datesUpdated.emit({ startDate: this.startDate, endDate: this.endDate });
    }
    /**
     * @param {?} date
     * @return {?}
     */
    isInvalidDate(date) {
        return false;
    }
    /**
     * @param {?} date
     * @return {?}
     */
    isCustomDate(date) {
        return false;
    }
    /**
     * @return {?}
     */
    updateView() {
        this.updateMonthsInView();
        this.updateCalendars();
    }
    /**
     * @return {?}
     */
    updateMonthsInView() {
        if (this.endDate) {
            // if both dates are visible already, do nothing
            if (!this.singleDatePicker && this.leftCalendar.month && this.rightCalendar.month &&
                ((this.startDate && this.leftCalendar && this.startDate.format('YYYY-MM') === this.leftCalendar.month.format('YYYY-MM')) ||
                    (this.startDate && this.rightCalendar && this.startDate.format('YYYY-MM') === this.rightCalendar.month.format('YYYY-MM')))
                &&
                    (this.endDate.format('YYYY-MM') === this.leftCalendar.month.format('YYYY-MM') ||
                        this.endDate.format('YYYY-MM') === this.rightCalendar.month.format('YYYY-MM'))) {
                return;
            }
            if (this.startDate) {
                this.leftCalendar.month = this.startDate.clone().date(2);
                if (!this.linkedCalendars && (this.endDate.month() !== this.startDate.month() ||
                    this.endDate.year() !== this.startDate.year())) {
                    this.rightCalendar.month = this.endDate.clone().date(2);
                }
                else {
                    this.rightCalendar.month = this.startDate.clone().date(2).add(1, 'month');
                }
            }
        }
        else {
            if (this.leftCalendar.month.format('YYYY-MM') !== this.startDate.format('YYYY-MM') &&
                this.rightCalendar.month.format('YYYY-MM') !== this.startDate.format('YYYY-MM')) {
                this.leftCalendar.month = this.startDate.clone().date(2);
                this.rightCalendar.month = this.startDate.clone().date(2).add(1, 'month');
            }
        }
        if (this.maxDate && this.linkedCalendars && !this.singleDatePicker && this.rightCalendar.month > this.maxDate) {
            this.rightCalendar.month = this.maxDate.clone().date(2);
            this.leftCalendar.month = this.maxDate.clone().date(2).subtract(1, 'month');
        }
    }
    /**
     *  This is responsible for updating the calendars
     * @return {?}
     */
    updateCalendars() {
        this.renderCalendar(SideEnum.left);
        this.renderCalendar(SideEnum.right);
        if (this.endDate === null) {
            return;
        }
        this.calculateChosenLabel();
    }
    /**
     * @return {?}
     */
    updateElement() {
        if (!this.singleDatePicker && this.autoUpdateInput) {
            if (this.startDate && this.endDate) {
                this.chosenLabel = this.startDate.format(this.locale.format) +
                    this.locale.separator + this.endDate.format(this.locale.format);
            }
        }
        else if (this.autoUpdateInput) {
            this.chosenLabel = this.startDate.format(this.locale.format);
        }
    }
    /**
     * @return {?}
     */
    remove() {
        this.isShown = false;
    }
    /**
     * this should calculate the label
     * @return {?}
     */
    calculateChosenLabel() {
        let /** @type {?} */ customRange = true;
        let /** @type {?} */ i = 0;
        if (this.rangesArray.length > 0) {
            for (const /** @type {?} */ range in this.ranges) {
                if (this.startDate.format('YYYY-MM-DD') == this.ranges[range][0].format('YYYY-MM-DD') && this.endDate.format('YYYY-MM-DD') == this.ranges[range][1].format('YYYY-MM-DD')) {
                    customRange = false;
                    this.chosenRange = this.rangesArray[i];
                    break;
                }
                i++;
            }
            if (customRange) {
                if (this.showCustomRangeLabel) {
                    this.chosenRange = this.locale.customRangeLabel;
                }
                else {
                    this.chosenRange = null;
                }
                // if custom label: show calenar
                this.showCalInRanges = true;
            }
        }
        this.updateElement();
    }
    /**
     * @param {?=} e
     * @return {?}
     */
    clickApply(e) {
        if (this.chosenLabel) {
            this.choosedDate.emit({ chosenLabel: this.chosenLabel, startDate: this.startDate, endDate: this.endDate });
        }
        this.datesUpdated.emit({ startDate: this.startDate, endDate: this.endDate });
        if (!this.keepCalendarVisibleAfterApplying) {
            this.hide();
        }
    }
    /**
     * @param {?} e
     * @return {?}
     */
    clickCancel(e) {
        this.startDate = this._old.start;
        this.endDate = this._old.end;
        this.datesUpdated.emit({ startDate: this.startDate, endDate: this.endDate });
        this.hide();
    }
    /**
     * called when month is changed
     * @param {?} monthEvent get value in event.target.value
     * @param {?} side left or right
     * @return {?}
     */
    monthChanged(monthEvent, side) {
        const /** @type {?} */ year = this.calendarVariables[side].dropdowns.currentYear;
        const /** @type {?} */ month = parseInt(monthEvent.target.value, 10);
        this.monthOrYearChanged(month, year, side);
    }
    /**
     * called when year is changed
     * @param {?} yearEvent get value in event.target.value
     * @param {?} side left or right
     * @return {?}
     */
    yearChanged(yearEvent, side) {
        const /** @type {?} */ month = this.calendarVariables[side].dropdowns.currentMonth;
        const /** @type {?} */ year = parseInt(yearEvent.target.value, 10);
        this.monthOrYearChanged(month, year, side);
    }
    /**
     *  call when month or year changed
     * @param {?} month month number 0 -11
     * @param {?} year year eg: 1995
     * @param {?} side left or right
     * @return {?}
     */
    monthOrYearChanged(month, year, side) {
        const /** @type {?} */ isLeft = side === SideEnum.left;
        if (!isLeft) {
            if (year < this.startDate.year() || (year === this.startDate.year() && month < this.startDate.month())) {
                month = this.startDate.month();
                year = this.startDate.year();
            }
        }
        if (this.minDate) {
            if (year < this.minDate.year() || (year === this.minDate.year() && month < this.minDate.month())) {
                month = this.minDate.month();
                year = this.minDate.year();
            }
        }
        if (this.maxDate) {
            if (year > this.maxDate.year() || (year === this.maxDate.year() && month > this.maxDate.month())) {
                month = this.maxDate.month();
                year = this.maxDate.year();
            }
        }
        if (isLeft) {
            this.leftCalendar.month.month(month).year(year);
            if (this.linkedCalendars) {
                this.rightCalendar.month = this.leftCalendar.month.clone().add(1, 'month');
            }
        }
        else {
            this.rightCalendar.month.month(month).year(year);
            if (this.linkedCalendars) {
                this.leftCalendar.month = this.rightCalendar.month.clone().subtract(1, 'month');
            }
        }
        this.updateCalendars();
    }
    /**
     * Click on previous month
     * @param {?} side left or right calendar
     * @return {?}
     */
    clickPrev(side) {
        if (side === SideEnum.left) {
            this.leftCalendar.month.subtract(1, 'month');
            if (this.linkedCalendars) {
                this.rightCalendar.month.subtract(1, 'month');
            }
        }
        else {
            this.rightCalendar.month.subtract(1, 'month');
        }
        this.updateCalendars();
    }
    /**
     * Click on next month
     * @param {?} side left or right calendar
     * @return {?}
     */
    clickNext(side) {
        if (side === SideEnum.left) {
            this.leftCalendar.month.add(1, 'month');
        }
        else {
            this.rightCalendar.month.add(1, 'month');
            if (this.linkedCalendars) {
                this.leftCalendar.month.add(1, 'month');
            }
        }
        this.updateCalendars();
    }
    /**
     * When selecting a date
     * @param {?} e event: get value by e.target.value
     * @param {?} side left or right
     * @param {?} row row position of the current date clicked
     * @param {?} col col position of the current date clicked
     * @return {?}
     */
    clickDate(e, side, row, col) {
        if (!e.target.classList.contains('available')) {
            return;
        }
        if (this.rangesArray.length) {
            this.chosenRange = this.locale.customRangeLabel;
        }
        let /** @type {?} */ date = side === SideEnum.left ? this.leftCalendar.calendar[row][col] : this.rightCalendar.calendar[row][col];
        if (this.endDate || date.isBefore(this.startDate, 'day')) {
            // picking start
            this.endDate = null;
            this.setStartDate(date.clone());
        }
        else if (!this.endDate && date.isBefore(this.startDate)) {
            // special case: clicking the same date for start/end,
            // but the time of the end date is before the start date
            this.setEndDate(this.startDate.clone());
        }
        else {
            // picking end
            this.setEndDate(date.clone());
            if (this.autoApply) {
                this.calculateChosenLabel();
                this.clickApply();
            }
        }
        if (this.singleDatePicker) {
            this.setEndDate(this.startDate);
            this.updateElement();
            if (this.autoApply) {
                this.clickApply();
            }
        }
        this.updateView();
        // This is to cancel the blur event handler if the mouse was in one of the inputs
        e.stopPropagation();
    }
    /**
     *  Click on the custom range
     * @param {?} e
     * @param {?} label
     * @return {?}
     */
    clickRange(e, label) {
        this.chosenRange = label;
        if (label == this.locale.customRangeLabel) {
            this.isShown = true; // show calendars
            this.showCalInRanges = true;
        }
        else {
            var /** @type {?} */ dates = this.ranges[label];
            this.startDate = dates[0].clone();
            this.endDate = dates[1].clone();
            this.calculateChosenLabel();
            this.showCalInRanges = (!this.rangesArray.length) || this.alwaysShowCalendars;
            if (!this.timePicker) {
                this.startDate.startOf('day');
                this.endDate.endOf('day');
            }
            if (!this.alwaysShowCalendars && !this.keepCalendarVisibleAfterApplying) {
                this.isShown = false; // hide calendars
            }
            this.rangeClicked.emit({ label: label, dates: dates });
            this.datesUpdated.emit({ startDate: this.startDate, endDate: this.endDate });
            this.clickApply();
        }
    }
    ;
    /**
     * @param {?=} e
     * @return {?}
     */
    show(e) {
        if (this.isShown) {
            return;
        }
        this._old.start = this.startDate.clone();
        this._old.end = this.endDate.clone();
        this.isShown = true;
        this.updateView();
    }
    /**
     * @param {?=} e
     * @return {?}
     */
    hide(e) {
        if (!this.isShown) {
            return;
        }
        // incomplete date selection, revert to last values
        if (!this.endDate) {
            if (this._old.start) {
                this.startDate = this._old.start.clone();
            }
            if (this._old.end) {
                this.endDate = this._old.end.clone();
            }
        }
        // if a new date range was selected, invoke the user callback function
        if (!this.startDate.isSame(this._old.start) || !this.endDate.isSame(this._old.end)) {
            // this.callback(this.startDate, this.endDate, this.chosenLabel);
        }
        // if picker is attached to a text input, update it
        this.updateElement();
        setTimeout(() => { this.isShown = false; }, 0);
    }
    /**
     * handle click on all element in the component, usefull for outside of click
     * @param {?} e event
     * @return {?}
     */
    handleInternalClick(e) {
        e.stopPropagation();
    }
    /**
     * update the locale options
     * @param {?} locale
     * @return {?}
     */
    updateLocale(locale) {
        for (const /** @type {?} */ key in locale) {
            if (this.locale.hasOwnProperty(key) && this.locale.hasOwnProperty(key)) {
                this.locale[key] = locale[key];
            }
        }
    }
    /**
     *  clear the daterange picker
     * @return {?}
     */
    clear() {
        this.startDate = moment().startOf('day');
        this.endDate = moment().endOf('day');
        this.choosedDate.emit({ chosenLabel: '', startDate: null, endDate: null });
        this.datesUpdated.emit({ startDate: null, endDate: null });
        this.hide();
    }
    /**
     * Find out if the selected range should be disabled if it doesn't
     * fit into minDate and maxDate limitations.
     * @param {?} range
     * @return {?}
     */
    disableRange(range) {
        if (range === this.locale.customRangeLabel) {
            return false;
        }
        const /** @type {?} */ rangeMarkers = this.ranges[range];
        const /** @type {?} */ areBothBefore = rangeMarkers.every(date => {
            return date.isBefore(this.minDate);
        });
        const /** @type {?} */ areBothAfter = rangeMarkers.every(date => {
            return date.isAfter(this.maxDate);
        });
        return (areBothBefore || areBothAfter);
    }
    /**
     * Find out if the current calendar row has current month days
     * (as opposed to consisting of only previous/next month days)
     * @param {?} currentMonth
     * @param {?} row
     * @return {?}
     */
    hasCurrentMonthDays(currentMonth, row) {
        for (let /** @type {?} */ day = 0; day < 7; day++) {
            if (row[day].month() === currentMonth) {
                return true;
            }
        }
        return false;
    }
}
DaterangepickerComponent.decorators = [
    { type: Component, args: [{
                selector: 'ngx-daterangepicker-md',
                styles: [`.md-drppicker{position:absolute;font-family:Roboto,sans-serif;color:inherit;border-radius:4px;width:278px;padding:4px;margin-top:-10px;overflow:hidden;z-index:1000;font-size:14px;background-color:#fff;-webkit-box-shadow:0 2px 4px 0 rgba(0,0,0,.16),0 2px 8px 0 rgba(0,0,0,.12);box-shadow:0 2px 4px 0 rgba(0,0,0,.16),0 2px 8px 0 rgba(0,0,0,.12)}.md-drppicker.double{width:auto}.md-drppicker:after,.md-drppicker:before{position:absolute;display:inline-block;border-bottom-color:rgba(0,0,0,.2);content:''}.md-drppicker.openscenter:after,.md-drppicker.openscenter:before{left:0;right:0;width:0;margin-left:auto;margin-right:auto}.md-drppicker.single .calendar,.md-drppicker.single .ranges{float:none}.md-drppicker.shown{-webkit-transform:scale(1);transform:scale(1);-webkit-transition:all .1s ease-in-out;transition:all .1s ease-in-out;-webkit-transform-origin:0 0;transform-origin:0 0;-webkit-touch-callout:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.md-drppicker.shown .calendar{display:block}.md-drppicker.hidden{-webkit-transition:all .1s ease;transition:all .1s ease;-webkit-transform:scale(0);transform:scale(0);-webkit-transform-origin:0 0;transform-origin:0 0;cursor:default;-webkit-touch-callout:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.md-drppicker.hidden .calendar{display:none}.md-drppicker .calendar{max-width:270px;margin:4px}.md-drppicker .calendar.single .calendar-table{border:none}.md-drppicker .calendar td,.md-drppicker .calendar th{padding:0;white-space:nowrap;text-align:center;min-width:32px}.md-drppicker .calendar td span,.md-drppicker .calendar th span{pointer-events:none}.md-drppicker .calendar-table{border:1px solid #fff;padding:4px;border-radius:4px;background-color:#fff}.md-drppicker table{width:100%;margin:0}.md-drppicker th{color:#988c8c}.md-drppicker td,.md-drppicker th{text-align:center;border-radius:4px;border:1px solid transparent;white-space:nowrap;cursor:pointer;height:2em;width:2em}.md-drppicker td.available.prev,.md-drppicker th.available.prev{display:block;background-image:url(data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgMy43IDYiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDMuNyA2IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxnPg0KCTxwYXRoIGQ9Ik0zLjcsMC43TDEuNCwzbDIuMywyLjNMMyw2TDAsM2wzLTNMMy43LDAuN3oiLz4NCjwvZz4NCjwvc3ZnPg0K);background-repeat:no-repeat;background-size:.5em;background-position:center;opacity:.8;-webkit-transition:background-color .2s ease;transition:background-color .2s ease;border-radius:2em}.md-drppicker td.available.prev:hover,.md-drppicker th.available.prev:hover{margin:0}.md-drppicker td.available.next,.md-drppicker th.available.next{-webkit-transform:rotate(180deg);transform:rotate(180deg);display:block;background-image:url(data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgMy43IDYiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDMuNyA2IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxnPg0KCTxwYXRoIGQ9Ik0zLjcsMC43TDEuNCwzbDIuMywyLjNMMyw2TDAsM2wzLTNMMy43LDAuN3oiLz4NCjwvZz4NCjwvc3ZnPg0K);background-repeat:no-repeat;background-size:.5em;background-position:center;opacity:.8;-webkit-transition:background-color .2s ease;transition:background-color .2s ease;border-radius:2em}.md-drppicker td.available.next:hover,.md-drppicker th.available.next:hover{margin:0;-webkit-transform:rotate(180deg);transform:rotate(180deg)}.md-drppicker td.available:hover,.md-drppicker th.available:hover{background-color:#eee;border-color:transparent;color:inherit;background-repeat:no-repeat;background-size:.5em;background-position:center;margin:.25em 0;opacity:.8;border-radius:2em;-webkit-transform:scale(1);transform:scale(1);-webkit-transition:all 450ms cubic-bezier(.23,1,.32,1) 0s;transition:all 450ms cubic-bezier(.23,1,.32,1) 0s}.md-drppicker td.week,.md-drppicker th.week{font-size:80%;color:#ccc}.md-drppicker td{margin:.25em 0;opacity:.8;-webkit-transition:background-color .2s ease;transition:background-color .2s ease;border-radius:2em;-webkit-transform:scale(1);transform:scale(1);-webkit-transition:all 450ms cubic-bezier(.23,1,.32,1) 0s;transition:all 450ms cubic-bezier(.23,1,.32,1) 0s}.md-drppicker td.off,.md-drppicker td.off.end-date,.md-drppicker td.off.in-range,.md-drppicker td.off.start-date{background-color:#fff;border-color:transparent;color:#999}.md-drppicker td.in-range{background-color:#dde2e4;border-color:transparent;color:#000;border-radius:0}.md-drppicker td.start-date{border-radius:2em 0 0 2em}.md-drppicker td.end-date{border-radius:0 2em 2em 0}.md-drppicker td.start-date.end-date{border-radius:4px}.md-drppicker td.active{-webkit-transition:background .3s ease-out;transition:background .3s ease-out;background:rgba(0,0,0,.1)}.md-drppicker td.active,.md-drppicker td.active:hover{background-color:#3f51b5;border-color:transparent;color:#fff}.md-drppicker th.month{width:auto}.md-drppicker option.disabled,.md-drppicker td.disabled{color:#999;cursor:not-allowed;text-decoration:line-through}.md-drppicker select{display:inline-block;background-color:rgba(255,255,255,.9);width:100%;padding:5px;border:1px solid #f2f2f2;border-radius:2px;height:3rem}.md-drppicker select.monthselect,.md-drppicker select.yearselect{font-size:12px;padding:1px;height:auto;margin:0;cursor:default}.md-drppicker select.monthselect{margin-right:2%;width:56%}.md-drppicker select.yearselect{width:40%}.md-drppicker .label-input{border:1px solid #ccc;border-radius:4px;color:#555;height:30px;line-height:30px;display:block;vertical-align:middle;margin:0 auto 5px;padding:0 0 0 28px;width:100%}.md-drppicker .label-input.active{border:1px solid #08c;border-radius:4px}.md-drppicker .md-drppicker_input{position:relative;padding:0 30px 0 0}.md-drppicker .md-drppicker_input i,.md-drppicker .md-drppicker_input svg{position:absolute;left:8px;top:8px}.md-drppicker.rtl .label-input{padding-right:28px;padding-left:6px}.md-drppicker.rtl .md-drppicker_input i,.md-drppicker.rtl .md-drppicker_input svg{left:auto;right:8px}.md-drppicker .show-ranges .drp-calendar.left{border-left:1px solid #ddd}.md-drppicker .ranges{float:none;text-align:left;margin:0}.md-drppicker .ranges ul{list-style:none;margin:0 auto;padding:0;width:100%}.md-drppicker .ranges ul li{font-size:12px}.md-drppicker .ranges ul li button{padding:8px 12px;width:100%;background:0 0;border:none;text-align:left;cursor:pointer}.md-drppicker .ranges ul li button.active{background-color:#3f51b5;color:#fff}.md-drppicker .ranges ul li button[disabled]{opacity:.3}.md-drppicker .ranges ul li button:active{background:0 0}.md-drppicker .ranges ul li:hover{background-color:#eee}.md-drppicker .show-calendar .ranges{margin-top:8px}@media (min-width:564px){.md-drppicker{width:auto}.md-drppicker.single .calendar.left{clear:none}.md-drppicker.ltr{direction:ltr;text-align:left}.md-drppicker.ltr .calendar.left{clear:left}.md-drppicker.ltr .calendar.left .calendar-table{border-right:none;border-top-right-radius:0;border-bottom-right-radius:0;padding-right:12px}.md-drppicker.ltr .calendar.right{margin-left:0}.md-drppicker.ltr .calendar.right .calendar-table{border-left:none;border-top-left-radius:0;border-bottom-left-radius:0}.md-drppicker.ltr .left .md-drppicker_input,.md-drppicker.ltr .right .md-drppicker_input{padding-right:35px}.md-drppicker.ltr .calendar,.md-drppicker.ltr .ranges{float:left}.md-drppicker.rtl{direction:rtl;text-align:right}.md-drppicker.rtl .calendar.left{clear:right;margin-left:0}.md-drppicker.rtl .calendar.left .calendar-table{border-left:none;border-top-left-radius:0;border-bottom-left-radius:0}.md-drppicker.rtl .calendar.right{margin-right:0}.md-drppicker.rtl .calendar.right .calendar-table{border-right:none;border-top-right-radius:0;border-bottom-right-radius:0}.md-drppicker.rtl .calendar.left .calendar-table,.md-drppicker.rtl .left .md-drppicker_input{padding-left:12px}.md-drppicker.rtl .calendar,.md-drppicker.rtl .ranges{text-align:right;float:right}.drp-animate{-webkit-transform:translate(0);transform:translate(0);-webkit-transition:opacity .2s ease,-webkit-transform .2s ease;transition:opacity .2s ease,-webkit-transform .2s ease;transition:transform .2s ease,opacity .2s ease;transition:transform .2s ease,opacity .2s ease,-webkit-transform .2s ease}.drp-animate.drp-picker-site-this{-webkit-transition-timing-function:linear;transition-timing-function:linear}.drp-animate.drp-animate-right{-webkit-transform:translateX(10%);transform:translateX(10%);opacity:0}.drp-animate.drp-animate-left{-webkit-transform:translateX(-10%);transform:translateX(-10%);opacity:0}}@media (min-width:730px){.md-drppicker .ranges{width:auto}.md-drppicker.ltr .ranges{float:left}.md-drppicker.rtl .ranges{float:right}.md-drppicker .calendar.left{clear:none!important}}[hidden]{display:none}.buttons{text-align:right;margin:0 5px 5px 0}.btn{position:relative;overflow:hidden;border-width:0;outline:0;padding:0 6px;cursor:pointer;border-radius:2px;-webkit-box-shadow:0 1px 4px rgba(0,0,0,.6);box-shadow:0 1px 4px rgba(0,0,0,.6);background-color:#3f51b5;color:#ecf0f1;-webkit-transition:background-color .4s;transition:background-color .4s;height:auto;text-transform:uppercase;line-height:36px;border:none}.btn:focus,.btn:hover{background-color:#3f51b5}.btn>*{position:relative}.btn span{display:block;padding:12px 24px}.btn:before{content:"";position:absolute;top:50%;left:50%;display:block;width:0;padding-top:0;border-radius:100%;background-color:rgba(236,240,241,.3);-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%)}.btn:active:before{width:120%;padding-top:120%;-webkit-transition:width .2s ease-out,padding-top .2s ease-out;transition:width .2s ease-out,padding-top .2s ease-out}.btn:disabled{opacity:.5}.btn.btn-default{color:#000;background-color:#dcdcdc}.clear{-webkit-box-shadow:none;box-shadow:none;background-color:#fff!important}.clear svg{color:#eb3232;fill:currentColor}`],
                template: `<div class="md-drppicker" #pickerContainer
[ngClass]="{
    ltr: locale.direction === 'ltr',
    rtl: this.locale.direction === 'rtl',
    'shown': isShown,
    'hidden': !isShown,
    'double': !singleDatePicker && showCalInRanges,
    'show-ranges': rangesArray.length
}">
    <div class="ranges">
        <ul>
          <li *ngFor="let range of rangesArray">
            <button type="button"
                    (click)="clickRange($event, range)"
                    [disabled]="disableRange(range)"
                    [ngClass]="{'active': range === chosenRange}">{{range}}</button>
          </li>
        </ul>
    </div>  
    <div class="calendar" [ngClass]="{right: singleDatePicker, left: !singleDatePicker}"
        *ngIf="showCalInRanges">
        <div class="calendar-table">
            <table class="table-condensed" *ngIf="calendarVariables">
                <thead>
                    <tr>
                        <th *ngIf="showWeekNumbers || showISOWeekNumbers"></th>
                        <ng-container *ngIf="!calendarVariables.left.minDate || calendarVariables.left.minDate.isBefore(calendarVariables.left.calendar.firstDay) && (!this.linkedCalendars || true)">
                            <th (click)="clickPrev('left')" class="prev available" >
                            </th>
                        </ng-container>
                        <ng-container *ngIf="!(!calendarVariables.left.minDate || calendarVariables.left.minDate.isBefore(calendarVariables.left.calendar.firstDay) && (!this.linkedCalendars || true))">
                            <th></th>
                        </ng-container>
                        <th colspan="5" class="month drp-animate">
                            <ng-container *ngIf="showDropdowns && calendarVariables.left.dropdowns">
                                    <select class="monthselect" (change)="monthChanged($event, 'left')">
                                            <option [disabled]="(inMinYear && m < minDate.month()) || (inMaxYear && m > maxDate.month())"
                                            *ngFor="let m of calendarVariables.left.dropdowns.monthArrays" [value]="m" [selected]="calendarVariables.left.dropdowns.currentMonth === m">
                                                {{locale.monthNames[m]}}
                                            </option>
                                    </select>
                                    <select class="yearselect"  (change)="yearChanged($event, 'left')">
                                        <option *ngFor="let y of calendarVariables.left.dropdowns.yearArrays" [selected]="y === calendarVariables.left.dropdowns.currentYear">
                                            {{y}}
                                        </option>
                                    </select>
                            </ng-container>
                            <ng-container *ngIf="!showDropdowns || !calendarVariables.left.dropdowns">
                                    {{this.locale.monthNames[calendarVariables?.left?.calendar[1][1].month()]}}  {{ calendarVariables?.left?.calendar[1][1].format(" YYYY")}}
                            </ng-container>
                        </th>
                        <ng-container *ngIf="(!calendarVariables.left.maxDate || calendarVariables.left.maxDate.isAfter(calendarVariables.left.calendar.lastDay)) && (!linkedCalendars || singleDatePicker )">
                            <th class="next available" (click)="clickNext('left')">
                            </th>
                        </ng-container>
                        <ng-container *ngIf="!((!calendarVariables.left.maxDate || calendarVariables.left.maxDate.isAfter(calendarVariables.left.calendar.lastDay)) && (!linkedCalendars || singleDatePicker ))">
                            <th></th>
                        </ng-container>
                    </tr>
                    <tr>
                        <th *ngIf="showWeekNumbers || showISOWeekNumbers" class="week"><span>{{this.locale.weekLabel}}</span></th>
                        <th *ngFor="let dayofweek of locale.daysOfWeek"><span>{{dayofweek}}</span></th>
                    </tr>
                </thead>
                <tbody class="drp-animate">
                    <tr *ngFor="let row of calendarVariables.left.calRows" [class]="calendarVariables.left.classes[row].classList">
                        <!-- add week number -->
                        <td  class="week" *ngIf="showWeekNumbers">
                            <span>{{calendarVariables.left.calendar[row][0].week()}}</span>
                        </td>
                        <td class="week" *ngIf="showISOWeekNumbers">
                            <span>{{calendarVariables.left.calendar[row][0].isoWeek()}}</span>
                        </td>
                        <!-- cal -->
                        <td *ngFor="let col of calendarVariables.left.calCols" [class]="calendarVariables.left.classes[row][col]" (click)="clickDate($event, 'left', row, col)">
                            <span>{{calendarVariables.left.calendar[row][col].date()}}</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <div class="calendar right"
        *ngIf="showCalInRanges && !singleDatePicker"
        >
        <div class="calendar-table">
            <table class="table-condensed" *ngIf="calendarVariables">
                <thead>
                    <tr>
                        <th *ngIf="showWeekNumbers || showISOWeekNumbers"></th>
                        <ng-container *ngIf="(!calendarVariables.right.minDate || calendarVariables.right.minDate.isBefore(calendarVariables.right.calendar.firstDay)) && (!this.linkedCalendars)">
                            <th (click)="clickPrev('right')" class="prev available" >
                            </th>
                        </ng-container>
                        <ng-container *ngIf="!((!calendarVariables.right.minDate || calendarVariables.right.minDate.isBefore(calendarVariables.right.calendar.firstDay)) && (!this.linkedCalendars))">
                            <th></th>
                        </ng-container>
                        <th colspan="5" class="month">
                            <ng-container *ngIf="showDropdowns && calendarVariables.right.dropdowns">
                                    <select class="monthselect" (change)="monthChanged($event, 'right')">
                                            <option [disabled]="(inMinYear && m < minDate.month()) || (inMaxYear && m > maxDate.month())"
                                            *ngFor="let m of calendarVariables.right.dropdowns.monthArrays" [value]="m" [selected]="calendarVariables.right.dropdowns.currentMonth === m">
                                                {{locale.monthNames[m]}}
                                            </option>
                                    </select>
                                    <select class="yearselect" (change)="yearChanged($event, 'right')">
                                        <option *ngFor="let y of calendarVariables.right.dropdowns.yearArrays" [selected]="y === calendarVariables.right.dropdowns.currentYear">
                                            {{y}}
                                        </option>
                                    </select>
                            </ng-container>
                            <ng-container *ngIf="!showDropdowns || !calendarVariables.right.dropdowns">
                                    {{this.locale.monthNames[calendarVariables?.right?.calendar[1][1].month()]}}  {{ calendarVariables?.right?.calendar[1][1].format(" YYYY")}}
                            </ng-container>
                        </th>
                            <ng-container *ngIf="!calendarVariables.right.maxDate || calendarVariables.right.maxDate.isAfter(calendarVariables.right.calendar.lastDay) && (!linkedCalendars || singleDatePicker || true)">
                                <th class="next available" (click)="clickNext('right')">
                                </th>
                            </ng-container>
                            <ng-container *ngIf="!(!calendarVariables.right.maxDate || calendarVariables.right.maxDate.isAfter(calendarVariables.right.calendar.lastDay) && (!linkedCalendars || singleDatePicker || true))">
                                <th></th>
                            </ng-container>
                    </tr>

                    <tr>
                        <th *ngIf="showWeekNumbers || showISOWeekNumbers" class="week"><span>{{this.locale.weekLabel}}</span></th>
                        <th *ngFor="let dayofweek of locale.daysOfWeek"><span>{{dayofweek}}</span></th>
                    </tr>
                </thead>
                <tbody>
                    <tr *ngFor="let row of calendarVariables.right.calRows" [class]="calendarVariables.right.classes[row].classList">
                        <td class="week" *ngIf="showWeekNumbers">
                            <span>{{calendarVariables.right.calendar[row][0].week()}}</span>
                        </td>
                        <td class="week" *ngIf="showISOWeekNumbers">
                            <span>{{calendarVariables.right.calendar[row][0].isoWeek()}}</span>
                        </td>
                        <td *ngFor="let col of calendarVariables.right.calCols" [class]="calendarVariables.right.classes[row][col]" (click)="clickDate($event, 'right', row, col)">
                            <span>{{calendarVariables.right.calendar[row][col].date()}}</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <div class="buttons" *ngIf="!autoApply && ( !rangesArray.length || (showCalInRanges && !singleDatePicker))">
        <div class="buttons_input">
            <button  *ngIf="showClearButton" class="btn btn-default clear" type="button" (click)="clear()" title="clear the date">
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 -5 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
            </button>
            <button class="btn btn-default" type="button" (click)="clickCancel($event)">{{locale.cancelLabel}}</button>
            <button class="btn"  [disabled]="applyBtn.disabled" type="button" (click)="clickApply($event)">{{locale.applyLabel}}</button>
        </div>
    </div>
</div>
`,
                host: {
                    '(click)': 'handleInternalClick($event)',
                },
            },] },
];
/** @nocollapse */
DaterangepickerComponent.ctorParameters = () => [
    { type: ElementRef, },
];
DaterangepickerComponent.propDecorators = {
    "choosedDate": [{ type: Output, args: ['choosedDate',] },],
    "rangeClicked": [{ type: Output, args: ['rangeClicked',] },],
    "datesUpdated": [{ type: Output, args: ['datesUpdated',] },],
    "pickerContainer": [{ type: ViewChild, args: ['pickerContainer',] },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class DaterangepickerDirective {
    /**
     * @param {?} viewContainerRef
     * @param {?} _changeDetectorRef
     * @param {?} _componentFactoryResolver
     * @param {?} _el
     * @param {?} _renderer
     * @param {?} differs
     */
    constructor(viewContainerRef, _changeDetectorRef, _componentFactoryResolver, _el, _renderer, differs) {
        this.viewContainerRef = viewContainerRef;
        this._changeDetectorRef = _changeDetectorRef;
        this._componentFactoryResolver = _componentFactoryResolver;
        this._el = _el;
        this._renderer = _renderer;
        this.differs = differs;
        this._onChange = Function.prototype;
        this._onTouched = Function.prototype;
        this._validatorChange = Function.prototype;
        this._locale = {};
        this._endKey = 'endDate';
        this._startKey = 'startDate';
        this.notForChangesProperty = [
            'locale',
            'endKey',
            'startKey'
        ];
        this.onChange = new EventEmitter();
        this.rangeClicked = new EventEmitter();
        this.datesUpdated = new EventEmitter();
        const /** @type {?} */ componentFactory = this._componentFactoryResolver.resolveComponentFactory(DaterangepickerComponent);
        viewContainerRef.clear();
        const /** @type {?} */ componentRef = viewContainerRef.createComponent(componentFactory);
        this.picker = (/** @type {?} */ (componentRef.instance));
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set locale(value) {
        if (value !== null) {
            this._locale = value;
        }
    }
    /**
     * @return {?}
     */
    get locale() {
        return this._locale;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set startKey(value) {
        if (value !== null) {
            this._startKey = value;
        }
        else {
            this._startKey = 'startDate';
        }
    }
    ;
    /**
     * @param {?} value
     * @return {?}
     */
    set endKey(value) {
        if (value !== null) {
            this._endKey = value;
        }
        else {
            this._endKey = 'endDate';
        }
    }
    ;
    /**
     * @return {?}
     */
    get value() {
        return this._value || null;
    }
    /**
     * @param {?} val
     * @return {?}
     */
    set value(val) {
        this._value = val;
        this._onChange(val);
        this._changeDetectorRef.markForCheck();
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.picker.rangeClicked.asObservable().subscribe((range) => {
            this.rangeClicked.emit(range);
        });
        this.picker.datesUpdated.asObservable().subscribe((range) => {
            this.datesUpdated.emit(range);
        });
        this.picker.choosedDate.asObservable().subscribe((change) => {
            if (change) {
                const /** @type {?} */ value = {};
                value[this._startKey] = change.startDate;
                value[this._endKey] = change.endDate;
                this.value = value;
                this.onChange.emit(value);
                if (typeof change.chosenLabel === 'string') {
                    this._el.nativeElement.value = change.chosenLabel;
                }
            }
        });
        this.picker.firstMonthDayClass = this.firstMonthDayClass;
        this.picker.lastMonthDayClass = this.lastMonthDayClass;
        this.picker.emptyWeekRowClass = this.emptyWeekRowClass;
        this.picker.firstDayOfNextMonthClass = this.firstDayOfNextMonthClass;
        this.picker.lastDayOfPreviousMonthClass = this.lastDayOfPreviousMonthClass;
        this.picker.keepCalendarVisibleAfterApplying = this.keepCalendarVisibleAfterApplying;
        this.localeDiffer = this.differs.find(this.locale).create();
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        for (let /** @type {?} */ change in changes) {
            if (changes.hasOwnProperty(change)) {
                if (this.notForChangesProperty.indexOf(change) === -1) {
                    this.picker[change] = changes[change].currentValue;
                }
            }
        }
    }
    /**
     * @return {?}
     */
    ngDoCheck() {
        if (this.localeDiffer) {
            const /** @type {?} */ changes = this.localeDiffer.diff(this.locale);
            if (changes) {
                this.picker.updateLocale(this.locale);
            }
        }
    }
    /**
     * @return {?}
     */
    onBlur() {
        this._onTouched();
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onFocus(event) {
        this.picker.show(event);
        this.setPosition();
    }
    /**
     * @return {?}
     */
    hide() {
        this.picker.hide();
    }
    /**
     * @param {?} value
     * @return {?}
     */
    writeValue(value) {
        this.value = value;
        this.setValue(value);
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnChange(fn) {
        this._onChange = fn;
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnTouched(fn) {
        this._onTouched = fn;
    }
    /**
     * @param {?} val
     * @return {?}
     */
    setValue(val) {
        if (val) {
            if (val[this._startKey]) {
                this.picker.setStartDate(val[this._startKey]);
            }
            if (val[this._endKey]) {
                this.picker.setEndDate(val[this._endKey]);
            }
            this.picker.calculateChosenLabel();
            if (this.picker.chosenLabel) {
                this._el.nativeElement.value = this.picker.chosenLabel;
            }
        }
        else {
            //
        }
    }
    /**
     * Set position of the calendar
     * @return {?}
     */
    setPosition() {
        let /** @type {?} */ style;
        let /** @type {?} */ containerTop;
        const /** @type {?} */ container = this.picker.pickerContainer.nativeElement;
        const /** @type {?} */ element = this._el.nativeElement;
        if (this.drops && this.drops == 'up') {
            containerTop = (element.offsetTop - container.clientHeight) + 'px';
        }
        else {
            containerTop = 'auto';
        }
        if (this.opens == 'left') {
            style = {
                top: containerTop,
                left: (element.offsetLeft - container.clientWidth + element.clientWidth) + 'px',
                right: 'auto'
            };
        }
        else if (this.opens == 'center') {
            style = {
                top: containerTop,
                left: (element.offsetLeft + element.clientWidth / 2
                    - container.clientWidth / 2) + 'px',
                right: 'auto'
            };
        }
        else {
            style = {
                top: containerTop,
                left: element.offsetLeft + 'px',
                right: 'auto'
            };
        }
        if (style) {
            this._renderer.setStyle(container, 'top', style.top);
            this._renderer.setStyle(container, 'left', style.left);
            this._renderer.setStyle(container, 'right', style.right);
        }
    }
    /**
     * For click outside of the calendar's container
     * @param {?} event event object
     * @param {?} targetElement target element object
     * @return {?}
     */
    outsideClick(event, targetElement) {
        if (!targetElement) {
            return;
        }
        const /** @type {?} */ clickedInside = this._el.nativeElement.contains(targetElement);
        if (!clickedInside) {
            this.hide();
        }
    }
}
DaterangepickerDirective.decorators = [
    { type: Directive, args: [{
                selector: 'input[ngxDaterangepickerMd]',
                host: {
                    '(keyup.esc)': 'hide()',
                    '(blur)': 'onBlur()',
                    '(focus)': 'onFocus()',
                    '(click)': 'onFocus()'
                },
                providers: [
                    {
                        provide: NG_VALUE_ACCESSOR,
                        useExisting: forwardRef(() => DaterangepickerDirective), multi: true
                    }
                ]
            },] },
];
/** @nocollapse */
DaterangepickerDirective.ctorParameters = () => [
    { type: ViewContainerRef, },
    { type: ChangeDetectorRef, },
    { type: ComponentFactoryResolver, },
    { type: ElementRef, },
    { type: Renderer2, },
    { type: KeyValueDiffers, },
];
DaterangepickerDirective.propDecorators = {
    "minDate": [{ type: Input },],
    "maxDate": [{ type: Input },],
    "autoApply": [{ type: Input },],
    "alwaysShowCalendars": [{ type: Input },],
    "showCustomRangeLabel": [{ type: Input },],
    "linkedCalendars": [{ type: Input },],
    "singleDatePicker": [{ type: Input },],
    "showWeekNumbers": [{ type: Input },],
    "showISOWeekNumbers": [{ type: Input },],
    "showDropdowns": [{ type: Input },],
    "isInvalidDate": [{ type: Input },],
    "isCustomDate": [{ type: Input },],
    "showClearButton": [{ type: Input },],
    "ranges": [{ type: Input },],
    "opens": [{ type: Input },],
    "drops": [{ type: Input },],
    "lastMonthDayClass": [{ type: Input },],
    "emptyWeekRowClass": [{ type: Input },],
    "firstDayOfNextMonthClass": [{ type: Input },],
    "lastDayOfPreviousMonthClass": [{ type: Input },],
    "keepCalendarVisibleAfterApplying": [{ type: Input },],
    "locale": [{ type: Input },],
    "_endKey": [{ type: Input },],
    "startKey": [{ type: Input },],
    "endKey": [{ type: Input },],
    "onChange": [{ type: Output, args: ['change',] },],
    "rangeClicked": [{ type: Output, args: ['rangeClicked',] },],
    "datesUpdated": [{ type: Output, args: ['datesUpdated',] },],
    "outsideClick": [{ type: HostListener, args: ['document:click', ['$event', '$event.target'],] },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class NgxDaterangepickerMd {
}
NgxDaterangepickerMd.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    DaterangepickerComponent,
                    DaterangepickerDirective
                ],
                imports: [
                    CommonModule,
                    FormsModule,
                    ReactiveFormsModule
                ],
                providers: [],
                exports: [
                    DaterangepickerComponent,
                    DaterangepickerDirective
                ],
                entryComponents: [
                    DaterangepickerComponent
                ]
            },] },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Generated bundle index. Do not edit.
 */

export { NgxDaterangepickerMd, DaterangepickerComponent, DaterangepickerDirective };
//# sourceMappingURL=ngx-daterangepicker-material.js.map
