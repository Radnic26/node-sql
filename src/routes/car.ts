import express from "express";
import controller from "../controllers/car";

const router = express.Router();

router.get("/", controller.getCars);
router.get("/cars-with-promotion", controller.getCarsWithPromotion);
router.get(
  "/promoted-cars-and-promotions",
  controller.promotedCarsAndPromotions
);
router.get("/cars-from-location/:locationId", controller.getCarsFromLocation);
router.get(
  "/cars-promotion-expired/:date",
  controller.getCarsWithExpiredPromotion
);

router.post("/", controller.createCar);

router.put("/change-color/:carId", controller.changeColor);
router.put("/replace-car/:carId/:newCarId/:locationId", controller.replaceCar);
router.put("/assign-promotion/:carId/:promotionId", controller.assignPromotion);

router.delete(
  "/delete-car/:carId/:locationId",
  controller.deleteCarFromLocation
);

export = router;
