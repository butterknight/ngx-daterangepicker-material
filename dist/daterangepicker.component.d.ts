import { OnInit, ElementRef, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as _moment from 'moment';
export declare enum SideEnum {
    left = "left",
    right = "right",
}
export declare class DaterangepickerComponent implements OnInit {
    private el;
    private _old;
    chosenLabel: string;
    calendarVariables: {
        left: any;
        right: any;
    };
    daterangepicker: {
        start: FormControl;
        end: FormControl;
    };
    applyBtn: {
        disabled: boolean;
    };
    startDate: _moment.Moment;
    endDate: _moment.Moment;
    minDate: _moment.Moment;
    maxDate: _moment.Moment;
    dateLimit: any;
    autoApply: Boolean;
    singleDatePicker: Boolean;
    showDropdowns: Boolean;
    showWeekNumbers: Boolean;
    showISOWeekNumbers: Boolean;
    linkedCalendars: Boolean;
    autoUpdateInput: Boolean;
    alwaysShowCalendars: Boolean;
    maxSpan: Boolean;
    timePicker: Boolean;
    showClearButton: Boolean;
    firstMonthDayClass: string;
    lastMonthDayClass: string;
    emptyWeekRowClass: string;
    firstDayOfNextMonthClass: string;
    lastDayOfPreviousMonthClass: string;
    locale: any;
    isShown: Boolean;
    leftCalendar: any;
    rightCalendar: any;
    ranges: any;
    chosenRange: string;
    showCustomRangeLabel: boolean;
    rangesArray: Array<any>;
    showCalInRanges: Boolean;
    options: any;
    choosedDate: EventEmitter<Object>;
    rangeClicked: EventEmitter<Object>;
    constructor(el: ElementRef);
    ngOnInit(): void;
    renderRanges(): void;
    renderCalendar(side: SideEnum): void;
    setStartDate(startDate: any): void;
    setEndDate(endDate: any): void;
    isInvalidDate(date: any): boolean;
    isCustomDate(date: any): boolean;
    updateView(): void;
    updateMonthsInView(): void;
    /**
     *  This is responsible for updating the calendars
     */
    updateCalendars(): void;
    updateElement(): void;
    remove(): void;
    /**
     * this should calculate the label
     */
    calculateChosenLabel(): void;
    clickApply(e?: any): void;
    clickCancel(e: any): void;
    /**
     * called when month is changed
     * @param monthEvent get value in event.target.value
     * @param side left or right
     */
    monthChanged(monthEvent: any, side: SideEnum): void;
    /**
     * called when year is changed
     * @param yearEvent get value in event.target.value
     * @param side left or right
     */
    yearChanged(yearEvent: any, side: SideEnum): void;
    /**
     *  call when month or year changed
     * @param month month number 0 -11
     * @param year year eg: 1995
     * @param side left or right
     */
    monthOrYearChanged(month: number, year: number, side: SideEnum): void;
    /**
     * Click on previous month
     * @param side left or right calendar
     */
    clickPrev(side: SideEnum): void;
    /**
     * Click on next month
     * @param side left or right calendar
     */
    clickNext(side: SideEnum): void;
    /**
     * When selecting a date
     * @param e event: get value by e.target.value
     * @param side left or right
     * @param row row position of the current date clicked
     * @param col col position of the current date clicked
     */
    clickDate(e: any, side: SideEnum, row: number, col: number): void;
    /**
     *  Click on the custom range
     * @param e: Event
     * @param label
     */
    clickRange(e: any, label: any): void;
    show(e?: any): void;
    hide(e?: any): void;
    /**
     * handle click on all element in the component, usefull for outside of click
     * @param e event
     */
    handleInternalClick(e: any): void;
    /**
     * update the locale options
     * @param locale
     */
    updateLocale(locale: any): void;
    /**
     *  clear the daterange picker
     */
    clear(): void;
    /**
     * Find out if the selected range should be disabled if it doesn't
     * fit into minDate and maxDate limitations.
     */
    disableRange(range: any): any;
    /**
     * Find out if the current calendar row has current month days
     * (as opposed to consisting of only previous/next month days)
     */
    hasCurrentMonthDays(currentMonth: any, row: any): boolean;
}
