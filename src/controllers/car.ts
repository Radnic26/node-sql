import { NextFunction, Request, Response } from "express";
import { Connect } from "../config/mysql";
import { postCarInLocation, getCars, changeCarColor } from "../services/car";

const createCar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const connection = await Connect();

    const result = await postCarInLocation(connection, req.body);

    connection.end();

    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

const getAllCars = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const connection = await Connect();
    const cars = await getCars(connection);

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

    const connection = await Connect();
    const result = await changeCarColor(connection, color, carId);
    connection.end();

    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export default { createCar, getAllCars, changeColor };
