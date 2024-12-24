import Bus from '../models/busModel.js';
import Route from '../models/busRouteModel.js';
import { validateAndAssignAdminOrOperator } from '../validators/busAddUpdatePersonAsigner.js';
import { AppError } from '../utils/errorHandler.js';


// Add New Bus
export const addNewBus = async (req, res,next) => {
    try {
       
        const { permitNo, busNo, busName, busType, driverRegisteredCode, conductorRegisteredCode, routeNo } = req.body;

        const existingBus = await Bus.findOne({ permitNo } );
        if (existingBus) {
            return res.status(409).json({ message: 'This bus is already registered' });
        }

        const existingBusNo = await Bus.findOne({ busNo } );
        if (existingBusNo) {
            return res.status(409).json({ message: 'This bus is already registered' });
        }

        // Check if routeNo exists in Route table
        const route = await Route.findOne({ routeNo });
        if (!route) {
            return res.status(400).json({ error: 'Invalid route number. Route not found.' });
        }

        // Prepare bus data with routeId
        const busData = {
            permitNo,
            busNo,
            busName,
            busType,
            driverRegisteredCode,
            conductorRegisteredCode,
            routeNo: route._id
        };

       const systemEnteredId = await validateAndAssignAdminOrOperator(req)

       Object.assign(busData, systemEnteredId);

        // Save Bus Data
        const newBus = new Bus(busData,);
        await newBus.save();


        res.status(200).json({
            message: 'Bus added successfully!',
            
        });

       next()

    } catch (error) {
        next(error)
    }
};


//delete bus by permit no
export const deleteBus = async (req, res, next) => {
    try {
        const { permitNo } = req.params;

        //Find the bus by permitNo
        const bus = await Bus.findOne({ permitNo });

        if (!bus) {
            return res.status(404).json({ message: `No Bus found with the Permit No '${permitNo}'.` });
        }

        // Authorization Check
        if (req.operator?.operatorId) {
            if (bus.systemEnteredOperatorId?.toString() !== req.operator.operatorId) {
                return res.status(403).json({ message: 'Unauthorized: You can only delete buses you created.' });
            }
        } else if (!req.admin?.adminId) {
            // If neither an Admin nor a valid Operator, deny access
            return res.status(403).json({ message: 'Unauthorized: Only Admins or the assigned Operator can delete this bus.' });
        }

        // Perform the deletion
        await Bus.deleteOne({ permitNo });

        res.status(200).json({
            message: `Bus with Permit No '${permitNo}' deleted successfully.`,
        });

        next();

    } catch (error) {
        next(error); // Pass error to the global error handler
    }
};



// update all details of bus by permit no
export const updateBusPermitNo = async (req, res, next) => {
    try {
        const { permitNo } = req.params; 
        const { busNo, busName, busType, driverRegisteredCode, conductorRegisteredCode, routeNo } = req.body;// Get updates from request body

        if (!permitNo || !busNo || !busName || !busType || !driverRegisteredCode || !conductorRegisteredCode || !routeNo){
            throw new AppError('all fields are required', 422, 'ValidationError');
        }

        // Find the bus by permitNo
        const bus = await Bus.findOne({ permitNo });
        if (!bus) {
            return res.status(404).json({ message: `No Bus found with Permit No '${permitNo}'.` });
        }

        // Authorization Check
        if (req.operator?.operatorId) {
            // If Operator is trying to update
            if (bus.systemEnteredOperatorId?.toString() !== req.operator.operatorId) {
                return res.status(403).json({ message: 'Unauthorized: You can only update buses you created.' });
            }
        } else if (!req.admin?.adminId) {
            // If neither Admin nor a valid Operator, deny access
            return res.status(403).json({ message: 'Unauthorized: Only Admins or the assigned Operator can update this bus.' });
        }

        // Check if routeNo exists in Route table
        const route = await Route.findOne({ routeNo });
        if (!route) {
            return res.status(400).json({ error: 'Invalid route number. Route not found.' });
        }

        const systemEnteredId = await validateAndAssignAdminOrOperator(req)


        // Perform the update
        const updatedBus = await Bus.findOneAndUpdate(
            { permitNo },
            {busNo,busName,busType,driverRegisteredCode,conductorRegisteredCode,routeNo: route._id,systemEnteredId},       // Update data
            { new: true} // Return the updated document and validate updates
        );

        res.status(200).json({
            message: `Bus with Permit No '${permitNo}' updated successfully.`,
            
        });

        next();
    } catch (error) {
        next(error); // Pass error to the global error handler
    }
};



// update driver code and conductor code by using bus no 
export const updateBusByBusNo = async (req, res, next) => {
    try {
        const { busNo } = req.params; 
        const {  driverRegisteredCode, conductorRegisteredCode } = req.body;// Get updates from request body

        if ( !busNo || !driverRegisteredCode || !conductorRegisteredCode ){
            throw new AppError('all fields are required', 422, 'ValidationError');
        }

        // Find the bus by busNo
        const bus = await Bus.findOne({ busNo });
        if (!bus) {
            return res.status(404).json({ message: `No Bus found with Permit No '${busNo}'.` });
        }

        // Authorization Check
        if (req.operator?.operatorId) {
            // If Operator is trying to update
            if (bus.systemEnteredOperatorId?.toString() !== req.operator.operatorId) {
                return res.status(403).json({ message: 'Unauthorized: You can only update buses you created.' });
            }
        } else if (!req.admin?.adminId) {
            // If neither Admin nor a valid Operator, deny access
            return res.status(403).json({ message: 'Unauthorized: Only Admins or the assigned Operator can update this bus.' });
        }


        const systemEnteredId = await validateAndAssignAdminOrOperator(req)


        // Perform the update
        const updatedBus = await Bus.findOneAndUpdate(
            { busNo },
            {driverRegisteredCode,conductorRegisteredCode,systemEnteredId},       // Update data
            { new: true} // Return the updated document and validate updates
        );

        res.status(200).json({
            message: ` driver code and conductor code of Bus with  No '${busNo}' updated successfully.`,
            
        });

        next();
    } catch (error) {
        next(error); // Pass error to the global error handler
    }
};

