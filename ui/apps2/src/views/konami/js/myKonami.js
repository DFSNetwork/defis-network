/**
 * 
 * @param {*} keys
 * eg. {
 *  pc: '38384040373937396665',
 *  apps: ["UP", "UP", "DOWN", "DOWN", "LEFT", "RIGHT", "LEFT", "RIGHT", "TAP", "TAP"]
 * }
 * @param {*} callback 
 */
var Konami = function (keys, callback) {
  var konami = {
      addEvent: function (obj, type, fn, ref_obj) {
        if (obj.addEventListener)
          obj.addEventListener(type, fn, false);
        else if (obj.attachEvent) {
          // IE
          obj["e" + type + fn] = fn;
          obj[type + fn] = function () {
            obj["e" + type + fn](window.event, ref_obj);
          }
          obj.attachEvent("on" + type, obj[type + fn]);
        }
      },
      removeEvent: function (obj, eventName, eventCallback) {
          if (obj.removeEventListener) {
              obj.removeEventListener(eventName, eventCallback);
          } else if (obj.attachEvent) {
              obj.detachEvent(eventName);
          }
      },
      input: "",
      pattern: keys.pc,
      keydownHandler: function (e, ref_obj) {
        if (ref_obj) {
          konami = ref_obj;
        } // IE
        const isEnter = (e ? e.keyCode : event.keyCode) == '13';
        // console.log(isEnter, e ? e.keyCode : event.keyCode)
        if (isEnter) {
          const hasPattern = konami.pattern.findIndex(v => v === konami.input)
          if (hasPattern === -1) {
            konami.input = '';
            return false
          }
          if (hasPattern !== -1) {
            konami.code(hasPattern);
            konami.input = '';
            e.preventDefault();
            return false;
          }
        }
        konami.input += e ? e.keyCode : event.keyCode;
        if (konami.input > 100) {
          konami.input = e ? e.keyCode : event.keyCode;
        }
      },
      load: function (link) {
        this._currentLink = link;
        this.addEvent(document, "keydown", this.keydownHandler, this);
        this.iphone.load(link);
      },
      unload: function () {
          this.removeEvent(document, 'keydown', this.keydownHandler);
          this.iphone.unload();
      },
      code: function (link) {
          window.location = link
      },
      iphone: {
          start_x: 0,
          start_y: 0,
          stop_x: 0,
          stop_y: 0,
          tap: false,
          capture: false,
          orig_keys: "",
          keys: keys.apps,
          input: [],
          timer: null, // 定时器 - 3S内完成操作。否则，清空操作记录
          code: function (link) {
            konami.code(link);
          },
          touchmoveHandler: function (e) {
            if (e.touches.length === 1 && konami.iphone.capture === true) {
              var touch = e.touches[0];
              konami.iphone.stop_x = touch.pageX;
              konami.iphone.stop_y = touch.pageY;
              konami.iphone.tap = false;
              konami.iphone.capture = false;
              // konami.iphone.check_direction();
            }
          },
          touchendHandler: function () {
            const tIpt = konami.iphone.check_direction();
            // if (tIpt === 'TAP') {
            //   const iptLast = konami.iphone.input[konami.iphone.input.length - 1];
            //   // console.log(iptLast)
            //   if (iptLast === tIpt || !iptLast) {
            //     // const thisIpt = konami.iphone.input.join(',');
            //     // console.log(thisIpt)
            //     const index = konami.iphone.keys.findIndex(v => {
            //       const ipt = konami.iphone.input
            //       const vIpt = ipt.slice(ipt.length - v.length);
            //       return v.join(',') === vIpt.join(',');
            //     });
            //     if (index === -1) {
            //       konami.iphone.input = []
            //     } else {
            //       konami.iphone.code(index);
            //       konami.iphone.input = []
            //     }
            //     return
            //   }
            // }
            konami.iphone.input.push(tIpt);
            if (konami.iphone.input.length > 20) konami.iphone.input.shift();
            // console.log(konami.iphone.input)
            const index = konami.iphone.keys.findIndex(v => {
              const ipt = konami.iphone.input
              const vIpt = ipt.slice(ipt.length - v.length);
              return v.join(',') === vIpt.join(',');
            });
            if (index !== -1) {
              konami.iphone.code(index);
              konami.iphone.input = []
            }
            clearTimeout(konami.iphone.timer);
            konami.iphone.timer = setTimeout(() => {
              konami.iphone.input = []
            }, 3000);
          },
          touchstartHandler: function (e) {
            konami.iphone.start_x = e.changedTouches[0].pageX;
            konami.iphone.start_y = e.changedTouches[0].pageY;
            konami.iphone.tap = true;
            konami.iphone.capture = true;
          },
          load: function () {
            this.orig_keys = this.keys;
            konami.addEvent(document, "touchmove", this.touchmoveHandler);
            konami.addEvent(document, "touchend", this.touchendHandler, false);
            konami.addEvent(document, "touchstart", this.touchstartHandler);
          },
          unload: function () {
            konami.removeEvent(document, 'touchmove', this.touchmoveHandler);
            konami.removeEvent(document, 'touchend', this.touchendHandler);
            konami.removeEvent(document, 'touchstart', this.touchstartHandler);
          },
          check_direction: function () {
            let x_magnitude = Math.abs(this.start_x - this.stop_x);
            let y_magnitude = Math.abs(this.start_y - this.stop_y);
            let x = ((this.start_x - this.stop_x) < 0) ? "RIGHT" : "LEFT";
            let y = ((this.start_y - this.stop_y) < 0) ? "DOWN" : "UP";
            let result = (x_magnitude > y_magnitude) ? x : y;
            result = (this.tap === true) ? "TAP" : result;
            // console.log(result)
            return result;
          }
      }
  }

  typeof callback === "string" && konami.load(callback);
  if (typeof callback === "function") {
      konami.code = callback;
      konami.load();
  }

  return konami;
};


if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = Konami;
} else {
  window.Konami = Konami;
}
