var Block = cc.Sprite.extend({
	ctor:function(type){
		this._super();
		this.init(type);
	},

	init:function(type){
		var frameName = 'cocos' + ('00' + type).slice(-2) + '.png';
		this.initWithSpriteFrameName(frameName);
	}
});