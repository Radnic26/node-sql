import { NextFunction, Request, Response } from "express";
import { Connect } from "../config/mysql";
import * as Service from "../services/car";

const createCar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const connection = await Connect();

    const result = await Service.postCarInLocation(connection, req.body);

    connection.end();

    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

const getCars = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const connection = await Connect();
    const cars = await Service.getCars(connection, req.query);

    connection.end();

    return res.status(200).json(cars);
  } catch (err) {
    next(err);
  }
};

const changeColor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { color } = req.body;
    const { carId } = req.params;

    if (!color) {
      res.status(400).send("Bad request");
    }

    const connection = await Connect();
    const result = await Service.changeCarColor(connection, color, carId);
    connection.end();

    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

const deleteCarFromLocation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { carId, locationId } = req.params;

    const connection = await Connect();
    const result = await Service.removeCar(connection, carId, locationId);
    connection.end();

    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

const replaceCar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { carId, newCarId, locationId } = req.params;

    const connection = await Connect();
    const result = await Service.replaceCarInLocation(
      connection,
      carId,
      newCarId,
      locationId
    );
    connection.end();

    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

const assignPromotion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { carId, promotionId } = req.params;

    const connection = await Connect();
    const result = await Service.assignPromotionToCar(
      connection,
      carId,
      promotionId
    );
    connection.end();

    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

const getCarsWithPromotion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const connection = await Connect();
    const result = await Service.getPromotedCars(connection);

    connection.end();

    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

const promotedCarsAndPromotions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const connection = await Connect();
    const result = await Service.getPromotedCarsWithPromotions(connection);

    connection.end();

    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

const getCarsFromLocation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { locationId } = req.params;

    const connection = await Connect();
    const result = await Service.getCarsFromSpecificLocation(
      connection,
      locationId
    );

    connection.end();

    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

const getCarsWithExpiredPromotion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { date } = req.params;

    const connection = await Connect();
    const result = await Service.getCarsWithExpiredPromotion(connection, date);

    connection.end();

    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export default {
  createCar,
  getCars,
  changeColor,
  deleteCarFromLocation,
  replaceCar,
  assignPromotion,
  getCarsWithPromotion,
  promotedCarsAndPromotions,
  getCarsFromLocation,
  getCarsWithExpiredPromotion,
};
