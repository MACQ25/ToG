import { config } from "../config/config.js";
import { createUserAccount, loginUserAccount, loginViaCookie } from "../services/accountService.js";

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
        const { email, password, rememberMe } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ error: "Missing email or password" });
        }

        console.log(rememberMe)

        const loginResult = await loginUserAccount(email, password, rememberMe);    
        
        if (loginResult.code === 200) {
            res.cookie('tog_token', loginResult.payload.token, {
                httpOnly: true,
                secure: config.env === 'production', // true in prod (requires HTTPS)
                sameSite: 'lax',
                maxAge: (rememberMe ? 10 : 1) * (24 * 60 * 60 * 1000) 
            });
        }
        
        console.log("got cookie!")

        return res.status(loginResult.code).json({ msg: loginResult.message, payload: loginResult.payload })

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export async function rememberAccount(req, res) {
    try {
        const cookie = req.cookies.tog_token

        if (!cookie) return res.status(401).json({ message: 'Not logged in' });

        const check = loginViaCookie(cookie)

        return res.status(check? 200 : 400).json({ message: 'welcome back user'})
        
    } catch (error) {
        return res.status(500).json({error: error.message})
    }
}

export async function logout(req, res) {
    try {
        const cookie = req.cookies.tog_token

        if (!cookie) return res.status(401).json({ message: 'Not logged in' });

        res.cookie('tog_token', 'byebye', {
                httpOnly: true,
                secure: config.env === 'production',
                sameSite: 'lax',
                maxAge: 1
            });

        return res.status(200).json({msg: 'so long partner'})

    } catch (error) {
        return res.status(500).json({error: error.message})
    }
}