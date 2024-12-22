import Operator from '../models/operatorModel.js';
import { AppError } from '../utils/errorHandler.js'; 
import bcrypt from 'bcrypt';



const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); // Basic email regex
const isValidPassword = (password) => /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{6,}$/.test(password); // At least 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char
const isValidPhone = (phone) => /^\d{10}$/.test(phone); 


export const addOperator = async (req, res, next) => {
    try{
        const { operatorRegisteredId,operatorName, operatorEmail,operatorPassword,operatorPhoneNo } = req.body

        const existingOperator = await Operator.findOne({ operatorRegisteredId });
        if (existingOperator) {
            return res.status(409).json({ message: 'Operator is already registered' });
        }

        // check email is already exists
        const existingOperatorEmail = await Operator.findOne({ operatorEmail });
        if (existingOperatorEmail) {
            return res.status(409).json({ message: 'Email is already registered' });
        }

        // create nwe operator
        const newOperator = new Operator({
            operatorRegisteredId,
            operatorName,
            operatorEmail,
            operatorPassword,
            operatorPhoneNo
        });

        await newOperator.save();

        res.status(201).json({ message: 'New Operator Added successful' });


    } catch(error){
        next(error); // Pass error to the global error handler
    }
};



//get admin by ID
export const getOperatorById = async (req, res, next) => {
    try {
        const {operatorRegisteredId}  = req.params;

        // Validate the  id
        if (!operatorRegisteredId) {
            throw new AppError('ID required', 422, 'ValidationError');
        }

        // Search for operator with the given id
        const operator = await Operator.findOne({ operatorRegisteredId });

        if (!operator) {
            return res.status(404).json({ message: `No operator found with the ID '${operatorRegisteredId}'.` });
        }

        res.status(200).json({
            message: `Operator with the ID '${operatorRegisteredId}' retrieved successfully.`,
            operatorRegisteredId,
            operatorName: operator.operatorName,
            operatorEmail: operator.operatorEmail,
            operatorPhoneNo: operator.operatorPhoneNo
        });
    } catch (error) {
        next(error); // Pass error to the global error handler
    }
};

//get all operators
export const getOperator = async (req, res, next) => {
    try {

        // Search for all operators
        const operator = await Operator.find();

        if (!operator) {
            return res.status(404).json({ message: `No operator found'.` });
        }

        res.status(200).json({
            message: `Operator retrieved successfully.`,
            operators: operator.map(operator => ({
                operatorRegisteredId: operator.operatorRegisteredId,
                operatorName: operator.operatorName,
                operatorEmail: operator.operatorEmail,
                operatorPhoneNo: operator.operatorPhoneNo
            }))
        });

    } catch (error) {
        next(error); // Pass error to the global error handler
    }
};


//delete operator
export const deleteOperator = async (req, res, next) => {
    try {

        const { operatorRegisteredId } = req.params;

        // Find and delete operatot by id
        const deletedOperator = await Operator.findOneAndDelete({ operatorRegisteredId });

        if (!deletedOperator) {
            return res.status(404).json({ message: `No operator found with the ID '${operatorRegisteredId}'.` });
        }

        res.status(200).json({message: `Operator with ID '${operatorRegisteredId}' deleted successfully.`,});

    } catch (error) {
        next(error); // Pass error to the global error handler
    }
};

//update email and password and phone no by using id
export const updateOperatorEmailAndPassword = async (req, res, next) => {
    try {
       
        const { operatorRegisteredId } = req.params;
        const { operatorEmail, operatorPassword,operatorPhoneNo } = req.body;

        // Validate the email and password and Id
        if (!operatorEmail || !operatorPassword || !operatorPhoneNo)  {
            throw new AppError('email, password and phone No are required', 422, 'ValidationError');
        }
        
        if (!isValidEmail(operatorEmail)) {
            throw new AppError('Invalid email format', 422, 'ValidationError');
        }

        // Validate password format
        if (!isValidPassword(operatorPassword)) {
            throw new AppError('Password must be at least 6 characters, include an uppercase letter, a lowercase letter, a number, and a special character', 422, 'ValidationError');
        }

        // Validate phone number format
        if (!isValidPhone(operatorPhoneNo)) {
            throw new AppError('Invalid phone number format. It should be 10 digits', 422, 'ValidationError');
        }

        const hashedpassword = await bcrypt.hash(operatorPassword, 10);
        // Find operator by operatorId and update only email and password and phone no (without changing name)
        const updatedOperator = await Operator.findOneAndUpdate(
            { operatorRegisteredId },
            { operatorEmail, operatorPassword:hashedpassword, operatorPhoneNo }, // Only update email and password
            { new: true } // Return the updated admin document
        );

        if (!updatedOperator) {
            return res.status(404).json({
                message: `Operator with ID ${operatorRegisteredId} not found.`
            });
        }

        // Respond with the updated operator info
        res.status(200).json({
            message: `Operator with ID ${operatorRegisteredId} updated successfully.`,
            updatedAdmin: {
                operatorRegisteredId: updatedOperator.operatorRegisteredId,
                operatorName: updatedOperator.operatorName, // Name remains unchanged
                operatorEmail: updatedOperator.operatorEmail, // Updated email
                operatorPhoneNo: updatedOperator.operatorPhoneNo
            }
        });
    } catch (error) {
        next(error); // Pass error to the global error handler
    }
};


