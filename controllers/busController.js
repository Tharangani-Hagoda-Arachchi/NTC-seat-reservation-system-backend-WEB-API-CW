import Bus from '../models/busModel.js';
import Route from '../models/busRouteModel.js';
import Admin from '../models/adminModel.js';
import Operator from '../models/operatorModel.js';


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

        if (req.admin?.adminId) {
            // If Admin ID exists, verify and store it
            const isAdmin = await Admin.findById(req.admin.adminId);
            if (!isAdmin) {
                return res.status(403).json({ error: 'Unauthorized: Admin not found.' });
            }
            busData.systemEnteredAdminId = isAdmin._id;
        } else if (req.operator?.operatorId) {
            // If Operator ID exists, verify and store it
            const isOperator = await Operator.findById(req.operator.operatorId);
            if (!isOperator) {
                return res.status(403).json({ error: 'Unauthorized: Operator not found.' });
            }
            busData.systemEnteredOperatorId = isOperator._id;
        } else {
            // If neither Admin nor Operator is found
            return res.status(403).json({ error: 'Unauthorized: User must be an Admin or Operator.' });
        }

        // Save Bus Data
        const newBus = new Bus(busData);
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
