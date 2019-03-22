module.exports = {
    write : function(v) {
        writeToConsole(null,v,false);
    },

    writeJS: function(m,v) {
        writeToConsole(m,v,true);   
    }
};

function writeToConsole(m,v,j) {
    var d = new Date().toDateString();
    if(j) v = JSON.stringify(v);
    if(m === null)
        console.log("[" + d + "] " + v);
    else 
    console.log("[" + d + "] [" + m + "] [" + v + "]");
}