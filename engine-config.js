(function(){
	var c = {
		COCOS2D_DEBUG : 2,
		box2d : false,
		chipmunk : false,
		showFPS: true,
		frameRate : 60,
		loadExtension : true,
		renderMode : 1, 
		tag : 'game-canvas',
		engineDir : 'cocos2d-html5/cocos2d/',
		appFiles : ['src/CCNotificationCenter.js','game-resource.js', 'src/WelcomeLayer.js', 'src/GameScene.js','src/Block.js'],
	}

	if(!document.createElement('canvas').getContext){
		var s = document.createElement('div');
		s.innerHTML = '<h2>Your browser does not support HTML5 canvas!</h2>' +
            '<p>Google Chrome is a browser that combines a minimal design with sophisticated technology to make the web faster, safer, and easier.Click the logo to download.</p>' +
            '<a href="http://www.google.com/chrome" target="_blank"><img src="http://www.google.com/intl/zh-CN/chrome/assets/common/images/chrome_logo_2x.png" border="0"/></a>';
        var p = document.getElementById(c.tag).parentNode;
        p.style.background = 'none';
        p.style.border = 'none';
        p.insertBefore(s);

        document.body.style.background = "#ffffff";
        return;
	}

	window.addEventListener('DOMContentLoaded', function(){
		var s = document.createElement('script');
		if(c.SingleEngineFile && !c.engineDir){
			s.src = c.SingleEngineFile;
		}
		else if(c.engineDir && !c.SingleEngineFile){
			s.src = c.engineDir + 'jsloader.js';
		}
		else{
			alert('You must specify either the single engine file OR the engine directory in "cocos2d.js"');
		}

		document.ccConfig = c;
		s.id = 'cocos2d-html5';
		document.body.appendChild(s);
	});
})();