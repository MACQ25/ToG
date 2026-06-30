import { createUserAccount, loginUserAccount } from "../services/accountService.js";

export async function accountTest(req, res) {
     res.send('Hello from Accounts');
}

export async function registerAccount(req, res) {
    try {
        const { username, email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Missing email or password" });
        }

        const newUser = await createUserAccount(username, email, password);
        return res.status(201).json(newUser);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export async function loginAccount(req, res) {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ error: "Missing email or password" });
        }

        const loginResult = await loginUserAccount(email, password);        
        
        return res.status(loginResult.code).json({ msg: loginResult.message, payload: loginResult.payload })

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

