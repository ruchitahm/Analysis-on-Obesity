const {MongoClient} = require('mongodb');
async function main (){
    const uri = "mongodb+srv://Ruchita:Ruchita421@cluster0.sy0ss.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
    const client = new MongoClient(uri);
    try{
    await client.connect();
    await AvgIncome(client);
    } catch(e){
        console.error(e);
    } finally{
        await client.close();
    }
}
main().catch(console.error);
async function AvgIncome(client){
    console.log(`Income of a People: Percentage of People with Obesity - `);
    const pipeline = 
    [
        {
          '$project': {
            'Income': 1, 
            'obesity_percentage': 1
          }
        }, {
          '$group': {
            '_id': '$Income', 
            'avgObesityPercentage': {
              '$avg':  '$obesity_percentage'
            }
          }
        }, {
          '$match': {
            '_id': {
              '$gt': '', 
              '$ne': 'Data not reported'
            }
          }
        }, {
          '$sort': {
            '_id': 1
          }
        }
      ]

    const aggCursor = client.db("Obesity").collection("Obesity").aggregate(pipeline);
    await aggCursor.forEach(objesityListing => {
        console.log(`${objesityListing._id}: ${objesityListing.avgObesityPercentage.toFixed(2)}`);
    });
}