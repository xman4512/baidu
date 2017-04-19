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
let app = new Observer({
    name: {
        firstName:"nihao",
        lastName:"zaijian"
    },
    age: 25,
    company: 'Qihoo 360',
    address: 'Chaoyang, Beijing'
})

app.$watch('age', function(oldVal, newVal){
    console.log(`我的年龄变了，原来是: ${oldVal}岁，现在是：${newVal}岁了`)
})

app.$watch('name', function (newName) {
    console.log('我的姓名发生了变化，可能是姓氏变了，也可能是名字变了。')
});

app.data.name.firstName = 'hahaha';
