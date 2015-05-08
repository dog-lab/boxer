// jscs:disable validateLineBreaks
// jscs:enable validateLineBreaks
/*jshint unused:false*/
//noinspection JSUnusedGlobalSymbols
var Boxer = (
  function(selector, options) {
    'use strict';

    var _clearedChoice;
    var _dialog;
    var _errorChoice;
    var _infoChoice;
    var _onClose;
    var _okChoice;
    var _timerMillis;
    var _wrapper;

    /**
     * Create a minimal dialog with display control elements and message display area inserted
     * in the passed in selector element
     *
     * @param selector
     * @returns {Element|*}
     * @private
     */
    function _build(selector) {
      selector = selector || '.boxer';
      var firstChar = selector[0];

      _wrapper = document.createElement(
        (
        firstChar === '.' || firstChar === '#'
        ) ? 'div' : selector
      );

      if (firstChar === '.') {
        _wrapper.className = selector.slice(1);
      } else if (firstChar === '#') {
        _wrapper.setAttribute('id', selector.slice(1));
      }

      _wrapper.appendChild(_createRadio('bxr-hidden-control bxr-cleared', 'bxr-type', 'none'));
      _wrapper.appendChild(_createRadio('bxr-hidden-control bxr-error', 'bxr-type', 'error'));
      _wrapper.appendChild(_createRadio('bxr-hidden-control bxr-info', 'bxr-type', 'info'));
      _wrapper.appendChild(_createRadio('bxr-hidden-control bxr-ok', 'bxr-type', 'ok'));

      var div = _createDiv('bxr-dialog');
      div.appendChild(_createDiv('bxr-content'));
      _wrapper.appendChild(div);

      return _wrapper;
    }

    /**
     * Create a div element with an attached class.
     *
     * @param className
     * @returns {Element|*}
     * @private
     */
    function _createDiv(className) {
      var div = document.createElement('div');
      div.className = className;

      return div;
    }

    /**
     * Create a radio button with an attached class.
     *
     * @param className
     * @param name
     * @param value
     * @returns {Element|*}
     * @private
     */
    function _createRadio(className, name, value) {
      var radio = document.createElement('input');

      radio.className = className;
      radio.name = name;
      radio.type = 'radio';
      radio.value = value;

      return radio;
    }

    /**
     * Get the x/y coordinates needed to center the dialog in the viewport.
     *
     * @returns {{}}
     * @private
     */
    function _getCenter() {
      var coordinates = {};
      var scroll = _getScroll();
      // http://javascript.info/tutorial/coordinates ... may want to look at this for more acccurate calcs
      coordinates.x =
        (
        (
        document.documentElement.clientWidth - _dialog.clientWidth
        ) / 2
        ) + scroll.x;

      coordinates.y =
        (
        (
        document.documentElement.clientHeight - _dialog.clientHeight
        ) / 2
        ) + scroll.y;

      return coordinates;
    }

    /* from http://www.greywyvern.com/?post=331 */
    /**
     * Gets the scroll coordinates of the html page.
     *
     * @returns {*}
     * @private
     */
    function _getScroll() {
      var html = document.getElementsByTagName('html')[0];

      if (html.scrollTop && document.documentElement.scrollTop) {
        return { x: html.scrollLeft, y: html.scrollTop };
      } else if (html.scrollTop || document.documentElement.scrollTop) {
        return {
          x: html.scrollLeft + document.documentElement.scrollLeft,
          y: html.scrollTop + document.documentElement.scrollTop
        };
      } else if (document.body.scrollTop) {
        return { x: document.body.scrollLeft, y: document.body.scrollTop };
      }

      return {x: 0, y: 0};
    }

    /**
     * Initialize the dialog:
     *  - create the dialog div wrapper if necessary
     *  - and, get the initial values of the display control radios
     *
     * @param selector
     * @param options
     * @private
     */
    function _init(selector, options) {
      _wrapper = document.querySelector(selector);

      if (!_wrapper) {
        document.body.appendChild(_build(selector));
        _wrapper = document.querySelector(selector);
      }

      _dialog = _wrapper.querySelector('.bxr-dialog');

      if (!_dialog) {
        return;
      }

      _clearedChoice = _wrapper.querySelector('.bxr-cleared');
      _errorChoice = _wrapper.querySelector('.bxr-error');
      _infoChoice = _wrapper.querySelector('.bxr-info');
      _okChoice = _dialog.querySelector('.bxr-ok');

      if (options) {
        if (options['is-cleared']) {
          _wrapper.querySelector('.bxr-cleared').checked = 'checked';
        }

        if (options['is-error']) {
          _wrapper.querySelector('.bxr-error').checked = 'checked';
        }

        if (options['is-info']) {
          _wrapper.querySelector('.bxr-info').checked = 'checked';
        }

        if (options['is-ok']) {
          _wrapper.querySelector('.bxr-ok').checked = 'checked';
        }

        if (options['on-close']) {
          _onClose = options['on-close'];
        }
      }
    }

    /**
     * Adds HTML content to the dialog body.
     *
     * @param content
     */
    function appendContent(content) {
      _dialog.querySelector('.bxr-content').innerHTML += content;
    }

    /**
     * Adds HTML Node(s) (DOM) to the dialog body.
     *
     * @param htmlNode
     */
    function appendNode(htmlNode) {
      _dialog.querySelector('.bxr-content').appendChild(htmlNode);
    }

    /**
     * Closes (hides) the dialog.
     */
    function close() {
      _wrapper.style.display = 'none';

      if (_onClose) {
        _onClose();
      }
    }

    /**
     * Sets the dialog to show an Error state.
     *
     * @param value
     */
    function isError(value) {
      if (value) {
        _errorChoice.setAttribute('checked', 'checked');
      } else {
        _clearedChoice.setAttribute('checked', 'checked');
      }
    }

    /**
     * Sets the dialog to show an Information/General state.
     *
     * @param value
     */
    function isInfo(value) {
      if (value) {
        _infoChoice.setAttribute('checked', 'checked');
      } else {
        _clearedChoice.setAttribute('checked', 'checked');
      }
    }

    /**
     * Sets the dialog to show an OK state.
     *
     * @param value
     */
    function isOk(value) {
      if (value) {
        _okChoice.setAttribute('checked', 'checked');
      } else {
        _clearedChoice.setAttribute('checked', 'checked');
      }
    }

    /**
     * Assigns the passed in callback function to the
     * close event of the dialog.
     *
     * @param callback
     */
    function onClose(callback) {
      _onClose = callback;
    }

    /**
     * Replaces any existing dialog body HTML with
     * the passed in content.
     *
     * @param content
     */
    function setContent(content) {
      _dialog.querySelector('.bxr-content').innerHTML = content;
    }

    /**
     * Sets the number of milliseconds to show the dialog.
     * If the passed in value is zero then no timed
     * closing occurs.
     *
     * @param millis
     */
    function setTimeout(millis) {
      _timerMillis = millis;
    }

    /**
     * Yep...displays the dialog...
     * In this version, the dialog is displayed in the center
     * of the page.
     */
    function show() {
      var centerCoordinates;

      if (!_dialog) {
        return;
      }

      _wrapper.style.display = 'block';
      centerCoordinates = _getCenter();

      _wrapper.style.left = centerCoordinates.x + 'px';
      _wrapper.style.top = centerCoordinates.y + 'px';

      if (_timerMillis > 0) {
        window.setTimeout(close, _timerMillis);
      }
    }

    _init(selector, options);

    return {
      appendContent: appendContent,
      appendNode: appendNode,
      close: close,
      isError: isError,
      isInfo: isInfo,
      isOk: isOk,
      onClose: onClose,
      setContent: setContent,
      setTimeout: setTimeout,
      show: show
    };
  }
);

