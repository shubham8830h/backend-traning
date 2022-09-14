const clollegeModel = require("../Model/collageModel")
const interModel = require("../Model/InternModel")


const getcollegeDetails= async function(req,res){
    try {
        let collegeName = req.query.collegeName
        if(!collegeName) return res.status(400).send({status:false,message:"please provide college name"})
        
        const result = {}

        const college = await clollegeModel.findOne({name: collegeName,isDeleted : false})

        if(!college) return res.status(404).send({status:false,msg:"college name not exist"})
        
        const interns= await interModel.find({collegeId : college._id,isDeleted:false})

        result.name = college.name
        result.fullName = college.fullName
        result.logoLink = college.logoLink
        result.interns = interns

        if(Object.keys(interns).length == 0 ){
        return res.status(400).send({status:true, msg:"no interns applied for this college"})
    }
      return res.status(200).send({status:true,data:result})

    } catch (err) {
        res.status(500).send({status:false,message:"server error",error:err.message})
    }
}

module.exports.getcollegeDetails = getcollegeDetails