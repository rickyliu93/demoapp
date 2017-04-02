var file,
    extension;

$('#file').on('change',function(){
  extension = $(this).val().substr($(this).val().lastIndexOf('.') + 1);
  if (extension != 'csv'){
    $(this).focus();
    alert("Selected file is not a CSV formatted file");
  }
  file = $(this).get(0).files[0];  
});

$('#upload-btn').on('click', function(event){  
  event.preventDefault();
  if (typeof file === 'undefined'){
    return alert("Please select a csv file");
  }  
  else if (extension != 'csv'){ 
    return alert("Selected file is not a CSV formatted file")
  } else {    
   $(this).html("<i class='fa fa-spinner fa-spin '></i> Loading").attr("disabled", true);   
    var data = new FormData();
    data.append("casesCSV", file, file.name);
  }
  
  $.ajax({
    url: '/caserecord/upload/',
    type: 'POST',
    data: data,
    cache: false,
    contentType: false,
    processData: false,
    success: function(data){
      $('#upload-btn').html('upload successfull');
    },
    error: function(error){
      alert('Error encountered, please try to upload again!');
      $('#upload-btn').html('Submit').attr("disabled", false); ;
    }
  })
  
  $('#file').on('change',function(){
    $('#upload-btn').html('Submit').attr("disabled", false)
  });
})
