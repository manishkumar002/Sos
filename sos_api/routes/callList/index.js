// routes/callList/index.js
const express = require("express");
const router = express.Router();
const callListController = require("../../controllers/callListController");

// Get all call lists
router.post("/callLists", callListController.getAllCallLists);
router.get("/getSosCall", callListController.getSosCallInfo);
router.post("/createCallList", callListController.createCallList);
router.put("/updateCallList/:id", callListController.updateCallList);
router.post("/receiveCall", callListController.receiveCall);
router.post("/endCall", callListController.endCall);
router.post(
  "/getMonthlyFinished",
  callListController.getMonthlyCallListCountFinished
);
router.post(
  "/getMonthlyMissed",
  callListController.getMonthlyCallListCountMissed
);
router.get(
  "/getLast7DaysFinishedCount",
  callListController.getLast7DaysFinishedCount
);
router.get(
  "/getLast7DaysActiveCount",
  callListController.getLast7DaysActiveCount
);

router.post("/join_call_status", callListController.joinCallStatus);
router.post("/request_call_recording", callListController.requestCallRecording);
router.get("/getSpashScreenInfo", callListController.getSpashScreenInfo);
router.get("/checkCallStatus", callListController.checkCallStatus);
router.get("/getStartCallInfo", callListController.getStartCallInfo);

router.post("/liftStartCall", callListController.liftStartCall);
router.post("/liftReceiveCall", callListController.liftReceiveCall);

module.exports = router;
