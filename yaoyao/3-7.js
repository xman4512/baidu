(function (window, undefined) {
	/*获取css的办法*/
	/*var getCss = function (obj, attribute) {
        if (obj.currentStyle) {//只有IE支持currentStyle，先判断是否是IE浏览器。IE8及以下不认opacity，IE9及以上、FF和Chrome可以使用opacity。filter: alpha(opacity=30)属性IE10及以上、FF和Chrome都不认识。IE9及以下支持
            return obj.currentStyle[attribute];//是IE浏览器则返回当前元素的对应属性的值
        } else {
            return getComputedStyle(obj, false)[attribute];//IE9及以上或者非IE浏览器例如FF和Chrome支持getComputedStyle
        }
    	};*/
    	/*test() 方法用于检测一个字符串是否匹配某个模式.*/
		function getid(id) {
            return /#/.test(id) ? document.querySelector(id) : document.getElementById(id);
        }
       function getclass(classname) {
            return /./.test(classname) ? document.querySelector(classname) : document.getElementsByClassName(classname)[0];
        }




		function SortTable (param) {
			return new SortTable.prototype.init(param);
		}

		SortTable.prototype={
			init:function (param) {
					this.title = param.title;
					this.isSortable = param.isSortable;
					this.message = param.message;
					this.createTable();
					var table = getclass(".sort-table");
					var that = this;
					table.addEventListener("click",function (event){
					 	event = event || window.event;
            			var target = event.target || event.srcElement;
            			if (target&&target.tagName == "SPAN") {
						var index = target.dataset.index;
						var method = /asc/.test(target.className)?"asc":"desc";
						console.log(method,index);
						that.sort(index, method);
                		that.updateTable(table);
						}
					});
				},
				createTable:function(){
					var tableBox = document.getElementById('tableBox')
					if (!tableBox) {
                		console.warn("请创建表格包含块：<section class='tableBox' id='tableBox'></section>");
               		 		return;
           		 		}
           		 	var table = document.createElement("table");
           		 	table.className = "sort-table"
           		 	var tbody = document.createElement("tbody");
           		 	
           		 	/*添加头部标题*/
           		 	var tr_head = document.createElement("tr");
           		 	for (var i = 0; i < this.title.length; i++) {
           		 		var th = document.createElement("th");
           		 		var p = document.createElement("p")
           		 		p.innerHTML = this.title[i];
           		 		if (this.isSortable[i]) {
           		 			var span_asc = document.createElement("span");
           		 			span_asc.className = "icon icon-asc";
           		 			var span_desc = document.createElement("span");
           		 			span_desc.className = "icon icon-desc";
           		 			span_asc.dataset.index = i;
           		 			span_desc.dataset.index = i;
           		 			span_asc.innerHTML = "↑"
           		 			span_desc.innerHTML = "↓"
           		 			th.appendChild(span_asc);
           		 			th.appendChild(span_desc)
           		 		}
           		 		th.appendChild(p);
           		 		tr_head.appendChild(th);
           		 	}
           		 	tbody.appendChild(tr_head);
           		 	/*添加数据*/
           		 	for (var i = 0; i < this.message.length; i++) {
           		 		var tr = document.createElement("tr");
           		 		for (var j = 0; j < this.message[i].length; j++) {
           		 			var td = document.createElement("td");
           		 			td.innerHTML = this.message[i][j];
           		 			tr.appendChild(td);
           		 		}
           		 		tbody.appendChild(tr);
           		 	}
           		 	table.appendChild(tbody);
           		 	tableBox.appendChild(table);
				},
				sort:function (index,method) {
					if (method == "asc") {
						this.message.sort(function (a,b) {
							console.log("a-b")
							return a[index] - b[index];
						});
					}else{
						this.message.sort(function (a,b) {
							console.log("b-a")
							return b[index] - a[index];
						});
					}
				},
				updateTable:function (target) {
					var arrTd = target.getElementsByTagName('td');
					index = 0;
					for (var i = 0; i < this.message.length; i++) {
						for (var j = 0; j < this.message[i].length; j++) {
							arrTd[index++].innerHTML = this.message[i][j];
						}
					}
				}
			};
	SortTable.prototype.init.prototype = SortTable.prototype;
	window.SortTable = SortTable;
})(window, undefined);