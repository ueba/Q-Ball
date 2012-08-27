/* qb3.js キャンバスのテストプログラム qball3 */
/* クーロンボール その３ 荷電粒子 */
/* 電荷の強さを変えられるバージョン */

/* プログラムの構造として
	window.onload用のfunctionがあり、
		canvasを作る
		パラメータを取得する
		ボールを作る
		実行する
	
	パラメータをリセットされた時のfunction
		既存のキャンバスを使い、
		パラメータを取得し、
		ボールにパラメータをセットし、
		再実行する
*/
//共通の変数


//パラメータは、グローバルな方がよい
var qParam;
var canvas;
var cx;
var timerNo;

// 画面上のスライドバーを動かされた時
function changeQparam(value){
	qParam = value * 100;
	document.getElementById("vqp").innerHTML = value;
}	

function setParams(){
	qParam = document.cform.qpm.value * 100;
}

// 制御パネルのセットボタンが押された時
function ReSetParams(){
	clearInterval(timerNo);
	qbInit();
}

// qBall のコンストラクタ
/* image : 画像ファイル, radius : 半径, ix,iy : 初期位置, ivx,ivy : 初速度 */
function qBall(image, radius, ix, iy, ivx, ivy){

/* プロパティ */
	this.element = document.createElement("img");
	this.element.src = image;
	this.radius = radius;
	this.x = ix;
	this.y = iy;
	this.vx = ivx;
	this.vy = ivy;
};
/* メソッド */
/* 次の位置 */
qBall.prototype.setNextPosition = function(){
	this.x += this.vx;
	this.y += this.vy;
};

/* 反射 */
qBall.prototype.setNextVelocity = function(){
	if ( (this.x > max_x) || (this.x < 0)) { //左右の壁にあたった
		this.vx = -this.vx;
	}; // その他の時は何もしない
	if ( (this.y > max_y) || (this.y < 0)) { //上下の壁にあたった
		this.vy = -this.vy;
	}; // その他の時は何もしない
};		

//以下は、メソッドではない
// 次の速度。引数は相手のボール
// b1,b2は２つのqBallインスタンス
function setQulombNextVelocity( b1, b2) {
	dx = b1.x - b2.x;
	dy = b1.y - b2.y;
	r = Math.sqrt( (dx * dx) + (dy * dy) );
	r3 = Math.pow(r,3);
	ax = qParam * dx / r3;	// x .. b1 to b2
	ay = qParam * dy / r3;	// y .. b1 to b2
	b1.vx += ax;
	b1.vy += ay;
	b2.vx -= ax;
	b2.vy -= ay;
};

/* 衝突の処理（グローバルな関数）*/
/* bb, rb は、qBall */
function collisionProcess ( bb, rb, radius ){
	// 判定後、衝突していたら速度を交換する
	if ( (Math.abs(bb.x - rb.x) < radius) && (Math.abs(bb.y - rb.y) < radius) ) {
		//衝突しているので速度を交換する
		tx = bb.vx;
		ty = bb.vy;
		bb.vx = rb.vx;
		bb.vy = rb.vy;
		rb.vx = tx;
		rb.vy = ty;
	}
	//衝突していないのでそのまま
}

function qbInit(){
/* キャンバスの設定 */
	canvas = document.getElementById("canvas1");
	cx = canvas.getContext("2d");	
	canvas.width =  600;
	canvas.height = 600;
	
	max_x = canvas.width - 50;		//跳ね返る場所x,50は仮
	max_y = canvas.height - 50;		//跳ね返る場所y,50は仮
	
	var rinterval = 50; // 再描画間隔(ms)
	
	/* パラメータを画面から入れられるようにする */
	//この中で、qParamもセットされる
	setParams();

// ボールの生成
// image : 画像ファイル, radius : 半径, ix,iy : 初期位置, ivx,ivy : 初速度
	
//青ボール
	var bb = new qBall("blue.gif", 
					50,		//半径
					Math.floor(Math.random()*max_x),	//ix
					Math.floor(Math.random()*max_y),	//iy,
					Math.floor(Math.random()*10)+1,		//ivx
					Math.floor(Math.random()*10)+1		//ivy
					);
//赤ボール
	var rb = new qBall("red.gif", 
					50,		//半径
					Math.floor(Math.random()*max_x),	//ix
					Math.floor(Math.random()*max_y),	//iy,
					Math.floor(Math.random()*10)+1,		//ivx
					Math.floor(Math.random()*10)+1		//ivy
					);
	
	var collisionRadius = 50; //衝突断面積。高速化のために変数にしておく

//描画ルーチン
	timerNo = setInterval (function() {
	
		//ボールの位置を１つ進める
		bb.setNextPosition();
		rb.setNextPosition();
		
		// 衝突処理
		// 判定後、衝突していたら速度を交換する
		// 第３引数は衝突断面積。高速化のため。
		// 引力の場合衝突しやすいので、どうするかは今後の課題
		collisionProcess ( bb, rb, collisionRadius );
		
		// 次の速度を求める。
		// 順番にやると難しい問題があるので、２つのボールを引数に渡すしかない。
		setQulombNextVelocity( bb, rb );
		
		//反射
		bb.setNextVelocity();
		rb.setNextVelocity();
		
		//再描画（最初よりこの位置の方が、空白時間が短い）
		canvas.width = canvas.width;

		//描画
		cx.drawImage( bb.element, bb.x, bb.y );
		cx.drawImage( rb.element, rb.x, rb.y );
		
	}, rinterval);

}; // end of on window.load

window.onload = qbInit;
