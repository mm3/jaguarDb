// Use our own custom internal logger so that we don't depend 
// on any other library. We'll probably get rid of this once 
// this project reaches certain maturity. A better approach
// would be to raise events as things happen rather than 
// calling the logger but that's for another day.
var log = function(type, message) {
  var logging = true;
  if(logging) {
    if (message === undefined) {
      // default to INFO. The message comes in the first 
      // parameter (awkward, but functional).
      console.log('INFO: %s', type);
    }
    else {
      console.log('%s: %s', type, message)
    }
  }
}


// stolen from http://stackoverflow.com/a/2673229/446681
var isEmptyObject = function (obj) {
  return Object.getOwnPropertyNames(obj).length === 0;
}


// Given a list of documents creates a new list of documents but
// only with the fields indicated in fieldsToProject.
var projectFields = function(documents, fieldsToProject, cb) {
  var isAllFields = isEmptyObject(fieldsToProject);
  if(isAllFields) {
    // No filter required, we are done.
    cb(null, documents);
    return;
  }

  var fields = Object.getOwnPropertyNames(fieldsToProject);
  if(fields.indexOf('_id') === -1) {
    // Make sure the _id field is always returned. 
    fields.push('_id');
  }

  var i, j;
  var filteredDocs = [];
  for(i=0; i<documents.length; i++) {

    var fullDoc = documents[i];
    var doc = {};
    for(j=0; j<fields.length; j++) {
      var field = fields[j];
      if(fullDoc.hasOwnProperty(field)) {
        doc[field] = fullDoc[field];
      }
    }

    filteredDocs.push(doc);
  }
  cb(null, filteredDocs);
}


var isCoveredQuery = function(indexes, fields) {
  if(indexes.length === 0) {
    return false;
  }
  var i;
  for(i = 0; i < fields.length; i++) {
    var field = fields[i];
    if(field == "_id") {
      continue;
    }
    if(indexes.indexOf(field) === -1) {
      return false;
    }
  }
  return true;
}


// See if the document matches the field & values passed. 
var isMatch = function(document, queryFields, queryValues) {
  var i;
  for(i = 0; i < queryFields.length; i++) {
    var field = queryFields[i];
    if(document.hasOwnProperty(field)) {
      if (document[field] !== queryValues[field]) {
        // Field present but values does not match.
        return false;
      }
    }
    else {
      // Field not present
      return false;
    }
  }
  return true;
} 

exports.log = log;
exports.isEmptyObject = isEmptyObject;
exports.projectFields = projectFields;
exports.isCoveredQuery = isCoveredQuery;
exports.isMatch = isMatch;
