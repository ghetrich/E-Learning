(function ($) {
	"use strict";

	const upload = async (file, callback) => {
		const data = new FormData();

		data.append("image", file);
		const result = await fetch(
			`http://localhost:3000/lessons/content/image`,
			{
				method: "POST",
				body: data,
			}
		).then(response => response.json());

		if (result.status === "OK") {
			callback(result.path);
			console.log(result.path);
		} else {
			console.log(result.error);
		}
	};

	$(".html-editor-cm")[0] &&
		$(".html-editor-cm").summernote({
			height: 335,
			onImageUpload: (files, editor, welEditable) => {
				console.log(files);
				upload(files[0], data => {
					var url = "http://localhost:3000/" + data;
                     $(".html-editor-cm").summernote("insertImage", url);
					// editor.insertImage(welEditable, url);
					
				});
			},
		}),
		$(".html-editor")[0] &&
			$(".html-editor").summernote({
				height: 150,
			}),
		$(".html-editor-click")[0] &&
			($("body").on("click", ".hec-button", function () {
				$(".html-editor-click").summernote({
					focus: !0,
				}),
					$(".hec-save").show();
			}),
			$("body").on("click", ".hec-save", function () {
				$(".html-editor-click").code(),
					$(".html-editor-click").destroy(),
					$(".hec-save").hide(),
					notify("Content Saved Successfully!", "success");
			})),
		$(".html-editor-airmod")[0] &&
			$(".html-editor-airmod").summernote({
				airMode: !0,
            });
    
    
    
})(jQuery);
