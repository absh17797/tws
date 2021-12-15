const Students = require('../models/student')
const { check, validationResult } = require('express-validator');

module.exports = {

    list: async (req, res) => {
        var conditions = {}
        let options = {}
        if (req.query.page != undefined && parseInt(req.query.page)) {
            options.page = req.query.page;
        }
        if (req.query.limit != undefined && parseInt(req.query.limit)) {
            options.limit = req.query.limit;
        }
        try {
            if (options.limit) {
                console.log('1')
                var allStudents = await Students.paginate(conditions, options);
                console.log('1')
                return commonService.sendCustomResult(req, res, 'SUCCESS', 'STUDENTS_FOUND_SUCCESSFULLY', commonService.paginateData(allStudents));
            } else {
                console.log('2')
                var allStudents = await Students.find(conditions)
                console.log('2')
                return commonService.sendCustomResult(req, res, 'SUCCESS', 'STUDENTS_FOUND_SUCCESSFULLY', allStudents);
            }
        } catch (error) {
            console.error('error', error);
            return commonService.sendCustomResult(req, res, 'SERVER_ERROR', 'STUDENTS_NOT_FOUND');
        }
    },
    create: async (req, res) => {
        console.log('1',req.body)
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('2',errors)
            return commonService.sendCustomResult(req, res, 'INVALID_REQUEST', 'VALIDATION_ERROR', { errors: errors.array() });
        }
        var data = req.body;
        console.log('2')
        Students.findOne({ $or: [{ username: (data.username).toLowerCase() }, { email: (data.email).toLowerCase() }] })
            .then(function (studentFound) {
                if (studentFound) {
                    throw new Error('EMAIL_OR_USERNAME_ALREADY_EXISTS');
                } else {
                    return Students.create({
                        firstName: data.firstName,
                        lastName: data.lastName,
                        email: (data.email).toLowerCase(),
                        password: data.password,
                        username: (data.username).toLowerCase(),
                        photo: data.photo,
                        address: data.address
                    });
                }
            })
            .then(function (result) {
                return commonService.sendCustomResult(req, res, 'SUCCESS', 'RECORD_CREATED', result);
            })
            .catch(function (error) {
                if (error.message == 'EMAIL_OR_USERNAME_ALREADY_EXISTS') {
                    return commonService.sendCustomResult(req, res, 'RECORD_ALREADY_EXISTS', 'EMAIL_OR_USERNAME_ALREADY_EXISTS');
                } else {
                    console.error('error', error);
                    return commonService.sendCustomResult(req, res, 'SERVER_ERROR', 'STUDENT_NOT_CREATED');
                }
            });
    },
    details: async (req, res) => {
        try {
            var studentFound = await Students.findOne({ _id: req.params.id });
            if (studentFound) {
                return commonService.sendCustomResult(req, res, 'SUCCESS', 'STUDENT_FOUND', { student: studentFound });
            } else {
                return commonService.sendCustomResult(req, res, 'NOT_FOUND', 'STUDENT_NOT_FOUND');
            }
        } catch (error) {
            console.error('error', error);
            commonService.sendCustomResult(req, res, 'SERVER_ERROR', 'STUDENT_NOT_FOUND');
        }
    },
    edit: async (req, res) => {
        var data = req.body;
        try {
            delete data.email;
            delete data.password;
            var studentFound = await Students.findOne({ _id: req.params.id })
            if (!studentFound) {
                return commonService.sendCustomResult(req, res, 'NOT_FOUND', 'STUDENT_NOT_FOUND');
            }
            let sameEmailOrUsername = await Students.findOne({
                $and: [
                    { "username": { '$eq': (data.username).toLowerCase() } }, 
                    { "_id": { '$ne': req.params.id } }
                ]
            })
            console.log(sameEmailOrUsername,data.username)
            if(sameEmailOrUsername){
                return commonService.sendCustomResult(req, res, 'NOT_FOUND', 'EMAIL_OR_USERNAME_ALREADY_EXISTS');
            }

            if (req.files && req.files[0]) {
                Object.assign(data, { photo: req.files[0].photo })
            }
            var studentUpdated = await Students.findOneAndUpdate({ _id: req.params.id }, data, { new: true })
            if (studentUpdated) {
                return commonService.sendCustomResult(req, res, 'SUCCESS', 'STUDENT_DETAILS_UPDATED', { student: studentUpdated });
            } else {
                return commonService.sendCustomResult(req, res, 'SERVER_ERROR', 'STUDENT_DETAILS_NOT_UPDATED');
            }
        } catch (error) {
            console.error('error', error);
            commonService.sendCustomResult(req, res, 'SERVER_ERROR', 'STUDENT_DETAILS_NOT_UPDATED');
        }
    },
    deleteStudent: async (req, res) => {
        try {
            let conditions = {
                _id: req.params.id
            }
            let student = await Students.findOne(conditions);
            if (!student) {
                return commonService.sendCustomResult(req, res, 'NOT_FOUND', 'STUDENT_NOT_FOUND');
            }
            await Students.delete(conditions);
            return commonService.sendCustomResult(req, res, 'SUCCESS', 'STUDENT_DELETED');
        } catch (error) {
            console.error('error', error);
            return commonService.sendCustomResult(req, res, 'SERVER_ERROR', 'STUDENTS_NOT_DELETED');
        }
    },
    validate: (method) => {
        switch (method) {
            case 'validateStudent': {
                return [
                    check('firstName').not().isEmpty().trim(),
                    check('lastName').not().isEmpty().trim(),
                    check('username').not().isEmpty().trim(),
                    check('email').not().isEmpty().isEmail().withMessage('Invalid Email'),
                    check('password').not().isEmpty().trim(),
                    check('confirmPassword').not().isEmpty().trim(),
                    check('photo').not().isEmpty().trim(),
                    check('address').not().isEmpty().trim()
                ]
            }
            case 'validateUpdateStudent': {
                return [
                    check('firstName').not().isEmpty().trim(),
                    check('lastName').not().isEmpty().trim(),
                    check('username').not().isEmpty().trim(),
                    check('address').not().isEmpty().trim()
                ]
            }
        }
    }
}
