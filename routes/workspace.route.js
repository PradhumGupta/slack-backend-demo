// POST /workspaces – Create a workspace
// PUT /workspaces/{workspace_id} – Update workspace details
// DELETE /workspaces/{workspace_id} – Delete a workspace

import { Router } from "express";
import Workspace from "../models/workspace.js";
import Channel from "../models/Channel.js";
import { protect } from "../middleware/auth.middleware.js";
import { tenant } from "../middleware/tenancy.middleware.js";
import { rbac } from "../middleware/rbac.middleware.js";
import User from "../models/User.js";

const router = Router();

router.post('/', protect, async (req, res) => {
    try {
        const { name } = req.body;
        const newWorkspace = await Workspace.create({
            name,
            ownerId: req.user.id,
            members: [ { userId: req.user.id, role: 'admin' } ]
        });

        const user = await User.findById(req.user.id);

        user.workspaces.push({ workspaceId: newWorkspace._id });
        await user.save();

        res.status(201).json(newWorkspace);
    } catch (error) {
        console.error("Error in creating workspace route\n", error);
        res.status(500).json({ message: "Server error", error: error.stack || error.message });
    }
})


router.put('/:workspace_id', protect, tenant, rbac(['admin']), async (req, res) => {
    try {
        const { name, member } = req.body;

        const workspace = await Workspace.findById(req.params.workspace_id);

        if(name) workspace.name = name;
        if(member) workspace.members.push(member);

        await workspace.save();

        res.status(200).json({ message: "updated successfully" });
    } catch (error) {
        console.error("Error in updating workspace", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
})


router.delete('/:workspace_id', protect, tenant, rbac(['admin']), async (req, res) => {
    try {
        const workspace = await Workspace.findById(req.params.workspace_id);
        
        if(workspace.ownerId != req.user.id) 
            return res.status(401).json({ message: "Unauthorized to delete" });

        await Channel.deleteMany({ workspaceId: req.params.workspace_id });

        await workspace.deleteOne();

        res.status(200).json({ message: "deleted successfully" });
    } catch (error) {
        console.error("Error in deleting workspace", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
})

export default router;