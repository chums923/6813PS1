// This allows the Javascript code inside this block to only run when the page
// has finished loading in the browser.
$(function() {
	var lang_to		  = "English";
	var lang_from	  = "Spanish";
	var current_dict  = dicts[lang_to][lang_from]; // keys: words in @lang_to, values: corresponding words in @lang_from 	

	// Your code here
	var reverseLookup = function(value) {
		for (var k in current_dict) {
			if (current_dict[k] == value) {
				return k;
			}
		}
	};

	var checkMatch = function(first, second) {
		if (current_dict[second] == first) {
			return true;
		} else {
			return false;
		}
	};

	var populateBottom = function(correct, first, second) {
		var answerCount = $('.englishPopulate').length;
		if (answerCount != $('.spanishPopulate').length){
			location.reload();
		}
		if (answerCount != $('.answerPopulate').length){
			location.reload();
		}
		var firstSpanish = $(".spanishPopulate").first();
		var firstEnglish = $(".englishPopulate").first();
		var firstAnswer = $(".answerPopulate").first();
		if (answerCount > 5) {
			//Take out the bottom one
			$(".spanishPopulate").last().remove();
			$(".englishPopulate").last().remove();
			$(".answerPopulate").last().remove();
		}
		//Simply prepend a combination
		if (correct) {
			$('<div class="spanishPopulate" id="spanishStaticCorrect">'+first+'</div>').insertBefore(firstSpanish);
			$('<div class="englishPopulate" id="englishStaticCorrect">'+second+'</div>').insertBefore(firstEnglish);
			$('<div class="answerPopulate" id="answerStaticCorrect">&#10004;</div>').insertBefore(firstAnswer);
		}	
		else {
			$('<div class="spanishPopulate" id="spanishStaticWrong">'+first+'</div>').insertBefore(firstSpanish);
			$('<div class="englishPopulate" id="englishStaticWrong">'+second+'</div>').insertBefore(firstEnglish);
			$('<div class="answerPopulate" id="answerStaticWrong">'+reverseLookup(first)+'</div>').insertBefore(firstAnswer);
		}
	};

	var autocompleteSubmitAction = function(input) {
		var second = input,
		   	first  = $("#spanishCurrent").text();
		if (second == '' || second == null || second == undefined) {
			return;
		}
		if (checkMatch(first, second)) {
			setupGame(true, first, second);
		} else {
			setupGame(false, first, second);
		}
	};

	var submitAction = function() {
		var second = $("#englishInput").val(),
		   	first  = $("#spanishCurrent").text();
		if (second == '' || second == null || second == undefined) {
			return;
		}
		if (checkMatch(first, second)) {
			setupGame(true, first, second);
		} else {
			setupGame(false, first, second);
		}
	};

	var setupGame = function(correct, first, second) {	
		if (correct) {
			//populate with blue word, blue word, and check
			populateBottom(true, first, second);
		} else {
			//populate with red word, crossed red word, and red word 
			populateBottom(false, first, second);
		}
		//Get new random
		runGame(function() {
			$("#englishInput").val("");
			//Refocus input
			$("#englishInput").focus();
		});
	};

	var runGame = function(cb) {
		//Find random value
		var length = Object.keys(current_dict).length;
		var random = Math.floor(Math.random()*length);
		var count = 0;
		for (var key in current_dict) {
			if (count == random) {
				var ranValue = current_dict[key];
			}
			count ++;
		}		
		//Set the random value
		$("#spanishCurrent").text(ranValue);
		cb();
	};

	//Global variables
	var englishWords = [];
	for (var k in current_dict) {
		englishWords.push(k);
	}
	$('#englishInput').autocomplete({
		minLength : 2,
		source : englishWords,
		select : function(event, ui) {
			autocompleteSubmitAction(ui.item.label);
			$(this).val('');
			return false;
		}
	});

	//Global actions
	//Submit click
	$("#submitButton").click(submitAction);
	//Enter submit
	$('#englishInput').keyup(function (e) {
        	if(e.which === 13) {
        		var tmp = $('#englishInput').data().uiAutocomplete.term;
        		console.log(tmp);
        		$('#englishInput').data().uiAutocomplete.term = null;
            	$(".ui-menu-item").hide();
            	autocompleteSubmitAction(tmp);
        	}            
    });
    //Highlight matching part of the dropdown
    $.ui.autocomplete.prototype._renderItem = function (ul, item) {
        item.label = item.label.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + $.ui.autocomplete.escapeRegex(this.term) + ")(?![^<>]*>)(?![^&;]+;)", "gi"), "<strong>$1</strong>");
        return $("<li></li>")
            .data("item.autocomplete", item)
            .append("<a>" + item.label + "</a>")
            .appendTo(ul);
    };
	runGame(function() {});
});
