const Job = require("../models/Job")
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')

const getAllJobs = async(req,res) => {
    const jobs = await Job.find({createdBy: req.user.userId}).sort('createdAt');
    res.status(StatusCodes.OK).json({jobs})
}

const getJob = async(req,res) => {
    const {user:{userId}, params:{id:jobId}} = req
    const job = await Job.findOne({_id: jobId, createdBy: userId})
    if(!job){
        throw new NotFoundError(`No job with id ${jobId}`)
    }
    res.status(StatusCodes.OK).json({job})
}

const createJob = async(req,res) => {
    req.body.createdBy = req.user.userId
    const job = await Job.create(req.body)
    res.status(StatusCodes.CREATED).json({job})
}

const updateJob = async(req,res) => {
    const {body: {company, position}, user:{userId}, params:{id:jobId}} = req
    
    if(company=='' || position==''){
        throw new BadRequestError('Company or position cannot be empty')
    }

    const job = await Job.findOneAndUpdate({ _id: jobId, createdBy: userId}, req.body, {
        new: true,
        runValidators: true,
      })

    if(!job){
        throw new NotFoundError(`No job with id ${jobId}`)
    }

    res.status(StatusCodes.OK).json({job})
}

const deletePerson = (req, res) => {
    const person = people.find((person) => person.id === Number(req.params.id))
    if (!person) {
      return res
        .status(404)
        .json({ success: false, msg: `no person with id ${req.params.id}` })
    }
    const newPeople = people.filter(
      (person) => person.id !== Number(req.params.id)
    )
    return res.status(200).json({ success: true, data: newPeople })
  }

const deleteJob = async(req,res) => {
    const {user:{userId}, params:{id:jobId}} = req
    const job = await Job.findByIdAndRemove({_id: jobId, createdBy: userId})
    if(!job){
        throw new NotFoundError(`No job with id ${jobId}`)
    }
    res.status(StatusCodes.OK).send()
}

module.exports = {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob
}