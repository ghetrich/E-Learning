# FREESHS
 

<!-- <script type="text/javascript">
	const form = document.getElementById("userForm");
	const response = document.getElementById("submitOkay");

	form.addEventListener("submit", async e => {
		e.preventDefault();

		const image = $("#dropImage").get(0).dropzone.getAcceptedFiles();

		let data = new FormData();

		data.append("surname", document.getElementById("surname").value);
		data.append("othernames", document.getElementById("othernames").value);
		data.append("id", document.getElementById("userID").value);
		data.append("phone", document.getElementById("phone").value);
		data.append("email", document.getElementById("email").value);
		data.append("previlege", document.getElementById("previlege").value);
		data.append("community", "<%= communityId %>");
		data.append("domain", "<%= domain %>");
		data.append("image", image[0], image[0].name);

		const uri = () => {
			if (previlege == "Student") {
				return "/student/new";
			} else if (previlege == "Teacher") {
				return "/teacher/new";
			} else {
				return "/administrator/new";
			}
		};

		const result = await fetch(`http://localhost:3000${uri()}`, {
			method: "POST",
			body: data,
		}).then(response => response.json());

		if (result.status === "OK") {
			console.log(result.data);
			response.click();
			$("#error-dialog").hide()
		} else {
			alert(result.error);
			console.log(result.error);
			$("#error-dialog").show()
		}
	});
</script> -->

<div id="voices" class="tab-pane fade">
							<div class="tab-ctn">
								<div class="row">
									<div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
										<div
											class="
												contact-form
												sm-res-mg-t-30
												tb-res-mg-t-30 tb-res-mg-t-0
												bordered
											"
										>
											<div class="basic-tb-hd">
												<!-- <h2>Sample Form</h2> -->
												<p>
													Fusce eget dolor id justo luctus commodo
													vel pharetra nisi. Donec velit libero
												</p>
											</div>
											<div class="contact-form-int">
												<div class="fm-checkbox">
													<label>
														<input
															type="checkbox"
															class="i-checks"
														/>
														<i></i>
														Link Restriction
													</label>
												</div>

												<div class="form-group todo-flex">
													<div class="nk-int-st">
														<input
															type="text"
															id="todo-input-text"
															name="todo-input-text"
															class="form-control"
															placeholder="Paste the video link here"
														/>
													</div>
													<div class="todo-send">
														<button
															class="
																btn-primary btn-md btn-block btn
																notika-add-todo
															"
															type="button"
															id="todo-btn-submit"
														>
															<i
																class="
																	notika-icon notika-paperclip
																"
															></i>
															Add Link
														</button>
													</div>
												</div>
											</div>
										</div>
									</div>
									<div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
										<div class="dw-atc-sn mg-b-10">
											<a class="wrap_link" href="#"
												>http://localhost:3000/admin/class/60bd56ad64f34b325c838852/lesson/new/60cd219191175d44083e556f </a
											><i class="notika-icon notika-close"></i>
										</div>
										<div class="dw-atc-sn mg-b-10">
											<a class="wrap_link" href="#"
												>http://localhost:3000/admin/class/60bd56ad64f34b325c838852/lesson/new/60cd219191175d44083e556f </a
											><i class="notika-icon notika-close"></i>
										</div>
										<div class="dw-atc-sn mg-b-10">
											<a
												class="wrap_link"
												target="_blank"
												href="https://www.youtube.com/watch?v=a0k6DrrMwU8"
												>https://www.youtube.com/watch?v=a0k6DrrMwU8</a
											><i class="notika-icon notika-close"></i>
										</div>
									</div>
								</div>
							</div>
						</div>