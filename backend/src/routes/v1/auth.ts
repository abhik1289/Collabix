


import express from "express";
import { signUpSchema } from "../../validation/auth";
import { validation } from "../../validation";
import { signUpHandler } from "../../controllers/auth.controller";



const authRouter = express.Router();



authRouter.post("/signup",validation(signUpSchema), signUpHandler);

authRouter.post("/signin", async (_req, res) => {
    res.send("signin");
});


export default authRouter;
