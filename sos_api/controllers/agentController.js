// const { Agent } = require("../models/agent");
const bcrypt = require("bcryptjs");
const { User } = require("../models/index");

exports.createAgent = async (req, res) => {
  const {
    name,
    email,
    password,
    role,
    phone,
    city,
    state,
    zip,
    status,
    elevators,
    unique_id,
    user_id,
  } = req.body;

  console.log("Request Body:", req.body);

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    // const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = await User.create({
      name,
      email,
      password,
      role,
      phone,
      city,
      state,
      zip,
      status,
      elevators,
      unique_id,
      user_id,
    });

    // Send the response
    res.status(201).json({
      message: "Agent created successfully",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// exports.getAllAgent = async (req, res) => {
//   try {
//     const { agentId, startDate, endDate } = req.body;
//     // Base condition: role must be "agent"
//     const whereCondition = { role: "agent" };
//     // Add agentId to condition if provided
//     if (agentId) {
//       whereCondition.unique_id = agentId;
//     }

//     if (startDate && endDate) {
//       whereCondition.timestamp = {
//         [Op.between]: [
//           new Date(startDate),
//           new Date(new Date(endDate).setHours(23, 59, 59, 999)),
//         ],
//       };
//     }

//     const agents = await User.findAll({
//       where: whereCondition,
//     });

//     res.status(200).json(agents);
//   } catch (err) {
//     console.error("Error fetching agents:", err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

exports.getAllAgent = async (req, res) => {
  try {
    const { agentId, startDate, endDate, user_id } = req.body;
    console.log(agentId, "req.body");

    // Base condition: role must be "agent"
    const whereCondition = { role: "agent" };

    // Filter by agentId if provided
    if (agentId) {
      whereCondition.unique_id = agentId;
    }

    // Filter by date range if provided
    if (startDate && endDate) {
      whereCondition.timestamp = {
        [Op.between]: [
          new Date(startDate),
          new Date(new Date(endDate).setHours(23, 59, 59, 999)),
        ],
      };
    }

    // Filter by user_id only if it's provided
    if (user_id) {
      whereCondition.user_id = user_id;
    }

    const agents = await User.findAll({
      where: whereCondition,
    });

    res.status(200).json(agents);
  } catch (err) {
    console.error("Error fetching agents:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateAgent = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    email,
    password,
    role,
    status,
    state,
    city,
    zip,
    phone,
    elevators,
  } = req.body;

  try {
    // Find the user by ID
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user fields if provided
    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (state) user.state = state;
    if (status) user.status = status;
    if (city) user.city = city;
    if (zip) user.zip = zip;
    if (elevators) user.elevators = elevators;
    if (phone) user.phone = phone;

    // Hash and update password if provided
    if (password) {
      // const hashedPassword = await bcrypt.hash(password, 10);
      user.password = password;
    }

    // Save updated user
    await user.save();

    // Respond with updated user data (excluding password)
    res.status(200).json({
      message: "agent updated successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        status: user.status,
        city: user.city,
        state: user.state,
        role: user.role,
        password: user.password,
      },
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteAgent = async (req, res) => {
  try {
    const agent = await User.findByPk(req.params.id);
    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    await agent.destroy();
    res.status(200).json({ message: "Agent deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// graph chart agent Manage
const { Op, fn, col } = require("sequelize");
exports.getMonthlyCountAgent = async (req, res) => {
  try {
    const { year } = req.body;

    if (!year) {
      return res.status(400).json({ message: "Year is required" });
    }

    const startDate = new Date(`${year}-01-01`);
    const endDate = new Date(`${parseInt(year) + 1}-01-01`);

    const monthlyData = await User.findAll({
      attributes: [
        [fn("MONTH", col("timestamp")), "month"],
        [fn("COUNT", col("id")), "count"],
      ],
      where: {
        timestamp: {
          [Op.gte]: startDate,
          [Op.lt]: endDate,
        },
        role: "agent",
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

// graph chart User Manage
exports.getMonthlyCountUser = async (req, res) => {
  try {
    const { year } = req.body;

    if (!year) {
      return res.status(400).json({ message: "Year is required" });
    }

    const startDate = new Date(`${year}-01-01`);
    const endDate = new Date(`${parseInt(year) + 1}-01-01`);

    const monthlyData = await User.findAll({
      attributes: [
        [fn("MONTH", col("timestamp")), "month"],
        [fn("COUNT", col("id")), "count"],
      ],
      where: {
        timestamp: {
          [Op.gte]: startDate,
          [Op.lt]: endDate,
        },
        role: "user",
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
