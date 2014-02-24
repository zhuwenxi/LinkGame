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

	//Total socre
	gameScore : 0,

	markupMatrix : null,

	ctor : function(){
		this._super();
		this.init();
	},

	init : function(){
		this.setTag(111);
		var winSize = director.getWinSize();
		//Set block numbers
		this.numOfBlocks = this.n_MatrixCol * this.n_MatrixRow;

		//Set total game time
		this.timeTotal = 50;

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

		//Init markup matrix
		this.markupMatrix = this.initArray(this.n_MatrixRow + 2, this.n_MatrixCol + 2, false);

		gNotification.addObserver(this, this.selectBlock, BLOCK_SELECTED);

		//Init Matrix
		this.initMatrix();

		//Updating the progress persistently
		this.schedule(this.updateProgress, 0.15);
	},

	clearListeners:function(){
		gNotification.removeObserver(this, BLOCK_SELECTED);
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

        //Init a temp matrix
        var tempMatrix = [];
        var tempMatrix_length = this.n_MatrixRow * this.n_MatrixCol;
        for(var i = 0 ; i < tempMatrix_length / 2; i++){
        	var randomNumber = 0 | Math.random() * 7;
        	tempMatrix[i * 2] = new Block(randomNumber);
        	tempMatrix[i * 2 + 1] = new Block(randomNumber);
        }

        //function to update the matrix
        function updateMatrix(index){
        	if(index == 0){
        		tempMatrix = tempMatrix.slice(1);
        	}
        	else{
        		tempMatrix = tempMatrix.slice(0, index).concat(tempMatrix.slice(index + 1));
        	}

        	tempMatrix_length --;
        }

        this.patternBg.begin();
        var bg = cc.Sprite.create("res/PatternBg.png");
		for(var row = 0 ; row < this.n_MatrixRow ; row ++){
			for(var col = 0 ; col < this.n_MatrixCol ; col ++){
				this.blocksPos[row][col] = cc.p(baseX + col * space, baseY + row * space);
				bg.setPosition(this.blocksPos[row][col]);
				bg.visit();

				//Randomly choose the block in tempMatrix
				var randomNumber = 0 | Math.random() * tempMatrix_length;

				var block = tempMatrix[randomNumber];
				updateMatrix(randomNumber);

				this.addOneBlock(row, col, block);
				this.markupMatrix[row + 1][col + 1] = true;
			}
		}
		this.patternBg.end();

		// var testBlock1 = new Block(2);
		// var testBlock2 = new Block(2);

		// var pos1 = {row : 3, col : 0};
		// var pos2 = {row : 5, col : 3};

		// this.blockBatchNode.removeChild(this.blocksSpr[pos1.row][pos1.col]);
		// this.blockBatchNode.removeChild(this.blocksSpr[pos2.row][pos2.col]);

		// this.addOneBlock(pos1.row, pos1.col, testBlock1);
		// this.addOneBlock(pos2.row, pos2.col, testBlock2);
		
		/*
		var block1 = new Block(1);
		var block2 = new Block(1);
		this.addOneBlock(1, 1, block1);
		this.addOneBlock(2, 2, block2);
		this.markupMatrix[2][2] = true;
		this.markupMatrix[3][3] = true;
		*/ 
	},

	addOneBlock:function(row, col, block){
		//var randomNumber = 0 | Math.random() * 7;
		//this.blocksSpr[row][col] = new Block(randomNumber);
		this.blocksSpr[row][col] = block;
		this.blocksSpr[row][col].setPosition(this.blocksPos[row][col].x, this.blocksPos[row][col].y);
		this.blocksSpr[row][col].row = row;
		this.blocksSpr[row][col].col = col;
		//this.blocksSpr[row][col].type = randomNumber;
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

			if(previous != current && previous.destroyed == false && current.destroyed == false && this.checkBlocks(previous, current)){
				previous.destroyBlocks(this.destroyFrames);
				current.destroyBlocks(this.destroyFrames);

				this.markupMatrix[previous.row + 1][previous.col + 1] = false;
				this.markupMatrix[current.row + 1][current.col + 1] = false;
				this.updateScore();

				this.blockSelectedSpr.setPosition(cc.p(-100, -100));
				this.previousBlock = null;

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
		if(previous.type != current.type){
			return false;
		}
		var testLink = new TestLink(previous, current, this.markupMatrix);
		cc.log('testLink');
		return testLink.canLink();

		// var test = new Test(previous, current, this.markupMatrix);
		// return test.canLink();
		//return true;
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

	updateScore:function(){
		this.gameScore += 1000;
		this.scoreLabel.setString("Score " + this.gameScore);
		if(this.gameScore >= 18000){
			//this.showGameResult(true);
			this.runAction(cc.Sequence.create(cc.DelayTime.create(0.7), cc.CallFunc.create(this.showGameResult,this)));
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

		var resultLayer = new ResultLayer(this.gameScore);
		director.getRunningScene().addChild(resultLayer);
	},
});