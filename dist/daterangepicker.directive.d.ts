import { ViewContainerRef, ComponentFactoryResolver, ElementRef, ChangeDetectorRef, OnInit, OnChanges, SimpleChanges, DoCheck, KeyValueDiffers, EventEmitter, Renderer2 } from '@angular/core';
import { DaterangepickerComponent } from './daterangepicker.component';
import * as _moment from 'moment';
export declare class DaterangepickerDirective implements OnInit, OnChanges, DoCheck {
    viewContainerRef: ViewContainerRef;
    _changeDetectorRef: ChangeDetectorRef;
    private _componentFactoryResolver;
    private _el;
    private _renderer;
    private differs;
    picker: DaterangepickerComponent;
    private _onChange;
    private _onTouched;
    private _validatorChange;
    private _value;
    private localeDiffer;
    minDate: _moment.Moment;
    maxDate: _moment.Moment;
    autoApply: boolean;
    alwaysShowCalendars: boolean;
    showCustomRangeLabel: boolean;
    linkedCalendars: boolean;
    singleDatePicker: boolean;
    showWeekNumbers: boolean;
    showISOWeekNumbers: boolean;
    showDropdowns: boolean;
    isInvalidDate: Function;
    isCustomDate: Function;
    showClearButton: boolean;
    ranges: any;
    opens: string;
    drops: string;
    firstMonthDayClass: string;
    lastMonthDayClass: string;
    emptyWeekRowClass: string;
    firstDayOfNextMonthClass: string;
    lastDayOfPreviousMonthClass: string;
    keepCalendarVisibleAfterApplying: boolean;
    _locale: any;
    locale: any;
    private _endKey;
    private _startKey;
    startKey: any;
    endKey: any;
    notForChangesProperty: Array<string>;
    value: any;
    onChange: EventEmitter<Object>;
    rangeClicked: EventEmitter<Object>;
    datesUpdated: EventEmitter<Object>;
    constructor(viewContainerRef: ViewContainerRef, _changeDetectorRef: ChangeDetectorRef, _componentFactoryResolver: ComponentFactoryResolver, _el: ElementRef, _renderer: Renderer2, differs: KeyValueDiffers);
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngDoCheck(): void;
    onBlur(): void;
    onFocus(event: any): void;
    hide(): void;
    writeValue(value: any): void;
    registerOnChange(fn: any): void;
    registerOnTouched(fn: any): void;
    private setValue(val);
    /**
     * Set position of the calendar
     */
    setPosition(): void;
    /**
     * For click outside of the calendar's container
     * @param event event object
     * @param targetElement target element object
     */
    outsideClick(event: any, targetElement: HTMLElement): void;
}
