# API-Call-Information-

##Usage of ADSB Exchange to check for Flight information 

##Table Of Contents
- [GetLastFlightInfo](##GetLiveFlightInfo): Reads the last flight information from the FlightStats API
- [GetLiveFlightInfo](##GetLastFlightInfo): Reads the live flight information from the FlightStats API
- [InAirChecker](##InAirChecker): Checks if the specified plane is in the air
- [AddressToLatLong](##AddressToLatLong): Converts an airport address to its latitude and longitude using the OpenCage Geocoding API
- [getDistanceFromDestPort](##getDistanceFromDestPort): Calculates the distance between the specified coordinates and the destination airport
    //getDistanceFromDestPort

  ##GetLiveFlightInfo
  ```
  ///Call
  GetLiveFlightInfo();
  ///Output:
  console.log(`The Only Important bits:
    Hex: ${responseData.ica[0].hex}
    Registration: ${responseData.ica[0].r}
    Latitude: ${responseData.ica[0].lat}
    Longitude: ${responseData.ica[0].lon}
    Altitude Geometric Reading: ${responseData.ica[0].alt_geom}
    Altitude Barometric Reading: ${responseData.ica[0].alt_baro}`);
  ```

  ##GetLastFlightInfo
  ```
  ///Call
  GetLastFlightInfo();
  ///output:
  console.log(`The Only Important bits:
    Hex: ${responseData.hex}
    Registration: ${responseData.r}
    Latitude: ${responseData.lat}
    Longitude: ${responseData.lon}
    Status: ${responseData.alt_baro}`); ///--> SHould display in the air or on the ground 
  
  ```
  ##InAirChecker
  ```
  ///Verifies if the flight is in the air or not, runs every 10 minutes checking if a single Flight is not on the ground, if it isnt it pushes a notification to the selected security services 
  ///CALL
  InAirChecker();
  ///output:
    console.log(`The plane is in the air current reading values:
        Latitude: ${responseData.ica[0].lat}
        Longitude: ${responseData.ica[0].lon}
        Altitude Geometric Reading: ${responseData.ica[0].alt_geom}
        Altitude Barometric Reading: ${responseData.ica[0].alt_baro}`);
  //Text alert to selected number: Client Flient has taken off, please check for more details
  ```

  ##AddresstoLatLong
  ```
  ///Converts an airport address to a longitudinal or latitudinal value to be compared to current flight longitude and latitude
  //Call:
  AddresstoLatLong();
  ///output:
  ///See Variables
  let dest_lat;
  let dest_long;
  
  ```

  ##getDistanceFromDestPort
  ```
  ///Gets the distance from the InAirChecker() and obtains the distance between the flight and the airport, it then pushes a notification to security services on departure and estimated time to arrival based on airspeed and distance left
  ///Call
  getDistanceFromDestPort();
  ///Output:
  console.log(`The distance from the destination airport is: ${d} meters`);
  ///notification to security services
  /*
  Client Flient has landed, please check for more details
  */
  
  ```
