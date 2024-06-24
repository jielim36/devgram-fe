import { updateUserInfo } from "@/services";
import { UpdateUserInfo } from "@/types";

const GEO_KEY = 'LastGeoLocationUpdateDate';

function updateGeoLocation(userId: number) {

    // check need to update or not
    if (!shouldUpdateGeoLocation()) return;

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => success(position, userId), error);
    } else {
        console.log("Geolocation not supported");
    }
}

function success(position: any, userId: number) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    getCountry(latitude, longitude, userId);
}

function error() {
    console.log("Unable to retrieve your location");
}

const getCountry = async (lat: any, lon: any, userId: number) => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAP_API_KEY;

    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${apiKey}&language=en`);
    const data = await response.json();
    if (data.results.length > 0) {
        const addressComponents = data.results[0].address_components;

        const country = addressComponents.find((component: any) => component.types.includes('country'))?.long_name || '';
        const state = addressComponents.find((component: any) => component.types.includes('administrative_area_level_1'))?.long_name || '';
        const city = addressComponents.find((component: any) => component.types.includes('locality'))?.long_name || '';

        const address = `${city}, ${state}, ${country}`;
        const userInfo: UpdateUserInfo = {
            userInfoEntity: {
                user_id: userId,
                address: address,
            }
        }
        updateUserInfo(userInfo);
    }
};

function shouldUpdateGeoLocation(): boolean {
    const twentyFourHours = 24 * 60 * 60 * 1000; // 一天的毫秒数

    // get current timestamp
    const currentTime = new Date().getTime();

    // get stored timestamp
    const storedTime = localStorage.getItem(GEO_KEY);

    if (!storedTime) {
        // if no stored timestamp, add current timestamp to local storage
        localStorage.setItem(GEO_KEY, currentTime.toString());
        return true;
    } else {
        // convert stored timestamp to number
        const storedTimeValue = parseInt(storedTime);

        // calculate time difference, if greater than 24 hours, return true
        const timeDiff = currentTime - storedTimeValue;

        if (timeDiff > twentyFourHours) {
            localStorage.setItem(GEO_KEY, currentTime.toString());
            return true;
        } else {
            return false;
        }
    }
}

export default updateGeoLocation;