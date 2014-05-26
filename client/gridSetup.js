//namespace for grid formatters
grid = (function(){


    var grid = {};

    grid.FirstColFormatter = function (row, cell, value, columnDef, dataContext) {
    var spacer = "<span style='display:inline-block;height:1px;width:" + (15 * dataContext["indent"]) + "px'></span>";
    //var idx = dataView.getIdxById(dataContext.id);
    if (!value) {value = "";}
    if (data[row + 1] && data[row + 1].indent > data[row].indent) {
      if (dataContext._collapsed) {
        return spacer + " <span class='toggle expand'></span>&nbsp;" + value;
      } else {
        return spacer + " <span class='toggle collapse'></span>&nbsp;" + value;
      }
    } else {
      return spacer + " <span class='toggle'></span>&nbsp;" + value;
    }
  };

  grid.cellFormatter = function (row, cell, value, columnDef, dataContext) {
    return value;
  };


  grid.setupGrid = function(case_data, selector){
    
    var columns = [];
    var cols = [];
    var ids = {};
    var data = [];

    var idd = []

    $.each(case_data, function(index, value) {
      d = {};
      ids[value.uuid] = index;
      last_id = null;
      last_parent = null;

      if (data[index - 1]) {
          last_id = data[index-1].id;
          last_parent = data[index-1].parent_uuid;}

      $.each(value.data, function(name, obj){
          if (cols.indexOf(name) == -1) {cols.push(name);}
          d[name] = obj.value;
      })
      d["indent"] = value.__indent;
      d["timestamp"] = value.timestamp;
      //console.log(value.__indent)

      d["id"] = value.uuid;
      idd.push(value.uuid);
      if (value.parent_uuid) {
          d["parent"] = ids[value.parent_uuid];
          d["parent_uuid"] = value.parent_uuid;
      }
      else {d["parent"] = null;}
      data.push(d);
    });
    


    cols.sort().reverse();
    cols.unshift(" ")
    $.each(cols, function(index, name) {

        if (index == 0) {format = grid.FirstColFormatter;}
        else {format = grid.cellFormatter;}
        columns.push({
            id : name,
            name: name,
            field: name,
            formatter: format
        })

    });

    var options = {
      editable: false,
      enableCellNavigation: true,
      asyncEditorLoading: false,
      forceFitColumns: true

    };

    var percentCompleteThreshold = 0;
    var searchString = "";

    // initialize the model
    dataView = new Slick.Data.DataView({ inlineFilters: true });
    dataView.beginUpdate();
    dataView.setItems(data);
    dataView.setFilter(myFilter);
    dataView.endUpdate();

    // initialize the grid
    var g = new Slick.Grid(selector, dataView, columns, options);

    g.onCellChange.subscribe(function (e, args) {
      dataView.updateItem(args.item.id, args.item);
    });


    g.onClick.subscribe(function (e, args) {
      if ($(e.target).hasClass("toggle")) {
        var item = dataView.getItem(args.row);
        if (item) {
          if (!item._collapsed) {
            item._collapsed = true;
          } else {
            item._collapsed = false;
          }

          dataView.updateItem(item.id, item);
        }
        e.stopImmediatePropagation();
      }
      //console.log(columns[args.cell].name);
    });


    // wire up model events to drive the grid
    dataView.onRowCountChanged.subscribe(function (e, args) {
      g.updateRowCount();
      g.render();
    });

    dataView.onRowsChanged.subscribe(function (e, args) {
      g.invalidateRows(args.rows);
      g.render();
    });

    return g;
  };


  return grid;
}()); 