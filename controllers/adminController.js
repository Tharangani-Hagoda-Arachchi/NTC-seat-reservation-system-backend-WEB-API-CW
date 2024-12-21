import Admin from "../models/adminModel.js";
import { AppError } from '../utils/errorHandler.js'; 
import bcrypt from 'bcrypt';

export const addAdmin = async (req, res, next) => {
    try{
        const { adminId,adminName, adminEmail,adminPassword } = req.body

        const existingAdmin = await Admin.findOne({ adminId });
        if (existingAdmin) {
            return res.status(409).json({ message: 'Admin is already registered' });
        }

        // check email is already exists
        const existingAdminEmail = await Admin.findOne({ adminEmail });
        if (existingAdminEmail) {
            return res.status(409).json({ message: 'Email is already registered' });
        }

        // create nwe admin
        const newAdmin = new Admin({
            adminId,
            adminName,
            adminEmail,
            adminPassword 
        });

        await newAdmin.save();

        res.status(201).json({ message: 'New Admin Added successful' });


    } catch(error){
        next(error); // Pass error to the global error handler
    }
};


//get admin by adminID
export const getAdminById = async (req, res, next) => {
    try {
        const {adminId}  = req.params;

        // Validate the admin id
        if (!adminId) {
            throw new AppError('Route no required', 422, 'ValidationError');
        }

        // Search for admin with the given id
        const admin = await Admin.findOne({ adminId });

        if (!admin) {
            return res.status(404).json({ message: `No admin found with the ID '${adminId}'.` });
        }

        res.status(200).json({
            message: `Admin with the ID '${adminId}' retrieved successfully.`,
            adminId,
            adminName: admin.adminName,
            adminEmail: admin.adminEmail
        });
    } catch (error) {
        next(error); // Pass error to the global error handler
    }
};

//get all admins
export const getAdmin = async (req, res, next) => {
    try {

        // Search for all admin
        const admin = await Admin.find();

        if (!admin) {
            return res.status(404).json({ message: `No admin found'.` });
        }

        res.status(200).json({
            message: `Admin retrieved successfully.`,
            admins: admin.map(admin => ({
                adminId: admin.adminId,
                adminName: admin.adminName,
                adminEmail: admin.adminEmail
            }))
        });

    } catch (error) {
        next(error); // Pass error to the global error handler
    }
};


//delete admin
export const deleteAdmin = async (req, res, next) => {
    try {

        const { adminId } = req.params;

        // Find and delete admin by adminId
        const deletedAdmin = await Admin.findOneAndDelete({ adminId });

        if (!deletedAdmin) {
            return res.status(404).json({ message: `Admin with ID '${adminId}' not found.` });
        }

        res.status(200).json({message: `Admin with ID '${adminId}' deleted successfully.`,});

    } catch (error) {
        next(error); // Pass error to the global error handler
    }
};

//update email and password by using id
export const updateAdminEmailAndPassword = async (req, res, next) => {
    try {
       
        const { adminId } = req.params;
        const { adminEmail, adminPassword } = req.body;

        // Validate the email and password and Id
        if (!adminEmail || !adminPassword )  {
            throw new AppError('email, password are required', 422, 'ValidationError');
        }
        
        const hashedpassword = await bcrypt.hash(adminPassword, 10);
        // Find admin by adminId and update only email and password (without changing name)
        const updatedAdmin = await Admin.findOneAndUpdate(
            { adminId },
            { adminEmail, adminPassword:hashedpassword }, // Only update email and password
            { new: true } // Return the updated admin document
        );

        if (!updatedAdmin) {
            return res.status(404).json({
                message: `Admin with ID ${adminId} not found.`
            });
        }

        // Respond with the updated admin info
        res.status(200).json({
            message: `Admin with ID ${adminId} updated successfully.`,
            updatedAdmin: {
                adminId: updatedAdmin.adminId,
                adminName: updatedAdmin.adminName, // Name remains unchanged
                adminEmail: updatedAdmin.adminEmail // Updated email
            }
        });
    } catch (error) {
        next(error); // Pass error to the global error handler
    }
};



