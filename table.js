var Table = function(sel, options){

  var that = this;
  var tbl;      // table dom
  var cols;     // columns data
  var row_num;  // row number ( exclude header )
  var cpr;      // column number per row

  options = options || {};
  var from_color    = options.from_color || '#00ff00';
  var to_color      = options.to_color   || '#ffffff';
  var replace_mode  = options.replace === true;

  // ########## PRIVATE FUNCTION ##########

  this._reload = function(){
    tbl     = document.querySelector(sel);
    cols    = tbl.querySelectorAll('td');
    row_num = tbl.querySelectorAll('tr').length - 1;
    cpr     = cols.length / row_num;
  }

  // fade column background color
  // https://stackoverflow.com/a/11678224/466693
  this._blend = function(a, b, alpha) {
    var aa = [
          parseInt('0x' + a.substring(1, 3)),
          parseInt('0x' + a.substring(3, 5)),
          parseInt('0x' + a.substring(5, 7))
      ];
    var bb = [
          parseInt('0x' + b.substring(1, 3)),
          parseInt('0x' + b.substring(3, 5)),
          parseInt('0x' + b.substring(5, 7))
      ];
    r = '0' + Math.round(aa[0] + (bb[0] - aa[0])*alpha).toString(16);
    g = '0' + Math.round(aa[1] + (bb[1] - aa[1])*alpha).toString(16);
    b = '0' + Math.round(aa[2] + (bb[2] - aa[2])*alpha).toString(16);
    return '#'
          + r.substring(r.length - 2)
          + g.substring(g.length - 2)
          + b.substring(b.length - 2);
  }
  this._fade_text = function(cl1, cl2, elm){
    var t = [];
    var steps = 100;
    var delay = 1000;
    for (var i = 0; i < steps; i++) {
      (function(j) {
           t[j] = setTimeout(function() {
            var a  = j/steps;
            var color = that._blend(cl1, cl2, a);
            elm.style.backgroundColor = color;
           }, j*delay/steps);
      })(i);
    }
    return t;
  }

  // ########## PUBLIC FUNCTION ##########

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
            that._fade_text(from_color, to_color, prev_col);
          }
        });
      }
      // handle replace mdoe, add new row
      else if(replace_mode){
        var r = tbl.insertRow(rid + 1); // include header row
        row.forEach(function(col, cid){
          var c = r.insertCell(cid);
          c.innerHTML = col;
          that._fade_text(from_color, to_color, c);
        });
      }
    });
    this._reload();

    // handle replace mode, remove row
    if(replace_mode && ( new_data.length < row_num )){
      for(var i=row_num; i>new_data.length; i--){
        tbl.deleteRow(i);
      }
    }
  }

  // ########## INITIALIZE ##########

  this._reload();

};
