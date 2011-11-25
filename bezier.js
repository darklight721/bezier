// JavaScript Document

myNameSpace = function(){

	var mColorCanvas = "#708090";
	var mLineColor = "#fff";
	var mLineCount = 20;
	var mLineWidth = 1;
	
	var mMouseDown = false;
	var mShowOptions = false;

	// Start of Public Functions **************************************************************************
	function init()
	{
		resizeControls();
		
		// disable default behavior for touchmove
		document.body.addEventListener('touchmove', function(event) {
			event.preventDefault();
		}, false);
		
		control.addEventListener('touchstart',showOptions,false);
		
		if (navigator.userAgent.indexOf('iPad') != -1 || navigator.userAgent.indexOf('iPhone') != -1 || navigator.userAgent.indexOf('iPod') != -1)
		{
			// add touch event listeners
			layer.addEventListener('touchstart', function(event) {
				layer.innerHTML="";
				
				if (mShowOptions)
					ShowOptions();
				
				canvasTouched(event);
			}, false);
			
			layer.addEventListener('touchmove', function(event) {
				canvasTouched(event);
			}, false);
		}
		else
		{
			/*
			layer.addEventListener("click",function(event){
				layer.innerHTML="";
				canvasClicked(event);
			},false);
			*/
			
			layer.addEventListener("mousedown",function(event){
				layer.innerHTML="";
				mMouseDown = true;
				
				if (mShowOptions)
					showOptions();
				
				canvasClicked(event);
			},false);
			
			layer.addEventListener("mousemove",function(event){
				canvasClicked(event);
			},false);
			
			layer.addEventListener("mouseup",function(event){
				mMouseDown = false;
			},false);
		}
	
	}
	
	function resizeControls()
	{	
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		
		layer.style.top = "5px";
		layer.style.left = "5px";
		layer.style.width = window.innerWidth - 12 + "px";		// 12 = leftPadding + rightPadding + leftBorder + rightBorder
		layer.style.height = window.innerHeight - 12 + "px";	// 12 = leftPadding + rightPadding + leftBorder + rightBorder
		
		control.style.top = window.innerHeight - control.offsetHeight - 10 + "px";
		control.style.left = "10px";
		
		options.style.left = "10px";
		mShowOptions = true;
		showOptions();
		
		fillBackground(canvas,mColorCanvas);
	}
	
	function showOptions()
	{		
		
		if (mShowOptions)
		{
			options.style.top = window.innerHeight + "px";
			options.style.opacity = "0";
			
			control.innerHTML = "&#9651;";
			applyOptions();
		}
		else
		{
			options.style.top = control.offsetTop - options.offsetHeight - 5 + "px";
			options.style.opacity = "1";
			
			control.innerHTML = "&#9661;";
		}
		
		mShowOptions = !mShowOptions;
		
	}
	
	function exportCanvas()
	{
		window.open(canvas.toDataURL("image/png"));
	}
	
	// End of Public Functions ****************************************************************************
	
	function canvasTouched(event)
	{
		var startX = -1;
		var startY = -1;
		var endX = -1;
		var endY = -1;
		
		// If there's exactly one finger inside this element
		if (event.targetTouches.length > 0) 
		{
			var touchStart = event.targetTouches[0];
			
			startX = touchStart.pageX;
			startY = touchStart.pageY;
			
			if (event.targetTouches.length > 1)
			{
				var touchEnd = event.targetTouches[1];
				
				endX = touchEnd.pageX;
				endY = touchEnd.pageY;
			}
		}
		
		fillBackground(canvas,mColorCanvas);
		drawBezier(canvas,startX,startY,endX,endY);	
	}
	
	function canvasClicked(event)
	{
		if (mMouseDown)
		{
			var x, y;
			
			// get the mouse position
			if (event.pageX || event.pageX == 0) // for chrome/safari
			{
				x = event.pageX - canvas.offsetLeft;
				y = event.pageY - canvas.offsetTop;
			}
			else if (event.layerX || event.layerX == 0) // for firefox
			{
				x = event.layerX;
				y = event.layerY;
			}      
			else if (event.offsetX || event.offsetX == 0) // for opera
			{
				x = event.offsetX;
				y = event.offsetY;
			}
			
			fillBackground(canvas,mColorCanvas);
			drawBezier(canvas,x,y,-1,-1);
		}
	}
	
	function fillBackground(canvas,color)
	{
		var context = canvas.getContext('2d');
		
		// clear canvas
		context.clearRect(0,0,canvas.width,canvas.height);
		
		var centerX = canvas.width/2;
		var centerY = canvas.height/2;
		
		var gradient = context.createRadialGradient(centerX,centerY,0,centerX,centerY,Math.max(canvas.width,canvas.height));
		gradient.addColorStop(0,color);
		gradient.addColorStop(1,"#000");
		
		context.fillStyle = gradient;
		context.fillRect(0,0,canvas.width,canvas.height);		
	}
	
	function drawBezier(canvas,startX,startY,endX,endY)
	{
		var context = canvas.getContext('2d');           
		
		var x, y, i;
		
		// draw bezier
		for(i = 0; i < mLineCount;i++)
		{
			context.beginPath();
			context.lineWidth = mLineWidth;
			context.strokeStyle = mLineColor;
			
			if (endX == -1 || endY == -1)
			{                 
				if (parseInt(Math.random()*2))
				{
					x = (parseInt(Math.random()*2))?0:canvas.width;
					y = Math.random()*canvas.height;
				}
				else
				{
					x = Math.random() * canvas.width;
					y = (parseInt(Math.random()*2))?0:canvas.height;
				}
			}
			else
			{
				x = endX;
				y = endY;
			}
			
			context.moveTo(startX,startY);
			context.bezierCurveTo(Math.random()*canvas.width,
								  Math.random()*canvas.height,
								  Math.random()*canvas.width,
								  Math.random()*canvas.height,
								  x,
								  y);
			context.stroke();
		}
	}
	
	function applyOptions()
	{
		mLineCount = lineCount.value;
		mLineWidth = lineWidth.value;
		mLineColor = lineColor.value;
		mColorCanvas = backColor.value;
	}
	
	return {
		init: init,
		resizeControls: resizeControls,
		showOptions: showOptions,
		exportCanvas: exportCanvas
	}
	
}();