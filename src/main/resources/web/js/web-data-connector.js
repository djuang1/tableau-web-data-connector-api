(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
        var cols = [{
            id: "Account_ID",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "Account_Name",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "Number_Sent",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "Number_Delivered",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "Unique_Clicks",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "Unique_Opens",
            dataType: tableau.dataTypeEnum.float
        }];

        var tableSchema = {
            id: "marketingData",
            alias: "Marketing Data",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

    // Download the data
    myConnector.getData = function(table, doneCallback) {
		//tokenJSON = JSON.parse(tableau.connectionData);

		$.ajax({
			//beforeSend: function(request) {
			//	request.setRequestHeader("Authorization", 'Bearer ' + tokenJSON.token);
			//},
			dataType: "json",
			url: '/api/data/emails',
			success: function(resp) {
				var parsedResp = resp,
					tableData = [];
					
				// Iterate over the JSON object
				for (var i = 0, len = parsedResp.length; i < len; i++) {
					console.log('In loop with: ');
					console.log(parsedResp[i]);
					tableData.push({
						"Account_ID": parsedResp[i]['account_id'],
						"Account_Name": parsedResp[i]['account_name'],
						"Number_Sent": parsedResp[i]['number_sent'],
						"Number_Delivered": parsedResp[i]['number_delivered'],
						"Unique_Clicks": parsedResp[i]['unique_clicks'],
						"Unique_Opens": parsedResp[i]['unique_opens']
					});
				}

				table.appendRows(tableData);
				doneCallback();			
			},
            error: function (textStatus, errorThrown) {
                alert(errorThrown);
            }
		});
		
    };

    tableau.registerConnector(myConnector);

    // Create event listeners for when the user submits the form
    $(document).ready(function() {
        $("#submitButton").click(function() {
            tableau.connectionName = "Marketing Data"; // This will be the data source name in Tableau
			//token = $('#anypoint').val();
			//tableau.connectionData = JSON.stringify({token: token});
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();
