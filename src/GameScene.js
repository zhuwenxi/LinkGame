var GameScene = cc.Layer.extend({
	timeTotal: 0,
	progressBar : null,
	progressBarBg : null,
	scoreLabel : 0,
	patternBg : null,

	n_MatrixRow : 6, 
	n_MatrixCol : 6,

	blocksSpr : [], 
	blocksPos : [], 

	blockBatchNode : null,

	ctor : function(){
		this._super();
		this.init();
	},

	init : function(){
		var winSize = director.getWinSize();
		//Set total game time
		timeTotal = 60;

		//Set background
		var bgSprite = cc.Sprite.create('res/background.jpg');
		bgSprite.setAnchorPoint(0, 0);
		this.addChild(bgSprite);

		//Init Progress
		this.initProgress();

		//Init score
		this.scoreLabel = cc.LabelTTF.create("Score 0", "Courier", 20);
		this.scoreLabel.setPosition(winSize.width / 2, winSize.height - 30);
		this.addChild(this.scoreLabel);

		//Init render texture
		this.patternBg = cc.RenderTexture.create(winSize.width, winSize.height);
		this.patternBg.setPosition(winSize.width / 2, winSize.height / 2);
		this.addChild(this.patternBg);

		//Batch node
		this.blockBatchNode = cc.SpriteBatchNode.create('res/baseResource.png', this.n_MatrixRow * this.n_MatrixCol * 2);
		this.addChild(this.blockBatchNode);

		//Init block sprite and block position array
		this.blocksSpr = this.initArray(this.n_MatrixRow, this.n_MatrixCol, null);
		this.blocksPos = this.initArray(this.n_MatrixRow, this.n_MatrixCol, null);

		//Init Matrix
		this.initMatrix();
	},

	initProgress:function(){
		var winSize = director.getWinSize();

		this.progressBarBg = cc.Sprite.create('res/ProgressBarBack.png');
		this.progressBarBg.setAnchorPoint(0.5, 0.5);
		this.progressBarBg.setPosition(winSize.width / 2, 20);
		this.addChild(this.progressBarBg);

		this.progressBar = cc.Sprite.create('res/ProgressBarFront.png');
		this.progressBar.setAnchorPoint(0.5, 0.5);
		this.progressBar.setPosition(winSize.width / 2, 20);
		this.addChild(this.progressBar);
	},

	initMatrix:function(){
		var halfSpace = 25.0;
        var space = 2*halfSpace;

        var baseX = 160.0 + halfSpace - this.n_MatrixCol*halfSpace;
        var baseY = 240.0 + halfSpace - this.n_MatrixRow*halfSpace;

		for(var row = 0 ; row < this.n_MatrixRow ; row ++){
			for(var col = 0 ; col < this.n_MatrixCol ; col ++){
				this.blocksPos[row][col] = cc.p(baseX + col * space, baseY + row * space);
				this.addOneBlock(row, col);
			}
		}
	},

	addOneBlock:function(row, col){
		var randomNumber = 0 | Math.random() * 7;
		this.blocksSpr[row][col] = new Block(randomNumber);
		this.blocksSpr[row][col].setPosition(this.blocksPos[row][col].x, this.blocksPos[row][col].y);
		this.blockBatchNode.addChild(this.blocksSpr[row][col]);
	}, 

	initArray:function(arow, acol, value){
		var arr = [];
		for(var row = 0 ; row < arow ; row ++){
			arr[row] = [];
			for(var col = 0 ; col < acol ; col ++){
				arr[row][col] = value;
			}
		}
		return arr;
	}
});