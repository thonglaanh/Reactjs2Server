// const cars = require('../models/cars')
// //khong co thi khong populate dc
// const brands = require('../models/brands')
// const fs = require('fs')
const Cars = require('../models/cars');
const Brands = require('../models/brands');
const fs = require('fs');
class productController {
    carClient(req, res) {
        let brandsData;
        let brandQuery = req.query.brand;
        let selectedBrand;

        Brands.find({})
            .then((brands) => {
                brandsData = brands.map((br) => br.toObject());
                if (brandQuery == undefined) {
                    return Cars.find({}).populate('brands');
                } else {
                    return Brands.findOne({ name: brandQuery })
                        .then((brand) => {
                            if (brand) {
                                selectedBrand = brand.toObject();
                                return Cars.find({ brands: brand._id }).populate('brands');
                            } else {
                                return Cars.find({}).populate('brands');
                            }
                        });
                }
            })
            .then((cars) => {
                const carData = cars.map((car) => car.toObject());
                res.json({ car: carData, brands: brandsData })
                // res.render('cars', { car: carData, brands: brandsData });
            })
            .catch((error) => {
                console.error(error);
                res.render('error', { error });
            });
    }
    car(req, res) {
        let brandsData;
        let brandQuery = req.query.brand;
        let selectedBrand;

        Brands.find({})
            .then((brands) => {
                brandsData = brands.map((br) => br.toObject());
                if (brandQuery == undefined) {
                    return Cars.find({}).populate('brands');
                } else {
                    return Brands.findOne({ name: brandQuery })
                        .then((brand) => {
                            if (brand) {
                                selectedBrand = brand.toObject();
                                return Cars.find({ brands: brand._id }).populate('brands');
                            } else {
                                return Cars.find({}).populate('brands');
                            }
                        });
                }
            })
            .then((cars) => {
                const carData = cars.map((car) => car.toObject());
                res.render('cars', { car: carData, brands: brandsData });
            })
            .catch((error) => {
                console.error(error);
                res.render('error', { error });
            });
    }
    detail(req, res) {
        const id = req.params._id;

        Cars.findById({ _id: id }).populate('brands').then((data) => {
            res.json({ car: data })
        })

    }

    addNew(req, res) {
        Brands.find({}).then((brand) => {
            brand = brand.map((br) => br.toObject());
            res.render('adds/addCars', { brands: brand });

        })
    }
    screenUpdate = async (req, res, next) => {
        try {
            const brands = await Brands.find({}).lean();
            const car = await Cars.findOne({ _id: req.params._id }).lean();

            res.render('updates/upCars', {
                _id: car._id,
                brands: car.brands,
                name: car.name,
                price: car.price,
                describe: car.describe,
                date: car.date,
                quantity: car.quantity,
                myBrand: brands
            });
        } catch (error) {
            next(error);
        }
    };

    update(req, res) {

        const id = req.params._id;
        const formData = req.body;
        if (req.file) {
            fs.rename(req.file.path, 'uploads/' + req.file.originalname, function (err) {
                console.log(req.file.originalname);
            });
            formData.image = 'http://localhost:3000/uploads/' + req.file.originalname;
        }

        formData.availableColors = ['Red', 'Black', 'White']
        formData.selectColor = 'Black';
        Cars.findByIdAndUpdate(id, formData)
            .then(() => {
                res.redirect('/car');
            })
            .catch((err) => {
                res.json('Error ' + err);
            });
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
        formData.availableColors = ['Red', 'Black', 'White']
        formData.selectColor = 'Black';


        const car = new Cars(formData);
        car.save()
            .then(() => res.redirect('/car'));
    }
    delete(req, res, next) {
        Cars.findByIdAndDelete({ _id: req.params._id })
            .then(() => {
                res.redirect('/car');
            })
            .catch(next);
    }
}
module.exports = new productController;