const {MongoClient} = require('mongodb');
async function main (){
    const uri = "mongodb+srv://Ruchita:Ruchita421@cluster0.sy0ss.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
    const client = new MongoClient(uri);
    try{
        await client.connect();
        await ObesityBasedOnState(client);
    } catch(e){
        console.error(e);
    } finally {
        await client.close();
    }
}
main().catch(console.error);
async function ObesityBasedOnState(client){
    const pipeline = [
        {
          '$project': {
            'Year': 1, 
            'State': 1, 
            '_id': 0, 
            'obesity_percentage': 1
          }
        }, {
          '$match': {
            'Year': {
              '$gt': 0
            }
          }
        }, {
          '$group': {
            '_id': '$Year', 
            'nationalObesity': {
              '$avg': '$obesity_percentage'
            }
          }
        }, {
          '$sort': {
            '_id': 1
          }
        }
      ];
      const aggCursor = client.db("Obesity").collection("Obesity").aggregate(pipeline);
      await aggCursor.forEach(obesityPercentage => {
          console.log(` National Obesity in year ${obesityPercentage._id} was: ${obesityPercentage.nationalObesity.toFixed(2)} percentage`);
          console.log(``);
      })
}