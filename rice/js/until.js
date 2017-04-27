(function (window, undefined) {
	var until = {
	/*
	跨浏览器的事件事件处理
	*/
	addHandle:function(element, type, handler){
		if (element.addEventListener) {
			element.addEventListener(type, handler, false);
		} else if (element.attachEvent) {
			element.attachEvent("on" + type,handler);
		}else{
			element["on" + type] = handler;
		}
	},
	removeHandler:function(element, type, handler) {
		if (element.removeEventListener) {
			element.removeEventListener(type, handler, false)
		}else if (element.detachEvent) {
			element.detachEvent("on" + type, handler)
		}else{
			element["on" + type] = null;
		}
	},
	/*
	跨浏览器的事件对象
	*/
	getEvent: function (event) {
		return event ? event : window.event;
	},
	getTarget: function (event) {
		return event.target || event.scrElement; 
	},
	preventDefault: function (event) {
		if (event.preventDefault) {
			event.preventDefault();
		}else{
			event.returnValue = false;
		}
	},
	stopPropagetion: function (event) {
		if (event.stopPropagetion) {
			event.stopPropagetion();
		}else{
			event.cancelBubble = true;
		}
	},
	/*
	mouseover和mouseout
	的event对象获取  relatedTarget
	*/
	getRelatedTarget: function (event) {
		if (event.relatedTarget) {
			return event.relatedRarget;
		}else if (event.toElement) {
			return event.toElement;
		}else if (event.fromElement) {
			return event.fromElement;
		}else{
			return null;
		}
	},
	/*
	js高级编程 374页 获得鼠标按钮DOM下的button 0表示主鼠标 1表示中间鼠标 2表示次鼠标
	ie8及以前版本
	0：表示没有按下按钮
	1：表示按下了主鼠标
	2：按下次鼠标
	3：表示同时按下主 次鼠标
	4：表示按下中间鼠标
	5：表示同时按下了主，中间鼠标
	6：表示同时按下次中间鼠标
	7表示同时按下3个鼠标
	*/
	getButton: function () {
		if (document.implementation.hasFeature("MuseEvents", "2.0")) {
			return event.button;
		}else{
			switch(event.button){
				case 0:
				case 1:
				case 3:
				case 5:
				case 7:
					return 0;
				case 2:
				case 6:
					return 2;
				case 4:
					return 1;
			}
		}
	},
	/*
	鼠标滚轮滚动事件
	wheelDalta是向前滚动120的倍数，向后滚动是-120的倍数
	*/
	getWheelDelta: function (event) {
		if (event.wheelDelta) {
			return (client.engine.opera && client.engine.opera < 9.5 ?   //Opera9.5版本之前的wheelDelta的值的正负号颠倒
				-event.wheelDalta : event.wheelDelta);
		}else{
			return -event.detail * 40;     //Firefox的DOMMouseSCroll的detail
		}
	},
	/*
	键盘 按键字符编码
	*/
	getCharCode: function (event) {
		if (typeof event.charCode == "number") {
			return event.charCode;
		}	else{
			return event.keyCode;
		}
	},
	setTimeout:function(fun, delay) {
    if(typeof fun == 'function'){
      var argu = Array.prototype.slice.call(arguments,2);
       var f = (function(){
      fun.apply(null, argu);
      }
    );
     return window.setTimeout(f, delay);
   }
   return window.setTimeout(fun,delay);
}
};
	window.until = until;
})(window, undefined);