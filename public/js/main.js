(function ($) {
	("use strict");

	$(".chosen")[0] &&
		$(".chosen").chosen({
			width: "100%",
			allow_single_deselect: !0,
		});
	/*--------------------------
		 auto-size Active Class
		---------------------------- */
	$(".auto-size")[0] && autosize($(".auto-size"));
	/*--------------------------
		 Collapse Accordion Active Class
		---------------------------- */
	$(".collapse")[0] &&
		($(".collapse").on("show.bs.collapse", function (e) {
			$(this).closest(".panel").find(".panel-heading").addClass("active");
		}),
		$(".collapse").on("hide.bs.collapse", function (e) {
			$(this).closest(".panel").find(".panel-heading").removeClass("active");
		}),
		$(".collapse.in").each(function () {
			$(this).closest(".panel").find(".panel-heading").addClass("active");
		}));
	/*----------------------------
		 jQuery tooltip
		------------------------------ */
	$('[data-toggle="tooltip"]').tooltip();
	/*--------------------------
		 popover
		---------------------------- */
	$('[data-toggle="popover"]')[0] && $('[data-toggle="popover"]').popover();
	/*--------------------------
		 File Download
		---------------------------- */
	$(".btn.dw-al-ft").on("click", function (e) {
		e.preventDefault();
	});
	/*--------------------------
		 Sidebar Left
		---------------------------- */
	$("#sidebarCollapse").on("click", function () {
		$("#sidebar").toggleClass("active");
	});
	$("#sidebarCollapse").on("click", function () {
		$("body").toggleClass("mini-navbar");
		SmoothlyMenu();
	});
	$(".menu-switcher-pro").on("click", function () {
		var button = $(this).find("i.nk-indicator");
		button
			.toggleClass("notika-menu-befores")
			.toggleClass("notika-menu-after");
	});
	$(".menu-switcher-pro.fullscreenbtn").on("click", function () {
		var button = $(this).find("i.nk-indicator");
		button.toggleClass("notika-back").toggleClass("notika-next-pro");
	});
	/*--------------------------
		 Button BTN Left
		---------------------------- */

	$(".nk-int-st")[0] &&
		($("body").on("focus", ".nk-int-st .form-control", function () {
			$(this).closest(".nk-int-st").addClass("nk-toggled");
		}),
		$("body").on("blur", ".form-control", function () {
			var p = $(this).closest(".form-group, .input-group"),
				i = p.find(".form-control").val();
			p.hasClass("fg-float")
				? 0 == i.length &&
				  $(this).closest(".nk-int-st").removeClass("nk-toggled")
				: $(this).closest(".nk-int-st").removeClass("nk-toggled");
		})),
		$(".fg-float")[0] &&
			$(".fg-float .form-control").each(function () {
				var i = $(this).val();
				0 == !i.length &&
					$(this).closest(".nk-int-st").addClass("nk-toggled");
			});
	/*--------------------------
		 mCustomScrollbar
		---------------------------- */
	$(window).on("load", function () {
		$(".widgets-chat-scrollbar").mCustomScrollbar({
			setHeight: 460,
			autoHideScrollbar: true,
			scrollbarPosition: "outside",
			theme: "light-1",
		});
		$(".notika-todo-scrollbar").mCustomScrollbar({
			setHeight: 445,
			autoHideScrollbar: true,
			scrollbarPosition: "outside",
			theme: "light-1",
		});
		$(".comment-scrollbar").mCustomScrollbar({
			autoHideScrollbar: true,
			scrollbarPosition: "outside",
			theme: "light-1",
		});
	});
	/*----------------------------
	 jQuery MeanMenu
	------------------------------ */
	jQuery("nav#dropdown").meanmenu();

	/*----------------------------
	 wow js active
	------------------------------ */
	new WOW().init();

	/*----------------------------
	 owl active
	------------------------------ */
	$("#owl-demo").owlCarousel({
		autoPlay: false,
		slideSpeed: 2000,
		pagination: false,
		navigation: true,
		items: 4 /* [This code for animation ] */,
		/* transitionStyle : "fade", */ navigationText: [
			"<i class='fa fa-angle-left'></i>",
			"<i class='fa fa-angle-right'></i>",
		],
		itemsDesktop: [1199, 4],
		itemsDesktopSmall: [980, 3],
		itemsTablet: [768, 2],
		itemsMobile: [479, 1],
	});

	/*----------------------------
	 price-slider active
	------------------------------ */
	$("#slider-range").slider({
		range: true,
		min: 40,
		max: 600,
		values: [60, 570],
		slide: function (event, ui) {
			$("#amount").val("£" + ui.values[0] + " - £" + ui.values[1]);
		},
	});
	$("#amount").val(
		"£" +
			$("#slider-range").slider("values", 0) +
			" - £" +
			$("#slider-range").slider("values", 1)
	);

	/*--------------------------
	 scrollUp
	---------------------------- */
	$.scrollUp({
		scrollText: '<i class="fa fa-angle-up"></i>',
		easingType: "linear",
		scrollSpeed: 900,
		animation: "fade",
	});

	/*--------------------------
	 row click
	---------------------------- */
	$(".community").on("click", function () {
		var id = $(this).data("id");
		window.location = `/single/community/${id}`;
	});

	$(".client").on("click", function () {
		var id = $(this).data("id");
		window.location = `/single/client/${id}`;
	});

	$("#btn-check-all").click(function () {
		console.log($(".user-checked"));
		if ($("#btn-check-all").hasClass("all-checked")) {
			$("#btn-check-all").removeClass("all-checked");
			$(".user-checked").each(function () {
				this.checked = false;
			});

			$(".user-checked").iCheck({
				checkboxClass: "icheckbox_square-green",
			});
		} else {
			$("#btn-check-all").addClass("all-checked");
			$(".user-checked").each(function () {
				this.checked = true;
			});

			$(".user-checked").iCheck({
				checkboxClass: "icheckbox_square-green",
			});
		}
	});

	// $("#btn-remove-checked").click(function () {
	// 	var students = [];
	// 	$.each($("input[name='checkme']:checked"), function () {
	// 		favorite.push($(this).val());
	// 	});
	// 	console.log(favorite);
	// });
})(jQuery);
