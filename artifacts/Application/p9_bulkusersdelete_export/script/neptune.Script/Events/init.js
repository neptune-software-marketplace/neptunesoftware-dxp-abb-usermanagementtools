var progcount = 0,
    chunklength = 0;

sap.ui.getCore().attachInit(function(data) {
    setTimeout(function() {
        dataRefresh();
        modeloTable.setSizeLimit(999999);
    }, 200);
    
});


