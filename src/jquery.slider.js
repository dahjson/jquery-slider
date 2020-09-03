!function($) { // avoid conflicts
  'use_strict';

  // plugin class
  class Slider {
    constructor(element, settings) {
      // setup plugin settings
      this.element = element;
      this.min = this.element.attr('min') || settings.min;
      this.max = this.element.attr('max') || settings.max;
      this.step = this.element.attr('step') || settings.step;
      this.value = this.element.attr('value') || (settings.max - settings.min) / 2 + settings.min;
      this.decimals = this.element.data('decimals') || settings.decimals;
      this.prefix = this.element.data('prefix') || settings.prefix;
      this.postfix = this.element.data('postfix') || settings.postfix;
      this.toggleBubble = this.element.data('toggle-bubble') || settings.toggleBubble;
      this.toggleLimit = this.element.data('toggle-limit') || settings.toggleLimit;
      this.bubbleColor = this.element.data('bubble-color') || settings.bubbleColor;
      this.bubbleFontScale = this.element.data('bubble-font-scale') || settings.bubbleFontScale;
      this.bubbleFontColor = this.element.data('bubble-font-color') || settings.bubbleFontColor;
      this.thumbScale = this.element.data('thumb-scale') || settings.thumbScale;
      this.thumbColor = this.element.data('thumb-color') || settings.thumbColor;
      this.thumbFontScale = this.element.data('thumb-font-scale') || settings.thumbFontScale;
      this.thumbFontColor = this.element.data('thumb-font-color') || settings.thumbFontColor;
      this.trackScale = this.element.data('track-scale') || settings.trackScale;
      this.trackColor = this.element.data('track-color') || settings.trackColor;

      // hide input field
      this.element.hide();

      // convert strings to numbers
      this.min = parseFloat(this.removeCommas(this.min));
      this.max = parseFloat(this.removeCommas(this.max));
      this.step = parseFloat(this.removeCommas(this.step));
      this.value = parseFloat(this.removeCommas(this.value));
      this.decimals = parseFloat(this.removeCommas(this.decimals));
      this.toggleLimit = parseFloat(this.removeCommas(this.toggleLimit));
      this.bubbleFontScale = parseFloat(this.removeCommas(this.bubbleFontScale));
      this.thumbScale = parseFloat(this.removeCommas(this.thumbScale));
      this.thumbFontScale = parseFloat(this.removeCommas(this.thumbFontScale));
      this.trackScale = parseFloat(this.removeCommas(this.trackScale));

      // create slider elements
      this.slider = $('<div>').addClass('jquery-slider__wrap').insertAfter(this.element);
      this.minus = $('<div><span>-</span></div>').addClass('jquery-slider__minus').appendTo(this.slider);
      this.plus = $('<div><span>+</span></div>').addClass('jquery-slider__plus').appendTo(this.slider);
      this.track = $('<div>').addClass('jquery-slider__track').appendTo(this.slider);
      this.thumb = $('<div><span>').addClass('jquery-slider__thumb').appendTo(this.track);
      this.bubble = $('<div><span>').addClass('jquery-slider__bubble').appendTo(this.thumb);
      this.bubbleArrow = $('<div>').addClass('jquery-slider__bubble-arrow').prependTo(this.bubble);

      // span elements
      this.thumbSpan = this.thumb.find('span').first();
      this.bubbleSpan = this.bubble.find('span').first();

      // size and scale elements
      if (this.bubbleFontScale !== 1) {
        this.bubble.css({
          'font-size': (parseFloat(this.bubble.css('font-size')) * this.bubbleFontScale) + 'px',
          'border-radius': (parseFloat(this.bubble.css('border-radius')) * this.bubbleFontScale) + 'px'
        });
        this.bubbleArrow.css({
          'width': (parseFloat(this.bubbleArrow.css('width')) * this.bubbleFontScale) + 'px',
          'height': (parseFloat(this.bubbleArrow.css('height')) * this.bubbleFontScale) + 'px'
        });
      }

      if (this.thumbScale !== 1) {
        this.thumb.css({
          'width': (parseFloat(this.thumb.css('width')) * this.thumbScale) + 'px',
          'height': (parseFloat(this.thumb.css('height')) * this.thumbScale) + 'px'
        });
      }

      if (this.thumbFontScale !== 1) {
        this.thumbSpan.css({
          'font-size': (parseFloat(this.thumbSpan.css('font-size')) * this.thumbFontScale) + 'px'
        });
      }

      if (this.trackScale !== 1) {
        this.minus.css({
          'width': Math.round(parseFloat(this.minus.css('width')) * this.trackScale) + 'px',
          'height': Math.round(parseFloat(this.minus.css('height')) * this.trackScale) + 'px',
          'font-size': Math.round(parseFloat(this.minus.css('font-size')) * this.trackScale) + 'px'
        });
        this.plus.css({
          'width': Math.round(parseFloat(this.plus.css('width')) * this.trackScale) + 'px',
          'height': Math.round(parseFloat(this.plus.css('height')) * this.trackScale) + 'px',
          'font-size': Math.round(parseFloat(this.plus.css('font-size')) * this.trackScale) + 'px'
        });
        this.track.css({
          'left': parseFloat(this.minus.outerWidth()) + (this.minus.outerWidth() * 0.2) + 'px',
          'right': parseFloat(this.plus.outerWidth()) + (this.plus.outerWidth()* 0.2) + 'px'
        });
      }

      // adjust margin spacing
      if ((this.bubbleFontScale !== 1) || (this.thumbScale !== 1) || (this.trackScale !== 1)) {
        const trackHeight = this.thumb.outerHeight() > this.plus.outerHeight() ? this.thumb.outerHeight() : this.plus.outerHeight();
        const bubbleHeight = this.bubble.outerHeight();
        this.slider.css({
          'margin': parseFloat(trackHeight) + parseFloat(bubbleHeight) + 'px auto'
        });
      }

      // colorize elements
      if (this.bubbleColor) {
        this.bubbleArrow.css('background', this.bubbleColor);
        this.bubble.css('background', this.bubbleColor);
      }
      if (this.bubbleFontColor) {
        this.bubbleSpan.css('color', this.bubbleFontColor);
      }
      if (this.thumbColor) {
        this.minus.css('color', this.thumbColor);
        this.plus.css('color', this.thumbColor);
        this.thumb.css('background', this.thumbColor);
      }
      if (this.thumbFontColor) {
        this.thumbSpan.css('color', this.thumbFontColor);
      }
      if (this.trackColor) {
        this.minus.css('border-color', this.trackColor);
        this.plus.css('border-color', this.trackColor);
        this.track.css('background', this.trackColor);
      }

      // other initial settings
      this.dragging = false;
      this.thumbOffset = this.thumb.outerWidth() / 2;

      // set number value and thumb position
      this.setValue(this.value);
      this.positionThumb(this.value);

      // set initial bubble state
      if (this.toggleBubble && (this.value.toString().length <= this.toggleLimit)) {
        this.bubble.hide();
        this.thumbSpan.show();
      } else {
        this.thumbSpan.hide();
      }

      // disables default touch actions for IE on thumb
      this.thumb.css('-ms-touch-action', 'none');

      // thumb events (mouse and touch)
      this.thumb.on('mousedown touchstart', (event) => {
        if (!this.dragging) {
          event.preventDefault();
          this.dragging = true;
          this.bubbleState(true);
        }
      });

      $('html')
        .on('mousemove touchmove', (event) => {
          if (this.dragging) {
            event.preventDefault();
            if (event.type === 'touchmove') {
              this.dragThumb(event.originalEvent.touches[0].pageX);
            } else {
              this.dragThumb(event.originalEvent.pageX);
            }
          }
        }).on('mouseup touchend', (event) => {
          if (this.dragging) {
            event.preventDefault();
            this.dragging = false;
            this.bubbleState(false);
          }
      });

      // minus button
      this.minus.on('click', (event) => {
        event.preventDefault();
        let newValue = this.value - this.step;
        newValue = Math.max(this.min, newValue);
        this.setValue(newValue);
        this.positionThumb(newValue);
      });

      // plus button
      this.plus.on('click', (event) => {
        event.preventDefault();
        let newValue = this.value + this.step;
        newValue = Math.min(this.max, newValue);
        this.setValue(newValue);
        this.positionThumb(newValue);
      });

      // adjust for window resize
      $(window).on('resize onorientationchange', () => {
        this.positionThumb(this.value);
      });
    }

    // drag slider thumb
    dragThumb(pageX) {
      const minPosition = this.track.offset().left + this.thumbOffset;
      const maxPosition = (this.track.offset().left + this.track.innerWidth()) - this.thumbOffset;

      // find new position for thumb
      let newPosition = Math.max(minPosition, pageX);
      newPosition = Math.min(maxPosition, newPosition);

      this.setValue(this.calcValue()); // set slider number

      // set the new thumb position
      this.thumb.offset({
        left: newPosition - this.thumbOffset
      });
    }

    // calculate value for slider
    calcValue() {
      const trackRatio = this.normalize(this.thumb.position().left, 0, this.track.innerWidth() - (this.thumbOffset * 2));
      return (trackRatio * (this.max - this.min)) + this.min;
    }

    // set new value for slider
    setValue(value) {
      this.value = (Math.round((value - this.min) / this.step) * this.step) + this.min; // find step value
      this.element.val(this.value); // update hidden input number
      const modValue = this.prefix + this.addCommas(this.value.toFixed(this.decimals)) + this.postfix; // modified number value
      this.thumbSpan.text(modValue); // update thumb number
      return this.bubbleSpan.text(modValue); // update bubble number
    }

    // position the thumb
    positionThumb(value) {
      const thumbRatio = this.normalize(value, this.min, this.max);
      // set the new thumb position
      this.thumb.offset({
        left: Math.round((thumbRatio * (this.track.innerWidth() - (this.thumbOffset * 2))) + this.track.offset().left)
      });
    }

    // toggle bubble on or off
    bubbleState(state) {
      if (this.toggleBubble) {
        if (state) {
          this.bubble.stop(true, true).fadeIn(300);
          this.thumbSpan.stop(true, true).fadeOut(200);
        } else if (this.value.toString().length <= this.toggleLimit) {
          this.bubble.stop(true, true).fadeOut(300);
          this.thumbSpan.stop(true, true).fadeIn(200);
        }
      }
    }

    // normalize number scaled 0 - 1
    normalize(number, min, max) {
      return (number - min) / (max - min);
    }

    // add commas to number
    addCommas(num) {
      return num.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    }

    // remove commas from number
    removeCommas(num) {
      return num.toString().replace(/,/g, '');
    }
  }

  // jQuery plugin
  $.fn.slider = function(settings) {
    // default settings for plugin
    const defaults = {
      min: 0,
      max: 100,
      step: 1,
      value: 50,
      decimals: 0,
      prefix: '',
      postfix: '',
      toggleBubble: false,
      toggleLimit: 3,
      bubbleColor: '',
      bubbleFontScale: 1,
      bubbleFontColor: '',
      thumbScale: 1,
      thumbColor: '',
      thumbFontScale: 1,
      thumbFontColor: '',
      trackScale: 1,
      trackColor: ''
    };

    // merge defaults with user defaults and settings
    const merged = $.extend({}, defaults, $.fn.slider.defaults, settings);

    // instantiate class instance
    return new Slider($(this), merged);
  };

  // execute code
  $(function() {
    // attach to elements with class name
    $('.jquery-slider').each(function() {
      $(this).slider();
    });
  });
}(jQuery);
