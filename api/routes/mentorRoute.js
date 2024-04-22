const express = require("express");
const router = express.Router();
const mentorshipController = require("../controllers/mentorshipController");

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.use(express.json())
router.use(express.urlencoded({ extended: true }))

router.get("/list", mentorshipController.listAvailableMentors);
router.get("/list/enabler/:enablerId", mentorshipController.listMentorsByEnabler);
router.get("/request/list/sender/:senderId", mentorshipController.listMentorshipRequestBySender);
router.get("/request/list/receiver/:receiverId", mentorshipController.listMentorshipRequestByReceiver);

router.post("/partnership/end", mentorshipController.endPartnership);
router.post("/partnership/end/cancel", mentorshipController.cancelEndPartnership);
router.post("/request/accept", mentorshipController.acceptMentorshipRequest);
router.post("/request/cancel", mentorshipController.cancelMentorshipRequest);
router.post("/request/create", upload.single("file"), mentorshipController.createMentorshipRequest);
router.post("/request/reject", mentorshipController.rejectMentorshipRequest);

module.exports = router;
