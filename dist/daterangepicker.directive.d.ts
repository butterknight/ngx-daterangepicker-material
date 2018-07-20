import { ViewContainerRef, ComponentFactoryResolver, ElementRef, ChangeDetectorRef, OnInit, OnChanges, SimpleChanges, DoCheck, KeyValueDiffers, EventEmitter } from '@angular/core';
import { DaterangepickerComponent } from './daterangepicker.component';
import * as _moment from 'moment';
export declare class DaterangepickerDirective implements OnInit, OnChanges, DoCheck {
    viewContainerRef: ViewContainerRef;
    _changeDetectorRef: ChangeDetectorRef;
    private _componentFactoryResolver;
    private _el;
    private differs;
    picker: DaterangepickerComponent;
    private _onChange;
    private _onTouched;
    private _validatorChange;
    private _value;
    private localeDiffer;
    constructor(viewContainerRef: ViewContainerRef, _changeDetectorRef: ChangeDetectorRef, _componentFactoryResolver: ComponentFactoryResolver, _el: ElementRef, differs: KeyValueDiffers);
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
    firstMonthDayClass: string;
    lastMonthDayClass: string;
    emptyWeekRowClass: string;
    firstDayOfNextMonthClass: string;
    lastDayOfPreviousMonthClass: string;
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
     * For click outside of the calendar's container
     * @param event event object
     * @param targetElement target element object
     */
    outsideClick(event: any, targetElement: HTMLElement): void;
}
