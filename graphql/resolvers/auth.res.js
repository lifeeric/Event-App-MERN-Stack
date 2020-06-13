const User   = require('../../models/user.model');
const bcrypt = require('bcryptjs'); 
const jwt    = require('jsonwebtoken');

module.exports = {
    createUser: async (args, req) => {

        // Desctruct email & pass
        const {email, password} = args.user;

        // Checking old user
        const userExists = await User.findOne({email: email});
    

        if( userExists )
            return {
                _id: '',
                email: email,
                error: { error: true, message: 'User already exists!' }
            }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 12);
        
        const addNewUser = new User({
            email,
            password: hashedPassword
        });
        
       const result = await addNewUser.save();
       return {
           ...result._doc,
           error: {
               error: false,
               message: "Account Successfully Created!"
           }
        };

    },

    // Login User
    login: async (args, req) => {

        // Simplify
        const { email, password } = args;

        try {
            const user = await User.findOne({email: email});

            if( !user )
                return {
                    token: '',
                    _id: '',
                    error: {
                        error: true,
                        message: "User Doesn't exist!"
                    }
                };

            // now confirm hashes
            const hashed = await bcrypt.compare(password, user.password);

            if( !hashed )
                return {
                    token: '',
                    _id: '',
                    error: {
                        error: true,
                        message: "Password doen't match!"
                    }
                }

            // Create Token
            const token = jwt.sign({
                userId: user._id,
                email,
            }, 'myKey');

            // Keep token
            

            return {
                token, 
                _id: user._id, 
                error: {
                    error: false,
                    message: 'Logged In'
                }
            };
        }
        catch(err) {
            throw new Error(err, 'Falied to login');
        }
    } 
}