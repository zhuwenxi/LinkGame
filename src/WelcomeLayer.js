var WelcomeLayer = cc.Layer.extend({
	ctor : function(){
		this._super();
		this.init();
	},

	init : function(){
		var result = false;

		//Globals
		director = cc.Director.getInstance();
		var winSize = director.getWinSize();

		//Background
		var bgSprite = cc.Sprite.create('res/background.jpg');
		bgSprite.setPosition(cc.p(winSize.width / 2, winSize.height / 2));
		this.addChild(bgSprite);

		//Logo
		var logoSprite = cc.LabelTTF.create('Link Game', 'Comic Sans MS', 60);
		logoSprite.setPosition(cc.p(winSize.width / 2, winSize.height * 2 / 3));
		//logoSprite.setColor(cc.c3b(0, 0, 0));
		this.addChild(logoSprite);

		//Start button
		var startGameButton = cc.MenuItemImage.create('res/btn/btnStartGameNor.png', 'res/btn/btnStartGameDown.png', this.menuCallback, this);
		var menu = cc.Menu.create(startGameButton);
		menu.setPosition(cc.p(winSize.width / 2, winSize.height  / 3));
		this.addChild(menu);

		// Pause / Resume BGM
		var bgmOn = cc.MenuItemFont.create("Pause BGM", function(){
                cc.log("Turn off BGM.");
            }, this);
            var bgmOff = cc.MenuItemFont.create("Resume BGM", function(){
                cc.log("Turn on BGM.");
            }, this);

        bgmOn.setFontSize(10);
        //bgmOn.setColor(cc.c3b(0, 0, 0));
        bgmOff.setFontSize(10);
        //bgmOff.setColor(cc.c3b(0, 0, 0));

		var toggleButton = cc.MenuItemToggle.create(bgmOn, bgmOff);
            toggleButton.setCallback(function(){
            	gSharedEngine.playEffect(EFFECT_BUTTON_CLICK);
                if(gSharedEngine.isMusicPlaying()){
                    gSharedEngine.pauseMusic();
                }
                else{
                    gSharedEngine.resumeMusic();
                }
            }, this);

	    var bgmMenu = cc.Menu.create(toggleButton);
	    bgmMenu.setPosition(cc.p(winSize.width / 2, winSize.height / 8));
        this.addChild(bgmMenu);
		return true;
	}, 

	menuCallback : function(){
		gSharedEngine.playEffect(EFFECT_BUTTON_CLICK);

		var gameScene = cc.Scene.create();
		gameScene.addChild(new GameScene);

		director.replaceScene(cc.TransitionSlideInT.create(0.5 , gameScene));
	}
});

var MyGameScene = cc.Scene.extend({
	onEnter : function(){
		this._super();

		var layer = new WelcomeLayer;
		this.addChild(layer);

		var spriteFrameCache = cc.SpriteFrameCache.getInstance();
        spriteFrameCache.addSpriteFrames("res/baseResource.plist","res/baseResource.png");

		gSharedEngine.setMusicVolume(1);
        gSharedEngine.setEffectsVolume(1);
        gSharedEngine.playMusic(MUSIC_BACKGROUND,true);
	}
});