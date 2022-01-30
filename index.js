var http = require('http');
var url = require('url');
var qs = require('querystring');

var db = require('./database');

var currentdate = new Date(); 
var datetime = currentdate.getFullYear() + "-"
                + (currentdate.getMonth()+1)  + "-" 
                + currentdate.getDate() + " "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();

var port = 8080;

http.createServer(function(req, res){
    
    var q = url.parse(req.url, true);

    var id = q.query.id;
    res.setHeader('Content-Type', 'application/json');

    if(q.pathname == "/barang" && req.method === "GET"){

        if (id === undefined) {
            //mengambil semua barang
            let sql = 'SELECT * FROM barang';
            db.query(sql, (err, result) => {
                if (err) throw err;
                res.end(JSON.stringify(result));
            });

        }else if(id > 0){
            //mengambil 1 barang
            let sql = 'SELECT * FROM barang WHERE id = ' + id;
            db.query(sql, (err, result) => {
                if (err) throw err;
                var barang = result[0];
                res.end(JSON.stringify(barang));
            });
        }

    }else if(q.pathname == "/barang" && req.method === "POST"){
        //simpan barang
        var body = '';
        
        req.on('data', function(data){
            body += data;
            //data terlalu banyak matikan connection
            if (body.length > 1e6)
                req.connection.destroy();
        });

        req.on('end', function(){
            
            var postData = qs.parse(body);

            let nama_barang = postData.nama_barang;
            let harga = postData.harga;

            let sql = `INSERT INTO barang (nama_barang, harga) VALUES ('${nama_barang}', '${harga}')`;

            db.query(sql, (err, result) => {
                if (err) throw err;

                if (result.affectedRows == 1){
                    res.end(JSON.stringify({message: 'success added'}));
                }else {
                    res.end(JSON.stringify({message: 'failed to add'}));
                }

            });
        
        });


    }else if(q.pathname == "/barang" && req.method === "PUT"){
        //update barang
        var body = '';

        req.on('data', function(data){
            body += data;

            if (body.length > 1e6)
                req.connection.destroy();
        });

        req.on('end', function(){

            var postData = qs.parse(body);

            let nama_barang = postData.nama_barang;
            let harga = postData.harga;

            let sql = `UPDATE barang SET nama_barang = '${nama_barang}', harga = '${harga}', updated_at = '${datetime}' WHERE id = '${id}'`;
            
            db.query(sql, (err, result) => {
                if (err) throw err;

                if(result.affectedRows == 1){
                    res.end(JSON.stringify({message: 'success updated'}));
                }else {
                    res.end(JSON.stringify({message: 'failed to update'}));
                }
            });
        
        });

    }else if(q.pathname == "/barang" && req.method === "DELETE"){
        //hapus barang

        let sql = `DELETE FROM barang WHERE id = '${id}'`;
        db.query(sql, (err, result) => {
            if (err) throw err;

            if (result.affectedRows == 1){
                res.end(JSON.stringify({message: 'success deleted'}));
            }else {
                res.end(JSON.stringify({message: 'failed to delete'}));
            }

        });

    }else {
        res.end();
    }

}).listen(port);

console.log('Server berjalan di http://localhost:' + port);