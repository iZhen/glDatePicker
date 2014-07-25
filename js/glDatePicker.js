/*!
 * glDatePicker
 */
(function(exports, $) {
  // if jQuery is not define
  if(!$) { return;}
  // define namespace
  var NAME_SPACE_SINGLE = 'glDatePicker';
  var NAME_SPACE_RANGE = 'glDateRangePicker';

  /**
   * define glDatePicker
   * @param options
   * @returns {*}
   */
  $.fn.glDatePicker = function(options) {
    var namespace = NAME_SPACE_SINGLE;
    // get datepicker from data
    var instance = this.data(namespace);

    if (!instance) {
      // build new object
      return this.each(function() {
        return $(this).data(namespace, new datePicker(this, options));
      });
    } else if (options === true) {
      // return object
      return instance;
    }
  };
  $.fn.glDateRangePicker = function(options) {
    var namespace = NAME_SPACE_RANGE;
    // get datepicker from data
    var instance = this.data(namespace);

    if (!instance) {
      // build new object
      return this.each(function() {
        return $(this).data(namespace, new dateRangePicker(this, options));
      });
    } else if (options === true) {
      // return object
      return instance;
    }
  };

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
      /*year: "",
       week: "WK",
       quarter: "Quarter",
       month: "Month",
       qoy: ["Q1th", "Q2th", "Q3th", "Q4th"],
       moy: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
       dow: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]*/
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
          ele.val(dateHelper.format(date, format));
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
  $.fn.glDateRangePicker.options = {
    // day:日期选择 / week:周选择 / month:月份选择 / quarter:季度选择 / year:年份选择
    type: "day",
    dateRange: {
      start: null,
      end: null
    },
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
      /*year: "",
       week: "WK",
       quarter: "Quarter",
       month: "Month",
       qoy: ["Q1th", "Q2th", "Q3th", "Q4th"],
       moy: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
       dow: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]*/
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
          ele.val(dateHelper.format(date, format));
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

      // add calendar content
      if(!options.showAlways) {
        // if cal not show always, it will using a common dom to show the calendar.
        self.calendar = addDropdownCalendar(options.type);
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

      // show selected date
      options.events.onClick($ele, options.selectedDate, options.format);

      // render calendar
      self.render();
    };
    dp.prototype = {
      show: function() {
        var self = this;
        if(!self.calendar.renderTo.hasClass(NAME_SPACE_SINGLE)) {
          // not has NAME_SPACE_SINGLE and 'calendar' class name at same time
          // it's should be use common calendar object.
          var $wrap = $('.' + NAME_SPACE_SINGLE + '-dropdown');
          if(self.calendar.renderTo.attr('dp-ele') != self.ele.attr('dp-id')) {
            // common calendar not used for current element.
            // 1. hide element and remove dp-id
            $wrap.hide();
            $('.' + NAME_SPACE_SINGLE + ' .calendar')
              .removeAttr('dp-ele')
              .hide();
            // 2. show self calendar
            self.calendar.renderTo.show();
            // 3. set position
            setCalendarPosition(self.ele, $wrap);
            // 4. change attr dp-ele
            self.calendar.renderTo.attr('dp-ele', self.ele.attr('dp-id'));
            // 5. render calender
            self.calendar.setOptions(self.options);
            self.calendar.setClickEvent((function(self) {
              return function(data) {
                self.options.events.onClick(self.ele, data, self.options.format);
                self.options.events.onHide($('.glDatePicker.glDatePicker-dropdown'))
              };
            })(self));
            self.calendar.render();
            // 6. show content
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
      render: function(onClickEvent) {
        // define alise name
        var self = this;
        var ele = self.ele;
        var options = self.options;
        var calendar = self.calendar;

        // build calendar content

      }
    };
    return dp;
  })();

  /**
   * dateRangePicker object
   */
  var dateRangePicker = (function() {
    var drp = function(element, userOptions) {
      // define self
      var self = this;

      // ele
      var $ele = self.ele = $(element);

      // init options
      userOptions = userOptions || {};
      self.options = $.extend(true, {}, $.fn.glDatePicker.options, userOptions);
      var options = self.options;

      // add calendar content
      if(!options.showAlways) {
        // if cal not show always, it will using a common dom to show the calendar.
        self.calendar = addDropdownRangeCalendar(options.type);
      }
    };

    drp.prototype = {};

    return drp;
  })();

  /**
   * add common calendar for dropdown
   * @param calendar
   * @returns {*|HTMLElement}
   */
  var addDropdownCalendar = function(type) {
    // get exist wrap object.
    var $wrap = $('.' + NAME_SPACE_SINGLE + '.' + NAME_SPACE_SINGLE + '-dropdown');
    // if wrap object not exist, build it.
    if(!$wrap.length) {
      // define object
      $wrap = $('<div class="' + NAME_SPACE_SINGLE + ' ' + NAME_SPACE_SINGLE + '-dropdown"/>');
      $wrap.appendTo('body');
      // bind hide event
      $(document).on('mouseup', (function($wrap){
        return function(e) {
          var target = e.target;
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

    // set new calendar
    var calendar;
    // try to find calendar-type object.
    var $calendar = $('.' + NAME_SPACE_SINGLE + '-' + type, $wrap);
    // if not exist calendar-type object, create it.
    if(!$calendar.length) {
      calendar = new Calendar(type);
      calendar.renderTo = $('<div class="calendar ' + NAME_SPACE_SINGLE + '-' + type + '"/>');
      calendar.renderTo.appendTo($wrap);
      calendar.renderTo.data('calendar', calendar);
      calendar.init();
    } else {
      calendar = $calendar.data('calendar');
    }

    // return calendar object.
    return calendar;
  };
  var addDropdownRangeCalendar = function(type) {
    // get exist wrap object.
    var $wrap = $('.' + NAME_SPACE_RANGE + '.' + NAME_SPACE_RANGE + '-dropdown');
    // if wrap object not exist, build it.
    if(!$wrap.length) {
      // define object
      $wrap = $('<div class="' + NAME_SPACE_RANGE + ' ' + NAME_SPACE_RANGE + '-dropdown"/>');
      $wrap.appendTo('body');
      // bind hide event
      $(document).on('mouseup', (function($wrap){
        return function(e) {
          var target = e.target;
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

    // set new calendar
    var calendar;
    // try to find calendar-type object.
    $calendar = $('.' + NAME_SPACE_RANGE + '-panel-' + type, $wrap);
    // if not exist calendar-type object, create it.
    if(!$calendar.length) {
      var $renderTo = $('<div class="' + NAME_SPACE_RANGE + '-panel-' + type + '"/>');
      $renderTo.appendTo($wrap);
      calendar = new rangePanel(type, $renderTo);
      $renderTo.data('calendar', calendar);
    } else {
      calendar = $calendar.data('calendar');
    }

    // return calendar object.
    return calendar;
  };

  var rangePanel = (function() {
    // object
    var rp = function(type, renderTo) {
      var self = this;
      self.renderTo = renderTo || $('body');
      var $wrap = $('<div></div>').appendTo(self.renderTo);
      self.calendar = {
        start: new Calendar(type),
        end: new Calendar(type)
      };
      self.calendar.start.renderTo = $('<div class="calendar ' + NAME_SPACE_RANGE + '-' + type + '"/>');
      self.calendar.start.renderTo.appendTo($wrap);
      self.calendar.start.init();
      self.calendar.end.renderTo = $('<div class="calendar ' + NAME_SPACE_RANGE + '-' + type + '"/>');
      self.calendar.end.renderTo.appendTo($wrap);
      self.calendar.end.init();


    };

    rp.prototype = {
      setOptions: function(userOptions) {},
      setClickEvent: function(func) {}
    };

    return rp;
  })();

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

  /**
   * Calendar object
   */
  var Calendar = (function() {
    /**
     * cal object
     * @param options
     */
    var cal = function(type) {
      // add this alias
      var self = this;
      // dom target
      self.renderTo = null;
      // calendar type
      self.type = type || null;

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
        $prev.appendTo($head).append('<span class="glyphicon glyphicon-chevron-left"></span>');
        // title
        var $title = ele.title = $('<div class="title"></div>');
        $title.appendTo($head);
        // btn next
        var $next = ele.next = $('<div class="next"/>');
        $next.appendTo($head).append('<span class="glyphicon glyphicon-chevron-right"></span>');
        // year
        var $year = ele.year = $('<div class="year">2014</div>');
        $year.appendTo($title);
        //month
        var $month = ele.month = $('<div class="month"></div>');
        $month.appendTo($title);

        // table
        var $table = ele.table = $('<table></table>');
        $table.appendTo($target);
        // thead
        var $thead = ele.thead = $('<thead/>');
        $thead.appendTo($table);
        // tbody
        var $tbody = ele.tbody = $('<tbody/>');
        $tbody.appendTo($table);
      },
      setOptions: function(options) {
        // add this alias
        var self = this;

        // store options
        self.options = options || {};
      },
      addOptions: function(options) {
        // add this alias
        var self = this;

        // store options
        self.options = self.options || {};
        $.extend(true, self.options, options);
      },
      setClickEvent: function(func) {
        if(typeof func == 'function') {
          this.onClick = func;
        }
      },
      render: function(type) {
        var self = this;
        var ele = self.ele;
        var options = self.options;

        // if cur type is null
        // set the type by options
        type = type || self.type;

        // empty content
        ele.prev.off();
        ele.next.off();
        ele.year.off().empty();
        ele.month.off().empty().show();
        ele.table.removeClass();
        ele.thead.empty();
        ele.tbody.empty();

        // set selected date.
        options.selectedDate = options.selectedDate || options.todayDate;
        // set first date of month.
        options.firstDate = dateHelper.firstDayOfMonth((options.firstDate || options.selectedDate));

        // render content
        // title set
        self._setTitle(type);
        // body set
        self._setBody(type);


        /*switch (type) {
         case 'day':
         self._type_day();
         break;
         case 'month':
         self._type_month();
         break;
         case 'year':
         self._type_year();
         break;
         default: break;
         }*/

      },
      prevEvent: function(type) {
        var self = this;
        var options = self.options;

        // set first date
        switch (type) {
          case 'day':
            dateHelper.addMonth(options.firstDate, -1);
            break;
          case 'month':
            dateHelper.addYear(options.firstDate, -1);
            break;
          case 'year':
            dateHelper.addYear(options.firstDate, -25);
            break;
          default: break;
        }

        // render content
        self.render(type);

        // bind click event
        self.ele.prev.on('click', (function(self, type) {
          return function(e) {
            e.stopPropagation();
            self.render(type);
          };
        })(self, type));
      },
      nextEvent: function(type) {
        var self = this;
        var options = self.options;

        // set first date
        switch (type) {
          case 'day':
            dateHelper.addMonth(options.firstDate, 1);
            break;
          case 'month':
            dateHelper.addYear(options.firstDate, 1);
            break;
          case 'year':
            dateHelper.addYear(options.firstDate, 25);
            break;
          default: break;
        }

        // render content
        self.render(type);

      },
      _setTitle: function(type) {
        var self = this;
        var ele = self.ele;
        var options = self.options;

        type = type || self.type;

        // bind click event
        // set prev function
        ele.prev.on('click', (function(self, type) {
          return function(e) {
            e.stopPropagation();
            self.prevEvent(type);
          };
        })(self, type));

        // bind click event
        // set next function
        ele.next.on('click', (function(self, type) {
          return function(e) {
            e.stopPropagation();
            self.nextEvent(type);
          };
        })(self, type));

        // set year and month
        switch(type) {
          case 'day':
            ele.year
              .html(options.firstDate.getFullYear() + options.text.year)
              .on('click', (function(self, type) {
                return function(e) {
                  self.render('year');
                };
              })(self, type));
            ele.month
              .html(options.text.moy[options.firstDate.getMonth()])
              .on('click', (function(self, type) {
                return function(e) {
                  self.render('month');
                };
              })(self, type));
            break;
          case 'month':
            ele.year
              .html(options.firstDate.getFullYear() + options.text.year)
              .on('click', (function(self, type) {
                return function(e) {
                  self.render('year');
                };
              })(self, type));
            ele.month
              .hide();
            break;
          case 'year':
            var year = options.firstDate.getFullYear();
            ele.year
              .html((year - 12) + options.text.year + " - " + (year + 12) + options.text.year);
            ele.month
              .hide();
            break;
          default: break;
        }

      },
      _setBody: function(type) {
        var self = this;
        var ele = self.ele;
        var options = self.options;

        // add class name for calendar body
        ele.table.addClass(type);

        // add calendar
        switch(type) {
          case 'day':
            self._type_day();
            break;
          case 'month':
            self._type_month();
            break;
          case 'year':
            self._type_year();
            break;
          default: break;
        }
      },
      _type_day: function() {
        var self = this;
        var ele = self.ele;
        var type = self.type;
        var options = self.options;

        // set thead
        var $trHead = $('<tr/>').appendTo(ele.thead);
        // wk title
        $trHead.append($('<th class="week"/>').html(options.text.week));
        // week title
        for (var i = options.startDayOfWeek; i < options.startDayOfWeek + 7; i++) {
          var weekday = i % 7;
          var $dow = $("<th/>")
            .html(options.text.dow[weekday])
            .addClass(weekday == 0 || weekday == 6 ? 'weekend' : 'weekday');
          $dow.appendTo($trHead);
        }

        // set tbody
        // define time cursor
        var curDate = dateHelper.firstDayOfMonth(options.firstDate);
        var curMonth = curDate.getMonth();
        dateHelper.addDay(curDate, options.startDayOfWeek - curDate.getDay());

        // the class name for day of week
        var dowClass = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        // build
        for(var r = 0; r < 6; r++) {
          // a month has 6 rows date

          // define row
          var $trRow = $('<tr/>').appendTo(ele.tbody);

          // week
          var $tdWeek = $('<td/>').appendTo($trRow);
          var $cellWeek = $('<div/>').appendTo($tdWeek);
          $cellWeek.html(dateHelper.weekOfYear(curDate, options.startDayOfWeek));
          $cellWeek.addClass("week");

          // build date
          for(var i = 0; i < 7; i++) {
            // date wrapper
            var $tdDate = $("<td/>").appendTo($trRow);
            var $cellDate = $("<div/>").appendTo($tdDate);

            var _curDate = new Date(curDate);

            // add date content
            $cellDate
              .html(curDate.getDate())
              .data('date', _curDate);

            if (curDate.getMonth() != curMonth) {
              // set other month
              $cellDate
                .addClass('outday');
            } else {
              $cellDate.on('click', (function(self, _curDate){
                return function(e) {
                  self._clickEvent.call(self, _curDate, 'day');
                }
              })(self, _curDate));
            }

            // set weekday & weekend
            var dow = curDate.getDay();
            if (dow == 0
              || dow == 6) {
              $cellDate.addClass("weekend");
            } else {
              $cellDate.addClass("weekday");
            }

            // set week name
            $cellDate.addClass(dowClass[curDate.getDay()]);

            // set selected
            if (curDate.toLocaleDateString()
              == options.selectedDate.toLocaleDateString()) {
              $cellDate.addClass("selected");
              $trRow.addClass("selected");
            }

            dateHelper.addDay(curDate, 1);
          }

        }


      },
      _type_month: function() {
        var self = this;
        var ele = self.ele;
        var type = self.type;
        var options = self.options;

        // add class name for calendar body
        ele.table.addClass('month');

        // curDate
        var curDate = dateHelper.firstDayOfYear(options.firstDate);

        // build head
        var $trHead = $('<tr/>').appendTo(ele.thead);
        // quarter text
        $trHead.append($('<th/>').addClass('quarter').html(options.text.quarter));
        // month text
        $trHead.append($('<th/>').attr('colspan', '3').addClass('month').html(options.text.month));

        // build
        for (var r = 0; r < 4; r++) {
          // a year has 4 rows of month
          // each row has 3 month
          var $trRow = $('<tr/>').appendTo(ele.tbody);

          // add quarter
          var $tdQuarter = $('<td/>').appendTo($trRow);
          var $cellQuarter = $('<div/>').appendTo($tdQuarter);
          $cellQuarter
            .html(options.text.qoy[r])
            .addClass('quarter');

          // add month
          for (var i = 0; i < 3; i++) {
            var $tdMonth = $('<td/>').appendTo($trRow);
            var $cellMonth = $('<div/>').appendTo($tdMonth);
            $cellMonth.html(options.text.moy[curDate.getMonth()]);

            // set date object.
            var _curDate = new Date(curDate);

            // store date to data
            $cellMonth.data("date", _curDate);

            // bind click event
            $cellMonth.on('click', (function(self, _curDate){
              return function(e) {
                self._clickEvent.call(self, _curDate, 'month');
              }
            })(self, _curDate));

            // add selected
            if (curDate.getMonth() == options.selectedDate.getMonth()
              && curDate.getFullYear() == options.selectedDate.getFullYear()) {
              $cellMonth.addClass("selected");
              $trRow.addClass("selected");
            }

            dateHelper.addMonth(curDate, 1);
          }
        }
      },
      _type_year: function() {
        var self = this;
        var ele = self.ele;
        var type = self.type;
        var options = self.options;

        // add class name for calendar body
        ele.table.addClass('year');

        // curDate
        var curDate = dateHelper.firstDayOfYear(options.firstDate);
        dateHelper.addYear(curDate, -12);

        // build
        for (var r = 0; r < 5; r++) {
          var $trRow = $('<tr/>').appendTo(ele.tbody);
          // each row has 5 col
          for (var i = 0; i < 5; i++) {
            var $tdYear = $('<td/>').appendTo($trRow);
            var $cell = $('<div/>').appendTo($tdYear);
            $cell.html(curDate.getFullYear());

            // set date object.
            var _curDate = new Date(curDate);

            // store date to data
            $cell.data("date", _curDate);

            // bind click event
            $cell.on('click', (function(self, _curDate){
              return function(e) {
                self._clickEvent.call(self, _curDate, 'year');
              }
            })(self, _curDate));

            if (curDate.getFullYear()
              == options.selectedDate.getFullYear()) {
              $cell.addClass("selected");
            }

            dateHelper.addYear(curDate, 1);
          }
        }

      },
      _clickEvent: function(date, type) {
        var self = this;
        self.options.firstDate = date;

        if(type != self.type) {
          self.render();
        } else {
          if(self.onClick) {
            self.onClick(date);
          }
        }
      }
    };

    return cal;
  })();

  /**
   * helpers for date object
   * @type {{}}
   */
  var dateHelper = {
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
        day: date.getDay(),
        hour: date.getHours(),
        minute: date.getMinutes(),
        second: date.getSeconds()
      };
    },
    format: function(date, format) {
      var content = (format && typeof(format) == "string") ? format : "yyyy-mm-dd";
      //content = content.replace(/qq/g, this._quarterOfYear() + 1); // 季度
      //content = content.replace(/wk/g, this._dow()); // 星期
      //content = content.replace(/woy/g, this._weekOfYear()); // 星期
        var month = date.getMonth() + 1;
        var data = date.getDate();
        if(month < 10){ month = "0" + month; }
        if(data < 10){ data = "0" + data; }
      content = content.replace(/yyyy/g, date.getFullYear()); // 年
      content = content.replace(/mm/g, month); // 月
      content = content.replace(/dd/g, data); // 日
      content = content.replace(/HH/g, date.getHours()); // 时
      content = content.replace(/MM/g, date.getMinutes()); // 分
      content = content.replace(/SS/g, date.getSeconds()); // 秒
      return content;
    },
    addDay: function(d, days) {
      if (days && typeof(days) == "number") {
        d.setDate(d.getDate() + days);
      }
    },
    addMonth: function(d, months) {
      if (months && typeof(months) == "number") {
        d.setMonth(d.getMonth() + months);
      }
    },
    addYear: function(d, years) {
      if (years && typeof(years) == "number") {
        d.setFullYear(d.getFullYear() + years);
      }
    },
    firstDayOfMonth: function(d) {
      var date = new Date(d);
      date.setDate(1);

      return date;
    },
    lastDayOfMonth: function(d) {
      var date = new Date(d);
      date.setMonth(d.getMonth() + 1);
      date.setDate(0);

      return date;
    },
    firstDayOfYear: function(d) {
      var date = new Date(d);
      date.setDate(1);
      date.setMonth(0);

      return date;
    },
    weekOfYear: function(d, firstDayOfWeek) {
      var fdow = (typeof (firstDayOfWeek) == "number") ? firstDayOfWeek : 1,
        firstDateOfYear = new Date(d.getFullYear(), 0, 0);
      // 计算
      var addDay = (new Date(d.getFullYear(), 0, 1)).getDay() - fdow;
      if (addDay < 0) {
        addDay = addDay + 7;
      }
      //
      var weekOfYear = Math.ceil((d.getTime() - firstDateOfYear.getTime()) / (7 * 24 * 60 * 60 * 1000) + (addDay / 7));
      return weekOfYear;
    }

  };

  var glDate = (function() {
    var gld = function(obj) {
      this.date = new Date(obj);
    };
    gld.prototype = {
      val: function() {
        return {
          year: this.date.getFullYear(),
          month: this.date.getMonth(),
          date: this.date.getDate(),
          time: this.date.getTime(),
          day: this.date.getDay()
        };
      },
      format: function(format) {
        var content = (format && typeof(format) == "string") ? format : "yyyy-mm-dd";
        //content = content.replace(/qq/g, this._quarterOfYear() + 1); // 季度
        //content = content.replace(/wk/g, this._dow()); // 星期
        //content = content.replace(/woy/g, this._weekOfYear()); // 星期
        content = content.replace(/yyyy/g, this.date.getFullYear()); // 年
        content = content.replace(/mm/g, this.date.getMonth() + 1); // 月
        content = content.replace(/dd/g, this.date.getDate()); // 日
        content = content.replace(/HH/g, this.date.getHours()); // 时
        content = content.replace(/MM/g, this.date.getMinutes()); // 分
        content = content.replace(/SS/g, this.date.getSeconds()); // 秒
        return content;
      }
    };
  })();
})(window, jQuery);