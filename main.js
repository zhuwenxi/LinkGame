var linkGameApp = cc.Application.extend({
	config : document['ccConfig'],

	ctor : function(scene){
		this._super();
		this.startScene = scene;
		cc.COCOS2D_DEBUG = this.config['COCOS2D_DEBUG'];
		cc.initDebugSetting();
		cc.setup(this.config['tag']);
		cc.AppController.shareAppController().didFinishLaunchingWithOptions();
	},

	applicationDidFinishLaunching : function(){
		if(cc.RenderDoesnotSupport()){
			alert("Browser doesn't support Canvas or WebGL");
            return false;
		}

		var director = cc.Director.getInstance();
		cc.EGLView.getInstance().setDesignResolutionSize(320, 480, cc.RESOLUTION_POLICY.SHOW_ALL);
		cc.EGLView.getInstance().resizeWithBrowserSize(true);

		director.setDisplayStats(this.config['showFPS']);

		director.setAnimationInterval(1.0 / this.config['frameRate']);

		cc.LoaderScene.preload(g_resources, function(){
			director.replaceScene(new this.startScene);
		}, this);

		return true;
	}
});

new linkGameApp(MyGameScene);