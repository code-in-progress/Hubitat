const mysql = require('mysql');
const sprintf = require('sprintf-js').sprintf;
const debug = require('./debug.js');


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
          if(dest.debug) debug.writeJS("Result", result);
        });
      }
    
      var stmt = 'INSERT INTO ' + dest.table + ' (';
      
      stmt += dest.columns.join();
      
      stmt += ') VALUES (';
      
      values = [];

      for(var o in data) {
        if(dest.debug) {
          debug.writeJS("Data", o);
          debug.write("Columns", dest.columns.indexOf(o));
        }
        
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

      if(dest.debug) debug.write("Writing to MYSQL", stmt);

      
      pool.query(stmt, function (err, result) {
        if (err) throw err;
        if(dest.debug) debug.writeJS("Result", result);
      });

      if(dest.postSqlStatements !== null) {
        pool.query(dest.postSqlStatements, function (err, result) {
          if (err) throw err;
          if(dest.debug) debug.writeJS("Result", result);
        });
      }
    }  
  }