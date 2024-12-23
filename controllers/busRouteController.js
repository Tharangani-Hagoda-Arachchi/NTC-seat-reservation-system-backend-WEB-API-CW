import Route from '../models/busRouteModel.js';


// add new route
export const addRoute = async (req, res, next) => {
    try{
        const { routeNo, startLocation,endLocation,totalDistanceIn_km} = req.body

        const capitalizeFirstLetter = (str) => {
            if (!str || typeof str !== 'string') return '';
            return str.trim().charAt(0).toUpperCase() + str.trim().slice(1).toLowerCase();
        };

        //  Normalize Input
        const normalizedStartLocation = capitalizeFirstLetter(startLocation);
        const normalizedEndLocation = capitalizeFirstLetter(endLocation);


        // check route is already exists
        const existingRoute = await Route.findOne({ routeNo });
        if (existingRoute) {
            return res.status(409).json({ message: 'This route is already registered' });
        }

        // create nwe route
        const newRoute = new Route({
            routeNo,
            startLocation: normalizedStartLocation,
            endLocation: normalizedEndLocation,
            totalDistanceIn_km
        });

        await newRoute.save();

        res.status(201).json({ message: 'Add new route successfully.' });

        next()


    } catch(error){
        next(error); // Pass error to the global error handler
    }
};

//get route by no
export const getRouteByRouteNo = async (req, res, next) => {
    try{
        const {routeNo} = req.params
        if (typeof routeNo !== 'string') {
            throw new Error('routeNo must be a string');
        }

        if (!routeNo) {
            throw new AppError('Route no required', 422, 'ValidationError');
        }

        const route = await Route.findOne({ routeNo });

        if (!route) {
            return res.status(404).json({ message: 'Route is not found' });
        } else{
            res.status(200).json({
                message: `Routes retrieved successfully.`,
                routeNo: route.routeNo,
                startLocation: route.startLocation,
                endLocation: route.endLocation,
                totalDistanceIn_km: route.totalDistanceIn_km
            });
        }
        next()

    } catch(error){
        next(error); // Pass error to the global error handler
    }
}

//get routes by start location
export const getRouteByStaratLocation = async (req, res, next) => {
    try{
        const {startLocation} = req.params

        if (!startLocation) {
            throw new AppError('Start Location required', 422, 'ValidationError');
        }
        const normalizedStartLocation = startLocation
            .trim()
            .toLowerCase()
            .replace(/^\w/, (c) => c.toUpperCase());


        const route = await Route.find({ startLocation: normalizedStartLocation });

        if (!route || route.length === 0) {
            return res.status(404).json({ message: 'No routes found for the specified start location.' });
        } else{
            
            res.status(200).json({
                message: `Routes retrieved successfully.`,
                routes: route.map(route => ({
                    routeNo: route.routeNo,
                    startLocation: route.startLocation,
                    endLocation: route.endLocation,
                    totalDistanceIn_km: route.totalDistanceIn_km
                }))
            });
        }
        next()

    } catch(error){
        next(error); // Pass error to the global error handler
    }
}

// get all routes
export const getRoute = async (req, res, next) => {
    try {

        // Search for all admin
        const route = await Route.find();

        if (!route) {
            return res.status(404).json({ message: `No routes found'.` });
        }
        
        // Sort routes alphabetically by startLocation
        route.sort((a, b) => {
            if (a.routeNo !== b.routeNo) {
                return a.routeNo - b.routeNo; // Sort numerically by routeNo
            }
            return a.startLocation.localeCompare(b.startLocation); // Sort alphabetically by startLocation
        });

        res.status(200).json({
            message: `Routes retrieved successfully.`,
            routes: route.map(route => ({
                routeNo: route.routeNo,
                startLocation: route.startLocation,
                endLocation: route.endLocation,
                totalDistanceIn_km: route.totalDistanceIn_km
            }))
        });
        next()

    } catch (error) {
        next(error); // Pass error to the global error handler
    }
};

//delete route
export const deleteRoute = async (req, res, next) => {
    try {

        const { routeNo } = req.params;

        // Find and delete operatot by id
        const deletedRoute = await Route.findOneAndDelete({ routeNo });

        if (!deletedRoute) {
            return res.status(404).json({ message: `No route found with the No '${routeNo}'.` });
        }

        res.status(200).json({message: `Route with No '${routeNo}' deleted successfully.`,});

        next()

    } catch (error) {
        next(error); // Pass error to the global error handler
    }
};






