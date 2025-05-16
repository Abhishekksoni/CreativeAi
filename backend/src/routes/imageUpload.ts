import express from "express";
import { Request, Response } from "express";
import { generateURL } from "../config/s3";

const router = express.Router();

router.get("/get-upload-url", async (req: Request, res: Response) => {
    try {
        const url = await generateURL();
        res.status(200).json({ uploadedURL: url });
    } catch (err:any) {
        console.log(err.message);
        res.status(500).json({ error: err.message});

    }
}
);


export default router;
