var csvParse = require('csv-parse'),
    fs = require('fs');
    
module.exports = {
  
  parseCsv: function(file, returnArray){
    
    fs.readFile(file, 'utf8', function(err, data){
      var input;

      if(err) return returnArray(err);
        input = data;
                
        fs.unlink(file, function(err){
          if (err) return console.log(err);
        });
        
        csvParse(input, function(err, output){          
          if(err) return returnArray(err);
          var outputArray = [];
          
          output.forEach(function(inputArray){
            var caseObject = {
                              case_no: inputArray[0],
                              category: inputArray[1],
                              party: inputArray[2]
                             };
            outputArray.push(caseObject);   
          })
          returnArray(null, outputArray);            
        })
    })
  },
}  
