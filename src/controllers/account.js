const account = require('../models/accounts')
const fs = require('fs');
class accountController {
    account(req, res) {
        account.find({}).then((account) => {
            account = account.map((ac) => ac.toObject());
            // res.json({ account })
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
    login(req, res) {
        let email = req.body.email
        let password = req.body.password

        account.findOne({ email: email })
            .then(acc => {
                if (!acc) {
                    return res.status(401).json({ status: 'error', message: 'Tài khoản chưa tồn tại' })
                }
                if (acc.password !== password) {
                    return res.status(401).json({ status: 'error', message: 'Sai mật khẩu!!' });
                }
                return res.status(200).json({ status: 'success', acc });

            })
    }
}
module.exports = new accountController;