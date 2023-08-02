const admin = require('../models/admins')
class mainController {
    screenlogin(req, res) {
        res.render('login')
    }
    login(req, res) {
        let account = req.body.account
        let password = req.body.password

        admin.findOne({ account: account })
            .then(admin => {
                if (!admin) {
                    return res.status(401).json({ status: 'error', message: 'Tài khoản chưa tồn tại' })
                }
                if (admin.password !== password) {
                    return res.status(401).json({ status: 'error', message: 'Sai mật khẩu!!' });
                }
                // return res.status(200).json({ status: 'success', taikhoan });
                res.redirect('/account');

            })
    }

}
module.exports = new mainController;