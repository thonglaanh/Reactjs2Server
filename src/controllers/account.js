const account = require('../models/accounts')
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
class accountController {
    account(req, res) {
        account.find({}).then((account) => {
            account = account.map((ac) => ac.toObject());
            res.render('account', { account: account })
        })
    }

    addNew(req, res) {
        res.render('adds/addAccounts')
    }
    screenUpdate(req, res, next) {
        account.findOne({ _id: req.params._id })
            .then((acc) => {
                res.render('updates/upAccounts', {
                    _id: acc._id,
                    name: acc.name,
                    email: acc.email,
                    password: acc.password,
                    date: acc.date,
                    image: acc.image
                })
            })
            .catch(next);
    }
    add(req, res) {
        fs.rename(req.file.path, 'uploads/' + req.file.originalname, function (err) {
            console.log(req.file.originalname);
        });
        const formData = req.body;

        if (req.file) {
            formData.image = 'http://localhost:3000/uploads/' + req.file.originalname;
        }
        console.log(req.body);
        const acc = new account(formData);
        acc.save()
            .then(() => res.redirect('/account'));
    }
    update(req, res) {
        const { name, email, password, date } = req.body;
        const id = req.params._id;

        // Prepare the update object with the fields you want to update
        const updateData = {
            name,
            email,
            password,
            date,
        };

        // Check if there's a file uploaded (image field)
        if (req.file) {
            fs.rename(req.file.path, 'uploads/' + req.file.originalname, function (err) {
                console.log(req.file.originalname);
            });
            updateData.image = 'http://localhost:3000/uploads/' + req.file.originalname;
        }

        // Use the updateData object to update the account
        account.findByIdAndUpdate(id, updateData)
            .then(() => {
                res.redirect('/account');
            })
            .catch((err) => {
                res.json('Error ' + err);
            });
    }

    delete(req, res, next) {
        account.findByIdAndDelete({ _id: req.params._id })
            .then(() => {
                res.redirect('/account');
            })
            .catch(next);
    }
    // login(req, res) {
    //     let email = req.body.email
    //     let password = req.body.password

    //     account.findOne({ email: email })
    //         .then(acc => {
    //             if (!acc) {
    //                 return res.status(401).json({ status: 'error', message: 'Tài khoản chưa tồn tại' })
    //             }
    //             if (acc.password !== password) {
    //                 return res.status(401).json({ status: 'error', message: 'Sai mật khẩu!!' });
    //             }
    //             return res.status(200).json({ status: 'success', acc });

    //         })
    // }
    register(req, res, next) {
        var { password, email } = req.body;
        console.log(req.body);

        account.findOne({ email: email })
            .then((data) => {
                if (data) {
                    res.status(400).json('Email đã tồn tại!');
                } else {
                    console.log(data);
                    bcrypt.genSalt(10)
                        .then(salt => {
                            return bcrypt.hash(password, salt);
                        })
                        .then(hash => {
                            password = hash; // Gán mật khẩu đã được mã hóa vào formData
                            account.create({
                                password: password,
                                email: email,
                                img: 'https://sm.ign.com/ign_nordic/cover/a/avatar-gen/avatar-generations_prsz.jpg'
                            })
                                .then(() => {
                                    return res.status(200).json({ status: 'success', message: 'Thành công' });

                                })
                                .catch((err) => {
                                    return res.status(500).json({ status: 'error', message: 'Đã xảy ra lỗi tạo thất bại' + err });

                                });
                        })
                        .catch(() => {
                            return res.status(500).json({ status: 'error', message: 'Đã xảy ra lỗi mã hóa mật khẩu' });

                        });

                }
            })
            .catch((err) => {
                res.status(500).json('Lỗi trong quá trình kiểm tra username');
            });
    }
    login(req, res, next) {
        var email = req.body.email;
        var password = req.body.password;
        account.findOne({ email: email })
            .then((data) => {
                if (!data) {
                    return res.status(401).json({ status: 'error', message: 'Tài khoản chưa tồn tại' });
                }
                console.log(data);
                // So sánh mật khẩu đã nhập với mật khẩu đã mã hóa
                bcrypt.compare(password, data.password)
                    .then(isMatch => {
                        if (isMatch) {
                            var accessToken = getAccessToken({ _id: data._id });
                            var refreshToken = getRefeshToken({ _id: data._id });
                            console.log('accessToken', accessToken);
                            console.log('refreshToken', refreshToken);

                            res.cookie('token', accessToken); // Lưu access token vào cookie
                            res.cookie('refreshToken', refreshToken); // Lưu refresh token vào cookie
                            res.cookie('user', data);

                            console.log(data);
                            return res.status(200).json({ status: 'success', data });
                        } else {
                            console.log('hehehe');
                            return res.status(402).json({ status: 'error', message: 'Sai mật khẩu!!' });
                        }
                    })
                    .catch(error => {
                        console.error(error);
                        return res.status(501).json({ status: 'error', message: 'Đã xảy ra lỗi' });
                    });

            })
            .catch((err) => {
                return res.status(500).json({ status: 'error', message: 'Đã xảy ra lỗi' });
            });
    }
}

function getAccessToken(data) {
    const plainData = { ...data, _id: data._id.toString() };
    return jwt.sign(plainData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10m' });
}
function getRefeshToken(data) {
    const plainData = { ...data, _id: data._id.toString() };
    return jwt.sign(plainData, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
}
module.exports = new accountController;