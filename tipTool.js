;(function(window, undefined){

    var document = window.document;

    function tipInstance(){
    	this.instanceCss = {};
    	this.tipContent = "";
    	this.newElement = null;
    }

    tipInstance.prototype = {
    	defaultCss : {
    		"position":"absolute",
            "top":"0",
            "left":"0",
            "display" : "inline-block",
            "*zoom" : "1",
            "*display" : "block",
        	"height" : "auto",
        	"width" : "auto",
        	"border" : "2px solid #18A307",
        	"z-index" : "99999999",
        	"text-align" : "center",
        	"padding" : "3px",
        	"white-space" : "nowrap",
        	"font-size" : "0.8em",
        	"font-weight" : "bold",
        	"color" : "red"
    	},
    	addedCss : {
    		"position" : "relative",
            "top" : "0",
            "left" : "0"
    	},
        showTip : function(targetE){//展示提示窗
            var  parent = targetE.parentNode;//找到需要添加tip元素的父元素

            if (parent.style.position == ""){//父级原来就有定位，则不添加
                operTool.addCss(parent, this.addedCss);//为需tip父级元素添加相对定位
            }

            this.newElement = document.createElement("span");//创建提示元素,并存放在对象中
            this.newElement.appendChild(this.tipContent);

            operTool.addCss(this.newElement, this.instanceCss);//给提示元素添加样式 进行绝对定位
            operTool.insertAfter(targetE, this.newElement);//将提示元素添加到目标元素之后
        },
        clearTip : function(target){
        	operTool.removeElement(target);
        },
        calPosition : function(target, ev){//计算提示窗定位的位置
            var mousePos = operTool.mouseCoords(ev);//取得当前鼠标的坐标

            var ePos = operTool.offset(target);//取得当前元素坐标

            this.instanceCss.top = mousePos.y - ePos.top + 10 + "px";
            this.instanceCss.left = mousePos.x - ePos.left + 10 + "px";
        },
        addEvent : function(target){//添加元素监听事件

        	var that = this;

        	operTool.addHandler(target,"mouseover",function(ev){
        		ev = ev || window.event;

                if (ev.stopPropagation ){//阻止冒泡
                	ev.stopPropagation();
                }else{
                	ev.cancelBubble = true;
                }

                that.calPosition(target, ev);
                that.showTip(target);
            });

        	operTool.addHandler(target,"mouseout", function(ev){
        		ev = ev || window.event;

                if (ev.stopPropagation ){//阻止冒泡
                	ev.stopPropagation();
                }else{
                	ev.cancelBubble = true;
                }
                that.clearTip(that.newElement);
            });

        	operTool.addHandler(target,"mousemove", function(ev){
        		ev = ev || window.event;

                if (ev.stopPropagation ){//阻止冒泡
                	ev.stopPropagation();
                }else{
                	ev.cancelBubble = true;
                }

                if (that.newElement != null){
                    that.calPosition(target, ev);
                    operTool.addCss(that.newElement, that.instanceCss);
                }
            });
        },
        tipBind : function(targetElement, tipContent, instanceCss){//插件入口函数，

            targetElement = targetElement[0] || targetElement;//兼容jQuery对象

            this.addEvent(targetElement);
            this.tipContent = document.createTextNode(tipContent);
            this.instanceCss = operTool.extend(this.defaultCss,instanceCss);
        }
    };

    //内部使用的工具对象
    var operTool = {
        insertAfter : function(targetElement, newElement){//在元素后插入一个兄弟元素
            var parent = targetElement.parentNode;//找到父亲节点

            var lastChild;
            if (parent.lastElementChild){
                lastChild = parent.lastElementChild;
            }else{
                lastChild = parent.lastChild;
            }
            if (lastChild == targetElement){
                parent.appendChild(newElement);
            }else{
                var nextElement;
                if (targetElement.nextElementSibling){
                    nextElement = targetElement.nextElementSibling;
                }else{
                    nextElement = targetElement.nextSibling;
                }
                parent.insertBefore(newElement, nextElement);
            }
        },
        addCss :function(element, cssObj){//为元素添加CSS样式
            if (cssObj instanceof Object ){
                for (var key in cssObj){
                    try{//避免用户传入的对象样式关键字错误
                        element.style[key] = cssObj[key];
                    }catch(err){
                        console.log(err.message);
                    }
                }
            }else{
                console.log("the second param of the function is not a object");
                return ;
            }

        },
        extend : function(obj1, obj2){//元素属性或者方法的扩展
            var obj = {};

            for (var i in obj1){
                if (obj1.hasOwnProperty(i)){
                    obj[i] = obj1[i];
                }
            }

            for (i in obj2){
                if (obj2.hasOwnProperty(i)){
                    obj[i] = obj2[i];
                }
            }

            return obj;
        },
        mouseCoords : function(ev){//获取鼠标位置
            if(ev.pageX || ev.pageY){
                return {x:ev.pageX, y:ev.pageY};
            }
            return {
                x:ev.clientX + document.body.scrollLeft - document.body.clientLeft,
                y:ev.clientY + document.body.scrollTop - document.body.clientTop
            };
        },
        offset : function(e){//获取一个元素距窗口顶部和左边的位置
            var distance = {"top":0,"left":0};

            distance.top = e.offsetTop;
            distance.left = e.offsetLeft;

            if (e.offsetParent != null){
                var dis = this.offset(e.offsetParent);
                distance.top += dis.top;
                distance.left += dis.left;
            }
            return distance;
        },
        removeElement : function(e){
            var parent = e.parentNode;
            if (!parent){
                return;
            }
            try{
                parent.removeChild(e);
            }catch(err){
                console.log(err.message);
            }
        },
        addHandler : function(ele, type, handler){
            if (ele.addEventListener){//主流浏览器，及ie9以上版本
                addHandler = function(ele, type, handler){
                    ele.addEventListener(type,handler,false);
                }
            }else{//ie8及以下浏览器
                addHandler = function(ele, type, handler){
                    ele.attachEvent("on"+type,handler);
                }
            }
            addHandler(ele, type, handler);
        }
    };

    var tipArray = [];

    window.tipTool = function(targetElement, tipContent, instanceCss){//外界访问提示插件的入口
    	tipArray[tipArray.length] = new tipInstance().tipBind(targetElement, tipContent, instanceCss);
    }

})(window);
