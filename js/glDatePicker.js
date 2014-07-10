/*!
 * glDatePicker
 */
(function(exports, $) {
    // if jQuery is not define
    if(!$) { return;}
    // define namespace
    var namespace = 'glDatePicker';
    /**
     * Calendar object
     */
    var Calendar = (function() {
        /**
         * cal object
         * @param options
         */
        var cal = function(options) {
            options = options || {};
            // add this alias
            var self = this;
            // dom target
            self.renderTo = null;
            // calendar type
            self.type = options.type || null;

            // dom element
            self.ele = {};

            // privite
            self._isinit = false;
        };
        
        cal.prototype = {
            init: function() {
                var self = this;
                var ele = self.ele;
                // break
                if(self._isinit || !self.renderTo) { return; }
                // build content
                var $target = self.renderTo;
                // head
                var $head = ele.head = $('<div class="head"></div>');
                $head.appendTo($target);
                // btn prev
                var $prev = ele.prev = $('<div class="prev"/>');
                $prev.appendTo($head).append('<span class="glyphicon glyphicon-step-backward"/>');
                // title
                var $title = ele.title = $('<div class="title">1</div>');
                $title.appendTo($head);
                // btn next
                var $next = ele.next = $('<div class="next"/>');
                $next.appendTo($head).append('<span class="glyphicon glyphicon-step-forward"/>');
                // body
                var $body = ele.table = $('<table></table>');
                $body.appendTo($target);
            }
        };

        return cal;
    })();
    /**
     * define glDatePicker
     * @param options
     * @returns {*}
     */
    $.fn.glDatePicker = (function(ns) {
        return function(options) {
            var namespace = ns;

            var instance = this.data(namespace);

            if (!instance) {
                return this.each(function() {
                    return $(this).data(namespace, new datePicker(this, options));
                });
            } else if (options === true) {
                return instance;
            }
        };
    })(namespace);
    $.fn.glDateRangePicker = function(options) {};
    /**
     * parameters for datepicker
     * @type {json}
     */
    $.fn.glDatePicker.options = {
        // day:日期选择 / week:周选择 / month:月份选择 / quarter:季度选择 / year:年份选择
        type: "day",
        // 显示格式
        format: null,
        // 浮动层级
        zIndex: 1000,
        // 日历偏移
        calendarOffset: {
            x: 0,
            y: 1
        },
        // 选择日期后是否隐藏
        hideOnClick: true,
        // 是否一直可见
        showAlways: false,
        // 一周起始星期
        startDayOfWeek: 0,
        // 本日
        todayDate: new Date(),
        // 选择的日期
        selectedDate: null,
        // 允许月份选择
        allowMonthSelect: true,
        // 允许年份选择
        allowYearSelect: true,
        // 可选日期区间
        selectableDateRange: null,
        // 可选日期
        selectableDates: null,
        // 可选星期 [0 - 6]
        selectableDOW: null,
        // 可选月份 [0 - 11]
        selectableMonths: null,
        // 可选季度
        selectableQuarters: null,
        // 可选年份
        selectableYears: null,
        // 月份第一天，切换日历用
        firstDate: null,
        // 文本显示
        text: {
            // 往前箭头
            prevArrow: '\u25c4',
            // 往后箭头
            nextArrow: '\u25ba',
            year: "年",
            week: "周",
            quarter: "季度",
            month: "月份",
            qoy: ["第1季度", "第2季度", "第3季度", "第4季度"],
            moy: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
            dow: ["日", "一", "二", "三", "四", "五", "六"]
            //year: "",
            //week: "WK",
            //quarter: "Quarter",
            //month: "Month",
            //qoy: ["Q1th", "Q2th", "Q3th", "Q4th"],
            //moy: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            //dow: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
        },
        // 事件
        events: {
            // 点击后事件
            onClick: function(ele, date, format) {
                if (!ele || !date) {
                    return;
                }
                if (format == null) {
                    ele.val(date.toLocaleDateString());
                } else {
                    ele.val(date._format(format));
                }
            },
            // 显示时事件
            onShow: function(calendar) {
                calendar.show();
            },
            // 显示后事件
            onHide: function(calendar) {
                calendar.hide();
            }
        }
    };
    /**
     * datePicker object
     */
    var datePicker = (function() {
        /**
         * main object
         * @param element
         * @param userOptions
         */
        var dp = function(element, userOptions) {
            // define self
            var self = this;

            // jquery element
            self.ele = $(element);
            var $ele = self.ele;

            // init options
            userOptions = userOptions || {};
            self.options = $.extend(true, {}, $.fn.glDatePicker.options, userOptions);
            var options = self.options;

            // calendar object
            self.calendar = new Calendar(options);
            // add calendar content
            if(!options.showAlways) {
                // if cal not show always, it will using a common dom to show the calendar.
                self.calendar = addDropdownCalendar(self.calendar);
            }

            // add dp-id
            if (!($ele.attr('dp-id') || '').length) {
                $ele.attr('dp-id', 'dp-' + Math.round(Math.random() * 1e10));
            }
            // bind element event
            $ele
                .on('click', (function(self) {
                    return function(e) {
                        $(this).blur();
                        self.show(e);
                    };
                })(self))
                .on('focus', (function(self) {
                    return function(e) {
                        $(this).blur();
                        self.show(e);
                    };
                })(self));


            // render calendar
            self.render();
        };
        dp.prototype = {
            show: function() {
                var self = this;
                if(!self.calendar.renderTo.hasClass(namespace)) {
                    // not has namespace and 'calendar' class name at same time
                    // it's should be use common calendar object.
                    var $wrap = $('.' + namespace + '-dropdown');
                    if(self.calendar.renderTo.attr('dp-ele') != self.ele.attr('dp-id')) {
                        // common calendar not used for current element.
                        // 1. hide element and remove dp-id
                        $wrap.hide();
                        $('.' + namespace + ' .calendar')
                            .removeAttr('dp-ele')
                            .hide();
                        // 2. show self calendar
                        self.calendar.renderTo.show();
                        // 3. set position
                        setCalendarPosition(self.ele, $wrap);
                        // 4. change attr dp-ele
                        self.calendar.renderTo.attr('dp-ele', self.ele.attr('dp-id'));
                        // 5. show content
                        $wrap.show();
                    } else if(!$wrap.is(':visible')) {
                        // just only hide
                        $wrap.show();
                    }
                } else {
                }
            },
            hide: function() {},
            remove: function() {},
            render: function() {}
        };
        return dp;
    })();
    /**
     * add common calendar for dropdown
     * @param calendar
     * @returns {*|HTMLElement}
     */
    var addDropdownCalendar = function(calendar) {
        // get exist wrap object.
        var $wrap = $('.' + namespace + '.' + namespace + '-dropdown');
        // if wrap object not exist, build it.
        if(!$wrap.length) {
            // define object
            $wrap = $('<div class="' + namespace + ' ' + namespace + '-dropdown"/>');
            $wrap.appendTo('body');
            // bind hide event
            $(document).on('mouseup', (function($wrap){
                return function(e) {
                    var target = e.renderTo;
                    var $calendar = $('.calendar:visible', $wrap);

                    if ($calendar.length
                        && !$('[dp-id="' + $calendar.attr('dp-ele') + '"]').is(target)
                        && !$calendar.is(target)
                        && $calendar.has(target).length === 0) {
                        $wrap.hide();
                    }
                };
            })($wrap));
        }

        // try to find calendar-type object.
        calendar.renderTo = $('.' + namespace + '-' + calendar.type, $wrap);
        // if not exist calendar-type object, create it.
        if(!calendar.renderTo.length) {
            calendar.renderTo = $('<div class="calendar ' + namespace + '-' + calendar.type + '"/>');
            calendar.renderTo.appendTo($wrap);
            calendar.init();
        }

        // return calendar object.
        return calendar;
    };
    /**
     * set the calendar position depend on input element.
     * @param ele
     * @param $calendar
     * @returns {*}
     */
    var setCalendarPosition = function(ele, $calendar) {
        // get offset object
        var elePos = ele.offset();
        $calendar.css({
            top: (elePos.top + ele.outerHeight() + 1) + 'px',
            left: (elePos.left) + 'px'
        });
        // return object
        return $calendar;
    };
    var renderCalendarDay = function() {};
    var renderCalendarMonth = function() {};
    var renderCalendarYear = function() {};
    var renderCalendarWeek = function() {};
    var renderCalendarQuarter = function() {};
    /**
     * helpers for date object
     * @type {{}}
     */
    var util = {
        /**
         * 获取日期对象内容
         * @param date
         * @returns {{year: number, month: number, date: number, time: (number|*), day: number}}
         */
        val: function(date) {
            return {
                year: date.getFullYear(),
                month: date.getMonth(),
                date: date.getDate(),
                time: date.getTime(),
                day: date.getDay()
            };
        }
    };
})(window, jQuery);