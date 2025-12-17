// controllers/callListController.js
//const { Notes } = require('../models/notes');

// Get all call lists
// exports.getNoteList = async (req, res) => {
//   try {
//     const NoteLists = await Notes.findAll();
//     res.json({ NoteLists });
//   } catch (error) {
//     console.error('Error fetching call lists:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

// Create a new notes list
// exports.createNoteList = async (req, res) => {
//   const { call_id, notes } = req.body;

//   try {
//     // Create a new note list with the provided call_id and notes
//     const newNoteList = await Notes.create({
//       call_id,
//       notes,
//       // No need to explicitly include 'timestamp' here
//     });

//     // Send the response with the created note list
//     res.status(201).json({ message: 'Note List created successfully', newNoteList });
//   } catch (error) {
//     console.error('Error creating note list:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };


// Get a specific call list by ID
// exports.getNoteById = async (req, res) => {
 
//   const { call_id } = req.body;

//   try {
//     //const notes = await Notes.findByPk(id);
//     const notes = await Notes.findAll({
//       where: {
//         call_id: call_id // Only search by 'call_id'
//       }
//     });

//     if (!notes) {
//       return res.status(404).json({ message: 'Note not found' });
//     }
//     res.json({ notes });
//   } catch (error) {
//     console.error('Error fetching call list:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

// Update a note list by ID
// exports.updateNotes = async (req, res) => {
//   const { id } = req.params;
//   const { call_id, notes} = req.body;

//   try {
//     const noteList = await Notes.findByPk(id);
//     if (!noteList) {
//       return res.status(404).json({ message: 'Notes List not found' });
//     }

//     // Update the fields
//     if (call_id) noteList.call_id = call_id;
//     if (notes) noteList.notes = notes;
    
//     await noteList.save();
//     res.json({ message: 'Notes List updated successfully', noteList });
//   } catch (error) {
//     console.error('Error updating notes list:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };



// ++++++++++++++++++++++++++++++++++ Notess Created +++++++++++++++++++++++++++++++++

const { Notess } = require('../models/notess');
const {User} = require('../models/index')
const {CallList} = require('../models/callList');
const moment = require('moment-timezone');
// Create a new AgentNotes list
exports.AddNotes = async (req, res) => {
  const { name,notes,status,call_id,} = req.body;

  try {
    const NoteLists = await Notess.create({
      name,
      notes,
      status,
      call_id,
    });
    res.status(201).json({ message: 'Note List created successfully', NoteLists });
  } catch (error) {
    console.error('Error creating note list:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all call AgentNotesLists
// exports.getNoteList = async (req, res) => {
//   try {
//     const NotesLists = await Notess.findAll();
//     res.json({ NotesLists });
//   } catch (error) {
//     console.error('Error fetching call lists:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

const { Op } = require('sequelize');
exports.getNoteList = async (req, res) => {
  try {
    const { agentId, liftId, startDate, endDate } = req.body;
    console.log(agentId, liftId,startDate, endDate, "startDate, endDate");

    // Define filter objects
    const noteWhere = {};
    const callWhere = {};

    // Apply date filter if provided
    if (startDate && endDate) {
      noteWhere.timestamp = {
        [Op.between]: [
          new Date(startDate),
          new Date(new Date(endDate).setHours(23, 59, 59, 999)),
        ],
      };
    }

    // Apply agent filter if provided
    if (agentId) {
      callWhere.agent_id = agentId;
    }

    // Apply lift filter if provided
    if (liftId) {
      callWhere.lift_id = liftId;
    }

    // Prepare include object
    const includeOptions = [
      {
        model: CallList,
        as: 'agent', // Make sure it matches your model's alias
        attributes: ['id', 'agent_id', 'lift_id', 'address'],
        include: [
          {
            model: User,
            as: 'agentList', // Match your association alias
            attributes: ['unique_id', 'name', 'email', 'phone'],
          }
        ]
      }
    ];

    // Add 'where' clause only if callWhere is not empty
    if (Object.keys(callWhere).length > 0) {
      includeOptions[0].where = callWhere;
    }

    // Fetch data with conditions
    const notes = await Notess.findAll({
      where: noteWhere,
      include: includeOptions
    });

    res.json({ NotesLists: notes });
  } catch (error) {
    console.error('Error fetching note list:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};






// Update a AgentNote list by ID
exports.updateNotesList = async (req, res) => {
  const { id } = req.params;
  const { notes} = req.body;

  try {
    const NoteLists = await Notess.findByPk(id);
    if (!NoteLists) {
      return res.status(404).json({ message: 'Notes List not found' });
    }

    // Update the fields
    if (notes) NoteLists.notes = notes;
 
    
    await NoteLists.save();
    res.json({ message: 'Notes List updated successfully',NoteLists });
  } catch (error) {
    console.error('Error updating notes list:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
//Update status
exports.updateStatusNotesList = async (req, res) => {
  const { id } = req.params;
  const { status} = req.body;
  try {
    const NoteLists = await Notess.findByPk(id);
    if (!NoteLists) {
      return res.status(404).json({ message: 'Notes List not found' });
    }
    // Update the fields
    if (status) NoteLists.status = status;
    await NoteLists.save();
    res.json({ message: 'Notes List status successfully',NoteLists });
  } catch (error) {
    console.error('Error updating notes list:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


//Get a specific call list by ID
exports.getNoteById = async (req, res) => {
 
  const { call_id } = req.body;

  try {
    //const notes = await Notes.findByPk(id);
    const notes = await Notess.findAll({
      where: {
        call_id: call_id // Only search by 'call_id'
      }
    });

    if (!notes) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.json({ notes });
  } catch (error) {
    console.error('Error fetching call list:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



