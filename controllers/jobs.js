const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors/index");

const getAllJobs = async (req, res) => {
  // Filter by user
  const jobs = await Job.find({ createdBy: req.user.userID }).sort("createdAt");
  res.status(StatusCodes.OK).json({ count: jobs.length, jobs });
};

const getJob = async (req, res) => {
  const { userID } = req.user;
  const { jobID } = req.params;

  const foundJob = await Job.findOne({
    createdBy: userID,
    _id: jobID,
  });

  if (!foundJob) {
    throw new NotFoundError(`No job with id ${req.params.jobID}`);
  }

  res.status(StatusCodes.OK).json(foundJob);
};

const updateJob = async (req, res) => {
  const { userID } = req.user;
  const { jobID } = req.params;

  const foundJob = await Job.findOneAndUpdate(
    {
      createdBy: userID,
      _id: jobID,
    },
    req.body,
    {
      // Options
      new: true, // Return new obj
      runValidators: true, // Re-run validators when update
    }
  );

  if (!foundJob) {
    throw new NotFoundError(`No job with id ${jobID}`);
  }

  res.status(StatusCodes.OK).json(foundJob);
};

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userID;
  const newJob = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json(newJob);
};

const deleteJob = async (req, res) => {
  const { userID } = req.user;
  const { jobID } = req.params;

  const foundJob = await Job.findByIdAndDelete({
    createdBy: userID,
    _id: jobID,
  });

  if (!foundJob) {
    throw new NotFoundError(`No job with id ${req.params.jobID}`);
  }

  res.status(StatusCodes.DELE).json(foundJob);
};

module.exports = {
  getAllJobs,
  getJob,
  updateJob,
  createJob,
  deleteJob,
};
