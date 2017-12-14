var Table = function(sel){

  var tbl;      // table dom
  var cols;     // columns data
  var row_num;  // row number ( exclude header )
  var cpr;      // column number per row

  this._reload = function(){
    tbl     = document.querySelector(sel);
    cols    = tbl.querySelectorAll('td');
    row_num = tbl.querySelectorAll('tr').length - 1;
    cpr     = cols.length / row_num;
  }

  this.update = function(new_data){
    new_data.forEach(function(row, rid){
      // update existing row
      var row_exist = cols[ rid*cpr ];
      if(row_exist){
        row.forEach(function(col, cid){
          var prev_col = cols[ (rid*cpr)+cid ];
          var prev_val = prev_col ? prev_col.innerHTML : null;
          // value diff
          if(prev_val != col){
            prev_col.innerHTML = col;
          }
        });
      }
      // add new row
      else {
        var r = tbl.insertRow(rid + 1); // include header row
        row.forEach(function(col, cid){
          var c = r.insertCell(cid);
          c.innerHTML = col;
        });
      }
    });
    this._reload();
  }

  // reload table vars
  this._reload();

};
