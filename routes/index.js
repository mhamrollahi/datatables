const express = require("express");
const database = require("../database");

const router = express.Router();

/* GET home page. */
router.get("/", async (req, res, next) => {
  console.log("in / route ...");

  res.render("index");
});

router.get("/get_data", async (req, res, next) => {
  const { draw, start, length, search, order } = req.query;

  console.log("order = ", order);

  let column_name;
  let column_sort_order;

  if (typeof order == "undefined") {
      column_name = "id";
      column_sort_order = "desc";
    } else {
      let column_index = req.query.order[0]["column"];
      column_name = req.query.columns[column_index]["data"];
      column_sort_order = req.query.order[0]["dir"];
    }
    console.log(column_name, column_sort_order);

  const search_value = req.query.search["value"];

  const search_query = `
  AND (
    code LIKE '%${search_value}%'
    OR fa_TableName LIKE '%${search_value}%'
    OR en_TableName LIKE '%${search_value}%'
    )`;

  let data = await database.query(
    "SELECT COUNT(*) AS Total FROM CodeTableLists"
  );

  const total_records = data[0][0].Total;
  
  data= await database.query(
    `SELECT COUNT(*) AS Total FROM CodeTableLists WHERE 1 ${search_query}`
  );
  
  const total_records_with_filter = data[0][0].Total;

  const query = `
    SELECT * FROM CodeTableLists WHERE 1 ${search_query}
    ORDER BY ${column_name} ${column_sort_order}
    LIMIT ${start} , ${length}
  `;

  let data_arr = [];

  data = await database.query(query);

  for (let i = 0; i < data[0].length; i++) {
    data_arr.push({
      id: data[0][i].id,
      code: data[0][i].code,
      en_TableName: data[0][i].en_TableName,
      fa_TableName: data[0][i].fa_TableName,
      creator: data[0][i].creator,
      createdAt: data[0][i].createdAt,
    });
  }

  res.json({
    draw: draw,
    iTotalRecords: total_records,
    iTotalDisplayRecords: total_records_with_filter,
    aaData: data_arr,
  });
});

module.exports = router;
