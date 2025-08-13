// POST /workspaces/{workspace_id}/channels – Create a channel within a workspace
// PUT /workspaces/{workspace_id}/channels/{channel_id} – Update channel details
// DELETE /workspaces/{workspace_id}/channels/{channel_id} – Delete a channel
// GET /workspaces/{workspace_id}/channels – List all channels in a workspace

import { Router } from "express";
import Channel from "../models/Channel.js";
import { protect } from "../middleware/auth.middleware.js";
import { tenant } from "../middleware/tenancy.middleware.js";
import { rbac } from "../middleware/rbac.middleware.js";

const router = Router();

router.post("/", protect, tenant, rbac(['admin']), async (req, res) => {
    try {
        const { name } = req.body;

        const channel = await Channel.create({ name, workspaceId: req.workspace._id });

        res.status(201).json({ message: "Channel created" });
    } catch (error) {
        console.error("Error in creating channel", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

router.put("/:channel_id", protect, tenant, rbac(['admin']), async (req, res) => {
    try {
        const { name } = req.body;

        if(!name || !req.params.channel_id) {
            return res.status(400).json({ message: "Bad Request" });
        }

        const channel = await Channel.findById(req.params.channel_id);

        if(!channel) return res.status(404).json({ message: "Channel not found" });
        
        channel.name = name;
        await channel.save();

        res.status(200).json({ message: "Channel updated" })
    } catch (error) {
        console.error("Error in updating channel", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
})

router.delete("/:channel_id",protect, tenant, rbac(['admin']), async (req, res) => {
    try {
        if(!req.params.channel_id) {
            return res.status(400).json({ message: "Bad Request" });
        }

        const channel = await Channel.findById(req.params.channel_id);
        
        if(!channel) 
            return res.status(404).json({ message: "Channel not found" });

        await channel.deleteOne();

        res.status(200).json({ message: "Channel deleted" });
    } catch (error) {
        console.error("Error in updating channel", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
})

router.get("/",protect, tenant, rbac(['admin', 'member']), async (req, res) => {
    try {
        const channels = await Channel.find({ workspaceId: req.workspace._id }).lean();
        
        res.status(200).json(channels);
    } catch (error) {
        console.error("Error in updating channel", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

export default router;