const _ = require("lodash");
const { Types } = require("mongoose");

const URL_IMG = `${process.env.URL_SERVER}/uploads`;

const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};

const convertToObjectIdMongose = (id) => {
  return new Types.ObjectId(id);
};

// ['a', 'b', 'c'] = {a: 1, b: 1, c: 1}
const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 1]));
};

const getUnSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 0]));
};

const cleanObject = (obj) => {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  Object.keys(obj).forEach((key) => {
    if (obj[key] === null || obj[key] === undefined) {
      delete obj[key];
    } else if (typeof obj[key] === "object") {
      cleanObject(obj[key]);
    }
  });

  return obj;
};

const pagination = (page, limit) => {
  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);
  const skip = (pageNumber - 1) * limitNumber;
  return { pageNumber, limitNumber, skip };
};

const convertUrlBook = (link) => {
  const url = `${URL_IMG}/${link}`;
  return url;
};
module.exports = {
  getInfoData,
  getSelectData,
  convertUrlBook,
  getUnSelectData,
  cleanObject,
  convertToObjectIdMongose,
  pagination,
};
