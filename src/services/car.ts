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

const checkCarExistance = async (
  connection: mysql.Connection,
  carId: string,
  locationId: string
): Promise<Boolean> => {
  const query = `SELECT * from cars_to_locations WHERE car_id="${carId}" AND location_id="${locationId}"`;
  const result = await Query(connection, query);

  return result.length > 0;
};

const getCars = async (connection: mysql.Connection, queryDetails: any) => {
  let query = "SELECT * FROM car";

  if (Object.keys(queryDetails).length > 0) {
    if (Object.keys(queryDetails).indexOf("location") !== -1) {
      query += ` JOIN cars_to_locations 
      ON car.car_id = cars_to_locations.car_id 
      AND cars_to_locations.location_id="${queryDetails.location}"
      JOIN location 
      ON cars_to_locations.location_id = location.location_id`;
    }

    query += " WHERE";
    if (queryDetails.make) {
      query += ` make="${queryDetails.make}" AND `;
    }

    if (queryDetails.model) {
      query += ` model="${queryDetails.model}" AND `;
    }

    if (queryDetails.year) {
      query += ` year="${queryDetails.year}" AND `;
    }

    if (queryDetails.color) {
      query += ` color="${queryDetails.color}" AND `;
    }
    query = query.slice(0, -5);
  }

  const cars = await Query(connection, query);

  return cars;
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

const removeCar = async (
  connection: mysql.Connection,
  carId: string,
  locationId: string
) => {
  const query = `DELETE FROM cars_to_locations WHERE car_id="${carId}" AND location_id="${locationId}"`;

  const result = await Query(connection, query);

  return result;
};

const replaceCarInLocation = async (
  connection: mysql.Connection,
  carId: string,
  newCarId: string,
  locationId: string
) => {
  const isCarInLocation = await checkCarExistance(
    connection,
    carId,
    locationId
  );

  if (isCarInLocation) {
    throw new Error("Car already in location!");
  }

  const query = `UPDATE cars_to_locations SET car_id="${newCarId}" WHERE location_id="${locationId}" AND car_id="${carId}"`;

  const result = await Query(connection, query);

  return result;
};

const assignPromotionToCar = async (
  connection: mysql.Connection,
  carId: string,
  promotionId: string
) => {
  const query = `UPDATE car SET promotion_id="${promotionId}" WHERE car_id="${carId}"`;

  const result = await Query(connection, query);

  return result;
};

const getPromotedCars = async (connection: mysql.Connection) => {
  const query = "SELECT * FROM car WHERE promotion_id IS NOT NULL";

  const result = await Query(connection, query);

  return result;
};

const getPromotedCarsWithPromotions = async (connection: mysql.Connection) => {
  const query =
    "SELECT * FROM car RIGHT JOIN promotion ON car.promotion_id=promotion.promotion_id";

  const result = await Query(connection, query);

  return result;
};

const getCarsFromSpecificLocation = async (
  connection: mysql.Connection,
  locationId: string
) => {
  const query = `SELECT * FROM car JOIN cars_to_locations 
    ON car.car_id = cars_to_locations.car_id 
    AND cars_to_locations.location_id = "${locationId}" 
    JOIN location 
    ON cars_to_locations.location_id = location.location_id`;

  const result = await Query(connection, query);

  return result;
};

const getCarsWithExpiredPromotion = async (
  connection: mysql.Connection,
  date: string
) => {
  const query = `SELECT make, model, year, color 
  FROM car 
  JOIN promotion 
  ON car.promotion_id=promotion.promotion_id
  WHERE promotion.end_date="${date}"`;

  const result = await Query(connection, query);

  return result;
};

export {
  postCarInLocation,
  getCars,
  changeCarColor,
  removeCar,
  replaceCarInLocation,
  assignPromotionToCar,
  getPromotedCars,
  getPromotedCarsWithPromotions,
  getCarsFromSpecificLocation,
  getCarsWithExpiredPromotion,
};
