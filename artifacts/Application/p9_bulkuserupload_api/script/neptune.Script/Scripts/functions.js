function resetAll() {
    tableName = tabData = tableHeader = tableHeaderMetadata = fileName = dictionaryDetails = undefined;
    progcount = 0, chunklength = 0, resultArr = [];
    fuCSV.setValue("");
    selSeparator.setSelectedKey("detect");
    var oFirstStep = oWizard.getSteps()[0];
    oWizard.discardProgress(oFirstStep);
    oWizard.goToStep(oFirstStep);
    btnNextStep.setText("Next");
    oTableData.removeAllColumns();
    columnListTableData.removeAllCells();
    modeloTableData.setData([]);
    modeloTableData.refresh();
    modeloTableResults.setData([]);
    modeloTableResults.refresh();
    oProgressIndicator.setState("Warning");
    oProgressIndicator.setPercentValue(0);
    omsgError.setType("Success");
    omsgError.setText("");
    omsgError.setVisible(false);
}



function buildDataTable() {
    $.each(tableHeader, function(key, value) {
        var colTableData = new sap.m.Column("colTableData" + key, {});
        var lblTableData = new sap.m.Text("lblTableData" + key, {
            text: value
        });
        oTableData.addColumn(colTableData);
        colTableData.setHeader(lblTableData);

        var txtTableData = new sap.m.Text("txtTableData" + key, {
            text: "{" + value + "}"
        });
        columnListTableData.addCell(txtTableData);
    });

    modeloTableData.setData(tabData);
    modeloTableData.refresh();
    oTableData.setHeaderText("Rows: " + tabData.length);
}


function chunk(arr, len) {
    var chunks = [],
        i = 0,
        n = arr.length;
    while (i < n) {
        chunks.push(arr.slice(i, i += len));
    }
    return chunks;
}

function saveData(chunkeddata, counter) {
    progcount += chunkeddata[counter].length;
    var singleUserDetails = chunkeddata[counter][0];
    singleUserDetails.roles = []
    var payload = {
        "detail": chunkeddata[counter][0]
    };
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: "/api/functions/User/Save",
        data: JSON.stringify(payload),
        success: function(data) {
            setProgress(progcount, modeloTableData.oData.length);
            oProgressIndicator.setState("Success");
            resultArr.push({
                'username': chunkeddata[counter][0].username,
                'highlight': 'Success',
                'reason': 'User created successfully !'
            });
            counter++;
            checkDone(chunkeddata, counter);
        },
        error: function(result, status) {
            resultArr.push({
                'username': chunkeddata[counter][0].username,
                'highlight': 'Error',
                'reason': result.responseJSON.status
            });
            setProgress(progcount, modeloTableData.oData.length);
            oProgressIndicator.setState("Warning");
            counter++;
            checkDone(chunkeddata, counter);
        }
    });

}

function checkDone(data, counter) {
    if (counter < chunklength) {
            saveData(data, counter);
    } else {
        var finalStatus = "";
        var finalMessage = "";
        var statusText = "";
        var successUsers = resultArr.filter(e => e.highlight === "Success");
        var errorUsers = resultArr.filter(e => e.highlight === "Error");
        var totalUsers = modeloTableData.oData.length;
        if (errorUsers.length === totalUsers) {
            finalStatus = "Error";
            finalMessage = "Failed to create any user from file '" + fileName + "' in Planet 9 !";
            statusText = "Failed";
        } else if (successUsers.length === totalUsers) {
            finalStatus = "Success";
            finalMessage = "All users from file '" + fileName + "' were created in Planet 9 !";
            statusText = "Success";
        } else {
            finalStatus = "Warning";
            finalMessage = successUsers.length + " out of " + totalUsers + " users from file '" + fileName + "' were created in Planet 9 !";
            statusText = "Partial upload";            
        }
        sap.m.MessageToast.show(finalMessage);
        objstatUpload.setState(finalStatus);
        objstatUpload.setText(statusText);
        oProgressIndicator.setState(finalStatus);
        omsgError.setVisible(true);
        omsgError.setText(finalMessage);
        omsgError.setType(finalStatus);

        btnReset.setEnabled(true);
        btnNextStep.setEnabled(true);
    }
}

function setProgress(current, total) {
    oProgressIndicator.setDisplayValue("Processing user " + current + " of " + total + "...");
    oProgressIndicator.setPercentValue(parseInt((current * 100 / total)));
    if (current === total) {
        oProgressIndicator.setDisplayValue('Processed  ' + total + ' users from uploaded file...');
    }
}