//jQuery to collapse the navbar on scroll
if (window.matchMedia("(min-width: 992px)").matches){
	$(window).scroll(function() {
	    if ($(".navbar").offset().top > 50) {
	        $(".navbar").addClass("top-nav-collapse");
	    } else {
	        $(".navbar").removeClass("top-nav-collapse");
	    }
	});
};
//jQuery for page scrolling feature - requires jQuery Easing plugin
$(function() {
    $(document).on('click', 'a.nav-link', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('data-target')).offset().top
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    });
});
$(function() {
	$('.nav-item a').click(function(){
		 $('#navbar-menu').removeClass("show");
	});
});