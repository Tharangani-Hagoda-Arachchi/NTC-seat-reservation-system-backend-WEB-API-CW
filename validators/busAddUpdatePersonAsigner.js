import Admin from '../models/adminModel.js';
import Operator from '../models/operatorModel.js';


export const validateAndAssignAdminOrOperator = async (req,res,next) => {
    if (req.admin?.adminId) {
        // If Admin ID exists, verify and store it
        const isAdmin = await Admin.findById(req.admin.adminId);
        if (!isAdmin) {
            return res.status(403).json({ error: 'Unauthorized: Admin not found.' });
        }    
        return {systemEnteredAdminId: isAdmin._id};
    } else if (req.operator?.operatorId) {
        // If Operator ID exists, verify and store it
        const isOperator = await Operator.findById(req.operator.operatorId);
        if (!isOperator) {
            return res.status(403).json({ error: 'Unauthorized: Operator not found.' });
        }
        return {systemEnteredOperatorId: isOperator._id};
    } else {
        // If neither Admin nor Operator is found
        return res.status(403).json({ error: 'Unauthorized: User must be an Admin or Operator.' });
    }

};

