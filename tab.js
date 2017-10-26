;(function($){
	var Tab=function(tab){
		var _this_=this;
		//baoc单个tab组件
		this.tab=tab;
		//默认peizh参数
		this.config={
			"triggerType":"mouseover",//用来定义鼠标触发类型
			"effect":"fade",//定义内容切换效果
			"invoke":2,//默认展示第几个tab
			"auto":false//定义是否自动切换
		}
		//如果配置参数存在，就扩展掉默认的配置参数
		if (this.getConfig()) {
			$.extend(this.config,this.getConfig());
		}
		//保存tab标签列表、对应的内容列表
		this.tabItems=this.tab.find("ul.tab-nav li");
		this.contentItems=this.tab.find("div.content-wrap div.content-item");
		//保存配置参数
		var config=this.config;
		if (config.triggerType==="click") {
			this.tabItems.bind(config.triggerType,function(){
				_this_.invoke($(this));
			});
		}else if (config.triggerType==="mouseover"||config.triggerType!="click") {
			this.tabItems.mouseover(function(){
				_this_.invoke($(this));
			});
			
		}
		//自动切换
		if (config.auto) {
				this.timer=null;
				this.loop=0;

				this.autoPlay();

				this.tab.hover(function(){
					window.clearInterval(_this_.timer);
				},function(){
					_this_.autoPlay();
				});
		}
		//默认第几个tab
		if (config.invoke>1) {
			this.invoke(this.tabItems.eq(config.invoke-1));
		}
	}
	Tab.prototype={
		//自动间隔时间切换
		autoPlay:function(){
			var _this_=this;
				tabItems=this.tabItems,
				tabLength=tabItems.size(),
				config=this.config;
				this.timer=window.setInterval(function(){
					_this_.loop++;
					if (_this_.loop>=tabLength) {
						_this_.loop=0;
					}
					tabItems.eq(_this_.loop).trigger(config.triggerType);
				},config.auto);
		},
		//事件驱动函数
		invoke:function(currentTab){
			var _this_=this;
			var index=currentTab.index();
			//tab选中状态
			currentTab.addClass("active").siblings().removeClass("active");
			//切换对应的内容区域
			var effect=this.config.effect;
			var contentItems=this.contentItems;
			if (effect==="default"||effect!="fade") {
				contentItems.eq(index).addClass("current").siblings().removeClass("current");

			}else if (effect==="fade") {
			contentItems.eq(index).fadeIn().siblings().fadeOut();	
			}
			//注意：如果配置了自动切换，记得把当前的loop值同步成当前tab的index值
			if (this.config.auto) {
				this.loop=index;
			}
		},
		//获取配置参数
		getConfig:function(){
			//拿一下tab elem节点上的data-config
			var config=this.tab.attr("data-config");
			//确保有配置参数
			if (config&&config!="") {
				return $.parseJSON(config);
			}else{
				return null;
			}
		}
	}
	Tab.init=function(tabs){
		var _this_=this;
		tabs.each(function(){
			new _this_($(this));
		});
	}
	window.Tab=Tab; 
})(jQuery);