jQuery.sap.require("sap.m.MessageBox");

var tableName,
    tabData,
    tableHeader,
    tableHeaderMetadata,
    fileName,
    dictionaryDetails,
    progcount = 0,
    chunklength = 0,
    userHeader = ["username", "language", "name", "email", "mobile", "phone", "password"],
    chunksize = 1,
    resultArr = [];


sap.ui.getCore().attachInit(function(data) {
    setTimeout(function() {
        oWizard._getProgressNavigator().ontap = function() {};
    }, 200);

});