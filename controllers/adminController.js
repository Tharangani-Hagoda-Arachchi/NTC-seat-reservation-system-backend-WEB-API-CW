import Admin from "../models/adminModel.js";

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
