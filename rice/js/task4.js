"use strict";
function Observer (data,parent, parentKey) {
  //暂不考虑数组
  this.data = data;
  this.parent = parent;
  this.parentKey = parentKey;
  this.makeObserver(data);
  this.eventsBus = new Event();
}

Observer.prototype.makeObserver = function (obj) {
  let val;
  for(let key in obj){
    if(obj.hasOwnProperty(key)){
      val = obj[key];
      //深度遍历
      if(typeof val === 'object'){
        new Observer(val,this,key);
      }
    }
    this.setterAndGetter(key, val);
  }
}

Observer.prototype.setterAndGetter = function (key, val) {
  let self = this;
  Object.defineProperty(this.data, key, {
    enumerable: true,
    configurable: true,
    get: function(){
      console.log('你访问了' + key);
      return val;
    },
    set: function(newVal){
      console.log('你设置了' + key);
      console.log('新的' + key + '=' + newVal);
      if (self.parent != null) { // 若有父类则会调用父类的监听事件
        self.parent.eventsBus.emit(self.parentKey, val, newVal); // 父类监听事件
      }
      //触发$watch函数
      self.eventsBus.emit(key, val, newVal);
       //如果newval是对象的话
      if(typeof newVal === 'object'){
        new Observer(val);
      }
     if (newVal === val) return;
      val = newVal
     
    }
  })
}



Observer.prototype.$watch = function(attr, callback){
  this.eventsBus.on(attr, callback);
}
//实现一个事件
function Event(){
  this.events = {};
}

Event.prototype.on = function(attr, callback){
  if(this.events[attr]){
    this.events[attr].push(callback);
  }else{
    this.events[attr] = [callback];
  }
}

Event.prototype.off = function(attr){
  for(let key in this.events){
    if(this.events.hasOwnProperty(key) && key === attr){
      delete this.events[key];
    }
  }
}

Event.prototype.emit = function(attr, ...arg){
  this.events[attr] && this.events[attr].forEach(function(item){
    item(...arg);
  })
}

function Compiler(options) {
    this.$el = options.el;
    this.vm = options.vm;
    if (this.$el) {
        this.$fragment = nodeToFragment(this.$el);
        this.compile(this.$fragment);
        this.$el.appendChild(this.$fragment);
    }
}

Compiler.prototype = {
    compile: function (node, scope) {
        var self = this;
        if (node.childNodes && node.childNodes.length) {
            [].slice.call(node.childNodes).forEach(function (child) {
                if (child.nodeType === 3) {
                    self.compileTextNode(child, scope);
                } else if (child.nodeType === 1) {
                    self.compileElementNode(child, scope);
                }
            });
        }
    },
    compileTextNode: function (node, scope) {
        var text = node.textContent.trim();
        if (!text) {
            return;
        }
        var exp = parseTextExp(text);
        scope = scope || this.vm;
        this.textHandler(node, scope, exp);
    },
    compileElementNode: function (node, scope) {
        // var attrs = node.attributes;
        var attrs = [].slice.call(node.attributes);
        var self = this;
        scope = scope || this.vm;
        // [].forEach.call(attrs, function (attr) { // attributes是动态的，会漏点某些属性
        attrs.forEach(function (attr) {
            var attrName = attr.name;
            var exp = attr.value;
            var dir = checkDirective(attrName);
            if (dir.type) {
                var handler = self[dir.type + 'Handler'].bind(self);  // 不要漏掉bind(this)，否则其内部this指向会出错
                handler && handler(node, scope, exp, dir.prop);
                node.removeAttribute(attrName);
            }
        });
    },
}

function parseTextExp(text) {
    var regText = /\{\{(.+?)\}\}/g;
    var pieces = text.split(regText);
    var matches = text.match(regText);
    var tokens = [];
    pieces.forEach(function (piece) {
        if (matches && matches.indexOf('{{' + piece + '}}') > -1) {    // 注意排除无{{}}的情况
            tokens.push(piece);
        } else if (piece) {
            tokens.push('`' + piece + '`');
        }
    });
    return tokens.join('+');
}