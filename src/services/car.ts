import { Query } from "../config/mysql";
import mysql from "mysql2";
import Car from "../interfaces/car";
import Location from "../interfaces/location";

const getLocationId = async (
  connection: mysql.Connection,
  name: string
): Promise<any> => {
  const query = `SELECT location_id FROM location WHERE name="${name}";`;

  const locationId = await Query(connection, query);

  return locationId;
};

const postCarInLocation = async (
  connection: mysql.Connection,
  carDetails: Car & Location
) => {
  const { make, model, year, color, locationName } = carDetails;
  const result = await getLocationId(connection, locationName);

  if (result) {
    const carCreateQuery = `INSERT INTO car (make, model, year, color) VALUES ("${make}", "${model}", "${year}", "${color}")`;
    const carCreateResult = await Query(connection, carCreateQuery);

    const carAddToLocationQuery = `INSERT INTO cars_to_locations (car_id, location_id) VALUES ("${carCreateResult.insertId}", "${result[0].location_id}")`;
    const assignCarToLocation = await Query(connection, carAddToLocationQuery);

    return assignCarToLocation;
  } else {
    throw new Error("car creation error");
  }
};

const changeCarColor = async (
  connection: mysql.Connection,
  color: string,
  carId: string
) => {
  const query = `UPDATE car SET color = "${color}" WHERE car_id="${carId}"`;

  const result = await Query(connection, query);

  return result;
};

const getCars = async (connection: mysql.Connection) => {
  const query = "SELECT * FROM car";

  const cars = await Query(connection, query);

  return cars;
};

export { postCarInLocation, getCars, changeCarColor };
