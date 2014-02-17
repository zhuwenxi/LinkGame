var WelcomeLayer = cc.Layer.extend({

    ctor:function () {
        this._super();
        this.init();
    },
    init:function () {
        var bRet = false;
        if (this._super()) {
            var bgSprite = cc.Sprite.create("res/background.jpg");
            bgSprite.setPosition(160,240);
            this.addChild(bgSprite);

            var logoSprite = cc.Sprite.create("res/logo.png");
            logoSprite.setPosition(160,320);
            this.addChild(logoSprite);

            var itemStartGame = cc.MenuItemImage.create(
                "res/btn/btnStartGameNor.png",
                "res/btn/btnStartGameDown.png",
                this.menuCallBack,
                this
            );
            itemStartGame.setPosition(160, 160);

            var menu = cc.Menu.create(itemStartGame);
            menu.setPosition(0,0);
            this.addChild(menu);

            //Add Toggles to turn on/off the background music
            var bgmOn = cc.MenuItemFont.create("Pause BGM", function(){
                cc.log("Turn off BGM.");
            }, this);
            var bgmOff = cc.MenuItemFont.create("Resume BGM", function(){
                cc.log("Turn on BGM.");
            }, this);

            bgmOn.setFontSize(20);
            bgmOff.setFontSize(20);

            var toggleButton = cc.MenuItemToggle.create(bgmOn, bgmOff);
            toggleButton.setCallback(function(){
                if(gSharedEngine.isMusicPlaying()){
                    gSharedEngine.pauseMusic();
                }
                else{
                    gSharedEngine.resumeMusic();
                }
            }, this);

            var menu = cc.Menu.create(toggleButton);
            this.addChild(menu);
            //gSharedEngine.pauseMusic();

            var winSize = cc.Director.getInstance().getWinSize();

            menu.setPosition(winSize.width / 2, winSize.height / 8);

            //Test a sprite
            var sprite = cc.Sprite.createWithSpriteFrameName("pattern_selected.png");
            sprite.setPosition(cc.p(winSize.width/2, winSize.height/2));

            var frame = gSpriteFrameCache.getSpriteFrame("pattern_selected.png");
            //this.addChild(sprite);

            bRet = true;
        }
        return bRet;
    },
    menuCallBack:function(sender){
        gSharedEngine.playEffect(EFFECT_BUTTON_CHICK);
        //gGameMode = eGameMode.Challenge;
        gGameMode = eGameMode.Timer;
        var nextScene = cc.Scene.create();
        var nextLayer = new PatternMatrix;
        nextScene.addChild(nextLayer);
        cc.Director.getInstance().replaceScene(cc.TransitionSlideInT.create(0.4, nextScene));
    }
});

var MyGameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();

        gScoreData.initData();

        var spriteFrameCache = cc.SpriteFrameCache.getInstance();
        spriteFrameCache.addSpriteFrames("res/baseResource.plist","res/baseResource.png");

        var layer = new WelcomeLayer;
        this.addChild(layer);

        gSharedEngine.setMusicVolume(1);
        gSharedEngine.setEffectsVolume(1);
        gSharedEngine.playMusic(MUSIC_BACKGROUND,true);
    }
});