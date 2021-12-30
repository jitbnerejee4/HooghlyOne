module.exports = (func)=>{ //catching a function    
    return (req, res, next) =>{ //returns a new function that has "func" executed
        func(req, res, next).catch(next); // catches any errors and pass it to next error handling middleware
    }
}