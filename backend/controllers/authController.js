const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h'});
};

//Register User
exports.registerUser = async (req, res) => {
    const { fullName, email, password, profileImageUrl } = req.body;

    // Validation: Check for missing fields
    if( !fullName || !email || !password ) {
        return res.status(400).json({ message: 'Vui lòng điền đầy đủ tất cả các trường bắt buộc'});
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Người dùng đã tồn tại' });
        }

        // Create the user
        const user = await User.create({
            fullName,
            email,
            password,
            profileImageUrl,
        });

        res.status(201).json({
            id: user._id,
            user,
            token: generateToken(user._id),
        });
    } catch (error) {
        res
            .status(500)
            .json({ message: 'Lỗi đăng ký người dùng', error: error.message });
    }
};

//Login User
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Vui lòng điền đầy đủ tất cả các trường bắt buộc' });
    }
    try {
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(400).json({ message: 'Thông tin đăng nhập không hợp lệ' });
        }

        res.status(200).json({
            id: user._id,
            user,
            token: generateToken(user._id),
        });
    } catch (err) {
        res
        .status(500)
        .json({ message: 'Lỗi đăng nhập', error: err.message });
    }
};

//Get User Info
exports.getUserInfo = async (req, res) => {
    try{
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'Người dùng không tồn tại' });
        }

        res.status(200).json(user);
    } catch (err) {
        res
        .status(500)
        .json({ message: 'Lỗi lấy thông tin người dùng', error: err.message });
    }
};