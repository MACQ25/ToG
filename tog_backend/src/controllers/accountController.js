    
exports.registerAccount = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Missing email or password" });
        }

        const newUser = await accountService.createUserAccount(username, email, password);

        return res.status(201).json(newUser);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

exports.loginAccount = async (req, res) => {
    try {

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

