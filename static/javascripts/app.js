/* Foundation v2.1.5 http://foundation.zurb.com */

// Change to add keys to monitor.
KVs = [];


displayJSON = function(id, s){
  var jsonobj = JSON.parse(s);
  var node = $("#"+id);
  node.empty();
  var dl = $("<dl></dl>");
  for (var key in jsonobj){
    var dt = $("<dt>" + key + "</dt>");
    var dd = $("<dd>" + jsonobj[key] + "</dd>");
    dl.append(dt);
    dl.append(dd);
  }
  node.append(dl);
};

Client = function(prefix){
  this.prefix = prefix || "/";
  this.monitoredKV = [];
};


Client.prototype.addKVMonitor = function(form){
  var keyname = form.keyname.value;
  console.log(keyname);
  var panel = $("<div></div>");
  panel.addClass("panel");
  var h4 = $("<h4></h4>");
  h4.text("KV: " + keyname);
  var box = $("<div></div>");
  box.addClass("box");
  box.attr("id", keyname);
  panel.append(h4);
  panel.append(box);
  this.monitoredKV.push(keyname);
  $("#kv").append(panel);
}

Client.prototype.getKey = function(key, callback){
  $.ajax(this.prefix + "/kv/" + key, {
    processData : false
  }).done(callback).error(function() {});
};

Client.prototype.getData = function(callback){
  $.ajax(this.prefix + "/q/data", {
    processData : false
  }).done(callback).error(function() {});
};

loop = function(client){
  client.getData(function(data){ displayJSON("status", data); });
  for (var i in client.monitoredKV){
    var key = client.monitoredKV[i];
    client.getKey(key, function(data) { displayJSON(key, data); });
  }

  if (!window.stop){
    setTimeout(function(){ loop(client); }, 1000);
  }
}

window.stop = false;

$(document).ready(function () {

	/* Use this js doc for all application specific JS */

	/* TABS --------------------------------- */
	/* Remove if you don't need :) */

	function activateTab($tab) {
		var $activeTab = $tab.closest('dl').find('a.active'),
				contentLocation = $tab.attr("href") + 'Tab';

		//Make Tab Active
		$activeTab.removeClass('active');
		$tab.addClass('active');

    	//Show Tab Content
		$(contentLocation).closest('.tabs-content').children('li').hide();
		$(contentLocation).show();
	}

	$('dl.tabs').each(function () {
		//Get all tabs
		var tabs = $(this).children('dd').children('a');
		tabs.click(function (e) {
			activateTab($(this));
		});
	});

	if (window.location.hash) {
		activateTab($('a[href="' + window.location.hash + '"]'));
	}

	/* ALERT BOXES ------------ */
	$(".alert-box").delegate("a.close", "click", function(event) {
    event.preventDefault();
	  $(this).closest(".alert-box").fadeOut(function(event){
	    $(this).remove();
	  });
	});


	/* PLACEHOLDER FOR FORMS ------------- */
	/* Remove this and jquery.placeholder.min.js if you don't need :) */

	$('input, textarea').placeholder();



	/* UNCOMMENT THE LINE YOU WANT BELOW IF YOU WANT IE6/7/8 SUPPORT AND ARE USING .block-grids */
//	$('.block-grid.two-up>li:nth-child(2n+1)').css({clear: 'left'});
//	$('.block-grid.three-up>li:nth-child(3n+1)').css({clear: 'left'});
//	$('.block-grid.four-up>li:nth-child(4n+1)').css({clear: 'left'});
//	$('.block-grid.five-up>li:nth-child(5n+1)').css({clear: 'left'});



	/* DROPDOWN NAV ------------- */

	var lockNavBar = false;
	$('.nav-bar a.flyout-toggle').live('click', function(e) {
		e.preventDefault();
		var flyout = $(this).siblings('.flyout');
		if (lockNavBar === false) {
			$('.nav-bar .flyout').not(flyout).slideUp(500);
			flyout.slideToggle(500, function(){
				lockNavBar = false;
			});
		}
		lockNavBar = true;
	});
  if (Modernizr.touch) {
    $('.nav-bar>li.has-flyout>a.main').css({
      'padding-right' : '75px',
    });
    $('.nav-bar>li.has-flyout>a.flyout-toggle').css({
      'border-left' : '1px dashed #eee'
    });
  } else {
    $('.nav-bar>li.has-flyout').hover(function() {
      $(this).children('.flyout').show();
    }, function() {
      $(this).children('.flyout').hide();
    })
  }

  var connect = document.getElementById("connect");
  connect.onsubmit = function() {
    var client = new Client(this.server.value);
    this.server.disabled = true;
    var kvform = document.getElementById("kvadd");
    kvform.keyname.disabled = false;
    kvform.onsubmit = function() { client.addKVMonitor(kvform); return false; };
    for (var i in KVs){
      var key = KVs[i];
      client.addKVMonitor(key);
    }
    loop(client);
    return false;
  };



});
