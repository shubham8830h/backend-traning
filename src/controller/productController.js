const productModel = require('../model/productModel')
const {validSize,isValidNames,isValidMixed, isValid, isValidName, isValidPrice, isValidNumber, isvalidObjectId, isValidImage } = require('../validation/validator')
const { uploadFile } = require('../middleware/aws')



// -------------------------------------------CreateProduct------------------------------------------------
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
        if (!isValidName(description.trim())) return res.status(400).send({ status: false, message: "Please provide valid description" })

        if (!isValid(price)) return res.status(400).send({ status: false, message: "Please provide price" })
        if (!isValidPrice(price.trim())) return res.status(400).send({ status: false, message: "Please provide valid price" })

        if (!isValid(currencyId)) return res.status(400).send({ status: false, message: "Please provide currencyId" })
        if (currencyId !== "INR") return res.status(400).send({ status: false, message: "Please provide valid currencyId & it should be INR only" })


        if(currencyFormat)
        {
            if (!isValid(currencyFormat)) return res.status(400).send({ status: false, message: "Please provide currencyFormat" })
            if (currencyFormat !== "₹") return res.status(400).send({ status: false, message: "Please provide valid currencyFormat & it should be ₹ only" })
        }

        if (isFreeShipping) {
            if (!isValid(isFreeShipping)) return res.status(400).send({ status: false, message: "Please enter fresshipping value" })
        }

        if (!isValid(style)) return res.status(400).send({ status: false, message: "Please provide style" })
        if (!isValidNames(style)) return res.status(400).send({ status: false, message: "style must be in characters" })

        // if (!isValid(availableSizes)) return res.status(400).send({ status: false, message: "Please provide availablesize" })
        if ((!availableSizes) || !validSize(availableSizes)) return res.status(400).send({ status: false, message: " Provide availableSizes their values can be only S, XS,M, X, L, XXL" })
        ////converting given string into array
        availableSizes = availableSizes.toUpperCase().split(",").map((x) => x.trim())

        if (!installments) return res.status(400).send({ status: false, message: "Please provide installments" })
        if (!isValidNumber(installments)) return res.status(400).send({ status: false, message: "Please provide valid installment in number." })

       
            if (productImage && productImage.length > 0) {
                if (!isValidImage(productImage[0].mimetype)) return res.status(400).send({ status: false, message: "provide the valid productImage" })
                let uploadedFileURL = await uploadFile(productImage[0]);

                productImage = uploadedFileURL;
                // console.log(profileImage)
            } else {
                return res.status(400).send({ message: "Please provide productImage" });
            }
        
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
    catch (error) {
        return res.status(500).send({ status: false, error: error.message });
    }
}


// ----------------------------------------------GetProduct--------------------------------------------
const getProduct = async function (req, res) {
    try {
        let data = req.query;
        let filter = { isDeleted: false };
        let { size, name, priceGreaterThan, priceLessThan, priceSort } = data;
        // validation for size
        if (size) {
            filter["availableSizes"] = { "$in": size.toUpperCase().split(",").map((x) => x.trim()) }
        }
        // validation for name
        if (name) {

            if (!isValid(name)) return res.status(400).send({ status: false, message: "Product title is required" });
            if (!isValidName(name)) return res.status(400).send({ status: false, message: "Product title should be valid" });
           
            filter.title = { $regex: name, $options: "i" }  //product  Product1 ,,,,procude lkj
        };

        // validation for price
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

        // validation for price sorting
        if (priceSort) {
            if (!((priceSort == 1) || (priceSort == -1))) {
                return res.status(400).send({ status: false, message: 'In price sort it contains only 1 & -1' });
            }

            const products = await productModel.find(filter).sort({ price: priceSort });

            if (!products) return res.status(404).send({ status: false, message: 'No products found' })
            return res.status(200).send({ status: true, message: 'Success', data: products });
        }
        console.log(filter)
        // find collection without filters
        const findData = await productModel.find(filter).sort({ price: 1 });
        if (findData.length == 0)
            return res.status(404).send({ status: false, message: 'No products found' });

        return res.status(200).send({ status: true, message: "Success", data: findData });

    } catch (error) {
        return res.status(500).send({ status: false, error: error.message });
    }

}

// -----------------------------------------------getProductById--------------------------------
const getProductsById = async (req, res) => {
    try {
        let productId = req.params.productId;
        // Validate Product ID
        if (!productId || !isvalidObjectId(productId)) { return res.status(400).send({ status: false, message: "Please Provide Valid Product ID" }); }

        // Check Product is Exists in Our Database
        let product = await productModel.findById(productId);
        if (!product) { return res.status(404).send({ status: false, message: "No product with this ID exists" }); }

        // Check Product is deleted or not
        if (product.isDeleted === true) { return res.status(400).send({ status: false, message: "Product is deleted" }); }

        return res.status(200).send({ status: true, message: "Success", data: product });
    }
    catch (error) {
        return res.status(500).send({ status: false, error: error.message });
    }
};



// --------------------------------------UpdateProduct-------------------------------------------

const updateproduct = async function (req, res) {
    try {
        let productId = req.params.productId
        if (!isvalidObjectId(productId)) return res.status(400).send({ status: false, message: "Please provide valid ProductId" })
        const checkproduct = await productModel.findById(productId)
        if (!checkproduct) return res.status(404).send({ status: false, message: "No product found with this productId" })
        
        let body = req.body
        let productImage = req.files;
        
        if (Object.keys(body).length == 0 && (!productImage)) return res.status(400).send({ status: false, message: "Please provide updations" })
        let { title, description, price, currencyId, currencyFormat, isFreeShipping, style, availableSizes, installments } = body
        // let { productImage } = files
        let updations = {}

        if (title) {
            if (!isValid(title)) return res.status(400).send({ status: false, message: "Please provide title" })
            if (!isValidName(title)) return res.status(400).send({ status: false, message: "Please provide valid title" })
            let titleexist = await productModel.findOne({ title: title, isDeleted: false })
            if (titleexist) return res.status(404).send({ status: false, message: "title is already exist" })
            updations.title = title
        }

        if (description ) {
            if (!isValid(description)) return res.status(400).send({ status: false, message: "Please provide description" })
            if (!isValidName(description)) return res.status(400).send({ status: false, message: "Please provide valid description" })
            updations.description = description
        }
        if (price ) {
            if (!isValid(price)) return res.status(400).send({ status: false, message: "Please provide price" })
            if (!isValidPrice(price)) return res.status(400).send({ status: false, message: "Please provide valid price" })
            updations.price = price
        }

        if (currencyId ) {
            if (!isValid(currencyId)) return res.status(400).send({ status: false, message: "Please provide currencyId" })
            if (currencyId !== "INR") return res.status(400).send({ status: false, message: "Please provide valid currencyId" })
            updations.currencyId = currencyId
        }

        if (currencyFormat) {
            if (!isValid(currencyFormat)) return res.status(400).send({ status: false, message: "Please provide currencyFormat" })
            if (currencyFormat !== "₹") return res.status(400).send({ status: false, message: "Please provide valid currencyFormat" })
            updations.currencyFormat = currencyFormat
        }

        if (isFreeShipping ) {
            if (!isValid(isFreeShipping)) return res.status(400).send({ status: false, message: "Please enter fresshipping value" })
            updations.isFreeShipping = isFreeShipping
        }

        if (style ) {
            if (!isValid(style)) return res.status(400).send({ status: false, message: "Please provide style" })
            if (!isValidName(style)) return res.status(400).send({ status: false, message: "style must be in characters" })
            updations.style = style
        }

        if (availableSizes) {
            let size1 = ["S", "XS", "M", "X", "L", "XXL", "XL"];
            let size2 = availableSizes.toUpperCase().split(",").map((x) => x.trim())
            for (let i = 0; i < size2.length; i++) {
                if (!size1.includes(size2[i])) {
                    return res.status(400).send({
                        status: false, message: "Sizes should one of these - 'S', 'XS', 'M', 'X', 'L', 'XXL' and 'XL'",
                    });
                }
            }
            updations.availableSizes= size2;
        }

        if (installments ) {
            if (!installments) return res.status(400).send({ status: false, message: "Please provide installments" })
            if (!isValidNumber(installments)) return res.status(400).send({ status: false, message: "Please provide valid installment" })
            updations.installments = installments
        }

     
        if (productImage && productImage.length > 0) {
            if (!isValidImage(productImage[0].mimetype)) return res.status(400).send({ status: false, message: "provide the valid productImage" })
            let uploadedFileURL = await uploadFile(productImage[0]);
            productImage = uploadedFileURL
            updations["productImage"] = uploadedFileURL
        }

        console.log(updations)
        let updated = await productModel.findOneAndUpdate({ _id: productId, isDeleted: false }, { $set: updations }, { new: true })
        if (!updated) return res.status(400).send({ status: false, message: "No product found" })
        return res.status(200).send({ status: true, message: "Updation successfull", data: updated })

    }
    catch (error) {
        return res.status(500).send({ status: false, error: error.message });
    }
}

// -------------------------------------------------DeleteProductById----------------------------------------
const deleteProductById = async (req, res) => {
    try {
        let productId = req.params.productId
        if (!isvalidObjectId(productId)) {
            return res.status(400).send({ status: false, message: "Please provide valid productId" })
        }
        let product = await productModel.findById(productId)
        if (!product) {
            return res.status(404).send({ status: false, message: "Product not found " })
        }
        if (product.isDeleted == true) {
            return res.status(400).send({ status: false, message: "Product already deleted" })
        }
        let deletedProduct = await productModel.findByIdAndUpdate(productId, { $set: { isDeleted: true, deletedAt: new Date() } }, { new: true })
        return res.status(200).send({ status: true, message: "Product deleted" })
    } catch (error) {
        return res.status(500).send({ status: false, error: error.message });
    }
}

// export 
module.exports = { createproduct, getProduct, getProductsById, deleteProductById, updateproduct }