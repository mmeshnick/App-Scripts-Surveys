//base code source: https://www.youtube.com/watch?v=SyB4MVkWV3c
/*
In order of priority:

-Testing as part of the process?
-Pulling more submission info like date
-named range
*/

//2021Q2
function combineSheets2021Q2() {
  combineSheets("2021Q2");
//first ID is folder, second is master sheet
}

//2021 Q3
function combineSheets2021Q3() {
  combineSheets("2021Q3");
//first ID is folder, second is master sheet
}

//2022 Q1
function combineSheets2022Q1() {
  combineSheets("2022Q1");
//first ID is folder, second is master sheet
}

//2022 Q2
function combineSheets2022Q2() {
  combineSheets("2022Q2");
//first ID is folder, second is master sheet
}

function combineSheets(folderName) {
  var folder=DriveApp.getFoldersByName(folderName).next();
  var filesIterator=folder.getFiles();

  var file;
  var fileType;
  var spreadId;
  var data = [];
  var masterId = folder.getFilesByName(folderName+" MasterFile").next().getId();
  var combinedData = [];

  while(filesIterator.hasNext()){
    file = filesIterator.next();
    fileType = file.getMimeType();
    if(fileType === "application/vnd.google-apps.spreadsheet" && file.getId() != masterId)
    {
      spreadId = file.getId();
      data = getDataFromSheet(spreadId);
      data = data.map(function(r){ 
        return r.concat([file.getName()])
        });      
      combinedData = combinedData.concat(data);  
    } //if ends
  }//while ends
  
  var ws = SpreadsheetApp.openById(masterId).getSheetByName("combined");
  ws.getRange("A2:I").clearContent();
  ws.getRange(2, 1, combinedData.length, combinedData[0].length).setValues(combinedData);
}


function getDataFromSheet(spreadId){
  var ss= SpreadsheetApp.openById(spreadId);
  var rawSheet = ss.getSheetByName("Data");
  //A3 to ignore the first row, 'completed'
  data = rawSheet.getRange("A3:H73").getValues();
  var rowTest = rawSheet.getRange("F2").getValue();
  //refers to 'completed' box
  if(rowTest == true){
    return data;
  }
  else {
    return [];
  };
  //returns blank array if rowTest returns false (note, treats 1 like true)
}


