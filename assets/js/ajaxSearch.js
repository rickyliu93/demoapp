var path = window.location.href,
    query, 
    currentPage = 1,
    totalPage;   
    
$('#search-btn').on('click', function(event){
  var casestableExist = false;
  
  query = $('#query').val()
  
  event.preventDefault();
  
  ($('#casestable').length > 0) ? casestableExist = true : casestableExist = false;

  if($.trim(query).length != 0){
    
  $('#search-btn').html("<i class='fa fa-circle-o-notch fa-spin fa-fw'></i> Searching...").attr("disabled", true);
  
    $.ajax({
      url: path+"?search="+query,
      type: 'GET',
      cache: true,
      contentType: false,
      processData: false,
      success: function(data){
        $('#nocase').remove();
        if (casestableExist){
          $('#casestable').fadeOut(500, function(){
            $('#casestable').remove();
            $('#count').remove();
            $('#tools').after(data);
            appendCases();
            totalPage = $('#totalpage').text();
            currentPage = 1; 
          });
        }
        else {
          $('#tools').after(data);
          appendCases();
          totalPage = $('#totalpage').text();
          currentPage = 1; 
        }
        $('#search-btn').html("<i class='fa fa-search'></i>").attr("disabled", false);
      },
      error: function(textStatus){
       $('#tools').after().html("An error occur, please refresh the page.");
      }
    })        
  }
})

function appendCases(){
  $('#innertable').on('scroll', function(){
    var casesTable = $(this); 
 
    if (casesTable.scrollTop() > (maxScrollTop(casesTable) - 15) && currentPage  < totalPage){           
      $('#loader').show();
      loadNextPage(currentPage+1);
      currentPage ++; 
    }   
  
    function maxScrollTop(element) {
      return element[0].scrollHeight - element.outerHeight();
    }
    
    function loadNextPage(page){
        $.ajax({
          url: path+"?search="+query+"&page="+page,
          type: 'GET',
          cache: true,
          contentType: false,
          processData: false,
          success: function(data){
            $('#innertable > table').append(data)
            $('#loader').fadeOut(500);  
          },
          error: function(error){
            $('#innertable').html("An error occur, please refresh the page.");
            $('#loader').fadeOut(500);
          }
        })
    }
  });
}

$(document).on('click', '.delete', function(e){
  var caseRecordRow = $(this).closest('tr'),
      caseRecordURL = $(this).attr('href');
      
  if(confirm("Are you sure you want to delete?")){
    e.preventDefault();
    deleteTheCase(caseRecordURL,caseRecordRow);
  }  
  else {
    return false;
  }      
});    
    
function deleteTheCase(caseRecordURL, caseRecordRow){
  $.ajax({
    url: caseRecordURL,
    headers: {'X-HTTP-Method-Override': 'DELETE'},
    method: 'GET',
    cache: false,
    success: function(data){
      caseRecordRow.effect("pulsate", {times:3}, function(){
        $(this).remove();
      });  
    },
    error: function(error){
      caseRecordRow.effect("pulsate", {times:5}, function(){
        $(this).effect("highlight", {color: "red"});
      });
    }
  })  
}