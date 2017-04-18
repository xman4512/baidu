"use strict";
var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!'
  }
});

var app2 = new Vue({
  el: '#app-2',
  data: {
    message: '页面加载于 ' + new Date()
  }
});

var app3 = new Vue({
  el: '#app-3',
  data: {
    seen: true
  }
});

var app4 = new Vue({
  el: '#app-4',
  data: {
    todos: [
      { text: '学习 JavaScript' },
      { text: '学习 Vue' },
      { text: '整个牛项目' }
    ]
  }
});

var app5 = new Vue({
	el:'#app-5',
	data:{
		message:'Hello VUE.JS'
	},
	methods:{
		reverseMessage:function () {
			this.message = this.message.split('').reverse().join('')
		}
	}
});

var app6 = new Vue({
	el:'#app-6',
	data:{
		message:'Hello VUE.JS',
		name:"名字"
	}
});

Vue.component('todo-item', {
  props: ['todo'],
  template: '<li>{{ todo.text }}</li>'
})
var app7 = new Vue({
  el: '#app-7',
  data: {
    groceryList: [
      { text: '蔬菜' },
      { text: '奶酪' },
      { text: '随便其他什么人吃的东西' }
    ]
  }
});


// 观察者构造函数
function Observer(data) {
    this.data = data;
    this.walk(data);
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
            

            // 这里进行判断，如果还没有遍历到最底层，继续new Observer
            if (typeof val === 'object') {
                new Observer(val);
            }

            this.convert(key, val);
        }
    }
};

p.convert = function (key, val) {
	//Object.defineProperty(obj, prop, descriptor)方法接收三个参数：需要添加或修改属性的对象，属性名称，属性描述options。
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
            if (newVal === val) return;
            val = newVal
        }
    })
};

let app11 = new Observer({
  name: 'youngwind',
  age: 25
});

let app21 = new Observer({
  university: 'bupt',
  major: 'computer'
});