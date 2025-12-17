const { Technician } = require("../models/technician");

// new updated code
exports.createTechnician = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      city,
      state,
      zip,
      status,
      techunique_id,
      agent_id,
    } = req.body;

    const newTechnician = await Technician.create({
      name,
      email,
      phone,
      city,
      state,
      zip,
      status,
      techunique_id,
      agent_id,
    });

    res.status(201).json({
      message: "Technician created successfully",
      technician: newTechnician,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllTechnicians = async (req, res) => {
  try {
    const { startDate, endDate, agent_id } = req.body;
    let whereCondition = { agent_id };

    if (startDate && endDate) {
      whereCondition.timestamp = {
        [Op.between]: [
          new Date(startDate),
          new Date(new Date(endDate).setHours(23, 59, 59, 999)),
        ],
      };
    }

    const technicians = await Technician.findAll({ where: whereCondition });

    res.status(200).json(technicians);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllTechniciansForAdmin = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;

    let whereCondition = {};

    if (startDate && endDate) {
      whereCondition.timestamp = {
        [Op.between]: [
          new Date(startDate),
          new Date(new Date(endDate).setHours(23, 59, 59, 999)),
        ],
      };
    }

    const technicians = await Technician.findAll({ where: whereCondition });

    res.status(200).json(technicians);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTechnicianById = async (req, res) => {
  try {
    const agent_id = req.body;

    const technician = await Technician.findOne({
      where: {
        id: req.params.id,
        agent_id,
      },
    });

    if (!technician) {
      return res
        .status(404)
        .json({ message: "Technician not found or unauthorized" });
    }

    res.status(200).json(technician);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateTechnician = async (req, res) => {
  try {
    const technician = await Technician.findByPk(req.params.id);
    if (!technician) {
      return res.status(404).json({ message: "Technician not found" });
    }

    const { name, email, phone, city, state, zip, status } = req.body;

    // Update the agent fields
    technician.name = name || technician.name;
    technician.email = email || technician.email;
    technician.phone = phone || technician.phone;
    technician.city = city || technician.city;
    technician.state = state || technician.state;
    technician.zip = zip || technician.zip;
    technician.status = status || technician.status;

    await technician.save();

    res
      .status(200)
      .json({ message: "Technician updated successfully", technician });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteTechnician = async (req, res) => {
  try {
    const technician = await Technician.findByPk(req.params.id);
    if (!technician) {
      return res.status(404).json({ message: "Technician not found" });
    }

    await technician.destroy();
    res.status(200).json({ message: "Technician deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Technicians by Zip Code
exports.getTechniciansByZipCode = async (req, res) => {
  const { zip } = req.query;

  try {
    if (!zip) {
      return res.status(400).json({ error: "Zip code is required" });
    }

    const technicians = await Technician.findAll({
      where: { zip },
    });

    res.status(200).json(technicians);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// graph chart Technician call
const { Op, fn, col } = require("sequelize");
exports.getMonthlyCallListCountTechnician = async (req, res) => {
  try {
    const { year } = req.body;

    if (!year) {
      return res.status(400).json({ message: "Year is required" });
    }

    const startDate = new Date(`${year}-01-01`);
    const endDate = new Date(`${parseInt(year) + 1}-01-01`);

    const monthlyData = await Technician.findAll({
      attributes: [
        [fn("MONTH", col("timestamp")), "month"],
        [fn("COUNT", col("id")), "count"],
      ],
      where: {
        timestamp: {
          [Op.gte]: startDate,
          [Op.lt]: endDate,
        },
      },
      group: [fn("MONTH", col("timestamp"))],
      order: [[fn("MONTH", col("timestamp")), "ASC"]],
      raw: true,
    });

    // Month mapping
    const monthNames = [
      "",
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    // Initialize all months with 0
    const result = [];
    for (let i = 1; i <= 12; i++) {
      result.push({
        month: monthNames[i],
        count: 0,
      });
    }

    // Fill counts from DB data
    monthlyData.forEach((item) => {
      const monthIndex = item.month;
      result[monthIndex - 1].count = item.count;
    });

    res.json({ year, data: result });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
