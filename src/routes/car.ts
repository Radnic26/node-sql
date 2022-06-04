import express from "express";
import controller from "../controllers/car";

const router = express.Router();

router.post("/car", controller.createCar);
router.get("/car", controller.getAllCars);
router.put("/car/change-color/:carId", controller.changeColor);

export = router;
