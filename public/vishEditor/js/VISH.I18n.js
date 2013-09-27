VISH.I18n = (function(V,$,undefined){
	
	var translations;
	var defaultTranslations;
	var language;

	/**
	 * Function to do the language translation
	 */
	var init = function(lang){
		// var initTime = new Date().getTime();

		//Set default translation
		switch(V.Configuration.getConfiguration().mode){
			case V.Constant.NOSERVER:
				if (typeof(i18n["vish"]["default"])!='undefined'){
					defaultTranslations = i18n["vish"]["default"];
				}
				break;
			case V.Constant.VISH:
				if (typeof(i18n["vish"]["default"])!='undefined'){
					defaultTranslations = i18n["vish"]["default"];
				}
				break;
			case V.Constant.STANDALONE:
				if (typeof(i18n["standalone"]["default"])!='undefined'){
					defaultTranslations = i18n["standalone"]["default"];
				}
				break;
		}

		//Set lang specific translation
		if(typeof lang != "undefined"){
			language = lang;
		} else {
			return;
		}
		
		switch(V.Configuration.getConfiguration().mode){
			case V.Constant.NOSERVER:
				if (typeof(i18n["vish"][language])!='undefined'){
					translations = i18n["vish"][language];
				}
				break;
			case V.Constant.VISH:
				if (typeof(i18n["vish"][language])!='undefined'){
					translations = i18n["vish"][language];
					defaultTranslations = i18n["vish"]["default"];
				}
				break;
			case V.Constant.STANDALONE:
				if (typeof(i18n["standalone"][language])!='undefined'){
					translations = i18n["standalone"][language];
					defaultTranslations = i18n["standalone"]["default"];
				}
				break;
		}

		if (typeof(translations)=='undefined'){
			return;
		}

		$("[i18n-key]").each(function(index, elem){
			var translation = getTrans($(elem).attr("i18n-key"));
			if(translation!=null){
				switch(elem.tagName){
					 case "INPUT":
					 	_translateInput(elem,translation);
					 	break;
					 case "TEXTAREA":
					 	_translateTextArea(elem,translation);
					 	break;
					 case "DIV":
					 	_translateDiv(elem,translation);
					 	break;
					 case "LI":
					 	_translateLI(elem,translation);
					 	break;
					default:
						//Generic translation (for h,p or span elements)
						_genericTranslate(elem,translation);
						break;
				}
			}
		});

		// Translate images (if any)

		// var duration = new Date().getTime() - initTime;
		// V.Debugging.log("Internationalization took " + duration + " ms.");
	};
		
	var _translateInput = function(input,translation){
		if($(input).val()!==""){
			$(input).val(translation);
		}
		if($(input).attr("placeholder")){
			$(input).attr("placeholder", translation);
		}
	}

	var _translateDiv = function(div,translation){
		if($(div).attr("title") != undefined){
			$(div).attr("title", translation);
		}
		if($(div).attr("data-text") != undefined){
			$(div).attr("data-text", translation);
		}
	}

	var _translateTextArea = function(textArea,translation){
		$(textArea).attr("placeholder", translation);
	}

	var _translateLI = function(elem,translation){
		if($(elem).attr("data-text") != undefined){
			$(elem).attr("data-text", translation);
		} else {
			_genericTranslate(elem,translation);
		}
	}

	var _genericTranslate = function(elem,translation){
		$(elem).text(translation);
	}

	/**
	 * Function to translate a text
	 */
	var getTrans = function(s) {
		if (typeof(translations)!= 'undefined' && translations[s]) {
			return translations[s];
		}
		// V.Debugging.log("Text without translation: " + s);

		//Search in default language
		if (typeof(defaultTranslations)!= 'undefined' && defaultTranslations[s]) {
			return defaultTranslations[s];
		}
		// V.Debugging.log("Text without default translation: " + s);

		//Don't return s if s is a key.
		var key_pattern =/^i\./g;
		if(key_pattern.exec(s)!=null){
			return null;
		} else {
			return s;
		}
	};

	/**
	 * Return the current language
	 */
	var getLanguage = function(){
		return language;
	}

	return {
		init 			: init,
		getTrans 		: getTrans,
		getLanguage		: getLanguage
	};

}) (VISH, jQuery);