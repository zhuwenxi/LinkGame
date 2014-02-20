var ORIENTATION = {UP:"UP", RIGHT:"RIGHT", DOWN:"DOWN", LEFT:"LEFT"};

function Point(x, y){
	this.x = x;
	this.y = y;
	this.hasUp = false;
	this.hasDown = false;
	this.hasLeft = false;
	this.hasRight = false;
	this.orientation = null;
}

var TestLink = cc.Class.extend({
	previous : null,
	current : null,
	markupMatrix : null, 

	path : [],

	can : false,

	ctor:function(previous, current, markupMatrix){
		//this._super();
		this.previous = new Point(previous.row + 1, previous.col + 1);
		this.current = new Point(current.row + 1, current.col + 1);
		this.markupMatrix = markupMatrix;
		this.path.turnNums = 0;

		cc.log(this.previous.x + ',' + this.previous.y);
		cc.log(this.current.x + ',' + this.current.y);
	},

	canLink:function(){
		this.can = false;
		this.tryAllPaths(this.previous);
		return this.can;
	},

	tryAllPaths:function(startPoint){
		/*
		if(startPoint.x == this.current.x && startPoint.y == this.current.y){
			this.can = true;
			return;
		}
		*/
		if(this.canGoUp(startPoint)){
			this.goUp(startPoint);
		}
		if(this.canGoRight(startPoint)){
			this.goRight(startPoint);
		}
		if(this.canGoDown(startPoint)){
			this.goDown(startPoint);
		}
		if(this.canGoLeft(startPoint)){
			this.goLeft(startPoint);
		}
		cc.log(startPoint.x + ',' + startPoint.y);
		cc.log('All tried.');
		this.moveBack();
	},

	moveBack:function(){
		if(this.path.length == 0){
			return;
		}
		else{
			if(this.path.length >= 2){
				if(this.path[this.path.length - 1].orientation != this.path[this.path.length - 2].orientation){
					this.path.turnNums --;
				}
			}
			this.tryAllPaths(this.path[this.path.length - 1]);
		}
		cc.log('moveback');
	},

	canGoUp:function(startPoint){

		if(startPoint.hasUp == true){
			return false;
		}

		var upPoint = new Point(startPoint.x + 1, startPoint.y);
		if(!this.isInRange(upPoint)){
			return false;
		}

		if(this.markupMatrix[upPoint.x][upPoint.y] == true){
			if(upPoint.x == this.current.x && upPoint.y == this.current.y){
				this.can = true;
			}
			return false;
		}

		if(this.path.turnNums >= 2){
			if(this.path[this.path.length - 1].orientation != ORIENTATION.UP){
				return false;
			}
		}

		return true;
	},

	canGoDown:function(startPoint){
		if(startPoint.hasDown == true){
			return false;
		}

		var downPoint = new Point(startPoint.x - 1, startPoint.y);
		if(!this.isInRange(downPoint)){
			return false;
		}

		if(this.markupMatrix[downPoint.x][downPoint.y] == true){
			if(downPoint.x == this.current.x && downPoint.y == this.current.y){
				this.can = true;
			}
			return false;
		}

		if(this.path.turnNums >= 2){
			if(this.path[this.path.length -1].orientation != ORIENTATION.DOWN){
				return false;
			}
		}

		return true;
	},

	canGoLeft:function(startPoint){
		if(startPoint.hasLeft == true){
			return false;
		}

		var leftPoint = new Point(startPoint.x, startPoint.y - 1);
		if(!this.isInRange(leftPoint)){
			return false;
		}

		if(this.markupMatrix[leftPoint.x][leftPoint.y] == true){
			if(leftPoint.x == this.current.x && leftPoint.y == this.current.y){
				this.can = true;
			}
			return false;
		}

		if(this.path.turnNums >= 2){
			if(this.path[this.path.length -1].orientation != ORIENTATION.LEFT){
				return false;
			}
		}

		return true;
	},

	canGoRight:function(startPoint){
		if(startPoint.hasRight == true){
			return false;
		}

		var rightPoint = new Point(startPoint.x, startPoint.y + 1);
		if(!this.isInRange(rightPoint)){
			return false;
		}

		if(this.markupMatrix[rightPoint.x][rightPoint.y] == true){
			if(rightPoint.x == this.current.x && rightPoint.y == this.current.y){
				this.can = true;
			}
			return false;
		}

		if(this.path.turnNums >= 2){
			if(this.path[this.path.length - 1].orientation != ORIENTATION.LEFT){
				return false;
			}
		}

		return true;
	},

	goUp:function(startPoint){
		cc.log('go up');
		startPoint.hasUp = true;
		startPoint.orientation = ORIENTATION.UP;

		if(this.path.length > 0){
			if(this.path[this.path.length - 1].orientation != ORIENTATION.UP){
				this.path.turnNums ++;
			}
		}
		this.path.push(startPoint);

		var upPoint = new Point(startPoint.x + 1, startPoint.y);
		this.tryAllPaths(upPoint);
	},

	goRight:function(startPoint){
		cc.log('go right');
		startPoint.hasRight = true;
		startPoint.orientation = ORIENTATION.RIGHT;

		if(this.path.length > 0){
			if(this.path[this.path.length -1].orientation != ORIENTATION.RIGHT){
				this.path.turnNums ++;
			}
		}
		this.path.push(startPoint);

		var rightPoint = new Point(startPoint.x, startPoint.y + 1);
		this.tryAllPaths(rightPoint);
	},

	goDown:function(startPoint){
		cc.log('go down');
		startPoint.hasDown = true;
		startPoint.orientation = ORIENTATION.DOWN;

		if(this.path.length > 0){
			if(this.path[this.path.length - 1].orientation != ORIENTATION.DOWN){
				this.path.turnNums ++;
			}
		}
		this.path.push(startPoint);

		var downPoint = new Point(startPoint.x - 1 , startPoint.y);
		this.tryAllPaths(downPoint);

	},

	goLeft:function(startPoint){
		cc.log('go left');
		startPoint.hasLeft = true;
		startPoint.orientation = ORIENTATION.LEFT;

		if(this.path.length > 0){
			if(this.path[this.path.length -1].orientation != ORIENTATION.LEFT){
				this.path.turnNums ++;
			}
		}
		this.path.push(startPoint);

		var downPoint = new Point(startPoint.x, startPoint.y - 1);
		this.tryAllPaths(downPoint);
	},

	isInRange:function(point){
		if(point.x > 0 && point.x < 8 && point.y > 0 && point.y < 8){
			return true;
		}
		else{
			return false;
		}
	}, 	
});