const express = require("express");
const database = require("../database");

const router = express.Router();

/* GET home page. */
router.get("/",async (req, res, next)=> {
  console.log("in / route ...");

  res.render("index");
});

router.get("/get_data", async (req, res, next) => {
  let { draw, start, length, search } = req.query;

  let order_data = req.query.order;

  console.log("order_data = ", order_data);

  let column_name ;
  let column_sort_order;
  
  if (order_data = "undefined") {
    column_name = 'id'
    column_sort_order = 'desc'
    console.log('in if ... ', column_name,column_sort_order);
  } else {
    console.log("in else ...  order_data = ", order_data);
    console.log("in else ...");

    let column_index = req.query.order[0]["column"];
    column_name = req.query.columns[column_index]["data"];
    column_sort_order = req.query.order[0]["dir"];
  }

  console.log(column_name,column_sort_order);

  const search_value = req.query.search["value"];

  const search_query = `
  AND (
    id LIKE '%${search_value}%'
    OR fa_TableName LIKE '%${search_value}%'
    OR en_TableName LIKE '%${search_value}%'
    )`;

  console.log("search_query = ", search_query);

  const data1 = await database.query(
    "SELECT COUNT(*) AS Total FROM CodeTableLists"
  );

  console.log("in query ...  ", data1);

  const total_records = data1[0].Total;

  const data2 = await database.query(`SELECT COUNT(*) AS Total FROM CodeTableLists WHERE 1 ${search_query}`);

  console.log('in query 2  .... ', data2)

  const total_records_with_filter = data2[0].Total;

  const query = `
    SELECT * FROM CodeTableLists WHERE 1 ${search_query}
    ORDER BY ${column_name} ${column_sort_order}
    LIMIT ${start} , ${length}
  `;

  console.log("query  = ",query)

  let data_arr = [];

  const data3 = await database.query(query);
  
  console.log('data3 = ', data3);

  

  data3.forEach((row) => {
    console.log(row)

    data_arr.push({
      'code': row.code,
      'en_TableName': row.en_TableName,
      'fa_TableName': row.fa_TableName,
      'creator': row.creator,
      'fa_createdAt': row.createdAt,
    });
  });

  console.log('data_arr = ',data_arr) 


  const outPut = {
    draw: draw,
    iTotalRecords: total_records,
    iTotalDisplayRecords: total_records_with_filter,
    aaData: data3,
  };

  res.json(outPut);
});

module.exports = router;
