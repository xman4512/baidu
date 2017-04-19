function Observer(data, parent, parentKey) {
  this.parent = parent
  this.parentKey = parentKey
  //console.log(this.parent,this.parentKey);
  this.data = data;
  this.watch = {}; // 所有变化监听事件
  this.walk(data)
}
let p = Observer.prototype;
p.walk = function(obj) {
  for (let key in obj) {
    val = obj[key];
    this.convert(key, val);
    //console.log(this,key,val)
    if (typeof val === 'object') {
      new Observer(val, this, key)
    }
  }
}
p.convert = function(key, val) {
  this.$watch(key, function(newVal){ // 为每个值设置一个监听事件
    console.log(`你设置了 ${key}, 新的值为${newVal}`);
  })
  var self = this;// *获取上下文
  Object.defineProperty(this.data, key, {
    enumerable: true,
    configurable: true,
    get: function() {
      console.log(`你访问了 ${key}`);
      return val
    },
    set: function(newVal) {
      if (self.parent != null) { // 若有父类则会调用父类的监听事件
        self.parent.watch[self.parentKey](newVal) // 父类监听事件
      }
      self.watch[key](newVal) // 回调监听 取代下面那条语句
      //console.log(`你设置了 ${key}, 新的值为${newVal}`);
      if (typeof newVal === 'object') {
        new Observer(newVal)
      }
      if (newVal === val) return;
      val = newVal
    }
  })
};
p.$watch = function (key, callback) {
  this.watch[key] = callback
}

/**
 * 测试代码
 */
let app = new Observer({
  name: {
    firstName: 'wenjun',
    lastName: 'dai'
  },
  location: {
    provinces: '浙江省',
    city: '温州市'
  },
  age: 25
});
app.data.name.firstName = 'wj';
app.data.name.lastName = 'd';

app.$watch('name', function (newName) {
    console.log('我的姓名发生了变化，可能是姓氏变了，也可能是名字变了。')
});
app.$watch('age', function(age) {
         console.log(`我的年纪变了，现在已经是：${age}岁了`)
 });
app.data.age = 100;
app.data.name.firstName = 'hahaha';
// 输出：我的姓名发生了变化，可能是姓氏变了，也可能是名字变了。
app.data.name.lastName = 'blablabla';
// 输出：我的姓名发生了变化，可能是姓氏变了，也可能是名字变了。
