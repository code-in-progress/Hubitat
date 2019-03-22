const mysql = require('mysql');
const sprintf = require('sprintf-js').sprintf;

module.exports = {
  write : function (data, dest) {

    var pool = mysql.createPool({
        connectionLimit : 10,
        host: dest.host ? dest.host : 'localhost',
        port : dest.port ? dest.port : 3306,
        user: dest.user,
        password: dest.pass,
        database: dest.db
      });
      
        // Used to run SQL statements before the insert like disabling keys or setting other SQL options.
      if(dest.preSqlStatements !== null) {
        pool.query(dest.preSqlStatements, function (err, result) {
          if (err) throw err;
          if(global.debug) console.log("Result: " + JSON.stringify(result));
        });
      }
    
      var stmt = 'INSERT INTO ' + dest.table + ' (';
      
      stmt += dest.columns.join();
      
      stmt += ') VALUES (';
      
      values = [];

      for(var o in data) {
        if(global.debug) console.log("Data: " + JSON.stringify(o));
        if(global.debug) console.log("Columns: " + dest.columns.indexOf(o));

        if(dest.columns.indexOf(o) !== -1) {
          var d = data[o];
          if(d !== null) {
            var val = JSON.stringify(d);
            val = val.replace(/"/g, '');
            val = val.replace(/'/g,"\'");
            values.push(pool.escape(val));
          }
            
          else
            values.push('null');
        }
      }
      
      stmt += values.join();

      stmt += ')';

      if(global.debug) console.log("Writing to MYSQL: " + stmt);
      
      pool.query(stmt, function (err, result) {
        if (err) throw err;
        if(global.debug) console.log("Result: " + JSON.stringify(result));
      });

      if(dest.postSqlStatements !== null) {
        pool.query(dest.postSqlStatements, function (err, result) {
          if (err) throw err;
          if(global.debug) console.log("Result: " + JSON.stringify(result));
        });
      }
    }  
  }