// routes/callList/index.js
const express = require('express');
const router = express.Router();
const notesController = require('../../controllers/notesController');

// //router.post('/notes', notesController.getNoteList);
// router.post('/notes/createNoteList', notesController.createNoteList);
// router.post('/notes', notesController.getNoteById);
// //router.put('/:id', callListController.updateCallList);
// router.put('/notes/createNoteList/:id', notesController.updateNotes);


// agent Notes  Routes
router.post('/addNotes', notesController.AddNotes);
router.post('/getNoteList',notesController.getNoteList)
router.put('/addNotes/:id', notesController.updateNotesList);
router.put('/statusNotes/:id', notesController.updateStatusNotesList);
router.post('/notes', notesController.getNoteById);



module.exports = router;
