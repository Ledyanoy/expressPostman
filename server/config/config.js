const config = {
    production: {
        SECRET: process.env.SECRET,
        DATABASE: process.env.MONGODB_URI,
    },
    default: {
        SECRET: 'supersecretpassword',
        DATABASE: 'mongodb+srv://admin:stars44@cluster0.7yid0.mongodb.net/authApp?retryWrites=true&w=majority'
    }
}

exports.get = (env) => {
    return config[env] || config.default
}
