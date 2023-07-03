function setProgress(current, total) {
    progDelete.setDisplayValue("Deleting user " + current + " of " + total + "...");
    progDelete.setPercentValue(parseInt((current * 100 / total)));
    if (current === total) {
        progDelete.setDisplayValue('Deleted ' + total + ' users from the instance...');
    }
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


function deleteUsers(chunkeddata, counter) {
    progcount += chunkeddata[counter].length;
    var planet9server = '';
    if (typeof AppCache !== "undefined" && AppCache.isMobile && !false) {
        planet9server = AppCache.Url;
    }
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: planet9server + "/api/functions/User/Delete",
        data: JSON.stringify(chunkeddata[counter][0]),
        success: function(data) {
            setProgress(progcount, oTable.getSelectedItems().length);
            counter++;
            checkDone(chunkeddata, counter);
        },
        error: function(result, status) {
            sap.m.MessageToast.show("Error deleting user : " + result.responseJSON.status);
            counter++;
            checkDone(chunkeddata, counter);            
        }
    });
}

function checkDone(data, counter) {
    if (counter < chunklength) {
        deleteUsers(data, counter);
    } else {
        sap.m.MessageToast.show("Users have been deleted from the instance !");
        dataRefresh();
        oButton2.setVisible(true);
    }
}

function dataRefresh() {
    userRecs = [];
    var planet9server = '';
    if (typeof AppCache !== "undefined" && AppCache.isMobile && !false) {
        planet9server = AppCache.Url;
    }
    oBusyDialog.setText("Refreshing user list...");
    oBusyDialog.open();
    $.ajax({
        url: planet9server + "/api/functions/User/List",
        method: "POST",
        data: {"start":0,"end":9999999},
    }).done(function(data) {
        var userList = JSON.parse(JSON.stringify(data.userRecords)).filter(e => e.username !== 'admin');
        modeloTable.setData(userList);
        modeloTable.refresh();
        oBusyDialog.close();
        oTable.removeSelections();
    }).fail(function(xhr) {
        oBusyDialog.close();
        oTable.setNoDataText(xhr.responseJSON.status);
    });
}
