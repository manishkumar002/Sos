const { TaskAssigned } = require('../models/taskAssigned');
const { Technician } =require('../models/technician')
exports.assignTechnician = async (req, res) => {
    try {
        const { elevator_id, technician_id, assigned_date } = req.body;

        const assignment = new TaskAssigned({
            elevator_id,
            technician_id,
            assigned_date
        });

        await assignment.save();

        res.status(200).json({ message: 'Technician assigned successfully with elevator' });
    } catch (error) {
        console.error('Error assigning technician:', error);
        res.status(500).json({ error: 'Failed to assign technician' });
    }
};

// exports.getAllTaskAssignedLists = async (req, res) => {
//   try {
//     const taskAssigned = await TaskAssigned.findAll({
//       include: [
//         {
//           model: Technician,
//           as: 'technician',
//           attributes: ['name', 'phone'],
//         }
//       ]
//     });

//     res.json({ taskAssigned });
//   } catch (error) {
//     console.error('Error fetching task assigned lists:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };



// graph chart Finished call

exports.getAllTaskAssignedLists = async (req, res) => {
  try {
    const { elevatorId ,startDate, endDate} = req.body; 
    const whereCondition = {};
    if (elevatorId) {
      whereCondition.elevator_id = elevatorId; 
    }
  
     if (startDate && endDate) {
      whereCondition.assigned_date = {
        [Op.between]: [
          new Date(startDate),
          new Date(new Date(endDate).setHours(23, 59, 59, 999)),
        ],
      };
    }


    const taskAssigned = await TaskAssigned.findAll({
      where: whereCondition,
      include: [
        {
          model: Technician,
          as: 'technician',
          attributes: ['name', 'phone'],
        }
      ]
    });

    res.json({ taskAssigned });
  } catch (error) {
    console.error('Error fetching task assigned lists:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



const { Op, fn, col } = require('sequelize');
exports.getMonthlyCountTasAssigned = async (req, res) => {
  try {
    const { year } = req.body;

    if (!year) {
      return res.status(400).json({ message: 'Year is required' });
    }

    const startDate = new Date(`${year}-01-01T00:00:00Z`);
    const endDate = new Date(`${parseInt(year) + 1}-01-01T00:00:00Z`);

    const monthlyData = await TaskAssigned.findAll({
      attributes: [
        [fn('MONTH', col('assigned_date')), 'month'],
        [fn('COUNT', col('id')), 'count'],
      ],
      where: {
        assigned_date: {
          [Op.gte]: startDate,
          [Op.lt]: endDate,
        },
      },
      group: [fn('MONTH', col('assigned_date'))],
      order: [[fn('MONTH', col('assigned_date')), 'ASC']],
      raw: true,
    });

    // Month mapping
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const result = monthNames.map((month, index) => ({
      month,
      count: 0,
    }));

    monthlyData.forEach(item => {
      const monthIndex = parseInt(item.month); // Ensure integer index
      if (monthIndex >= 1 && monthIndex <= 12) {
        result[monthIndex - 1].count = parseInt(item.count, 10);
      }
    });

    return res.json({ year, data: result });
  } catch (error) {
    console.error('Error fetching monthly task assignment count:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};