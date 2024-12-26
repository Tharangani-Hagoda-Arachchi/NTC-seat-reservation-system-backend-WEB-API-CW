import Route from '../models/busRouteModel.js';
import Bus from '../models/busModel.js';

 export const validateTripReferences = async (routeNo,busNo) => {

    const route = await Route.findOne({ routeNo });
    if (!route) {
        throw new Error('Invalid route number. Route not found.');
    }
   
    const bus = await Bus.findOne({ busNo });
    if (!bus) {
        throw new Error('Invalid bus no.');
    }

    // Return the validated data
    return { route, bus };
    
};

export default validateTripReferences



