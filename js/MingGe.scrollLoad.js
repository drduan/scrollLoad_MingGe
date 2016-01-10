/*   MingGe.scrollLoad2.51插件
 *
 *   2.51升级内容：加入container容器操作，这个功能在2.0的时候忘记了，修复各种事件机制，以及各种优化修复等
 *  
 *   图片或者节点滚动加载插件
 *
 *   MingGe.scrollLoad采用MingGeJS开发，兼容IE6/7/8，及尘世间所有一齐浏览器
 *
 *   作者：明哥先生-QQ399195513 QQ群：461550716 官网：www.shearphoto.com
 */
(function(window, undefined) {
    var D = MingGe,
    delEvent = D.delEvent,
    addEvent = D.addEvent,
    cacheData = [],
    isTransition,
    DOC = document,
    defaultArg = {
        attr: "_src",
        loadTime: 50,
        container: $(window),
        del: true,
        animate: "ease",
        event: "scroll"
    },
    del = function(eve) {
        var container = this,
        MGSL, cache, isUn = D.isUndefined(eve),
        count,
        isWin,
        eCache,
        elem,
        bodys = DOC.body;
        for (var i = 0; i < container.length; i++) {
            elem = container[i];
            isWin = elem == window;
            eCache = isWin ? D: elem;
            MGSL = eCache.MingGeScrollLoad;
            if (D.isNumber(MGSL) && (cache = cacheData[MGSL])) {
                D.each(cache,
                function(k, v) {
                    if (isUn || k == eve) {
                        count = v.callback.count;
                        if (k == "scroll" && elem == DOC && elem == bodys) {
                            elem = window;
                            isWin = true;
                        }
                        if (!isWin || k != "scroll") {
                            delEvent(elem, k, v.callback);
                            delete cache[k];
                        } else if (count && count < 2) {
                            isWin && k == "scroll" && delete cache[k];
                            delEvent(window, "scroll", v.callback);
                            delEvent(window, "resize", v.callback);
                        } else {
                            count && v.callback.count--;
                        }
                    }
                    if (D.isEmptyObject(cache)) {
                        delete cacheData[MGSL];
                        if (D.isEmptyObject(cacheData)) {
                            cacheData = [];
                        }
                        try {
                            delete eCache.MingGeScrollLoad;
                        } catch(e) {
                            eCache.MingGeScrollLoad = undefined;
                        }
                    }
                });
            }
        }
    },
    setDefault = function(elem, arg) {
        for (var i = elem.length - 1; i > -1; i--) {
            if (elem[i].getAttribute(arg.attr)) {
                elem[i].setAttribute("src", arg.defaultSrc);
            } else {
                elem.splice(i, 1);
            }
        }
    },
    initCallback = function(this_) {
        return function() {
            if (this_.timer) {
                clearTimeout(this_.timer);
                this_.timer = null;
            }
            this_.timer = setTimeout(function() {
                this_.run();
                this_.timer = null;
            },
            this_.arg.loadTime);
        };
    },
    varObj = function(obj) {
        var O = {};
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) O[key] = obj[key];
        }
        return O;
    },
    opacity = function(MimgGet, this_) {
        return function() {
            MimgGet.animate({
                opacity: 1
            },
            500, this_.arg.animate,
            function() {
                D(this).css("opacity", null);
                this_.arg.success && this_.arg.success.call(this);
            });
            this_.callback();
        };
    },
    forceArg = function(arg, elem) {
        arg.attr = D.isString(arg.attr) ? D.trim(arg.attr) : null;
        arg.loadTime = D.isNumber(arg.loadTime = parseFloat(arg.loadTime)) && arg.loadTime !== 0 ? arg.loadTime: 50;
        D.isFunction(arg.success) || (arg.success = false);
        D.isFunction(arg.error) || (arg.error = false);
        D.isString(arg.defaultSrc) && arg.attr && setDefault(elem, arg);
    },
    scrollLoad = function(elem, arg) {
        isTransition == null && (isTransition = !!(D._protected.transition = D.html5Attribute("transition")));
        D.isObject(arg) || (arg = {});
        D.isString(arg.event) || (arg.event = defaultArg.event);
        arg.container || (arg.container = defaultArg.container);
        this.callback = initCallback(this);
        this.callback.count = 0;
        this.writeEvent(this.callback, elem, arg);
    };
    scrollLoad.prototype = {
        handle: function(container, elem, arg, eCache, isScroll, isForce) {
            var MGSL = eCache.MingGeScrollLoad,
            cache, isCache = D.isNumber(MGSL) && (cache = cacheData[MGSL]);
            if (!isForce && isCache && (cache = cache[arg.event])) {
                forceArg.call(cache, cache.arg = D.extend(cache.arg, arg), elem);
                cache.img = elem;
                isScroll && cache.callback();
            } else {
                var callback = this.callback;
                if (!isForce) {
                    if (isCache) {
                        isCache[arg.event] = this;
                    } else {
                        cacheData[eCache.MingGeScrollLoad = cacheData.push({}) - 1][arg.event] = this;
                    }
                }
                this.arg || (forceArg.call(this, this.arg = D.extend(varObj(defaultArg), arg), elem), this.img = elem);
                if (container == window && isScroll) {
                    addEvent(window, "scroll", callback);
                    addEvent(window, "resize", callback);
                } else {
                    addEvent(container, arg.event, callback);
                }
                if (isScroll) return true;
            }
        },
        writeEvent: function(callback, elem, arg) {
            var i = 0,
            container, eCache, is = 0,
            bodys = DOC.body,
            isScroll = arg.event == "scroll",
            isForce;
            if (arg.container && arg.container.version) {
                while (container = arg.container.nodeList[i++]) {
                    if (isScroll && (container == window || container == DOC || container == bodys)) {
                        is || (is = 1);
                    } else {
                        eCache = container == window ? D: container;
                        if (this.handle(container, elem, arg, eCache, isScroll) === true) {
                            is++;
                            isForce = true;
                        }
                    }
                }
                if (callback.count = is) {
                    this.handle(window, elem, arg, D, isScroll, isForce);
                    this.arg && callback();
                }
            }
        },
        setSrc: function(img, i, args) {
            var imgGet = img[i],
            src = false,
            arg = this.arg;
            if (imgGet) {
                src = this.isRange(args, imgGet);
                if (src) {
                    img.splice(i, 1);
                    var MimgGet, loading, this_ = this;
                    if (src !== true) {
                        loading = new Image();
                        var imgError = function() {
                            delEvent(loading, "load", imgLoad);
                            delEvent(loading, "error", imgError);
                            arg.error && arg.error.call(imgGet);
                        },
                        imgLoad = function() {
                            delEvent(loading, "load", imgLoad);
                            delEvent(loading, "error", imgError);
                            if (isTransition && arg.animate) {
                                MimgGet = D(imgGet).css("opacity", 0);
                                imgGet.src = src;
                                setTimeout(opacity(MimgGet, this_), 10);
                            } else {
                                imgGet.src = src;
                                setTimeout(function() {
                                    this_.callback();
                                },
                                10);
                                arg.success && arg.success.call(imgGet);
                            }
                            imgGet.removeAttribute(arg.attr);
                        };
                        addEvent(loading, "load", imgLoad);
                        addEvent(loading, "error", imgError);
                        loading.src = src;
                    }
                    loading || arg.success && arg.success.call(imgGet);
                }
            }
            src === false && img.splice(i, 1);
        },
        isRange: function(arg, imgGet) {
            var src = this.arg.attr ? imgGet.getAttribute(this.arg.attr) : true;
            if (src) {
                var rect = imgGet.getBoundingClientRect(),
                RangeL = arg[0],
                RangeLEnd = RangeL + arg[2],
                RangeT = arg[1],
                RangeTEnd = RangeT + arg[3],
                imgRangeL = rect.left + RangeL + 1,
                imgRangeLEnd = imgRangeL + imgGet.offsetWidth,
                imgRangeT = rect.top + RangeT + 1,
                imgRangeTEnd = imgRangeT + imgGet.offsetHeight;
                if ((imgRangeT > RangeT && imgRangeT < RangeTEnd || imgRangeTEnd > RangeT && imgRangeTEnd < RangeTEnd) && (imgRangeL > RangeL && imgRangeL < RangeLEnd || imgRangeLEnd > RangeL && imgRangeLEnd < RangeLEnd)) {
                    return src;
                }
            } else return false;
        },
        Calculation: function(sL, sT, cw, ch) {
            var img = this.img,
            i = img.length - 1;
            if (i < 0) {
                this.arg.del && del.call(this.arg.container.nodeList, this.arg.event);
            } else {
                for (; i > -1; i--) {
                    this.setSrc(img, i, arguments);
                }
            }
        },
        run: function() {
            var elem = D(DOC);
            this.Calculation(elem.scrollLeft(), elem.scrollTop(), elem.clientWidth(), elem.clientHeight());
        }
    };
    D.fn.extend({
        delScrollLoad: function(event) {
            del.call(this.nodeList, event);
            return this;
        },
        scrollLoad: function(options) {
            new scrollLoad(this.nodeList, options);
            return this;
        }
    });
})(window);