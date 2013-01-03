VISH.ViewerAdapter = (function(V,$,undefined){
	var page_is_fullscreen = false; //it always init without fullscreen

	/**
	 * Initializer
	 */
	 var init = function(){
	 	_initPager();
	 	setupSize(false);
	 }

	/**
	 * function to adapt the slides to the screen size, in case the editor is shown in another iframe
	 * param "fullscreen" indicates that the call comes from a fullscreen button
	 */
	var setupSize = function(fullscreen){
		var reserved_px_for_menubar; //we don´t show the menubar
		var margin_height;
		var margin_width;

		if (V.Status.getDevice().mobile) {
			reserved_px_for_menubar = 0; //we don´t show the menubar
			margin_height = 0;
			margin_width = 0;
		} else {
			if(fullscreen && !page_is_fullscreen){
					//exit fullscreen
					page_is_fullscreen = true;
					reserved_px_for_menubar = 0; //we don´t show the menubar
					margin_height = 0;
					margin_width = 0;
			} else {
				page_is_fullscreen = false;
				if(VISH.Slides.getSlidesQuantity()>1){
					reserved_px_for_menubar = 40;
				} else {
					reserved_px_for_menubar = 0;
				}							
				margin_height = 40;
				margin_width = 30;
			}
		}
		
		var height = $(window).height() - reserved_px_for_menubar; //the height to use is the window height - 40px that is the menubar height
		var width = $(window).width();
		var finalW = 800;
		var finalH = 600;
		//VISH.Debugging.log("height " + height);
		//VISH.Debugging.log("width " + width);
		var aspectRatio = width/height;
		var slidesRatio = 4/3;
		if(aspectRatio > slidesRatio){
			finalH = height - margin_height;  //leave 40px free, 20 in the top and 20 in the bottom ideally
			finalW = finalH*slidesRatio;	
		}	else {
			finalW = width - margin_width; //leave 110px free, at least, 55 left and 55 right ideally
			finalH = finalW/slidesRatio;	
		}
		//VISH.Debugging.log("finalH " + finalH);
		//VISH.Debugging.log("finalW " + finalW);
		$(".slides > article").css("height", finalH);
		$(".slides > article").css("width", finalW);
		$(".subslide").css("height", finalH);
		$(".subslide").css("width", finalW);

		//margin-top and margin-left half of the height and width
		var marginTop = finalH/2 + reserved_px_for_menubar/2;
		var marginLeft = finalW/2;
		$(".slides > article").css("margin-top", "-" + marginTop + "px");
		$(".slides > article").css("margin-left", "-" + marginLeft + "px");
		
		$(".subslide").css("margin-top", "-" + finalH/2 + "px");
		$(".subslide").css("margin-left", "-" + marginLeft + "px");	
		
		//finally font-size, line-height and letter-spacing of articles
		//after this change the font sizes of the zones will be relative as they are in ems
		var increase = finalH/600;
		var font_size = V.Status.getDevice().mobile ? 15:16 ;
		
		$(".slides > article").css("font-size", font_size*increase + "px");
		$(".slides > article").css("line-height", font_size*increase + "px");
		$(".subslide").css("font-size", font_size*increase + "px");
		$(".subslide").css("line-height", font_size*increase + "px");
		
		//and now the arrows have to be increased or decreased
		$(".fc_poi img").css("width", 50*increase + "px");
		$(".fc_poi img").css("height", 50*increase + "px");
		
		//if fancybox is opened, resize it
		if ($('#fancy_content:empty').length === 0)
		{	
		   $('#fancybox-inner').width("80%");
			$('#fancybox-wrap').width("80%");

			$("#fancybox-content").width("80%");
			$("#fancybox-content > div").width("100%");
			$('#fancybox-inner').height("80%");
			$('#fancybox-wrap').height("80%");	
			
			$('#fancybox-wrap').css("top", "10%");	
			$('#fancybox-wrap').css("left", "10%");	
			

		}

		//Snapshot callbacks
		VISH.SnapshotPlayer.aftersetupSize(increase);
		
		//Object callbacks
		VISH.ObjectPlayer.aftersetupSize(increase);		
	};


	var setupElements = function(){
		//if page is fullscreen, it means we are exiting it
		if(page_is_fullscreen){
			_onLeaveFullScreen();
		} else {
			_onEnterFullScreen();
		}
	};

	var _onEnterFullScreen = function(){
		$("#page-fullscreen").css("background-position", "-45px 0px");
		$("#page-fullscreen").hover(function(){
			$("#page-fullscreen").css("background-position", "-45px -40px");
		}, function() {
			$("#page-fullscreen").css("background-position", "-45px 0px");
		});
		_decideIfViewBarShow(true);
	}

	var _onLeaveFullScreen = function(){
		$("#page-fullscreen").css("background-position", "0px 0px");
		$("#page-fullscreen").hover(function(){
			$("#page-fullscreen").css("background-position", "0px -40px");
		}, function() {
			$("#page-fullscreen").css("background-position", "0px 0px");
		});
		_decideIfViewBarShow(false);
	}

	var _decideIfViewBarShow = function(fullScreen){
		if(!fullScreen){
			if(VISH.Slides.getSlidesQuantity()>1){
				$("#viewbar").show();
			} else {
				$("#viewbar").hide();
			}
		} else {
			$("#viewbar").hide();
		}
	}
	
	/**
	* Method to add the src to the iframe, show it, hide the slides, and so on
	*/
	var setupGame = function(presentation){
		$("#my_game_iframe").attr("src", presentation.game.src);
		//load file game.css dinamically
		var fileref=document.createElement("link");
  		fileref.setAttribute("rel", "stylesheet");
  		fileref.setAttribute("type", "text/css");
  		fileref.setAttribute("href", "stylesheets/game/game.css");
  		document.getElementsByTagName("body")[0].appendChild(fileref);
	};


	var _initPager = function(){
		if(V.Status.getDevice().desktop){
			$("#back_arrow").html("");
			$("#forward_arrow").html("");

			if(VISH.Slides.getSlidesQuantity()>1){
				$("#viewbar").show();
				VISH.SlideManager.updateSlideCounter();
			} else {
				$("#viewbar").hide();
			}
		} else {
			$("#viewbar").hide();
		}
	}


	/**
	 * Function to hide/show the page-switchers buttons in the viewer
	 * hide the left one if on first slide
	 * hide the right one if on last slide
	 * show both otherwise
	 */
	var decideIfPageSwitcher = function(){
		if(VISH.Slides.isCurrentFirstSlide()){
			$("#back_arrow").hide();
		} else {
			$("#back_arrow").show();
		} 
		if (VISH.Slides.isCurrentLastSlide()){
			$("#forward_arrow").hide();		
		} else {
			$("#forward_arrow").show();
		}

		if(!page_is_fullscreen && !V.Status.getDevice().mobile){
			if(VISH.Slides.isCurrentFirstSlide()){
				$("#page-switcher-start").hide();			
			} else {
				$("#page-switcher-start").show();
			}  
			if(VISH.Slides.isCurrentLastSlide()){
				$("#page-switcher-end").hide();	
			} else {
				$("#page-switcher-end").show();
			}
		}		
	};
	
	return {
		init 					: init,
		decideIfPageSwitcher	: decideIfPageSwitcher,
		setupElements			: setupElements,
		setupGame				: setupGame,
		setupSize				: setupSize
	};
}) (VISH, jQuery);
