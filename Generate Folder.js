//Services: Drive API (for sharing) 
//Before running: Create a new empty folder called YYYYQQ in the Data Collection folder, then a new corresponding function. Check the KCRN Users sheet for accuracy. Make sure programnames variable pulls all rows in the users sheet.

//TO-DO: AUTO-FILL NAME! + dates as a variable coming in, change header

  var sourceFolder = "1T-Jt-SMexog8prybCCZXm_GPMAzlfomK";
  var parentFolder = "18o_McZNMGkB1jyv5MNfEp4Ig-dWataiV"
  // 'template' and parent folders
  var userNames = "1ouRYR7V_O3wNMwqAMVySY-MUzwPIA0ObVs35dEmZRy0";
  // KCRN users sheet
  var parent = DriveApp.getFolderById(parentFolder);
  var source = DriveApp.getFolderById(sourceFolder);
  var usersId = DriveApp.getFileById(userNames).getId();
  var template = source.getFilesByName("Template").next();
  var programNames = [];
  var emailBody=''
  var email=''

//create a new function for each quarter by copy and pasting the following function

//2021q3
function createFall2021() {
    emailBody='Your KCRN data collection form is ready for Fall 2021.'
    copyFolder("2021Q3","Fall 2021", emailBody);
}

//2022Q1
function createWinter2022() {
    emailBody= 'Your KCRN data collection form is ready for Winter 2022.\n \nThank you for your patience as we move to this new data collection system. Please fill out the form to the best of your ability, but we understand that you may not have relevant data for certain questions. Feel free to leave those fields blank. If you have any questions, difficulties, or comments, do not hesitate to reach out to Max (contact info below.) In another email we will send out the times of drop-in sessions (virtual) for help and discussion about the quarterly data process.\n \nWhen finished, make sure to check the box at the bottom of the form.'

    copyFolder("2022Q1","Winter 2022", emailBody);
}

//2022Q2
function createSpring2022() {
    emailBody= 'Your KCRN data collection form is ready for Spring 2022. Please fill it out by August 19th. We appreciate your participation!\n \nTFill out the form to the best of your ability, but we understand that you may not have relevant data for certain questions. Feel free to leave those fields blank. If you have any questions, difficulties, or comments, do not hesitate to reach out to Max (contact info below.) If you are having trouble with the google sheets format, feel free to download the form and email it back.\n \n To create a google account linked to your existing email address for future ease of use, follow the following steps. Note: this will NOT create a new gmail, just allow you to view and edit docs in google suite.\n 1. Go to the Google Account Sign In page. \n 2. Click Create account. \n 3. Click Use my current email address instead.\n 4. Enter your current email address. Click Next.\n 5. Verify your email address with the code sent to your existing email. \n 6.Click Verify. \n 7. When finished, make sure to check the box at the bottom of the form.\n \n In another email on Monday, I will send out the program reports for 2022 Q1. Thanks to those who provided feedback, and I would appreciate any further feedback as well. Thank you so much! '

    copyFolder("2022Q2","Spring 2022", emailBody);
}

function copyFolder(quarterName, quarterNameString, emailBody) {
  var targetFolder = parent.getFoldersByName(quarterName);
  var folderNext;
  var masterFile  = source.getFilesByName("MasterFile").next();

//delete old folders
  while(targetFolder.hasNext()){
    targetFolder.next().setTrashed(true);
  } 

//create new folder
  folderNext = parent.createFolder(quarterName);

//copy masterfile
  masterFile = masterFile.makeCopy(quarterName+' '+masterFile.getName(), folderNext);

//create new collection forms for each program + share and send email
  programIterator(quarterName, folderNext, quarterNameString, emailBody);

}

function programIterator(quarterName, folderNext, quarterNameString, emailBody) {
//email contents
  quarterNameString = quarterNameString+' KCRN Data Collection';

//change 'test' to 'final' to run
  var ss= SpreadsheetApp.openById(usersId);
  var sheet = ss.getSheetByName("Test");

//make sure it captures all active programs
  programNames = sheet.getRange("A2:C19").getValues();
  programNames.forEach(function(row){
      program = row[0];
      user = row[1];
      name = row[2];

      var newFile = template.makeCopy(quarterName+' '+program, folderNext);
      var id = newFile.getId();
      SpreadsheetApp.openById(id).getRangeByName("Program_Name").setValue(program);
      try {      
          email = 'Dear '+name+`, 
          
          `+emailBody+`

          Best,
          Max Meshnick
          Data Analyst
          Community Center for Education Results
          mmeshnick@ccedresults.org
          ` 
          var resource = {role: "writer", type: "user", value: user};
          Drive.Permissions.insert(resource,id,{emailMessage: email});
          email=''
         }
      catch(error){
          Logger.log(program+' '+error)
      }
  })
}

