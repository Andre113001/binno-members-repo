const express = require("express");
const router = express.Router();
const visitController = require("../controllers/visitController");

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get("/count/daily", visitController.countDailyVisit);
router.get("/count/all", visitController.countAllVisit);

router.post("/count/add", visitController.addVisitCount);

module.exports = router;
