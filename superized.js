/*
Supersized - Fullscreen Slideshow jQuery Plugin
By Sam Dunn (www.buildinternet.com // www.onemightyroar.com)
Version: supersized.2.0.js // Relase Date: 5/7/09
Website: www.buildinternet.com/project/supersized
Thanks to Aen for preloading, fade effect, & vertical centering
*/

(function(jQuery){

	//Resize image on ready or resize
	jQuery.fn.supersized = function() {
		jQuery.inAnimation = false;
		jQuery.paused = false;
		var options = jQuery.extend(jQuery.fn.supersized.defaults, jQuery.fn.supersized.options);
		
		jQuery(window).bind("load", function(){
			jQuery('#loading').hide();
			jQuery('#supersize').fadeIn('fast');
			jQuery('.main').show();
			if (jQuery('#slideshow .activeslide').length == 0) jQuery('#supersize a:first').addClass('activeslide');
			if (options.slide_captions == 1) jQuery('#slidecaption').html(jQuery('#supersize .activeslide').find('img').attr('title'));
			if (options.navigation == 0) jQuery('#navigation').hide();
			//Slideshow
			if (options.slideshow == 1){
				if (options.slide_counter == 1){ //Initiate slide counter if active
					jQuery('#slidecounter .slidenumber').html(1);
	    			jQuery('#slidecounter .totalslides').html(jQuery("#supersize > *").size());
	    		}
				slideshow_interval = setInterval("nextslide()", options.slide_interval);
				if (options.navigation == 1){ //Skip if no navigation
					jQuery('#navigation a').click(function(){  
   						jQuery(this).blur();  
   						return false;  
   					}); 	
					//Slide Navigation
				    jQuery('#nextslide').click(function() {
				    	if(jQuery.paused) return false; if(jQuery.inAnimation) return false;
					    clearInterval(slideshow_interval);
					    nextslide();
					    slideshow_interval = setInterval(nextslide, options.slide_interval);
					    return false;
				    });
				    jQuery('#prevslide').click(function() {
				    	if(jQuery.paused) return false; if(jQuery.inAnimation) return false;
				        clearInterval(slideshow_interval);
				        prevslide();
				        slideshow_interval = setInterval(nextslide, options.slide_interval);
				        return false;
				    });
					jQuery('#nextslide img').hover(function() {
						if(jQuery.paused == true) return false;
					   	jQuery(this).attr("src", "images/forward.gif");
					}, function(){
						if(jQuery.paused == true) return false;
					    jQuery(this).attr("src", "images/forward_dull.gif");
					});
					jQuery('#prevslide img').hover(function() {
						if(jQuery.paused == true) return false; 
					    jQuery(this).attr("src", "images/back.gif");
					}, function(){
						if(jQuery.paused == true) return false;
					    jQuery(this).attr("src", "images/back_dull.gif");
					});
					
				    //Play/Pause Button
				    jQuery('#pauseplay').click(function() {
				    	if(jQuery.inAnimation) return false;
				    	var src = (jQuery(this).find('img').attr("src") === "images/play.gif") ? "images/pause.gif" : "images/play.gif";
      					if (src == "images/pause.gif"){
      						jQuery(this).find('img').attr("src", "images/play.gif");
      						jQuery.paused = false;
					        slideshow_interval = setInterval(nextslide, options.slide_interval);  
				        }else{
				        	jQuery(this).find('img').attr("src", "images/pause.gif");
				        	clearInterval(slideshow_interval);
				        	jQuery.paused = true;
				        }
      					jQuery(this).find('img').attr("src", src);
					    return false;
				    });
				    jQuery('#pauseplay').mouseover(function() {
				    	var imagecheck = (jQuery(this).find('img').attr("src") === "images/play_dull.gif");
				    	if (imagecheck){
      						jQuery(this).find('img').attr("src", "images/play.gif"); 
				        }else{
				        	jQuery(this).find('img').attr("src", "images/pause.gif");
				        }
				    });
				    
				    jQuery('#pauseplay').mouseout(function() {
				    	var imagecheck = (jQuery(this).find('img').attr("src") === "images/play.gif");
				    	if (imagecheck){
      						jQuery(this).find('img').attr("src", "images/play_dull.gif"); 
				        }else{
				        	jQuery(this).find('img').attr("src", "images/pause_dull.gif");
				        }
				        return false;
				    });
				}
			}
		});
				
		jQuery(document).ready(function() {
			jQuery('#supersize').resizenow(); 
		});
		
		//Pause when hover on image
		jQuery('#supersize > *').hover(function() {
	   		if (options.slideshow == 1 && options.pause_hover == 1){
	   			if(!(jQuery.paused) && options.navigation == 1){
	   				jQuery('#pauseplay > img').attr("src", "images/pause.gif"); 
	   				clearInterval(slideshow_interval);
	   			}
	   		}
	   		original_title = jQuery(this).find('img').attr("title");
	   		if(jQuery.inAnimation) return false; else jQuery(this).find('img').attr("title","");
	   	}, function() {
			if (options.slideshow == 1 && options.pause_hover == 1){
				if(!(jQuery.paused) && options.navigation == 1){
					jQuery('#pauseplay > img').attr("src", "images/pause_dull.gif");
					slideshow_interval = setInterval(nextslide, options.slide_interval);
				} 
			}
			jQuery(this).find('img').attr("title", original_title);	
	   	});
		
		jQuery(window).bind("resize", function(){
    		jQuery('#supersize').resizenow();
			 
		});
		
		jQuery('#supersize').hide();
		//jQuery('.main').hide();
	};
	
	//Adjust image size
	jQuery.fn.resizenow = function() {
		var options = jQuery.extend(jQuery.fn.supersized.defaults, jQuery.fn.supersized.options);
	  	return this.each(function() {
	  		
			//Define image ratio
			var ratio = options.startheight/options.startwidth;
			
			//Gather browser and current image size
			var imagewidth = jQuery(this).width();
			var imageheight = jQuery(this).height();
			var browserwidth = jQuery(window).width();
			var browserheight = jQuery(window).height()-200;
			var offset;

			//Resize image to proper ratio
			if ((browserheight/browserwidth) > ratio){
				
			    jQuery(this).height(browserheight);
			    jQuery(this).width(browserheight / ratio);
			    jQuery(this).children().height(browserheight);
			    jQuery(this).children().width(browserheight / ratio);
			} else {
				//alert(browserwidth)
			    jQuery(this).width(browserwidth);
			    jQuery(this).height(browserwidth * ratio);
			    jQuery(this).children().width(browserwidth );
			    jQuery(this).children().height(browserwidth * ratio);
			}
			if (options.vertical_center == 1){
				var position = jQuery(".nav_wrapper").height();
				//alert(position)
				if ((browserheight/browserwidth) > ratio){
				jQuery(this).children().css('right', (jQuery(this).width()-browserwidth)-18);
				}
				else
				jQuery(this).children().css('right', (jQuery(this).width()-browserwidth));

				//jQuery(this).children().css('top', (position));
			  				jQuery(this).children().css('top', (browserheight - jQuery(this).height())/2+140);

			}
			return false;
		});
	};
	
	jQuery.fn.supersized.defaults = { 
			startwidth: 4,  
			startheight: 3,
			vertical_center: 1,
			slideshow: 1,
			navigation:1,
			transition: 1, //0-None, 1-Fade, 2-slide top, 3-slide right, 4-slide bottom, 5-slide left
			pause_hover: 0,
			slide_counter: 1,
			slide_captions: 1,
			slide_interval: 5000
	};
	
})(jQuery);

	//Slideshow Next Slide
	function nextslide() {
		if(jQuery.inAnimation) return false;
		else jQuery.inAnimation = true;
	    var options = jQuery.extend(jQuery.fn.supersized.defaults, jQuery.fn.supersized.options);
	    var currentslide = jQuery('#supersize .activeslide');
	    currentslide.removeClass('activeslide');
		
	    if ( currentslide.length == 0 ) currentslide = jQuery('#supersize a:last');
			
	    var nextslide =  currentslide.next().length ? currentslide.next() : jQuery('#supersize a:first');
	    var prevslide =  nextslide.prev().length ? nextslide.prev() : jQuery('#supersize a:last');
		
		
		//Display slide counter
		if (options.slide_counter == 1){
			var slidecount = jQuery('#slidecounter .slidenumber').html();
			currentslide.next().length ? slidecount++ : slidecount = 1;
		    jQuery('#slidecounter .slidenumber').html(slidecount);
		}
		
		jQuery('.prevslide').removeClass('prevslide');
		prevslide.addClass('prevslide');
		
		//Captions require img in <a>
	    if (options.slide_captions == 1) jQuery('#slidecaption').html(jQuery(nextslide).find('img').attr('title'));
		
	    nextslide.hide().addClass('activeslide')
	    	if (options.transition == 0){
	    		nextslide.show(); jQuery.inAnimation = false;
	    	}
	    	if (options.transition == 1){
	    		nextslide.fadeIn(750, function(){jQuery.inAnimation = false;});
	    	}
	    	if (options.transition == 2){
	    		nextslide.show("slide", { direction: "up" }, 'slow', function(){jQuery.inAnimation = false;});
	    	}
	    	if (options.transition == 3){
	    		nextslide.show("slide", { direction: "right" }, 'slow', function(){jQuery.inAnimation = false;});
	    	}
	    	if (options.transition == 4){
	    		nextslide.show("slide", { direction: "down" }, 'slow', function(){jQuery.inAnimation = false;});
	    	}
	    	if (options.transition == 5){
	    		nextslide.show("slide", { direction: "left" }, 'slow', function(){jQuery.inAnimation = false;});
	    	}
	    	
	    jQuery('#supersize').resizenow();//Fix for resize mid-transition
	    
	}
	
	//Slideshow Previous Slide
	function prevslide() {
		if(jQuery.inAnimation) return false;
		else jQuery.inAnimation = true;
	    var options = jQuery.extend(jQuery.fn.supersized.defaults, jQuery.fn.supersized.options);
	    var currentslide = jQuery('#supersize .activeslide');
	    currentslide.removeClass('activeslide');
		
	    if ( currentslide.length == 0 ) currentslide = jQuery('#supersize a:first');
			
	    var nextslide =  currentslide.prev().length ? currentslide.prev() : jQuery('#supersize a:last');
	    var prevslide =  nextslide.next().length ? nextslide.next() : jQuery('#supersize a:first');
		
		//Display slide counter
		if (options.slide_counter == 1){
			var slidecount = jQuery('#slidecounter .slidenumber').html();
			currentslide.prev().length ? slidecount-- : slidecount = jQuery("#supersize > *").size();
		    jQuery('#slidecounter .slidenumber').html(slidecount);
		}
		
		jQuery('.prevslide').removeClass('prevslide');
		prevslide.addClass('prevslide');
		
		//Captions require img in <a>
	    if (options.slide_captions == 1) jQuery('#slidecaption').html(jQuery(nextslide).find('img').attr('title'));
		
	    nextslide.hide().addClass('activeslide')
	    	if (options.transition == 0){
	    		nextslide.show(); jQuery.inAnimation = false;
	    	}
	    	if (options.transition == 1){
	    		nextslide.fadeIn(750, function(){jQuery.inAnimation = false;});
	    	}
	    	if (options.transition == 2){
	    		nextslide.show("slide", { direction: "down" }, 'slow', function(){jQuery.inAnimation = false;});
	    	}
	    	if (options.transition == 3){
	    		nextslide.show("slide", { direction: "left" }, 'slow', function(){jQuery.inAnimation = false;});
	    	}
	    	if (options.transition == 4){
	    		nextslide.show("slide", { direction: "up" }, 'slow', function(){jQuery.inAnimation = false;});
	    	}
	    	if (options.transition == 5){
	    		nextslide.show("slide", { direction: "right" }, 'slow', function(){jQuery.inAnimation = false;});
	    	}
	    	
	    	jQuery('#supersize').resizenow();//Fix for resize mid-transition
	}
