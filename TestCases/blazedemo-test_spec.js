describe('Blassedemo_Test', function(){

	
	it('TC 01 - Launch the Blazedemo website.', function(){

		browser.ignoreSynchronization = true;

		expect(browser.getCurrentUrl()).toEqual("https://blazedemo.com/");

		console.log('========== A website is launched. ==========');		
	});


	it('Scenario 1_Verify UI of website - TC 02  Verify top navigation bar is present and confirm the text on it', function(){

		browser.ignoreSynchronization = true;

		// Verify top navigation bar is present and confirm the text on it. 
		expect(element(by.cssContainingText('[href="index.php"]','Travel The World')).isDisplayed()).toBe(true);
		expect(element(by.cssContainingText('[href="home"]','home')).isDisplayed()).toBe(true);
		console.log('========== 02. Navigation bar with correct text is displayed.');
	});


	it('Scenario 1_Verify UI of website - TC 03 Verify the header present on the home page.', function(){
		
		browser.ignoreSynchronization = true;

		// Verify the header of the main home page.
		expect(element(by.css('[class="jumbotron"]')).element(by.css('[class="container"]')).getText()).toEqual("Welcome to the Simple Travel Agency!"
			+"\nThe is a sample site you can test with BlazeMeter!"
			+"\nCheck out our destination of the week! The Beach!");
		expect(element(by.css('[class="jumbotron"]')).element(by.css('[href="vacation.html"]')).isPresent()).toBe(true);
		console.log('========== 03. Website header is displayed correctly.');		
	});


	it('Scenario 1_Verify UI of website - TC 04 Verify departuare city details', function(){
		
		browser.ignoreSynchronization = true;

		// Verify departuare city details
		var deptLable = element.all(by.css('[class="container"]')).get(1);
		expect(deptLable.element(by.xpath('//h2')).getText()).toEqual('Choose your departure city:');
		element(by.css('[name="fromPort"]')).click();
		expect(element(by.css('[class="form-inline"]')).getText()).toEqual('Paris\nPhiladelphia\nBoston\nPortland\nSan Diego\nMexico City\nSão Paolo');
		console.log('========== 04. Departure city details are displayed correctly.');

		console.log('***** Defect 1 : Extra spaces are added before first departure city name and after last departure city name.');
	});


	it('Scenario 1_Verify UI of website - TC 05 Verify destination city details', function(){
		
		browser.ignoreSynchronization = true;

		// Verify destination city details.
		var destHeader = element.all(by.xpath('//h2')).get(1);
		expect(destHeader.getText()).toEqual('Choose your destination city:');
		element(by.css('[name="toPort"]')).click();
		expect(element(by.css('[name="toPort"]')).getText()).toEqual('Buenos Aires\Rome\London\Berlin\nNew York\nDublin\nCairo');
		console.log('========== 05. Destination city details are displayed correctly.');

		console.log('***** Defect 2 : New line is not selected for every city name listed in to port dropdown list.');
	});


	it('Scenario 1_Verify UI of website - TC 06 Verify_Find Flights_button is working fine.', function(){

		browser.ignoreSynchronization = true;

		// By default departure city and destination city both fields have values. Click on 'Find Flights' to see flights
		element(by.css('[value="Find Flights"]')).click();

		// wait for reserve page to load, showing table of flight details.
		browser.ignoreSynchronization = true;
		browser.wait(element(by.css('[class="table"]')), 2000);
	});

	
	it('Scenario 2_Book flight - TC 07 For default departure city and destination city selected, book all available flights.', function(){

		// get the count of all available flights.
		element.all(by.css('[value="Choose This Flight"]')).count().then(function(totalFlights_default){
			console.log('========== Total flights available for booking are: '+ totalFlights_default);

			// Select each fight one-by-one and do the booking.
			var i;
			for (i=0;i<totalFlights_default;i++){
				
				element(by.css('[class="table"]')).all(by.css('[value="Choose This Flight"]')).get(i).click().then(function(){

					// wait for purchase page to load.
					browser.ignoreSynchronization = true;
					browser.wait(element(by.css('[value="Purchase Flight"]')), 2000);
					element(by.css('[value="Purchase Flight"]')).click();

					// wait for confirmation page to load.
					browser.ignoreSynchronization = true;
					browser.wait(element(by.css('[class="table"]')),5000);			

					// check elements in rows 
					var rows = element(by.css('[class="table"]')).all(by.tagName("tr"));

					const cells = rows.all(by.tagName("td"));

					// check confirmation ID
					cells.get(1).getText().then(function(ID){
						console.log('The confirmation ID of flight booking is: '+ ID);
					});


					browser.navigate().back();				// navigate back to purchase page
					browser.ignoreSynchronization = true;

					browser.navigate().back();				// navigate back to reserve page
					browser.ignoreSynchronization = true;
				});	
			}
		});		
	});


	it('Scenario 2_Book flight - TC 08 Ensure flight selected on reserve page is correctly booked on purchase page.', function(){

		browser.navigate().back();				// navigate back to home page
		browser.ignoreSynchronization = true;
		browser.wait(element(by.css('[name="fromPort"]')), 3000);			

		// Select last city in the departure city dropdown.
		element(by.css('[name="fromPort"]')).click().then(function(){
			element(by.css('[value="São Paolo"]')).click();
		});

		// select last city in destination city dropdown.
		element(by.css('[name="toPort"]')).click().then(function(){
			element(by.css('[value="Cairo"]')).click();
		});	

		element(by.css('[value="Find Flights"]')).click();		// find flights

		// wait for reserve page to load, showing table of flight details.
		browser.ignoreSynchronization = true;
		browser.wait(element(by.css('[class="table"]')), 2000);

		// get the count of all available flights.
		element.all(by.css('[value="Choose This Flight"]')).count().then(function(totalFlights_last){
			console.log('========== Total flights available for booking are: '+ totalFlights_last);

			// Select each fight one-by-one and do the booking.
			var j; 
			var flight_details = new Array;
			var flight_nm_cnt = 1;
			var airline_cnt = 2;
			var price_cnt = 5;
			for (j=0;j<totalFlights_last;j++){

				// Check Flight name, Airline and Price of flight displayed on reserve page.
				var res_row = element(by.css('[class="table"]')).all(by.tagName("tr"));
				const res_cells = res_row.all(by.tagName("td"));

				// save flight name of selected flight
				var flightNm = res_cells.get(flight_nm_cnt).getText().then(function(k){
					console.log("The name of flight is: "+ k);
					flight_details.push(k);
				});

				// save airline name of selected flight
				var airlineNm = res_cells.get(airline_cnt).getText().then(function(l){
					console.log('The Airline Name is: '+ l);
					flight_details.push(l);
				});

				// save Price os selected flight
				var price = res_cells.get(price_cnt).getText().then(function(m){
					console.log('The Price of selected flight is: '+ m);
					flight_details.push(m);
				});

				// increase count to get next flight details as per  flight selection.
				flight_nm_cnt = flight_nm_cnt + 6; 
				airline_cnt = airline_cnt + 6;
				price_cnt = price_cnt + 6;

				element(by.css('[class="table"]')).all(by.css('[value="Choose This Flight"]')).get(j).click().then(function(){

					// wait for purchase page to load.
					browser.ignoreSynchronization = true;
					browser.wait(element(by.css('[value="Purchase Flight"]')), 2000);

					// confirm selected flight details are present correctly.
					expect(element.all(by.tagName("p")).get(0).getText()).toEqual('Airline: ' + flight_details[1]); 
					expect(element.all(by.tagName("p")).get(1).getText()).toEqual('Flight Number: ' + flight_details[0]);
					expect(element.all(by.tagName("p")).get(2).getText()).toEqual('Price: ' + flight_details[2]);

					// Empty the array for net iteration usage.
					flight_details = [];


					element(by.css('[value="Purchase Flight"]')).click();

					// wait for confirmation page to load.
					browser.ignoreSynchronization = true;
					browser.wait(element(by.css('[class="table"]')),5000);			

					// check elements in rows 
					var rows_lastCity = element(by.css('[class="table"]')).all(by.tagName("tr"));

					const cells_lastCity = rows_lastCity.all(by.tagName("td"));

					// check confirmation ID
					cells_lastCity.get(1).getText().then(function(ID){
						console.log('The confirmation ID of flight booking is: '+ ID);
					});


					browser.navigate().back();				// navigate back to purchase page
					browser.ignoreSynchronization = true;

					browser.navigate().back();				// navigate back to reserve page
					browser.ignoreSynchronization = true;		
				});	
			}
		});

		console.log('***** Defect 03 - Flight Details on reserve page are not matching with flight details on purchase page.');

	});


	it('Scenario 3_Verify different URLs on the website - TC 09 Verify the URL present on landing page header is working fine.', function(){

			browser.navigate().back();				// navigate back to reserve page
			browser.ignoreSynchronization = true;
			
			// check URL is working on landing page
			element(by.css('[class="jumbotron"]')).element(by.css('[href="vacation.html"]')).click();			

			// Wait for vacation image to display.
			browser.ignoreSynchronization = true;	
			expect(browser.getCurrentUrl()).toEqual('https://blazedemo.com/vacation.html');
			browser.wait(element(by.css('[src="assets/vacation.jpg"]')), 2000);
			console.log('========== Navigation to Vacation picture: success.');
				
			// Navigate back to landing page.
			browser.navigate().back();
			browser.ignoreSynchronization = true;	

			// Wait for elements on home page to load, confirm with 'Find Flights' button.
			browser.wait(element(by.css('[value="Find Flights"]')), 2000);
			expect(browser.getCurrentUrl()).toEqual('https://blazedemo.com/');
			console.log('========== Navigation back from Vacation picture: success.');
	});


	it('Scenario 2_Verify different URLs on the website - TC 10 Check URLs on top navigation bar.', function(){

		browser.ignoreSynchronization = true;
		
		// click on first URL on navigation bar.
		element(by.cssContainingText('[href="index.php"]','Travel The World')).click();
		expect(browser.refresh()).toBe(null); // page refreshes.


		// click on home  URL on rop navigation bar.
		element(by.cssContainingText('[href="home"]','home')).click();
		browser.wait(element(by.cssContainingText('[class="btn btn-primary"]','Login')), 3000); 		// Login page is opened.

		console.log('***** Defect 4: Landing page is opened without asking for the login credentials.');

		browser.navigate().forward();			// contral back to landing page to proceed with further test execution.
	});



})	