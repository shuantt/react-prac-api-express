function handleSuccess(res, statusCode, message, data) {

    res.status(statusCode).json({
        status: "success",
        message,
        data
    })
}


function handleError(res, statusCode, message, data) {

    res.status(statusCode).json({
        status: "fail",
        message,
        data
    })
}

module.exports = {
    handleSuccess,
    handleError
};