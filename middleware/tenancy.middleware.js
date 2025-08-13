import Workspace from "../models/workspace.js";

export const tenant = async (req, res, next) => {
    try {
        const { workspace_id } = req.params;

        const workspace = await Workspace.findById(workspace_id);

        if(!workspace) 
            return res.status(400).json({ message: 'Workspace not found' });

        req.workspace = workspace;
        next();
    } catch (error) {
        console.error('Error in tenancy middleware\n', error)
        res.status(500).json({ message: 'Server error', error: error.message || error.stack })
    }
}