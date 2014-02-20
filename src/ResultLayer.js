var ResultLayer = cc.Layer.extend({
	ctor:function(gameScore){
		this._super();
		this.init(gameScore);
	},

	init:function(gameScore){
		var winSize = director.getWinSize();
		var restartMenuItem = cc.MenuItemImage.create('resultLayer/btnResultRestart.png', 'resultLayer/btnResultRestartDown.png', this.menuCallback, this);
		restartMenuItem.setPosition(winSize.width / 2, winSize.height / 3);

		var restartMenu = cc.Menu.create(restartMenuItem);
		restartMenu.setPosition(0, 0);
		this.addChild(restartMenu);

		var starNum = gameScore / 6000 | 0;
		for(var i = 0 ; i < starNum ; i++){
			this.showStar(i);
		}
	},

	menuCallback:function(){
		gSharedEngine.playEffect(EFFECT_BUTTON_CLICK);

		var nextScene = cc.Scene.create();
		var nextLayer = new GameScene();
		nextScene.addChild(nextLayer);

		var matrixLayer = cc.Director.getInstance().getRunningScene().getChildByTag(111);
        matrixLayer.clearListeners();

		director.replaceScene(cc.TransitionSlideInT.create(0.5 , nextScene));
	},

	showStar:function(index){
		var star = cc.Sprite.create('resultLayer/star.png');
		star.setScale(0.1);

		switch(index){
			case 0 :
				star.setPosition(60,245);
				break;
			case 1 : 
				star.setPosition(160, 265);
				break;
			case 2 : 
				star.setPosition(260, 245);
				break;
			default :
				break;
		}

		this.addChild(star);
		star.runAction(cc.ScaleTo.create(0.7,1.0,1.0));
		star.runAction(cc.RotateBy.create(0.7,720.0));
	},
});