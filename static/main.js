// Update port list
function updatePorts() {

  axios.get('/update_ports')
    .then(function(response) {
      // handle success
      if (response.status == 200) {
        // Remove old content from list
        jQuery('.portList').html('');
        for (var content of response.data.content) {
          jQuery('.portList').append(`<option value="${content}">${content}</option>`)
        }
      }
    })
    .catch(function(error) {
      notify(error, 'danger')
      console.error(error);
    })
    .then(function() {});
}

// Auto detect Baudrate
function updateBaud() {

  // load spinner icon while the pi check for baudrate
  jQuery(".updateBaud").html('<a href="#" class="uk-icon-link mac-button updateBaud" title="Auto detect baudrate" uk-spinner></a>');

   // send port info over first
   jQuery.post('/update_baud', { 'selected_port' : jQuery('#portList').val() }, function(response) {

    console.log(response);
    if (response != 'None') {
      // change to new baudrate value
      $(".baudRate").val(response);
    }
    else {
      notify('Plotter not detected', 'warning')
    }
    // put back normal icon
    jQuery(".updateBaud").html('<a href="#" class="uk-icon-link mac-button updateBaud" title="Auto detect baudrate" data-uk-tooltip data-uk-icon="icon: search"></a>')
  })

  .fail(function(error) {
    notify(error, 'danger')
    console.error(error);
  })
  .then(function() {});
}

// Update file list
function updateFiles() {
  axios.get('/update_files')
    .then(function(response) {
      // handle success
      if (response.status == 200) {
        // Remove old content from list
        jQuery('#fileList').html('');

        for (var content of response.data.content) {
          jQuery('#fileList').append(`<li> ${renderFileListElement(content.name)} </li>`)
        }
      }
    })
    .catch(function(error) {
      notify(error, 'danger')
      console.error(error);
    })
    .then(function() {});
}

// Handle file selection
function selectFile(element) {
  const filename = jQuery(element).data('filename');

  // Update form
  jQuery('#fileName').val(filename);

  // Update list
  jQuery('#fileList li').removeClass('uk-alert-primary');
  const li = jQuery(element).parents('li')[0]
  if (li) jQuery(li).addClass('uk-alert-primary');

  // Update sidebar
  jQuery('.selectedFilename').html(filename);
}

// Handle file deletion
function deleteFile(element) {
  const filename = jQuery(element).data('filename');

  axios.post('/delete_file', { filename: filename })
    .then(function(response) {
      // handle success
      if (response.status == 200) {
        // Remove old content from list
        notify(response.data, 'warning')
        updateFiles()
      }
    })
    .catch(function(error) {
      notify(error, 'danger')
      console.error(error);
    })
    .then(function() {});
}

// Update page size options
function updatePageSize(element) {
  // TODO add pagesize filter for the machines
////////////////////////////////////////////////
////////////////////////////////////////////////
}

// Handle file conversion
function convertFileModal(element) {
  const filename = jQuery(element).data('filename');
  jQuery('#convertFile').val(filename)
  UIkit.modal('#modal-convertFile').show();
}

// Start conversion
function convertFile() {
  const convertData = jQuery('#convertData').serializeArray()
  console.log('convertData', convertData);
  jQuery("#loader").removeClass('uk-hidden');

  // Validation
  if (jQuery('#convertFile').val() == '') {
    notify('No *.svg file selected', 'danger');
    return false
  }

  axios.post('/start_conversion', jQuery('#convertData').serialize())
    .then(function(response) {

      // handle success
      if (response.status == 200) {

        if (response.data == 'File not converted.') {
          console.error(response);
          notify(response.data, 'danger');
        }
        else {
          console.log(response);
          notify(response.data, 'susuccess');
        }

        updateFiles();
        UIkit.modal('#modal-convertFile').hide();
        jQuery("#loader").addClass('uk-hidden');

      }
    })
    .catch(function(error) {
      notify(error, 'danger');
      console.error(error);
    });
}

// Display card
function closeCard(element) {
  const card = jQuery(element).data('card');

  jQuery(element).addClass('uk-hidden')
  jQuery("#"+card).addClass('uk-hidden')
  jQuery(".showCard[data-card='"+card+"']").removeClass('uk-hidden')
}

function showCard(element) {
  const card = jQuery(element).data('card');

  jQuery(element).addClass('uk-hidden')
  jQuery("#"+card).removeClass('uk-hidden')
  jQuery(".closeCard[data-card='"+card+"']").removeClass('uk-hidden')
}

// Clear Logs
function clearLog() {
  // Remove old content from log
  jQuery('#statusLog').html('');
  jQuery('#bytes_written').html('');
}

// Start plotting
function startPlot() {
  const plotterData = jQuery('#plotterData').serializeArray()
  console.log('plotterData', plotterData);


  // Validation
  if (jQuery('#fileName').val() == '') {
    notify('No *.hpgl file selected', 'danger');
    return false
  }
  if (jQuery('#portList').val() == null) {
    notify('No COM port selected', 'danger');
    updatePorts()
    return false
  }

  axios.post('/start_plot', jQuery('#plotterData').serialize())
    .then(function(response) {
      // handle success
      if (response.status == 200) {
        console.log(response);
      }
    })
    .catch(function(error) {
      notify(error, 'danger')
      console.error(error);
    });
}

function stopPlot() {

  axios.get('/stop_plot')
    .then(function(response) {
      // handle success
      if (response.status == 200) {
        console.log(response);
        notify('Stopped Print', 'danger');

        // Update sidebar
        jQuery('.selectedFilename').html("");
        jQuery('#statusLog').html('Plot canceled' + "<br>");
      }
    })
    .catch(function(error) {
      notify(error, 'danger')
      console.error(error);
    });

}

// Reboot Pi
function actionReboot() {

  axios.post('/action_reboot')
    .then(function(response) {
      // handle success
      if (response.status == 200) {
        UIkit.modal('#modal-reboot').hide();
        notify('Rebooting now', 'warning');
      }
    })
    .catch(function(error) {
      notify(error, 'danger')
      console.error(error);
    });
}

// Poweroff Pi
function actionPoweroff() {

  axios.post('/action_poweroff')
    .then(function(response) {
      // handle success
      if (response.status == 200) {
        UIkit.modal('#modal-poweroff').hide();
        notify('Poweroff now', 'danger');
      }
    })
    .catch(function(error) {
      notify(error, 'danger')
      console.error(error);
    });
}

function actionTasmota() {

  axios.post('/action_tasmota')
    .then(function(response) {
      // handle success
      if (response.status == 200) {
        notify('Tasmota Toggled', 'success');
      }
    })
    .catch(function(error) {
      notify(error, 'danger')
      console.error(error);
    });
}

function actionUpdatePreview() {

  axios.post('/action_update_preview')
    .then(function(response) {
      // handle success
      if (response.status == 200) {
        //console.error(response);
        source = jQuery("#preview-img").attr("src");
        source = source.split("?", 1);
        new_source = source + "?timestamp="  + new Date().getTime();
        jQuery("#preview-img").attr("src", new_source);
        notify('Preview Updated', 'success');
      }
    })
    .catch(function(error) {
      notify(error, 'danger')
      console.error(error);
    });
}

// Fetch config.ini data and update UI
function updateConfiguration() {
  axios.get('/save_configfile')
    .then(function(response) {
      // handle success
      if (response.status == 200) {

        jQuery('#telegram_token').val(response.data.telegram_token);
        jQuery('#telegram_chatid').val(response.data.telegram_chatid);
        jQuery('#tasmota_enable').val(response.data.tasmota_enable);
        jQuery('#timelapse_enable').val(response.data.timelapse_enable);
        jQuery('#timelapse_selected').val(response.data.timelapse_selected);
        jQuery('#timelapse_preview').val(response.data.timelapse_preview);
        jQuery('#tasmota_ip').val(response.data.tasmota_ip);
        jQuery('.plotter_name').html(response.data.plotter_name);
        jQuery('.portList').val(response.data.plotter_port).change();
        jQuery('#device').val(response.data.plotter_device).change();
        jQuery('#baudrate').val(response.data.plotter_baudrate).change();
        jQuery('#flowControl').val(response.data.plotter_flowControl).change();
        adjustVisibleOptions();
      }
    })
    .catch(function(error) {
      notify(error, 'danger')
      console.error(error);
    });
}

function adjustVisibleOptions(){
  if (jQuery('#tasmota_enable').val() == 'true') {
    jQuery('#tasmota-checkbox').show();
    jQuery('#tasmota-toggle').show();
  } else {
    jQuery('#tasmota-checkbox').hide();
    jQuery('#tasmota-toggle').hide();
  }
  if (jQuery('#timelapse_enable').val() == 'true') {
    jQuery('#timelapse-checkbox').show();
  } else {
    jQuery('#timelapse-checkbox').hide();
  }
  if (jQuery('#timelapse_enable').val() == 'true' && jQuery('#timelapse_selected').val() == 'true') {
    jQuery('#timelapse').prop('checked', true);
  } else {
    jQuery('#timelapse').prop('checked', false);
  }
  if (jQuery('#timelapse_enable').val() == 'true' && jQuery('#timelapse_preview').val() == 'true') {
    jQuery('#update-preview').show();
    jQuery('#timelapse-preview').show();
  } else {
    jQuery('#update-preview').hide();
    jQuery('#timelapse-preview').hide();
  }
}

// Fetch config.ini data and display modal
function actionOpenConfig() {
  axios.get('/save_configfile')
    .then(function(response) {
      // handle success
      if (response.status == 200) {
        jQuery('#telegram_token').val(response.data.telegram_token);
        jQuery('#telegram_chatid').val(response.data.telegram_chatid);
        jQuery('#tasmota_enable').val(response.data.tasmota_enable);
        jQuery('#timelapse_enable').val(response.data.timelapse_enable);
        jQuery('#timelapse_selected').val(response.data.timelapse_selected);
        jQuery('#timelapse_preview').val(response.data.timelapse_preview);
        jQuery('#tasmota_ip').val(response.data.tasmota_ip);
        jQuery('#plotter_name').val(response.data.plotter_name);
        jQuery('#plotter_port').val(response.data.plotter_port).change();
        jQuery('#plotter_device').val(response.data.plotter_device).change();
        jQuery('#plotter_baudrate').val(response.data.plotter_baudrate).change();
        jQuery('#plotter_flowControl').val(response.data.plotter_flowControl).change();
        UIkit.modal('#modal-configFile').show();
      }
    })
    .catch(function(error) {
      notify(error, 'danger')
      console.error(error);
    });
}

// Save new values in config.ini
function saveConfig() {
  const configData = jQuery('#configData').serializeArray()
  console.log('configData', configData);
  adjustVisibleOptions();
  axios.post('/save_configfile', jQuery('#configData').serialize())
    .then(function(response) {
      console.log(response);
      // handle success
      if (response.status == 200) {
        notify(response.data, 'success')
      }
    })
    .catch(function(error) {
      notify(error, 'danger')
      console.error(error);
    });
}

jQuery(document).ready(function($) {

	$('.lightbox_trigger').click(function(e) {

		//prevent default action (hyperlink)
		e.preventDefault();

		//Get clicked link href
		var image_href = $(this).attr("href");

		/*
If the lightbox window HTML already exists in document,
change the img src to to match the href of whatever link was clicked

If the lightbox window HTML doesn't exists, create it and insert it.
(This will only happen the first time around)
*/

		if ($('#lightbox').length > 0) { // #lightbox exists

			//place href as img src value
			$('#content').html('<img src="' + image_href + '" />');

			//show lightbox window - you could use .show('fast') for a transition
			$('#lightbox').show();
		}

		else { //#lightbox does not exist - create and insert (runs 1st time only)

			//create HTML markup for lightbox window
			var lightbox =
			'<div id="lightbox">' +
				'<p>Click to close</p>' +
				'<div id="content">' + //insert clicked link's href into img src
					'<img src="' + image_href +'" />' +
				'</div>' +
			'</div>';

			//insert lightbox HTML into page
			$('body').append(lightbox);
		}

	});

	//Click anywhere on the page to get rid of lightbox window
	$('body').on('click', '#lightbox', function() { //must use on, as the lightbox element is inserted into the DOM
		$('#lightbox').hide();
	});
});
