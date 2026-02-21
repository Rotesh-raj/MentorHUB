import csv from "csv-parser";
import { Readable } from "stream";

export const parseCSV = (fileContent) => {
  return new Promise((resolve, reject) => {
    const results = [];

    const stream = Readable.from([fileContent]);

    stream
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", (error) => reject(error));
  });
};
