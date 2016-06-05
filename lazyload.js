// 图片懒加载
// 图片懒加载：对图片不一次全部加载完成，而是在达到一定条件下在加载，实现延迟加载，有效的减轻服务端的压力
// 曾文彬

'use strict';

~function (factory) {
    // 解决在严格模式下，普通函数调用this不为window的问题
    var root = (0, eval)('this');
    root.LazyLoad = factory(root);
}(function (root) {
    var doc = root.document;
    var isIE8Under = typeof execScript === 'object' ? true : false;
    var viewportHeight = document.documentElement.clientHeight;
    var __LAZYLOAD_TIMELINE__ = 30;

    function LazyLoad (selector, options) {
        options || (options = {});

        this.pageNum = 1;
        this.tag = options.tag || 'data-src';
        this.elements = this.constructor.query(selector);
           
        this.init();
    }

    LazyLoad.prototype.init = function () {
        var self = this;

        // 初始化检测并加载
        this.loading();

        // 绑定window scroll事件
        this.constructor.bindScrollEvent(function () {
            self.loading();
        });
    };
    
    /*
     * 检测加载元素是否和当前视觉窗口相交
    */
    LazyLoad.prototype.detect = function (element) {
        var viewportRect = this.constructor.getViewportRect();
        var viewportRectTop = viewportRect.top;
        var viewportRectHeight = parseInt(viewportRect.height / 2);
        var viewportRectCenter = viewportRect.top + viewportRectHeight;
        var elementRect = element.getBoundingClientRect();
        var elementRectTop = elementRect.top;
        var elementRectHeight = parseInt(elementRect.height / 2);
        var elementRectCenter = elementRect.top + elementRectHeight;

        // 显示窗口中心位置和元素中心位置如果是相交或相切这个条件，那么开始加载该元素
        // 显示窗口和元素中心之间的距离大于他们的半宽之和 
        return Math.abs(viewportRectCenter - elementRectCenter) <= viewportRectHeight + elementRectHeight;
    };

    LazyLoad.prototype.loading = function () {
        for (var i = 0, element, length = this.elements.length; i < length; i++) {
            element = this.elements[i];
            
            if (this.detect(element)) {
                this.loadImage(element);
                this.elements.splice(i, 1);
                i--;
                length--;
            }     
        }                    
    };

    LazyLoad.prototype.loadImage = function (element) {
        var imageElements = element.getElementsByTagName('img');
        var i = 0;
        var length = imageElements.length, src, imageElement;
        
        for (; i < length; i++) {
            imageElement = imageElements[i];
            src = imageElement.getAttribute(this.tag); 
            src && imageElement.setAttribute('src', src);       
        }
                        
    };

    /* LazyLoad静态方法 */
    LazyLoad.bindScrollEvent = function (callback) {
        var eventName = isIE8Under ? 'onscroll' : 'scroll';
        var action = isIE8Under ? 'attachEvent' : 'addEventListener';

        root[action](eventName, callback, false);
    };

    /**
     * 拷贝对象属性复制到LazyLoad实例中
     *
     * @param {String} propertys 属性(,号分隔)
     * @param {Object} object 拷贝对象
     */
    LazyLoad.query = function (selector) {
        var ret = [];
        var allElements = document.all, element, list, cssStyleSheet, i, length;

        if (doc.querySelectorAll) {
            ret = doc.querySelectorAll(selector);
        } else {
            // 兼容ie8及其以下ie浏览器
            // 创建一个样式表实例，用来存储css样式规则
            cssStyleSheet = doc.createStyleSheet();
            selector = selector.split(',');

            // 存储选择器对应的css样式规则
            for (i = 0, length = selector.length; i < length; i++) {
                cssStyleSheet.addRule(selector[i], 'hello:world');
            }

            // 遍历页面所有dom，如果dom存在该样式，则找到该元素，并且存储
            for (i = 0, length = allElements.length; i < length; i++) {
                element = allElements[i];
                element.currentStyle['hello'] && ret.push(element);
            }
        }

        return ret instanceof Array ? ret : [].slice.call(ret);
    };
    
    /*
     * 获取
    */
    LazyLoad.getViewportRect = function () {
        return {
            top: isIE8Under ? document.documentElement.scrollTop : document.body.scrollTop,
            height: viewportHeight
        };   
    };  
    
    return LazyLoad;
});