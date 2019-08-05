//	生成音频文件
var oAu = document.createElement('audio');
oAu.src = 'audio/moon.mp3';
document.body.appendChild(oAu);
var dur = 0;  //将总时长定义为全局变量，保证后续函数中的正常引用
oAu.addEventListener('canplay', function() { //监听音频文件可正常播放后再获取时长
	dur = oAu.duration; //获取总时长
	console.log(oAu.duration);
	$('duration').innerHTML = changeTime(dur);
})



var oFoot = document.getElementById('footer');

var aBtn = oFoot.getElementsByTagName('button');
var oMute = oFoot.getElementsByClassName('lastspan')[0];

var oPoint = document.getElementsByClassName('point')[0];
var oCD = document.getElementsByClassName('CD')[0];

//暂停播放
var p = true;
aBtn[1].onclick = function() {
	if(p) {
		this.className = 'play'; //按钮的背景图
		oPoint.className = 'point active'; //唱片指针的状态
		oCD.style.animationPlayState = 'running'; //唱片的选装状态
		oAu.play();
	} else {
		this.className = '';
		oPoint.className = 'point';
		oCD.className = 'CD';
		oCD.style.animationPlayState = 'paused';
		oAu.pause();
	}
	proMove();  //播放实时修改进度条状态函数调用
	p = !p;
}

//静音控制
var m = true;
oMute.onclick = function() {
	if(m) {
		oAu.muted = true;
	} else {
		oAu.muted = false;
	}
	m = !m;
}

//控制音量
var oVol = document.getElementById('vol');
var oVolStro = oVol.getElementsByTagName('strong')[0];
oVolStro.onmousedown = function(ev) {
	var newEv = ev || event;
	var beginX = newEv.clientX;
	var beginW = oVol.offsetWidth;
	document.onmousemove = function(ev) {
		var newEv = ev || event;
		var w = beginW + newEv.clientX - beginX;
		if(w < 0) {
			w = 0;
		}
		if(w > 100) {
			w = 100;
		}

		oVol.style.width = w + 'px';
		oAu.volume = w / 100; //根据拖拽的距离，等比改变音量大小
	}
	document.onmouseup = function() {
		this.onmousemove = null;
	}
}

//音乐的进度

$('drag').onmousedown = function(ev) {
	var newEv = ev || event;
	var beginX = newEv.clientX;
	var beginW = $('line').offsetWidth;

	document.onmousemove = function(ev) {
		var newEv = ev || event;
		var w = beginW + newEv.clientX - beginX;
		if(w < 0) {
			w = 0;
		}
		if(w > 436) {
			w = 436;
		}

		$('line').style.width = w + 'px';
		oAu.currentTime = w / 436 * dur;
		$('current').innerHTML = changeTime(w / 436 * dur)
		moveLrc(changeTime(w / 436 * dur));
	}
	document.onmouseup = function() {
		this.onmousemove = null;
	}
}

function changeTime(t) { //处理时间格式的方法
	var m = Math.floor(t / 60);
	var s = Math.round(t % 60);
	return doubleFn(m) + ':' + doubleFn(s)
}

function doubleFn(n) {
	var m;
	n < 10 ? m = '0' + n : m = n;
	return m;
}

//当音乐播放过程中,改变进度条的状态
var mover=null;
function proMove(){
	if(p){
		mover = setInterval(function(){
//		c/dur = w/436
			var moveW = oAu.currentTime/dur*436;
			$('line').style.width = moveW + 'px';
			$('current').innerHTML = changeTime(oAu.currentTime);
			moveLrc(changeTime(oAu.currentTime));
		},1000)
	}else{
		clearInterval(mover);
	}
}

//歌词动态交互
//(1)生成歌词
var strLrc = '';
for(var attr in lrc){
	strLrc+='<li data-time="'+attr+'">'+lrc[attr]+'</li>'
//	console.log(lrc[attr]);
}
$('lrc').innerHTML = strLrc;
//(2)歌词动画函数
var aLi = $('lrc').getElementsByTagName('li');
var Len = aLi.length;
function moveLrc(t){
	for(var i=0;i<Len;i++){
		if(aLi[i].getAttribute('data-time')==t){
			for(var j=0;j<Len;j++){
				aLi[j].className = '';
			}
			aLi[i].className = 'active';
			console.log(aLi[i].offsetTop);
			if(aLi[i].offsetTop>=150){
				$('lrc').style.top = -(aLi[i].offsetTop-150)+'px';
			}
		}
	}
}
