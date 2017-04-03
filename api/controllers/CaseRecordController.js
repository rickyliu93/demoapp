/**
 * CaseRecordController
 *
 * @description :: Server-side logic for managing caserecords
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	


  /**
   * `CaseRecordController.index()`
   */
  find: function (req, res) {
    var search = req.query.search,
        page = req.query.page || 1,
        totalPage = 0,
        userId,   
        admin;
        
    userId = req.session.passport.user;
    
    (req.session.admin === true) ? admin = true : admin = false;
        
    if (!search){
      res.view({caseCount: 0, pageTitle: 'Case Record', totalPage: totalPage, userId: userId, admin: admin});
    }
    else {
      
      if (page==1){ 
        countCaseRecord(search, function(err, count){
          if (err) return res.serverError(err);
          totalPage = Math.ceil(count/100);
          if (count == 0) res.render('caserecord/partials/nocase');
          else {       
            findCaseRecord(search, 1, function(err, caseRecords){
              if (err) return res.serverError(err);
              res.render('caserecord/partials/casestable', {
                          caseRecords: caseRecords, caseCount: count, totalPage: totalPage, admin: admin});
              });     
          }
        });
                 
      } else {
        findCaseRecord(search, page, function(err, caseRecords){
          if (err) return res.serverError(err);
          res.render('caserecord/partials/casestabledata', {caseRecords: caseRecords, admin: admin});
        });
      }  
    }
    
    function countCaseRecord (search, callback){   
      CaseRecord.count({party: {'contains': search}}).exec(function(err, count){
        if (err) return callback(err);
        callback(null, count);
      });
    }
    
    function findCaseRecord (search, page, callback){
      CaseRecord.find({party: {'contains': search}}).paginate({page: page, limit: 100})
                .sort('party ASC catgeroy ASC case_no ASC').exec(function(err, caseRecords){
        if (err) return callback(err);
        callback(null, caseRecords);
      });  
    }  
  },


  /**
   * `CaseRecordController.new()`
   */
  new: function (req, res) {
    return res.json({
      todo: 'new() is not implemented yet!'
    });
  },


  /**
   * `CaseRecordController.create()`
   */
  create: function (req, res) {
    return res.json({
      todo: 'create() is not implemented yet!'
    });
  },


  /**
   * `CaseRecordController.edit()`
   */
  findone: function (req, res) {
    if (isNaN(parseInt(req.params.id))) return res.notFound('Could not find case, sorry.');
    CaseRecord.findOne({id: req.params.id}).exec(function(err, caseRecord){
      if (err) return res.serverError(err);
      if (!caseRecord) return res.notFound("No case record with that id exists.");
      res.view('caserecord/findone', {caseRecord: caseRecord, pageTitle: 'Edit Case Record'});     
    }); 
  },


  /**
   * `CaseRecordController.update()`
   */
  update: function (req, res) {
    return res.json({
      todo: 'update() is not implemented yet!'
    });
  },


  /**
   * `CaseRecordController.destroy()`
   */
  destroy: function (req, res) {
    CaseRecord.findOne({id: req.params.id}).exec(function(err, caseRecord){
      if (err) return res.serverError(err);
      if (!caseRecord) return res.notFound("No case record with that id exists.");
      else {
        CaseRecord.destroy({id: req.params.id}).exec(function(err){
          if (err) return res.serverError(err);
          res.end();
        });
      }
    });   
  },


  /**
   * `CaseRecordController.upload()`
   */
  upload: function (req, res) {
    var uploadedFile = req.file('casesCSV'),
        uploadedFileDir = ""; 
                       
    uploadedFile.upload(function (err, uploadedFile) {
      if (err) return res.end(err);
      if (uploadedFile.length === 0)
        return res.notFound("No File was uploaded");  
      uploadedFileDir = uploadedFile[0].fd;
      csvParser.parseCsv(uploadedFileDir, function(err, data){
        if (err) return res.end(err);
        savetoCaseRecord(data, function(err, output){
          if (err) return res.serverError(err);
          else {
            res.end();
          }
        })  
      })
    })
    
    function savetoCaseRecord (inputData, result){
      var importedData = [];
      async.eachSeries(
        inputData,    
        function(data, result){
          CaseRecord.findOrCreate(data).exec(result);          
        }, 
        function (err, createdOrFoundRecords){  
          if (err) return result(err)
          result(null, JSON.stringify(createdOrFoundRecords))
        });      
    }     
  }

}