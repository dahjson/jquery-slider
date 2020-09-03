# jQuery Slider

jQuery plugin for converting an input field into a range slider.

### Features

- Mobile, works with touch devices
- Responsive, adjusts on window resize
- Unobtrusive, normal input field fallback
- Defaults, all settings are optional
- Behaves like a normal input field
- Can add prefix and postfix to number
- Toggle mode available for bubble
- Easily customize color and scale

### Compatibility

Tested to work with the latest versions of Firefox, Chrome, Safari, Opera, and Edge.

## Setup

### CSS

Include the CSS stylesheet.

```html
<link href="dist/jquery.slider.css" rel="stylesheet">
```

### JavaScript

Include jQuery 1.7.1 or higher and the script.

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
<script src="dist/jquery.slider.js"></script>
```

## Usage

Add the *jquery-slider* class to any normal input field you want to convert into a slider. You can use the normal *min*, *max*, *step*, and *value* attributes to set custom values. Other values can also be set with *data-** attributes.

### Default Settings

```javascript
min: 0 //  minimum number
max: 100 // maximum number
step: 1 // increments between numbers
value: 50 // starting number
decimals: 0 // number of decimals to display
prefix: '' // add a prefix to the number
postfix: '' // add a prefix to the number
toggleBubble: false // enables toggle mode on bubble
toggleLimit: 3 // limits length of number for toggle
bubbleColor: '' // background color of bubble
bubbleFontScale: 1 // font size of bubble number
bubbleFontColor: '' // font color of bubble number
thumbScale: 1 // scale of thumb
thumbColor: '' // color of thumb, minus, and plus buttons
thumbFontScale: 1 // font size of thumb number
thumbFontColor: '' // font color of thumb number
trackScale: 1 // scale of track buttons
trackColor: '' // color of track outline
```

### Examples

Easily setup custom global defaults.

```html
<script>
$.fn.slider.defaults = {
  decimals: 2,
  toggleBubble: true
};
</script>
```

Setup using CSS class.

```html
<input class="jquery-slider"
  name="example"
  placeholder="0 - 10"
  type="number"
  min="1"
  max="10"
  data-prefix="$"
  data-toggle-bubble="true">
```

Setup without using CSS class.

```html
<input id="example">
<script>$("#example").slider({min: 1, max: 10})</script>
```

Easily style the generated HTML with CSS.

```html
<div class="jquery-slider__wrap">
  <div class="jquery-slider__minus"><span>-</span></div>
  <div class="jquery-slider__plus"><span>+</span></div>
  <div class="jquery-slider__track">
    <div class="jquery-slider__thumb">
      <span>0</span>
      <div class="jquery-slider__bubble">
        <div class="jquery-slider__bubble-arrow"></div>
        <span>0</span>
      </div>
    </div>
  </div>
</div>
```
