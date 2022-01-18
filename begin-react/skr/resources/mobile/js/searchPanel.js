var searchPanel = {

	init: function ( pull_max , pull_expand ) {

		var obj = $(".pull-content");
		var touch_begin = 0;
		var touch_move = 0;
		var touch_before = 0;
		var default_content_margin = parseInt(obj.css("margin-top").replace("px", ""));
		//var pull_max = 40;
		//var pull_min = 50;
		//var pull_expand = 230;
		var pull_state = "shrink";
		var is_moving = false;

		obj
			.bind("touchstart", function (e) {
				if ($(window).scrollTop() > 0) return;
				if (pull_state == "expand") return;

				//	e.preventDefault();
				var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
				var elm = $(this).offset();
				var x = touch.pageX - elm.left;
				var y = touch.pageY - elm.top;

				console.log("touchstart", y);

				touch_begin = y;

			})
			.bind("touchmove", function (e) {
				if ($(window).scrollTop() > 0) return;
				if (pull_state == "expand") return;

				var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
				var elm = $(this).offset();
				var x = touch.pageX - elm.left;
				var y = touch.pageY - elm.top;
				touch_move = y - touch_begin;
				console.log("touchmove", touch_move);
				if (touch_move < 0) {
					return;
				}

				e.preventDefault();
				if (touch_move > pull_max) return;
				if (touch_move < touch_before) return;

				is_moving = true;
				touch_before = touch_move;
				obj.css({ "margin-top": default_content_margin + touch_move });

			})
			.bind("touchend", function (e) {

				if (!is_moving) return;
				if ($(window).scrollTop() > 0) return;
				//e.preventDefault();
				touch_before = 0;
				is_moving = false;

				if (touch_move < pull_max) {
					// rollback

					obj.css({ "margin-top": default_content_margin });
					pull_state = "shrink";
				} else {
					// expand
					if (pull_state == "expand") return;

					obj.animate({ "margin-top": default_content_margin + pull_expand }, 400);
					//obj.css({ "margin-top": default_content_margin + pull_expand });
					pull_state = "expand";

					$(".search-detail").hide();
					$(".pull-search-wrap-all").addClass("hide");
				}

			})

		$(".pull-close").click(function () {
			pull_state = "shrink";
			obj.animate({ "margin-top": default_content_margin }, 400);

			$(".search-detail").show();
			$(".pull-search-wrap-all").removeClass("hide");

			return false;
		})

	}
}