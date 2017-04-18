"use strict";
// 观察者构造函数
function Observer(data) {
    this.data = data;
    this.walk(data);
    this.$p = Array.prototype.slice.call(arguments,1)[0] || 'data'; // 实现事件冒泡储存父级 名字
    //console.log(this.$p);
    this.eventsBus = new Event();
}

let p = Observer.prototype;

// 此函数用于深层次遍历对象的各个属性
// 采用的是递归的思路
// 因为我们要为对象的每一个属性绑定getter和setter
p.walk = function (obj) {
    let val;
    for (let key in obj) {
        // 这里为什么要用hasOwnProperty进行过滤呢？
        // 因为for...in 循环会把对象原型链上的所有可枚举属性都循环出来
        // 而我们想要的仅仅是这个对象本身拥有的属性，所以要这么做。
        if (obj.hasOwnProperty(key)) {
            val = obj[key];
            console.log(key);
            // 这里进行判断，如果还没有遍历到最底层，继续new Observer
            if (typeof val === 'object') {
                new Observer(val);
            }
        }
         this.convert(key, val);
    }
};

p.convert = function (key, val) {
	//Object.defineProperty(obj, prop, descriptor)方法接收三个参数：需要添加或修改属性的对象，属性名称，属性描述options。
  let _this = this;
    Object.defineProperty(this.data, key, {
        enumerable: true,
        configurable: true,
        get: function () {
            console.log('你访问了' + key);
            return val
        },
        set: function (newVal) {
            console.log('你设置了' + key);
            console.log('新的' + key + ' = ' + newVal)
            //触发$watch函数
             _this.eventsBus.emit(key, val, newVal);
            if (newVal === val) return;

            val = newVal

            if (typeof newVal === 'object') {
                new Observer(newVal);
            }
        }
    })
};
p.$watch = function (attr,callback) {

  this.eventsBus.on(attr,callback);
}
function Event() {
  this.events = {};
}
Event.prototype.on = function (attr,callback) {

  if (this.events[attr]) {
    
    this.events[attr].push(callback);

     
  }else{
    this.events[attr] = [callback];
  }
}
Event.prototype.off = function (attr) {
  for(let key in this.events){
    if (this.events.hasOwnProperty(key) && key === attr) {
      delete this.events[key];
    }
  }
}
Event.prototype.emit = function (attr,...arg) {
  //console.log(attr);
  this.events[attr] && this.events[attr].forEach(function (item) {
    item(...arg);
  }) 
//console.log(this,"分割",this.events[attr]);
}
 let app1 = new Observer({
         name: {
                lastName: 'liang',
                firstName: 'shaofeng'
         },
         age: 25
 });

app1.$watch('age', function(oldVal, newVal){
    console.log(`我的年龄变了，原来是: ${oldVal}岁，现在是：${newVal}岁了`)
})

app1.$watch('name', function(oldVal, newVal){
    console.log(`我的年龄真的变了诶，竟然年轻了${oldVal - newVal}岁`)
})

let app2 = new Observer({
    name: {
        firstName: 'shaofeng',
        lastName: 'liang'
    },
    age: 25
});

app2.$watch('name', function (newName) {
    console.log('我的姓名发生了变化，可能是姓氏变了，也可能是名字变了。')
});