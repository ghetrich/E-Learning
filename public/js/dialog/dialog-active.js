(function ($) {
	("use strict");

	/*----------------------
		Dialogs
	 -----------------------*/

	//Basic
	$("#sa-basic").on("click", function () {
		swal("Here's a message!");
	});

	//A title with a text under
	$("#sa-title").on("click", function () {
		swal(
			"Here's a message!",
			"Lorem ipsum dolor cry sit amet, consectetur adipiscing elit. Sed lorem erat, tincidunt vitae ipsum et, Spensaduran pellentesque maximus eniman. Mauriseleifend ex semper, lobortis purus."
		);
	});

	//Success Message
	$("#sa-success").on("click", function () {
		swal(
			"Good job!",
			"Spensaduran pellentesque maximus eniman. Mauriseleifend ex semper, lobortis purus.",
			"success"
		);
	});

	//Activation Message
	$("#sa-active").on("click", function () {
		swal(
			"Good job!",
			"Spensaduran pellentesque maximus eniman. Mauriseleifend ex semper, lobortis purus.",
			"success"
		).then(function () {
			window.location = "/control";
		});
	});

// ========================================================================
// ===== // this alert confirm successful submission of new user form =====
// ========================================================================

$("#submitOkay").on("click", function () {
	swal(
		"Good job!",
		"User has been successfully created.",
		"success"
	);
});


	//Leave single community page confirmation
	$("#toCommunity").on("click", function () {
		swal({
			title: "Are you sure?",
			text: "All unsaved information provided will be lost!",
			type: "warning",
			showCancelButton: true,
			confirmButtonText: "Yes, leave!",
		}).then(function () {
			window.location = "/community";
		});
	});

	//Leave single community page confirmation
	$("#toClients").on("click", function () {
		swal({
			title: "Are you sure?",
			text: "All unsaved information provided will be lost!",
			type: "warning",
			showCancelButton: true,
			confirmButtonText: "Yes, leave!",
		}).then(function () {
			window.location = "/clients";
		});
	});


	//Warning Message
	$("#sa-warning").on("click", function () {
		swal({
			title: "Are you sure?",
			text: "You will not be able to recover this imaginary file!",
			type: "warning",
			showCancelButton: true,
			confirmButtonText: "Yes, delete it!",
		}).then(function () {
			swal("Deleted!", "Your imaginary file has been deleted.", "success");
		});
	});

	//Parameter
	$("#sa-params").on("click", function () {
		swal({
			title: "Are you sure?",
			text: "You will not be able to recover this imaginary file!",
			type: "warning",
			showCancelButton: true,
			confirmButtonText: "Yes, delete it!",
			cancelButtonText: "No, cancel plx!",
		}).then(function (isConfirm) {
			if (isConfirm) {
				swal(
					"Deleted!",
					"Your imaginary file has been deleted.",
					"success"
				);
			} else {
				swal("Cancelled", "Your imaginary file is safe :)", "error");
			}
		});
	});

	//Custom Image
	$("#sa-image").on("click", function () {
		swal({
			title: "Sweet!",
			text: "Here's a custom image.",
			imageUrl: "img/dialog/like.png",
		});
	});

	//Auto Close Timer
	$("#sa-close").on("click", function () {
		swal({
			title: "Auto close alert!",
			text: "I will close in 2 seconds.",
			timer: 2000,
		});
	});
})(jQuery);
