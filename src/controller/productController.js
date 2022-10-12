const productModel = require('../model/productModel')
const userModel = require('../model/userModel')
const { isValid, isValidName, isValidPrice, isValidNumber, isvalidObjectId } = require('../validation/validator')
const { uploadFile } = require('../middleware/aws')


const createproduct = async function (req, res) {
    try {
        let body = req.body
        if (Object.keys(body).length === 0) return res.status(400).send({ status: false, message: "provide the All data" })
        let { title, description, price, currencyId, currencyFormat, isFreeShipping, style, availableSizes, installments, isDeleted } = body
        let productImage = req.files


        if (!isValid(title)) return res.status(400).send({ status: false, message: "Please provide title" })
        if (!isValidName(title)) return res.status(400).send({ status: false, message: "Please provide valid title" })
        let titleexist = await productModel.findOne({ title: title, isDeleted: false })
        if (titleexist) return res.status(404).send({ status: false, message: "title is already exist" })

        if (!isValid(description)) return res.status(400).send({ status: false, message: "Please provide description" })
        if (!isValidName(description)) return res.status(400).send({ status: false, message: "Please provide valid description" })

        if (!isValid(price)) return res.status(400).send({ status: false, message: "Please provide price" })
        if (!isValidPrice(price)) return res.status(400).send({ status: false, message: "Please provide valid price" })

        if (!isValid(currencyId)) return res.status(400).send({ status: false, message: "Please provide currencyId" })
        if (currencyId !== "INR") return res.status(400).send({ status: false, message: "Please provide valid currencyId" })

        if (!isValid(currencyFormat)) return res.status(400).send({ status: false, message: "Please provide currencyFormat" })
        if (currencyFormat !== "₹") return res.status(400).send({ status: false, message: "Please provide valid currencyFormat" })

        if (isFreeShipping) {
            if (!isValid(isFreeShipping)) return res.status(400).send({ status: false, message: "Please enter fresshipping value" })
        }

        if (!isValid(style)) return res.status(400).send({ status: false, message: "Please provide style" })
        if (!isValidName(style)) return res.status(400).send({ status: false, message: "style must be in characters" })

        if (!isValid(availableSizes)) return res.status(400).send({ status: false, message: "Please provide availablesize" })
        let sizes = ["S", "XS", "M", "X", "L", "XXL", "XL"]
        for (let i = 0; i > availableSizes.length; i++) {
            if (!sizes.includes(availableSizes[i]))
                return res.status(400).send({ status: false, message: "availableSizes must be -[S, XS, M, X, L, XXL, XL]" })
        }

        if (!installments) return res.status(400).send({ status: false, message: "Please provide installments" })
        if (!isValidNumber(installments)) return res.status(400).send({ status: false, message: "Please provide valid installment" })

        if (productImage) {
            let files = req.files;
            if (files && files.length > 0) {
                let uploadedFileURL = await uploadFile(files[0]);
                // console.log("HI")
                productImage = uploadedFileURL;
                // console.log(uploadedFileURL)
            } else {
                return res.status(400).send({ message: "No file found" });
            }
        }
        else { return res.status(400).send({ status: false, message: "Please provide productImage" }) }

        const newData = {
            title: title,
            description: description,
            price: price,
            currencyId: currencyId,
            currencyFormat: currencyFormat,
            isFreeShipping: isFreeShipping,
            productImage: productImage,
            style: style,
            availableSizes: availableSizes,
            installments: installments,
            isDeleted: isDeleted
        }

        // console.log(newData)
        const product = await productModel.create(newData)
        return res.status(201).send({ status: true, message: "Product created successfull", data: product })

    }
    catch (err) {
        console.log(err)
        return res.status(500).send({ status: false, message: err })
    }
}

const getProduct = async (req, res) => {
    try {
        let data = req.query;
        let { size, name, priceGreaterThan, priceLessThan, priceSort } = data
        let filter = { isdeleted: false }

        //validation for size
        if (size) {
            if (!size)
                return res.status(400).send({ status: false, message: "please enter a size" });
            if (!isValidSize(size))
                return res.status(400).send({ status: false, message: `size should be ["S", "XS","M","X", "L","XXL", "XL"]` })
        }
        //validation for name
        if (name) {
            if (!name)
                return res.status(400).send({ status: false, message: "please enter name" });
            if (!isValidName(name))
                return res.status(400).send({ status: false, message: "name should contain only character only" })
            name = filter.titel
        }
        //validation for price
        if (priceGreaterThan || priceLessThan) {
            filter.price = {}

            if (priceGreaterThan) {
                if (isNaN(priceGreaterThan))
                    return res.status(400).send({ status: false, message: "priceGreaterThan is required and should be valid" });

                priceGreaterThan = Number(priceGreaterThan)
                filter.price.$gte = priceGreaterThan;
            }
            if (priceLessThan) {
                if (isNaN(priceLessThan))
                    return res.status(400).send({ status: false, message: "priceLessThan  is required and should be valid" });

                priceLessThan = Number(priceLessThan)
                filter.price.$lte = priceLessThan;
            }
        }

        if ((priceGreaterThan && priceLessThan) && (priceGreaterThan > priceLessThan))
            return res.status(400).send({ status: false, message: "Invalid price range" });

            const findData = await productModel.find(filter).sort({ price: 1 });
            if (findData.length == 0)
                return res.status(404).send({ status: false, message: 'No products found' });
    
            return res.status(200).send({ status: true, message: "Success", data: findData });
    

    } catch (error) {
        return res.status(500).send({ status: false, message: 'Error', error: error });

    }
}


const getProductsById = async (req, res) => {
    try {

        let productId = req.params.productId;

        // Validate Product ID
        if (!isvalidObjectId(productId)) {
            return res
                .status(400)
                .send({ status: false, message: "Please Provide Valid Product ID" });
        }

        // Check Product is Exists in Our Database
        let product = await productModel.findById(productId);
        if (!product) {
            return res
                .status(404)
                .send({ status: false, message: "No product with this ID exists" });
        }

        // Check Product is deleted or not
        if (product.isDeleted === true) {
            return res
                .status(400)
                .send({ status: false, message: "Product is deleted" });
        }

        return res
            .status(200)
            .send({ status: true, message: "Success", data: product });
    } catch (err) {

        res.status(500).send({ msg: "Error", error: err.message });
    }
};









module.exports = { createproduct,getProduct, getProductsById }