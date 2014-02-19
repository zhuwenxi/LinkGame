var BLOCK_SELECTED = 'BLOCK_SELECTED';

var Block = cc.Sprite.extend({
	ctor:function(type){
		this._super();
		this.init(type);
	},

	init:function(type){
		var frameName = 'cocos' + ('00' + type).slice(-2) + '.png';
		this.initWithSpriteFrameName(frameName);
	},

	containsTouchLocation:function (touch) {
        var getPoint = touch.getLocation();

        var lx = 0 | (getPoint.x -  this.getPosition().x);//this.getPositionX();
        var ly = 0 | (getPoint.y -  this.getPosition().y);//this.getPositionY();
        if(lx>-22.5 && lx<22.5 && ly>-22.5 && ly<22.5)
            return true;
        return false;
    },

	onTouchBegan:function(touch, event){
		//cc.log(this.row + ',' + this.col);
		if(this.containsTouchLocation(touch)){
			gNotification.postNotification(BLOCK_SELECTED, this);
			return true;
		}
		return false
	},

	onTouchMoved:function(touch, event){
		//cc.log('Touch moved!');
		return true;
	},

	destroyBlocks:function(frames){
		var destroySprite = cc.Sprite.createWithSpriteFrameName('pattern_destroy_00.png');
		destroySprite.setPosition(22.5, 22.5);
		this.addChild(destroySprite);

		var animation = cc.Animation.create(frames, 0.025);
		destroySprite.runAction(cc.Animate.create(animation));
		var sequence = cc.Sequence.create(cc.FadeOut.create(0.5), cc.CallFunc.create(this.removeSelf, this));
		this.runAction(sequence);

		gSharedEngine.playEffect(EFFECT_PATTERN_BOMB);
		//this.runAction(cc.Sequence.create(cc.DelayTime.create(1.5), cc.CallFunc.create(this.removeSelf, this)));
	},

	removeSelf:function(){
		this.getParent().removeChild(this);
	},

	onEnter:function(){
		if(sys.platform == 'browser'){
			cc.registerTargetedDelegate(1, true, this);
		}
		else{
			cc.registerTargettedDelegate(1, true, this);
		}
		this._super();
	},

	onExit:function(){
		cc.unregisterTouchDelegate(this);
		this._super();
	}
});