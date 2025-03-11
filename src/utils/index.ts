import { uniqueNamesGenerator, colors, animals } from "unique-names-generator";

export const generateRandomName = () => {
  return uniqueNamesGenerator({
    dictionaries: [colors, animals],
    separator: "-",
    style: "lowerCase",
  });
};
