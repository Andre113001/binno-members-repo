const express = require('express')
const router = express.Router()
const memberController = require('../controllers/memberController')

router.use(express.json())
router.use(express.urlencoded({ extended: true }))

// 11/15/2023 - Include specify startup enabler and company

const activityLogging = require('../middlewares/activityLogging')
router.use(activityLogging)

router.get('/member/:member_id', memberController.getMember)
router.get('/profile/:accessToken', memberController.fetchProfileByToken)

router.get('/company_links/:member_id', memberController.getCompanyLinks);
router.post('/company_links/add', memberController.addUpdateCompanyLink);
router.post('/company_links/remove', memberController.removeCompanyLink);

router.get('/enablers', memberController.fetchEnablers)
router.get('/companies', memberController.fetchCompanies)

router.post('/update-profile', memberController.updateProfile)
router.post('/update-name', memberController.changeInstituteName)
router.post('/update-enablerClass', memberController.changeEnablerClass)
router.post('/update-password', memberController.changePassword)

router.get('/change-status/:member_id', memberController.changeStatus)
router.post('/update-profile-cover', memberController.updateCoverPic)
router.post('/update-profile-img', memberController.updateProfilePic)

module.exports = router
