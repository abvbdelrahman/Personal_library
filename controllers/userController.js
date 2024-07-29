const User = require('./../models/userModel');
const catchAsync = require('../utils/catchAsync');

exports.getAllUsers = catchAsync(async(req, res, next) => {
    const users = await User.find();
    res.status(200).json({
        status: 'success',
        results: users.length,
        users 
    });
});

exports.getUserById = catchAsync(async(req, res, next) => {
    const user = await User.findById(req.params.id);
    if(!user) return res.status(404).json({status: 'error', message: 'User not found'});
    res.status(200).json({status:'success', user});
});

exports.createUser = catchAsync(async(req, res, next) => {
    res.status(201).json({status: 'fail', message: 'use /signup instead'});
});

exports.updateUser = catchAsync(async(req, res, next) => {

    const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
    if(!user) return res.status(404).json({status: 'error', message: 'User not found'});
    res.status(200).json({status:'success', user});
});

exports.deleteUser = catchAsync(async(req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if(!user) return res.status(404).json({status: 'error', message: 'User not found'});
    res.status(204).json({status:'success', message: 'User deleted'});
});
