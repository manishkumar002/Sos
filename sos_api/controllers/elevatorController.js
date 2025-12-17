const { Elevator } = require("../models/elevator");
const { User } = require("../models/index");
// Create Elevator

exports.createElevator = async (req, res) => {
  try {
    const { elevatorid, user, company, city, state, zip, status } = req.body;

    // Validate required fields
    if (!elevatorid || !user || !company || !city || !state || !zip) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Create the Elevator
    const newElevator = await Elevator.create({
      elevatorid,
      user,
      company,
      city,
      state,
      zip,
      status,
    });

    res.status(201).json({
      message: "Elevator created successfully",
      elevator: newElevator,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// exports.createElevator = async (req, res) => {
//   try {
//     const {
//       elevatorid,
//       user,
//       company,
//       city,
//       state,
//       zip,
//       status,
//       unique_id,
//       role,
//     } = req.body;

//     // ✅ Validate basic fields
//     if (!elevatorid || !user || !company || !city || !state || !zip) {
//       return res
//         .status(400)
//         .json({ error: "All fields are required except userId." });
//     }

//     let agent = null;

//     if (unique_id && role === "agent") {
//       agent = await User.findOne({
//         where: { unique_id: unique_id, role: "agent" },
//       });
//     }

//     // ✅ Elevator table me save karo
//     const newElevator = await Elevator.create({
//       elevatorid,
//       company,
//       user,
//       city,
//       state,
//       zip,
//       status,
//     });

//     // ✅ Agar agent mila hai to elevators update karo
//     if (agent) {
//       let elevatorsArray = [];

//       if (agent.elevators) {
//         if (Array.isArray(agent.elevators)) {
//           elevatorsArray = agent.elevators;
//         } else {
//           elevatorsArray = JSON.parse(agent.elevators);
//         }
//       }

//       elevatorsArray.push(elevatorid);

//       agent.elevators = elevatorsArray; // ✅ Direct array assign karo (agar column JSON hai)
//       await agent.save();
//     }

//     res.status(201).json({
//       message: agent
//         ? "Elevator created and assigned to agent successfully."
//         : "Elevator created successfully",
//       elevator: newElevator,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// };

//Get all Elevators
exports.getAllElevators = async (req, res) => {
  try {
    const elevators = await Elevator.findAll();

    const users = await User.findAll({
      attributes: ["unique_id", "name", "elevators"],
      where: {
        role: "agent",
      },
    });

    const enriched = elevators.map((elevator) => {
      const matchedUser = users.find(
        (user) =>
          Array.isArray(user.elevators) &&
          user.elevators.includes(elevator.elevatorid)
      );

      return {
        ...elevator.toJSON(),
        agent: matchedUser
          ? { unique_id: matchedUser.unique_id, name: matchedUser.name }
          : null,
      };
    });

    res.status(200).json(enriched);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: err.message });
  }
};

// exports.getAllElevators = async (req, res) => {
//   try {
//     const { role, unique_id } = req.query;
//     let elevators = [];

//     if (role === "agent" && unique_id) {
//       // ✅ Sirf agent ka elevators fetch karo
//       const agent = await User.findOne({
//         where: { unique_id: unique_id, role: "agent" },
//       });

//       if (agent && agent.elevators) {
//         let elevatorsArray = [];

//         try {
//           elevatorsArray = Array.isArray(agent.elevators)
//             ? agent.elevators
//             : JSON.parse(agent.elevators);

//           if (!Array.isArray(elevatorsArray)) {
//             elevatorsArray = [];
//           }
//         } catch (error) {
//           elevatorsArray = [];
//         }

//         elevators = await Elevator.findAll({
//           where: {
//             elevatorid: elevatorsArray,
//           },
//         });
//       } else {
//         elevators = [];
//       }

//       res.status(200).json(elevators);
//     } else {
//       // ✅ Admin ya default: sabhi elevators + agent ka info
//       const allElevators = await Elevator.findAll();

//       const users = await User.findAll({
//         attributes: ["unique_id", "name", "elevators"],
//         where: {
//           role: "agent",
//         },
//       });

//       const enriched = allElevators.map((elevator) => {
//         const matchedUser = users.find((user) => {
//           let elevatorsArray = [];
//           try {
//             elevatorsArray = Array.isArray(user.elevators)
//               ? user.elevators
//               : JSON.parse(user.elevators);

//             if (!Array.isArray(elevatorsArray)) {
//               elevatorsArray = [];
//             }
//           } catch (error) {
//             elevatorsArray = [];
//           }

//           return elevatorsArray.includes(elevator.elevatorid);
//         });

//         return {
//           ...elevator.toJSON(),
//           agent: matchedUser
//             ? { unique_id: matchedUser.unique_id, name: matchedUser.name }
//             : null,
//         };
//       });

//       res.status(200).json(enriched);
//     }
//   } catch (err) {
//     console.error("Error:", err);
//     res.status(500).json({ error: err.message });
//   }
// };

//Get  Elevators By Id
exports.getElevatorById = async (req, res) => {
  try {
    const technicians = await Elevator.findByPk(req.params.id);
    res.status(200).json(technicians);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateElevator = async (req, res) => {
  try {
    const elevator = await Elevator.findByPk(req.params.id);
    if (!elevator) {
      return res.status(404).json({ message: "Elevator not found" });
    }

    const { elevatorid, user, company, city, state, zip, status } = req.body;

    // Update the elevator fields only if provided
    elevator.elevatorid = elevatorid || elevator.elevatorid;
    elevator.user = user || elevator.user;
    elevator.company = company || elevator.company;
    elevator.city = city || elevator.city;
    elevator.state = state || elevator.state;
    elevator.zip = zip || elevator.zip;
    elevator.status = status || elevator.status;

    await elevator.save();

    res.status(200).json({
      message: "Elevator updated successfully",
      elevator,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// exports.updateElevator = async (req, res) => {
//   try {
//     const elevator = await Elevator.findByPk(req.params.id);
//     if (!elevator) {
//       return res.status(404).json({ message: "Elevator not found" });
//     }

//     const {
//       elevatorid,
//       user,
//       company,
//       city,
//       state,
//       zip,
//       status,
//       unique_id,
//       role,
//     } = req.body;
//     console.log(req.body, "@@@@@@@@@@@@@@@@@@");

//     const previousElevatorId = elevator.elevatorid;

//     // ✅ Elevator table fields update karo
//     elevator.elevatorid = elevatorid || elevator.elevatorid;
//     elevator.user = user || elevator.user;
//     elevator.company = company || elevator.company;
//     elevator.city = city || elevator.city;
//     elevator.state = state || elevator.state;
//     elevator.zip = zip || elevator.zip;
//     elevator.status = status || elevator.status;

//     await elevator.save();

//     // ✅ Agent ka elevators array bhi update karo agar unique_id aur role mile
//     if (unique_id && role === "agent") {
//       const agent = await User.findOne({
//         where: { unique_id: unique_id, role: "agent" },
//       });

//       if (agent) {
//         let elevatorsArray = [];

//         if (Array.isArray(agent.elevators)) {
//           elevatorsArray = agent.elevators;
//         } else {
//           try {
//             elevatorsArray = JSON.parse(agent.elevators);
//             if (!Array.isArray(elevatorsArray)) {
//               elevatorsArray = [];
//             }
//           } catch (error) {
//             elevatorsArray = [];
//           }
//         }

//         // ✅ Previous elevatorid ko replace karo new elevatorid se
//         elevatorsArray = elevatorsArray.map((id) => {
//           return String(id).trim() === String(previousElevatorId).trim()
//             ? elevatorid // Replace with new elevatorid
//             : id; // Keep existing
//         });

//         agent.elevators = elevatorsArray; // ✅ Direct array assign karo
//         await agent.save();
//       }
//     }

//     res.status(200).json({
//       message:
//         "Elevator updated successfully (and agent elevators updated if matched)",
//       elevator,
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// Delete Elevators
exports.deleteElevator = async (req, res) => {
  try {
    const elevator = await Elevator.findByPk(req.params.id);
    if (!elevator) {
      return res.status(404).json({ message: "Elevator not found" });
    }

    await elevator.destroy();
    res.status(200).json({ message: "Elevator deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// exports.deleteElevator = async (req, res) => {
//   try {
//     const elevator = await Elevator.findByPk(req.params.id);

//     if (!elevator) {
//       return res.status(404).json({ message: "Elevator not found" });
//     }

//     const { unique_id, role } = req.body;

//     if (unique_id && role === "agent") {
//       const agent = await User.findOne({
//         where: { unique_id: unique_id, role: "agent" },
//       });

//       if (agent) {
//         let elevatorsArray = [];

//         // ✅ Load elevators as array directly
//         if (Array.isArray(agent.elevators)) {
//           elevatorsArray = agent.elevators;
//         } else {
//           try {
//             elevatorsArray = JSON.parse(agent.elevators);

//             if (!Array.isArray(elevatorsArray)) {
//               elevatorsArray = [];
//             }
//           } catch (error) {
//             elevatorsArray = [];
//           }
//         }

//         console.log("Before Remove: ", elevatorsArray);
//         console.log(
//           "Elevator ID to delete: ",
//           String(elevator.elevatorid).trim()
//         );

//         // ✅ Remove elevatorid
//         elevatorsArray = elevatorsArray.filter(
//           (id) => String(id).trim() !== String(elevator.elevatorid).trim()
//         );

//         console.log("After Remove: ", elevatorsArray);

//         // ✅ Save as pure array (just like create API)
//         agent.elevators = elevatorsArray;

//         await agent.save();
//       }
//     }

//     await elevator.destroy();

//     res.status(200).json({
//       message:
//         "Elevator deleted successfully from elevators table and removed from user's elevators array if matched.",
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// };
