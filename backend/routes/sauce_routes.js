const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-configs");

const sauceCtrl = require("../controllers/sauce_controllers");

router.get("/", auth, sauceCtrl.getAllSauces);
router.get("/:id", auth, sauceCtrl.getOneSauce);
router.post("/", auth, multer, sauceCtrl.createSauce);
router.delete("/:id", auth, sauceCtrl.deleteSauce);
router.put("/:id", auth, multer, sauceCtrl.updateSauce);
router.post('/:id/like', sauceCtrl.likeSauce);

module.exports = router;