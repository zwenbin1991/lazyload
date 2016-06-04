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
    var viewportHeight = doc.documentElement.clientHeight;
    var isIE8Under = typeof execScript === 'object' ? true : false;
    var __LAZYLOAD_TIMELINE__ = 30;

    function LazyLoad (selector, options) {
        options || (options = {});

        this.pageNum = 1;
        this.tag = options.tag || 'data-src';
        this.distance = options.distance || 0;
        this.elements = this.constructor.query(selector);

        this.init();
    }

    LazyLoad.prototype.init = function () {
        var self = this, timer;

        // 初始化检测并加载
        this.loading();

        // 绑定window scroll事件
        this.constructor.bindScrollEvent(function () {
            // 延迟30毫秒检测，每次滚动删除上一个定时器线程，避免浏览器崩溃
            timer && clearTimeout(timer);
            timer = setTimeout(function () {
                self.loading();
            }, __LAZYLOAD_TIMELINE__);
        });
    };

    LazyLoad.prototype.detect = function (element) {
        var rect = element.getBoundingClientRect();
        var top = rect.top;
        var bottom = rect.bottom;
    };

    LazyLoad.prototype.detectNextPage = function () {
        var scrollTop = isIE8Under ? document.documentElement.scrollTop : document.body.scrollTop;

        if (parseInt(scrollTop) >= viewportHeight) this.pageNum++;
    };

    LazyLoad.prototype.loading = function () {

    };

    LazyLoad.prototype.loadImage = function () {

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

        return ret;
    }

});

