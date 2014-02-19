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

	blockSelectedSpr : null,

	//current selected block
	previousBlock : null,

	//destroy frames
	destoryFrames : [],

	//Totally number of blocks
	numOfBlocks : 0,

	//Timer tally
	timerTally : 0,

	ctor : function(){
		this._super();
		this.init();
	},

	init : function(){
		var winSize = director.getWinSize();
		//Set block numbers
		this.numOfBlocks = this.n_MatrixCol * this.n_MatrixRow;

		//Set total game time
		this.timeTotal = 15;

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

		//Pattern Selected Sprite
		this.blockSelectedSpr = cc.Sprite.createWithSpriteFrameName('pattern_selected.png');
		this.blockSelectedSpr.setPosition(cc.p(-100, -100));
		this.addChild(this.blockSelectedSpr);

		//Init block sprite and block position array
		this.blocksSpr = this.initArray(this.n_MatrixRow, this.n_MatrixCol, null);
		this.blocksPos = this.initArray(this.n_MatrixRow, this.n_MatrixCol, null);

		gNotification.addObserver(this, this.selectBlock, BLOCK_SELECTED);

		//Init Matrix
		this.initMatrix();

		//Updating the progress persistently
		this.schedule(this.updateProgress, 0.15);
	},

	initProgress:function(){
		var winSize = director.getWinSize();

		this.progressBarBg = cc.Sprite.create('res/ProgressBarBack.png');
		this.progressBarBg.setAnchorPoint(0.0, 0.5);
		this.progressBarBg.setPosition(32, 20);
		this.addChild(this.progressBarBg);

		this.progressBar = cc.Sprite.create('res/ProgressBarFront.png');
		this.progressBar.setAnchorPoint(0.0, 0.5);
		this.progressBar.setPosition(32, 20);
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
		this.blocksSpr[row][col].row = row;
		this.blocksSpr[row][col].col = col;
		this.blocksSpr[row][col].type = randomNumber;
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
	}, 

	initDestroyFrames:function(){
		var frame = null;
		for(var i = 0 ; i < 18 ; i++){
			frame = gSpriteFrameCache.getSpriteFrame("pattern_destroy_"+("00"+i).slice(-2)+".png");
            this.mDestroyFrames.push(frame);
		}
	},

	selectBlock:function(block){
		if(this.previousBlock == null){
			this.previousBlock = block;
			this.blockSelectedSpr.setPosition(this.blocksPos[block.row][block.col]);
		}
		else{
			//Destory the chosen two blocks
			var previous = this.previousBlock;
			var current = block;

			if(this.checkBlocks(previous, current)){
				previous.destroyBlocks(this.destroyFrames);
				current.destroyBlocks(this.destroyFrames);

				this.numOfBlocks = this.numOfBlocks - 2;

				this.blockSelectedSpr.setPosition(cc.p(-100, -100));
				this.previousBlock = null;

				if(this.numOfBlocks <= 0){
					//Game Win
					this.showGameResult(true);
				}
			}
			else{
				this.previousBlock = block;
				this.blockSelectedSpr.setPosition(this.blocksPos[block.row][block.col]);
			}

			// block.destroyBlocks(this.destroyFrames);
			// this.previousBlock.destroyBlocks(this.destroyFrames);
			// this.previousBlock = null;
		}
	}, 

	//Check if this block and the previous one are the same type
	checkBlocks:function(previous, current){
		return true;
	},

	updateProgress:function(dt){
		this.timerTally += dt;
		var progressPercent = (this.timeTotal - this.timerTally) / this.timeTotal;

		if(progressPercent < 0){
			progressPercent = 0;
		}

		this.progressBar.setTextureRect(cc.rect(0, 0 , 257*progressPercent, 19));

		if(progressPercent == 0){
			//Game fail
			this.showGameResult(false);
		}
	},

	showGameResult:function(result){
		this.onExit();
		this.unscheduleAllCallbacks();
		if(result){
			cc.log('Game win!!');
		}
		else{
			cc.log('Game fail.');
		}
	},
});