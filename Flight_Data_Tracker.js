const axios = require('axios');

const readline = require('readline');
const Key = 'Enter Your Token Key for ADSB Exchnage';
const Host = 'adsbexchange-com1.p.rapidapi.com';
const accountSid = 'Enter Your Account Token';
const authToken = 'Enter Your Auth Token';
const client = require('twilio')(accountSid, authToken);



async function getLastPosition() {
    const userInput = await getInput('Enter flight number, tail number, or hex code: ');
    if(userInput.length > 6)
    {
        console.log("Hex code is too long, please enter a valid hex code");
        return;
    }
    else{
    const options = {
        method: 'GET',
        url: `https://adsbexchange-com1.p.rapidapi.com/v2/hex/${userInput}/`,
        headers: {
            'X-RapidAPI-Key': Key,
            'X-RapidAPI-Host': Host
        }
    };

    let responseData;
    try {
        const response = await axios.request(options);
        responseData = response.data;
    } catch (error) {
        console.error(error);
        responseData = null;
    }

    return responseData;
}
}


async function getLivePosition() {
    const userInput = await getInput('Enter flight number, tail number, or hex code: ');
    if(userInput.length > 6)
    {
        console.log("Hex code is too long, please enter a valid hex code");
        return;
    }
    else{
    const options = {
        method: 'GET',
        url: `https://adsbexchange-com1.p.rapidapi.com/v2/icao/${userInput}/`,
        headers: {
            'X-RapidAPI-Key': Key,
            'X-RapidAPI-Host': Host
        }
    };

    let responseData;
    try {
        const response = await axios.request(options);
        responseData = response.data;
    } catch (error) {
        console.error(error);
        responseData = null;
    }

    return responseData;
}
}

async function getInput(prompt) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve, reject) => {
        rl.question(prompt, (answer) => {
            rl.close();
            resolve(answer);
        });
    });
}

async function GetLastFlightInfo() {
    responseData = await getLastPosition();
    // Use the responseData here
    //console.log(responseData);
    console.log(`The Only Important bits:
    Hex: ${responseData.hex}
    Registration: ${responseData.r}
    Latitude: ${responseData.lat}
    Longitude: ${responseData.lon}
    Status: ${responseData.alt_baro}`); 
}
async function GetLiveFlightInfo() {
    responseData = await getLivePosition();
    // Use the responseData here
    //console.log(responseData);
    
    console.log(`The Only Important bits:
    Hex: ${responseData.ica[0].hex}
    Registration: ${responseData.ica[0].r}
    Latitude: ${responseData.ica[0].lat}
    Longitude: ${responseData.ica[0].lon}
    Altitude Geometric Reading: ${responseData.ica[0].alt_geom}
    Altitude Barometric Reading: ${responseData.ica[0].alt_baro}`); 
}

async function InAirChecker() {
    responseData = await getLastPosition();
    
    if(responseData.alt_baro != 'ground')
    {
        responseData = await getLivePosition();
        console.log(`The plane is in the air current reading values:
        Latitude: ${responseData.ica[0].lat}
        Longitude: ${responseData.ica[0].lon}
        Altitude Geometric Reading: ${responseData.ica[0].alt_geom}
        Altitude Barometric Reading: ${responseData.ica[0].alt_baro}`);
        ///Send a text message to the Authorized security team on flight take off 
        client.messages
        .create({
            body: 'Client Flient has taken off, please check for more details',
            to: 'Enter Your Text Number', // Text your number
            from: 'Enter Your Twilio Number', // From a valid Twilio number
        })
        .then((message) => console.log(message.sid));

        ///make it so that we get the approximate address of where the plane is
    }
}
///This function just loops and checks if the plane is in the air, if it is then it switcehs to the Liveposition check and givens the current values 
setInterval(async () => {
    await InAirChecker();
}, 10 * 60 * 1000); // 10 minutes in milliseconds
////The Portion above acan be changed with WayScript to be a trigger, so that it only runs when the plane is in the air, and then it will send a text message to the user
let dest_lat;
let dest_long
async function AddressToLatLong(){
    
    let a = await getInput('Enter the Address of the destination airport: ');
    let b = await getInput('Enter the City of the destination airport: ');
    let c = await getInput('Enter the State of the destination airport example (PA): ');
    let d = await getInput('Enter the Zip of the destination airport: ');
    let e = await getInput('Enter the Country of destination airport example (USA): ');
    
    const ops = {
        method: 'GET',
        url: 'https://forward-reverse-geocoding.p.rapidapi.com/v1/forward',
        params: {
          street: a,
          city: b,
          state: c,
          postalcode: d,
          country: e,
          'accept-language': 'en',
          polygon_threshold: '0.0'
        },
        headers: {
          'X-RapidAPI-Key': 'Enter Your Token Key for OpenCage Geocoding API',
          'X-RapidAPI-Host': 'forward-reverse-geocoding.p.rapidapi.com'
        }
      };


try {
    const responseLL = await axios.request(ops);
      ///console.log(responseLL.data);
      dest_lat = responseLL.data[0].lat;
      dest_long = responseLL.data[0].lon;
    
  } catch (error) {
    console.error(error);
    responseData = null;
  }

    
}

async function getDistanceFromDestPort(){
    responseData = await getLastPosition();
    let lat1 = responseData.lat;
    let lon1 = responseData.lon;
    let lat2 = dest_lat;
    let lon2 = dest_long;
    let R = 6371e3; // metres
    let φ1 = lat1 * Math.PI/180; // φ, λ in radians
    let φ2 = lat2 * Math.PI/180;
    let Δφ = (lat2-lat1) * Math.PI/180;
    let Δλ = (lon2-lon1) * Math.PI/180;

    let a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);

    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    let d = R * c; // in metres
    console.log(`The distance from the destination airport is: ${d} meters`);
    if(d < 1000)
    {
        ///Send a text message to the Authorized security team on flight take off and or the flight has landed
        client.messages
        .create({
            body: 'Client Flient has landed, please check for more details',
            to: 'Enter Your Text Number', // Text your number
            from: 'Enter Your Twilio Number', // From a valid Twilio number
        })
        .then((message) => console.log(message.sid));
    }
    else{
        console.log(`The distance from the destination airport is: ${d} meters`);
    }
}









// Documentation:
// - GetLastFlightInfo: Reads the last flight information from the FlightStats API
    //GetLastFlightInfo();
// - GetLiveFlightInfo: Reads the live flight information from the FlightStats API
    //GetLiveFlightInfo();
// - InAirChecker: Checks if the specified plane is in the air
    //InAirChecker();
// - AddressToLatLong: Converts an airport address to its latitude and longitude using the OpenCage Geocoding API
    //AddressToLatLong();
// - getDistanceFromDestPort: Calculates the distance between the specified coordinates and the destination airport
    //getDistanceFromDestPort



