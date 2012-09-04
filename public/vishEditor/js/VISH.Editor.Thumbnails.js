VISH.Editor.Thumbnails = (function(V,$,undefined){
	
	var carrouselDivId = "slides_carrousel";
	
	
	var init = function(){ }
	 
	 
	var redrawThumbnails = function(){

		//Clean previous content
		VISH.Editor.Carrousel.cleanCarrousel(carrouselDivId);
		$("#" + carrouselDivId).hide();

		//Generate carrousel images
		var carrouselImages = [];
		var carrouselImagesTitles = [];

		var carrouselElements = 0;
		$('article').each(function(index,s){
			var template = $(s).attr('template');
			carrouselElements += 1;
			carrouselImages.push($("<img class='image_barbutton fill_slide_button' slideNumber='" + carrouselElements + "' action='goToSlide' src='" + VISH.ImagesPath + "templatesthumbs/"+ template + ".png' />"));
			carrouselImagesTitles.push(carrouselElements);
		});

		//Add plus button
		carrouselImages.push($("<img class='image_barbutton add_slide_button' action='plus' id='addslidebutton' src='" + VISH.ImagesPath + "templatesthumbs/add_slide.png' />"));
		carrouselElements += 1;

		if(carrouselElements<8){
			//Fill with default
			var i;
			for(i=0+carrouselElements;i<8;i++){
				carrouselImages.push($("<img class='image_barbutton empty_slide_button' action='default' src='" + VISH.ImagesPath + "templatesthumbs/default.png' />"));
				carrouselElements += 1;
			}
		}

		VISH.Utils.loader.loadImagesOnCarrouselOrder(carrouselImages,_onImagesLoaded,carrouselDivId,carrouselImagesTitles); 	
	};
	 

	var _onImagesLoaded = function(){	
		//Add button events
		$(".add_slide_button").hover(
			function () {
				$(this).attr("src", VISH.ImagesPath + "hover/add_slide.png");
			},
			function () {
				$(this).attr("src", VISH.ImagesPath + "templatesthumbs/add_slide.png");
			}
		);
		
		//Unselect all thumbnails
		$(".barbutton").css("background-color", "transparent");
		 
		var options = new Array();
		options['rows'] = 1;
		options['callback'] = _onClickCarrouselElement;
		options['rowItems'] = 8;
		options['scrollItems'] = 1;
		options['styleClass'] = "slides";
		options['width'] = 900;
		options['startAtLastElement'] = true;
		options['pagination'] = false;
		$("#" + carrouselDivId).show();
		VISH.Editor.Carrousel.createCarrousel(carrouselDivId, options);


		//Add sortable
		var firstCarrouselNumber;
		$( "#" + carrouselDivId).sortable({ 
			items: 'div.carrousel_element_single_row_slides:has(img[action="goToSlide"])',
			change: function(event, ui) {
				//Do nothing
			},
			start: function(event, ui) { 
				firstCarrouselNumber = parseInt($($("div.carrousel_element_single_row_slides")[0]).find("img.carrousel_element_single_row_slides").attr("slidenumber"));
			},
			stop: function(event, ui) { 
				var dragElement = ui.item;
				var img = $(ui.item).find("img.carrousel_element_single_row_slides");
				if(isNaN($(img).attr("slidenumber"))){
					return;
				}

				var orgPosition = parseInt($(img).attr("slidenumber"));
				var destPosition = firstCarrouselNumber + $("div.carrousel_element_single_row_slides").index($("div.carrousel_element_single_row_slides:has(img[slidenumber='" + orgPosition + "'])"));

				// V.Debugging.log("firstCarrouselNumber: " + firstCarrouselNumber);
				// V.Debugging.log("Org position: " + orgPosition);
				// V.Debugging.log("Dest position: " + destPosition);

				//We must move slide orgPosition after or before destPosition
				var movement = null;
				if(destPosition > orgPosition){
					movement = "after";
				} else if(destPosition < orgPosition){
					movement = "before";
				} else {
					return;
				}

				var slideOrg = VISH.Slides.getSlideWithNumber(orgPosition);
				var slideDst= VISH.Slides.getSlideWithNumber(destPosition);

				if((slideOrg!=null)&&(slideDst!=null)&&(movement!=null)){
					VISH.Slides.moveSlideTo(slideOrg, slideDst, movement);

					//Update params and counters
					var carrouselVisibleElements = 8;
					$.each($("div.carrousel_element_single_row_slides:has(img[slidenumber])"), function(index, value) {
						var slideNumber = $(value).find("img.carrousel_element_single_row_slides").attr("slidenumber");
						if((slideNumber < firstCarrouselNumber)||(slideNumber > firstCarrouselNumber+carrouselVisibleElements-1)){
							return;
						} else {
							var slideNumber = firstCarrouselNumber + index;
							var p = $(value).find("p.carrousel_element_single_row_slides");
							$(p).html(slideNumber);
							var img = $(value).find("img.carrousel_element_single_row_slides");
							$(img).attr("slidenumber",slideNumber);
						}
					});
				}
			}
		});
  }
	
	
	var _onClickCarrouselElement = function(event){
		switch($(event.target).attr("action")){
			case "plus":
				$("#addSlideFancybox").trigger('click');
			  break;
			case "goToSlide":
			  VISH.Slides.goToSlide($(event.target).attr("slideNumber"));
			  break;
			default:
			  break;
		}
	}
	
	
  /**
   * function to select the thumbnail
   */
  var selectThumbnail = function(no){
		$(".image_barbutton").removeClass("selectedSlideThumbnail");
		$(".image_barbutton[slideNumber=" + no + "]").addClass("selectedSlideThumbnail");
  };
    	
  
	return {
		init              : init,
		redrawThumbnails  : redrawThumbnails,
		selectThumbnail	  : selectThumbnail
	};

}) (VISH, jQuery);